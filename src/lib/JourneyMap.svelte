<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { House } from 'lucide-svelte';
	import { mount } from 'svelte';

	// Standard MapLibre control class for home button
	class HomeControl {
		private _container: HTMLElement | null = null;
		private _button: HTMLElement | null = null;
		private _homeComponent: any = null;

		onAdd(map: any) {
			this._container = document.createElement('div');
			this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
			
			this._button = document.createElement('button');
			this._button.className = 'maplibregl-ctrl-btn';
			this._button.title = 'Reset view';
			
			// Create and mount lucide home icon with proper props
			this._homeComponent = mount(House, { 
				target: this._button,
				props: {
					size: 16,
					color: 'black'
				}
			});
			
			this._button.style.cssText = `
				background-color: white;
				border: none;
				border-radius: 4px;
				width: 29px;
				height: 29px;
				margin: 2px;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 4px;
				transition: background-color 0.2s ease;
			`;
			
			// Add hover effect
			this._button.addEventListener('mouseenter', () => {
				if (this._button) {
					this._button.style.backgroundColor = '#f3f4f6';
				}
			});
			
			this._button.addEventListener('mouseleave', () => {
				if (this._button) {
					this._button.style.backgroundColor = 'white';
				}
			});
			
			this._button.addEventListener('click', () => {
				resetMapView();
			});
			
			this._container.appendChild(this._button);
			return this._container;
		}
		
		onRemove() {
			// Clean up mounted component
			if (this._homeComponent) {
				this._homeComponent.$destroy();
				this._homeComponent = null;
			}
			if (this._container && this._container.parentNode) {
				this._container.parentNode.removeChild(this._container);
			}
		}
	}

	let mapContainer: HTMLDivElement;
	let map: any;
	let animated = false;
	let observer: IntersectionObserver;
	let scrollHandler: (() => void) | null = null;

	// Coordinates: Center of Italy and Australia
	const italyCoords: [number, number] = [12.5674, 41.8719]; // Center of Italy
	const australiaCoords: [number, number] = [134.4911, -25.2744]; // Center of Australia

	// Function to get country boundary from public API
	async function getCountryBoundary(countryName: string) {
		try {
			// Try to get country boundary from Natural Earth data via GitHub
			const response = await fetch(`https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson`);
			const geoJsonData = await response.json();
			
			// Find the country by name
			const countryFeature = geoJsonData.features.find((feature: { properties: { ADMIN: string; NAME: string; name: string; }; }) => 
				feature.properties.ADMIN === countryName || 
				feature.properties.NAME === countryName ||
				feature.properties.name === countryName
			);

			if (countryFeature) {
				return countryFeature;
			}
			
			console.warn(`Country ${countryName} not found in Natural Earth data`);
			return null;
		} catch (error) {
			console.warn(`Could not fetch boundary for ${countryName}:`, error);
			return null;
		}
	}

	// Function to create geodetic path between two points (great circle)
	function createGeodeticPath(start: [number, number], end: [number, number], segments: number = 100) {
		const path: [number, number][] = [];
		
		// Convert to radians
		const startLat = start[1] * Math.PI / 180;
		const startLon = start[0] * Math.PI / 180;
		const endLat = end[1] * Math.PI / 180;
		const endLon = end[0] * Math.PI / 180;
		
		// Calculate great circle distance and bearing
		const dLat = endLat - startLat;
		const dLon = endLon - startLon;
		
		const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				  Math.cos(startLat) * Math.cos(endLat) *
				  Math.sin(dLon/2) * Math.sin(dLon/2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		
		// Calculate initial bearing
		const y = Math.sin(dLon) * Math.cos(endLat);
		const x = Math.cos(startLat) * Math.sin(endLat) -
				  Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLon);
		const bearing = Math.atan2(y, x);
		
		// Generate points along great circle
		for (let i = 0; i <= segments; i++) {
			const f = i / segments;
			const d = c * f;
			
			// Calculate intermediate point
			const lat = Math.asin(
				Math.sin(startLat) * Math.cos(d) +
				Math.cos(startLat) * Math.sin(d) * Math.cos(bearing)
			);
			
			const lon = startLon + Math.atan2(
				Math.sin(bearing) * Math.sin(d) * Math.cos(startLat),
				Math.cos(d) - Math.sin(startLat) * Math.sin(lat)
			);
			
			// Convert back to degrees
			path.push([
				((lon * 180 / Math.PI) + 540) % 360 - 180, // Normalize longitude
				lat * 180 / Math.PI
			]);
		}
		
		return path;
	}

	// Function to get border points for countries
	function getBorderPoints(italyBoundary: any, australiaBoundary: any) {
		// For Italy, use easternmost point
		let italyPoint = italyCoords;
		if (italyBoundary && italyBoundary.geometry) {
			const coords = italyBoundary.geometry.coordinates[0][0];
			let maxLon = -180;
			for (const coord of coords) {
				if (coord[0] > maxLon) {
					maxLon = coord[0];
					italyPoint = coord;
				}
			}
		}

		// For Australia, use westernmost point
		let australiaPoint = australiaCoords;
		if (australiaBoundary && australiaBoundary.geometry) {
			const coords = australiaBoundary.geometry.coordinates[0][0];
			let minLon = 180;
			for (const coord of coords) {
				if (coord[0] < minLon) {
					minLon = coord[0];
					australiaPoint = coord;
				}
			}
		}
		return { italyPoint, australiaPoint };
	}

	onMount(async () => {
		// Initialize PMTiles protocol
		const protocol = new Protocol();
		maplibregl.addProtocol('pmtiles', protocol.tile);

		// Initialize MapLibre with custom style
		map = new maplibregl.Map({
			container: mapContainer,
			style: '/mapstyle.json',
			center: [(italyCoords[0] + australiaCoords[0]) / 2, (italyCoords[1] + australiaCoords[1]) / 2],
			zoom: 1,
            minZoom: 1,
            maxZoom: 10,
			interactive: true
		});

		// Add zoom controls
		map.addControl(new maplibregl.NavigationControl());
		map.addControl(new maplibregl.ScaleControl());

		// Add home button control using standard MapLibre pattern
		map.addControl(new HomeControl(), 'top-right');

		// Add polygons for both locations
		map.on('load', async () => {
			// Get exact country boundaries from public API
			const italyBoundary = await getCountryBoundary('Italy');
			const australiaBoundary = await getCountryBoundary('Australia');

			// Italy polygon (outline only)
			if (italyBoundary) {
				map.addLayer({
					id: 'italy-marker',
					type: 'line',
					source: {
						type: 'geojson',
						data: italyBoundary
					},
					paint: {
						'line-color': '#3b82f6',
						'line-width': 2,
						'line-opacity': 0.8
					}
				});

				// Add fill layer (initially hidden)
				map.addLayer({
					id: 'italy-marker-fill',
					type: 'fill',
					source: {
						type: 'geojson',
						data: italyBoundary
					},
					paint: {
						'fill-color': '#3b82f6',
						'fill-opacity': 0
					},
					layout: {
						visibility: 'none'
					}
				});
			}

			// Australia polygon (outline only)
			if (australiaBoundary) {
				map.addLayer({
					id: 'australia-marker',
					type: 'line',
					source: {
						type: 'geojson',
						data: australiaBoundary
					},
					paint: {
						'line-color': '#10b981',
						'line-width': 2,
						'line-opacity': 0.8
					}
				});

				// Add fill layer (initially hidden)
				map.addLayer({
					id: 'australia-marker-fill',
					type: 'fill',
					source: {
						type: 'geojson',
						data: australiaBoundary
					},
					paint: {
						'fill-color': '#10b981',
						'fill-opacity': 0
					},
					layout: {
						visibility: 'none'
					}
				});
			}

			// Add line connecting the two points with geodetic path and gradient
			const { italyPoint, australiaPoint } = getBorderPoints(italyBoundary, australiaBoundary);
			const geodeticPath = createGeodeticPath(italyPoint, australiaPoint);
			
			// Create gradient line by adding multiple segments with different colors
			for (let i = 0; i < geodeticPath.length - 1; i++) {
				const progress = i / (geodeticPath.length - 1);
				
				// Interpolate color from blue to green
				const r = Math.round(59 + (16 - 59) * progress); // 59 -> 16
				const g = Math.round(130 + (185 - 130) * progress); // 130 -> 185
				const b = Math.round(246 + (129 - 246) * progress); // 246 -> 129
				const color = `rgb(${r}, ${g}, ${b})`;
				
				map.addLayer({
					id: `journey-line-${i}`,
					type: 'line',
					source: {
						type: 'geojson',
						data: {
							type: 'Feature',
							geometry: {
								type: 'LineString',
								coordinates: [geodeticPath[i], geodeticPath[i + 1]]
							}
						}
					},
					paint: {
						'line-color': color,
						'line-width': 3,
						'line-opacity': 0.8
					}
				});
			}
		});

		// Disable scroll zoom
		map.scrollZoom.disable();
	});

	// Scroll sync functionality removed - map remains static
	function setupScrollSync() {
		// Function kept for compatibility but disabled
		console.log('Scroll sync disabled - map remains static');
	}

	// Functions to control country fill visibility
	function showCountryFill(country: 'italy' | 'australia') {
		if (!map) return;
		
		// Hide all fills first
		const fillLayers = [
			'italy-marker-fill', 'australia-marker-fill'
		];
		
		fillLayers.forEach(layerId => {
			if (map.getLayer(layerId)) {
				map.setLayoutProperty(layerId, 'visibility', 'none');
				map.setPaintProperty(layerId, 'fill-opacity', 0);
			}
		});
		
		// Show selected country fill
		const targetLayers = country === 'italy' 
			? ['italy-marker-fill']
			: ['australia-marker-fill'];
			
		targetLayers.forEach(layerId => {
			if (map.getLayer(layerId)) {
				map.setLayoutProperty(layerId, 'visibility', 'visible');
				map.setPaintProperty(layerId, 'fill-opacity', 0.6);
			}
		});
	}

	function hideAllFills() {
		if (!map) return;
		
		const fillLayers = [
			'italy-marker-fill', 'australia-marker-fill'
		];
		
		fillLayers.forEach(layerId => {
			if (map.getLayer(layerId)) {
				map.setLayoutProperty(layerId, 'visibility', 'none');
				map.setPaintProperty(layerId, 'fill-opacity', 0);
			}
		});
	}

	// Reset map to original view
	function resetMapView() {
		if (!map) return;
		
		hideAllFills();
		
		map.flyTo({
			center: [(italyCoords[0] + australiaCoords[0]) / 2, (italyCoords[1] + australiaCoords[1]) / 2],
			zoom: 1,
			duration: 1000,
			essential: true
		});
	}

	// Expose method to parent component
	function goToLocation(location: 'italy' | 'australia') {
		if (!map) return;
		
		const targetCoords = location === 'italy' ? italyCoords : australiaCoords;
		const zoomLevel = location === 'italy' ? 4 : 2;
		showCountryFill(location);
		
		map.flyTo({
			center: targetCoords,
			zoom: zoomLevel,
			duration: 2000,
			essential: true
		});
	}

	// Make functions available to parent
	export { goToLocation, showCountryFill, hideAllFills };

	onDestroy(() => {
		if (scrollHandler) {
			window.removeEventListener('scroll', scrollHandler);
		}
		if (map) {
			map.remove();
		}
	});
</script>

<div class="w-full h-96 bg-slate-100 rounded-lg overflow-hidden shadow-lg">
	<div bind:this={mapContainer} class="w-full h-full"></div>
</div>

<style>
	/* MapLibre controls styling */
	:global(.maplibregl-popup) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
	
	:global(.maplibregl-ctrl) {
		border-radius: 0.375rem;
	}
</style>
