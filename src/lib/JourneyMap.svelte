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
					color: '#1b1a17'
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
					this._button.style.backgroundColor = '#f5f2ea';
				}
			});
			
			this._button.addEventListener('mouseleave', () => {
				if (this._button) {
					this._button.style.backgroundColor = '#ffffff';
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

	// The country outlines and the journey line are added only once the map has
	// been scrolled to. The base tiles load as soon as the page opens, since they
	// take the longest to arrive.
	let journeyRevealed = false;
	let styleLoaded = false;
	let destroyed = false;
	// The two outlines are fetched once and shared by both lookups rather than
	// re-fetched per country.
	let countriesPromise: Promise<any> | null = null;

	// Reveal choreography: Italy, a beat, the route drawing west to east, Australia.
	const ITALY_HOLD_MS = 350;
	const LINE_DRAW_MS = 900;
	const LINE_SEGMENTS = 120;

	// Coordinates: Center of Italy and Australia
	const italyCoords: [number, number] = [12.5674, 41.8719]; // Center of Italy
	const australiaCoords: [number, number] = [134.4911, -25.2744]; // Center of Australia

	// The two country outlines, vendored in static/geo/. Only Italy and Australia
	// are needed, so fetching the 4.4 MB world dataset to draw them is waste; this
	// file is ~102 KB gzipped, is served from our origin, and cannot rot. Source:
	// datasets/geo-countries (Natural Earth), rounded to 4dp. Regenerate with
	// `npm run outlines`.
	const COUNTRIES_URL = '/geo/italy-australia.geojson';

	// Fetched once and shared by both lookups.
	async function getCountryBoundary(name: string) {
		try {
			countriesPromise ??= fetch(COUNTRIES_URL).then((response) => response.json());
			const geoJsonData = await countriesPromise;
			const countryFeature = geoJsonData.features.find(
				(feature: { properties: { name: string } }) => feature.properties.name === name
			);
			if (countryFeature) return countryFeature;
			console.warn(`Country ${name} not found in ${COUNTRIES_URL}`);
			return null;
		} catch (error) {
			console.warn(`Could not load boundary for ${name}:`, error);
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
				((lon * 180 / Math.PI) + 540) % 360 - 180, // Normalise longitude
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
		// Initialise PMTiles protocol
		const protocol = new Protocol();
		maplibregl.addProtocol('pmtiles', protocol.tile);

		// Initialise MapLibre with custom style
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

		// The base tiles load now, on page open, since they take the longest to
		// arrive. The outlines and the line wait until the map is scrolled to.
		//
		// Gated on `style.load`, not `load`: `load` also waits for the first tiles to
		// render, and the outlines do not need a single tile to draw.
		map.on('style.load', () => {
			styleLoaded = true;
			maybeReveal();
		});

		// Spend the idle time before the reader reaches the map fetching the outlines,
		// so the reveal is not waiting on the network. Ignore failures here: the
		// reveal's own lookup reports them if it comes to that.
		const prefetch = () => getCountryBoundary('Italy').catch(() => {});
		if ('requestIdleCallback' in window) requestIdleCallback(prefetch);
		else setTimeout(prefetch, 1200);

		// Disable scroll zoom
		map.scrollZoom.disable();

		// Reveal the outlines and the line once the map has been scrolled into view.
		const onViewCheck = () => maybeReveal();
		scrollHandler = onViewCheck;
		document.addEventListener('scroll', onViewCheck, { capture: true, passive: true });
		window.addEventListener('resize', onViewCheck);
		maybeReveal();
	});

	function mapInView() {
		if (!mapContainer) return false;
		const r = mapContainer.getBoundingClientRect();
		return r.top < window.innerHeight * 0.9 && r.bottom > 0;
	}

	function maybeReveal() {
		if (journeyRevealed || destroyed || !styleLoaded || !mapInView()) return;
		revealJourney();
	}

	// Add the country outlines and the journey line, once. Called on style load if
	// the map is already in view, or on scroll otherwise — whichever comes first.
	//
	// Gated on the style, not on the base tiles: the outlines are their own source,
	// so waiting for `load` (style *and* first tiles rendered) made them queue behind
	// the slowest thing on the page for no reason.
	async function revealJourney() {
		if (journeyRevealed || destroyed || !map) return;
		journeyRevealed = true;

		const italyBoundary = await getCountryBoundary('Italy');
		const australiaBoundary = await getCountryBoundary('Australia');
		if (destroyed || !map) return;

		// Italy first, alone, so the eye has somewhere to start.
		addCountryLayers('italy', italyBoundary, '#1d4ed8');
		await wait(ITALY_HOLD_MS);
		if (destroyed || !map) return;

		// Then the route, drawn from Italy towards Australia.
		const { italyPoint, australiaPoint } = getBorderPoints(italyBoundary, australiaBoundary);
		const path = createGeodeticPath(italyPoint, australiaPoint, LINE_SEGMENTS);
		addJourneyLine(path);
		await animateLine(path, LINE_DRAW_MS);
		if (destroyed || !map) return;

		// Finally the destination.
		addCountryLayers('australia', australiaBoundary, '#3d7bff');
	}

	function addCountryLayers(id: string, boundary: any, color: string) {
		if (!boundary || !map) return;

		map.addLayer({
			id: `${id}-marker`,
			type: 'line',
			source: { type: 'geojson', data: boundary },
			paint: { 'line-color': color, 'line-width': 2, 'line-opacity': 0.8 }
		});

		map.addLayer({
			id: `${id}-marker-fill`,
			type: 'fill',
			source: { type: 'geojson', data: boundary },
			paint: { 'fill-color': color, 'fill-opacity': 0 },
			layout: { visibility: 'none' }
		});
	}

	// One layer for the whole route. This used to be ~100 layers, one per segment,
	// to fake a gradient — the most expensive thing in the reveal (~800ms of paint),
	// and it never actually animated: every addLayer in the loop landed in one frame.
	function addJourneyLine(path: [number, number][]) {
		if (!map) return;

		map.addSource('journey-route', {
			type: 'geojson',
			lineMetrics: true,
			data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [path[0]] }, properties: {} }
		});

		map.addLayer({
			id: 'journey-route',
			type: 'line',
			source: 'journey-route',
			paint: {
				'line-width': 3,
				'line-opacity': 0.8,
				'line-gradient': [
					'interpolate',
					['linear'],
					['line-progress'],
					0, '#1d4ed8',
					1, '#3d7bff'
				]
			}
		});
	}

	// Grow the geometry a step per frame. Truncating the line rather than trimming it
	// keeps `line-progress` relative to what is drawn, so the gradient stretches
	// smoothly and lands exactly on the final ramp at t=1 — no jump at the end.
	function animateLine(path: [number, number][], duration: number) {
		return new Promise<void>((resolve) => {
			if (!map || path.length < 2) return resolve();

			const source = map.getSource('journey-route');
			if (!source) return resolve();

			const start = performance.now();
			const step = (now: number) => {
				if (destroyed || !map || !map.getSource('journey-route')) return resolve();

				const t = Math.min(1, (now - start) / duration);
				const shown = Math.max(2, Math.round(t * path.length));
				source.setData({
					type: 'Feature',
					geometry: { type: 'LineString', coordinates: path.slice(0, shown) },
					properties: {}
				});

				if (t < 1) requestAnimationFrame(step);
				else resolve();
			};

			requestAnimationFrame(step);
		});
	}

	function wait(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

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
		destroyed = true;
		if (scrollHandler) {
			document.removeEventListener('scroll', scrollHandler, { capture: true });
			window.removeEventListener('resize', scrollHandler);
			scrollHandler = null;
		}
		if (map) {
			map.remove();
			map = null;
		}
	});
</script>

<div class="w-full h-full">
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
