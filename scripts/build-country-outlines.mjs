// Builds static/geo/italy-australia.geojson — the two country outlines the
// Journey map draws.
//
// The map needs Italy and Australia and nothing else. The upstream dataset is
// the whole world (~14.6 MB of JSON, 4.6 MB gzipped), so downloading all of it
// to draw two outlines is waste, and its cache lifetime is five minutes. This
// script cuts the two features out once; the result is ~102 KB gzipped, is
// served from our own origin, and cannot rot.
//
// Run `npm run outlines` after changing SOURCE or COUNTRIES. The output is
// committed, so this is not part of the build.

import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const SOURCE =
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
const OUT = 'static/geo/italy-australia.geojson';

// In journey order: the map draws Italy, then Australia.
const COUNTRIES = ['Italy', 'Australia'];

// 4dp is ~11 m — far finer than the map's zoom range can show, and it keeps
// the file well under 5dp's size for no visible gain.
const DECIMALS = 4;

function roundCoords(coords) {
  if (typeof coords[0] === 'number') {
    return coords.map((n) => Number(n.toFixed(DECIMALS)));
  }
  return coords.map(roundCoords);
}

const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`${SOURCE} returned ${response.status}`);
const world = await response.json();

const byName = new Map(world.features.map((f) => [f.properties.name, f]));
const missing = COUNTRIES.filter((name) => !byName.has(name));
if (missing.length) throw new Error(`not found in source: ${missing.join(', ')}`);

const features = COUNTRIES.map((name) => {
  const feature = byName.get(name);
  return {
    type: 'Feature',
    // The other upstream properties are ISO codes the map never reads.
    properties: { name },
    geometry: {
      type: feature.geometry.type,
      coordinates: roundCoords(feature.geometry.coordinates)
    }
  };
});

const json = JSON.stringify({ type: 'FeatureCollection', features });
writeFileSync(OUT, json);

const bytes = Buffer.byteLength(json);
const gzipped = gzipSync(json, { level: 9 }).length;
console.log(`${OUT}: ${bytes.toLocaleString()} B (${gzipped.toLocaleString()} B gzipped)`);
