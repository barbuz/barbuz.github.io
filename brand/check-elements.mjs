#!/usr/bin/env node
/**
 * Checks the element kit against its own rules.
 *
 *   node brand/check-elements.mjs
 *
 * The rules are the whole reason the kit reads as barbuz, so they are asserted
 * rather than only described:
 *
 *   1. An edge bends if and only if it is a diagonal. An axis-aligned edge is
 *      straight; a diagonal bulges by K. Elements marked `orthogonal` opt out
 *      on purpose and are checked to have no bend at all.
 *   2. Every bulged edge runs at 45°, matching the mark's diagonal.
 *   3. Every element renders well-formed SVG, with each mask reference
 *      resolving to an id in the same document.
 *   4. A multi-run element (`arrow`, `cross`) emits one `M` per run. With only
 *      the first `M`, the pen draws straight across the gap and the element
 *      fuses into a shape it was never meant to be.
 *   5. The viewBox covers the ink. The nominal box is the *centrelines'* box,
 *      so a round cap reaches half a stroke past it; unpadded, every element
 *      whose stroke touches an edge has its caps clipped.
 *   6. A filled element still gets a node device when `nodes: true`. The device
 *      sizes from the element's stroke, so a filled element — which has none —
 *      must fall back to the kit default, or its radii are zero and the device
 *      vanishes while the flag was honoured in name only.
 *
 * Rules 5 and 6 are the ones that eroded silently: the shapes still rendered,
 * so nothing looked broken, while every `+nodes` element had its caps cut off
 * and no filled element drew a device at all. Assert the geometry, not just the
 * presence of markup.
 *
 * Hand-run: `npm run elements:check`. Not a CI gate — the kit does not ship,
 * so the workflow spends its checks on the mark instead. See the freeze note in
 * docs/DESIGN-NOTES.md → "The element kit".
 */
import { NAMES, element, elementSvg, BOX } from './elements.mjs';
import { strokeRuns, segPoints, NODE } from './mark.mjs';

const isDiagonal = (a, b) =>
  Math.abs(a[0] - b[0]) > 1e-9 && Math.abs(a[1] - b[1]) > 1e-9;

const num = (v) => Math.round(v * 1000) / 1000;

/** The kit's default device weight, mirroring elements.mjs. */
const DEFAULT_STROKE = 12;

/** How far the ink reaches past the nominal square, ignoring the device. */
function strokeReach(el, size) {
  const s = size / BOX;
  const w = (el.stroke || 0) * s;
  let reach = w / 2;
  for (const sg of el.segs) {
    for (const [x, y] of segPoints(sg, 24)) {
      reach = Math.max(reach, -x * s, x * s - size, -y * s, y * s - size);
    }
  }
  return Math.max(reach, 0);
}

/** How far the node device reaches past the nominal square. */
function nodeReach(el, size) {
  const s = size / BOX;
  const device = (el.fill ? DEFAULT_STROKE : el.stroke || 0) * s;
  return Math.max(strokeReach(el, size), device * (NODE.ring + NODE.width / 2));
}

const problems = [];

for (const name of NAMES) {
  const el = element(name);
  const bent = el.segs.filter((s) => Math.abs(s.k) > 1e-9);

  // Rule 1 — the bend rule.
  if (el.orthogonal) {
    if (bent.length) problems.push(`${name}: marked orthogonal but ${bent.length} edge(s) bend`);
  } else {
    for (const s of el.segs) {
      if (isDiagonal(s.a, s.b) !== Math.abs(s.k) > 1e-9) {
        problems.push(`${name}: edge ${JSON.stringify(s.a)}->${JSON.stringify(s.b)} breaks the bend rule`);
      }
    }
  }

  // Rule 2 — the 45° discipline.
  if (!el.orthogonal) {
    for (const s of el.segs) {
      if (Math.abs(s.k) < 1e-9) continue;
      const dx = Math.abs(s.b[0] - s.a[0]);
      const dy = Math.abs(s.b[1] - s.a[1]);
      if (Math.abs(dx - dy) > 1e-6) {
        problems.push(`${name}: bulged edge is not at 45° (dx=${dx}, dy=${dy})`);
      }
    }
  }

  // Rule 3 — well-formed SVG, with every mask reference resolvable.
  for (const withNodes of [false, true]) {
    const svg = elementSvg(name, { size: 48, nodes: withNodes });
    if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) {
      problems.push(`${name}: malformed SVG (nodes: ${withNodes})`);
      continue;
    }
    const ids = [...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    const refs = [...svg.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (!ids.includes(ref)) problems.push(`${name}: mask reference "${ref}" has no matching id`);
    }
    if (ids.length !== new Set(ids).size) problems.push(`${name}: duplicate id in one SVG`);
  }

  // Rule 4 — one `M` per contiguous run, so a multi-run element does not fuse.
  const d = elementSvg(name, { size: 48 }).match(/<path d="([^"]+)"/);
  if (d) {
    const want = el.fill ? 1 : strokeRuns(el.segs);
    const got = (d[1].match(/M/g) || []).length;
    if (got !== want) {
      problems.push(`${name}: ${got} subpath(s) for ${want} run(s) — the pen draws across the gap`);
    }
  }

  // Rule 5 — the viewBox covers the ink. The nominal box is the *centrelines'*
  // box, so a round cap reaches half a stroke past it; without padding, every
  // element whose stroke touches an edge has its caps clipped.
  //
  // The emitted numbers are rounded to 3 decimals, so the comparison carries a
  // tolerance a little above that; a real clip is a fraction of a stroke, far
  // larger than the rounding.
  const EPS = 2e-3;
  for (const withNodes of [false, true]) {
    const svg = elementSvg(name, { size: 48, nodes: withNodes });
    const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1];
    if (!vb) continue;
    const [vx, vy, vw, vh] = vb.split(/\s+/).map(Number);
    const want = withNodes ? nodeReach(el, 48) : strokeReach(el, 48);
    if (vx > -want + EPS || vy > -want + EPS || vx + vw < 48 + want - EPS || vy + vh < 48 + want - EPS) {
      problems.push(`${name}: viewBox ${vb} clips the ink (needs ±${num(want)})`);
    }
  }

  // Rule 6 — a filled element still gets a node device when asked. The device
  // sizes from the element's stroke, and a filled element has none, so it needs
  // the kit default — otherwise its hole and ring radii are zero and the device
  // silently vanishes while `nodes: true` was honoured in name only.
  //
  // `dot`, `ring` and `progress` are special-cased primitives with no corners,
  // so they have no device by design.
  if (!el.dot && !el.ring && !el.progress) {
    const withDevice = elementSvg(name, { size: 48, nodes: true });
    if (!withDevice.includes('<mask')) {
      problems.push(`${name}: nodes: true produced no mask`);
    }
    if (!withDevice.includes('fill="none"')) {
      problems.push(`${name}: nodes: true produced no rings`);
    }
    // The mask must cover the same box the viewBox does, or a node on an edge
    // lands outside the mask and its knockout is lost.
    const maskRect = (withDevice.match(/<mask[^>]*x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)"/) || []).slice(1).map(Number);
    const vbAll = (withDevice.match(/viewBox="([^"]+)"/) || [])[1].split(/\s+/).map(Number);
    if (maskRect.length === 3 && maskRect.some((v, i) => Math.abs(v - vbAll[i]) > EPS)) {
      problems.push(`${name}: mask box ${maskRect} does not match the viewBox ${vbAll.slice(0, 3)}`);
    }
  }
}

if (problems.length) {
  console.error('element kit check failed:');
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`element kit is consistent (${NAMES.length} elements).`);
