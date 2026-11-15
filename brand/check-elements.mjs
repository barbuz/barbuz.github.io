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
 *
 * Runs in CI, next to tokens:check and icons:check.
 */
import { NAMES, element, elementSvg } from './elements.mjs';

const isDiagonal = (a, b) =>
  Math.abs(a[0] - b[0]) > 1e-9 && Math.abs(a[1] - b[1]) > 1e-9;

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
}

if (problems.length) {
  console.error('element kit check failed:');
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`element kit is consistent (${NAMES.length} elements).`);
