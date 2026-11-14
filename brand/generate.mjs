#!/usr/bin/env node
/**
 * Generates brand/tokens.css and brand/tokens.js from brand/tokens.json.
 *
 *   node brand/generate.mjs            write both files
 *   node brand/generate.mjs --check    fail if the files are out of date
 *   node brand/generate.mjs --stdout   print the CSS, write nothing
 *
 * The generated files are committed, so the site builds without this script.
 * --check runs in CI to catch a tokens.json edit that was never regenerated.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(readFileSync(join(here, 'tokens.json'), 'utf8'));
const FACES = Object.keys(tokens.personas);

const HEADER = `/* ============================================================
   GENERATED FILE - DO NOT EDIT.
   Source:      brand/tokens.json
   Regenerate:  npm run tokens
   Check:       npm run tokens:check
   Rationale:   docs/DESIGN-NOTES.md
   ============================================================ */

`;

const block = (selector, decls) =>
  `${selector} {\n${decls.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

const entries = (obj) => Object.entries(obj);

function rootDecls() {
  const { motion, radius, space, font } = tokens.shared;
  const decls = [];
  for (const [k, v] of entries(motion)) decls.push([`--${k}`, v]);
  for (const [k, v] of entries(radius)) decls.push([`--radius-${k}`, v]);
  for (const [k, v] of entries(space)) decls.push([`--space-${k}`, v]);
  for (const [k, v] of entries(font)) decls.push([`--font-${k}`, v]);
  return decls;
}

function faceDecls(face) {
  const p = tokens.personas[face];
  const decls = [];
  for (const [k, v] of entries(p.color)) decls.push([`--${k}`, v]);
  decls.push(['--shadow', p.shadow.base]);
  decls.push(['--shadow-accent', p.shadow.accent]);
  for (const [k, v] of entries(p.font)) decls.push([`--font-${k}`, v]);
  return decls;
}

function chromeDecls(face) {
  const p = tokens.personas[face];
  const decls = entries(p.chrome).map(([k, v]) => [`--c-${k}`, v]);
  decls.push(['--page-bg', p.color['page-bg']]);
  return decls;
}

function buildCss() {
  const parts = [HEADER.trimEnd(), ''];
  parts.push('/* ---- scale (shared) ---- */');
  parts.push(block(':root', rootDecls()));
  for (const face of FACES) {
    parts.push('');
    parts.push(`/* ---- ${face} ---- */`);
    parts.push(block(`.face--${face}`, faceDecls(face)));
    parts.push(block(`html[data-persona='${face}']`, chromeDecls(face)));
  }
  return `${parts.join('\n')}\n`;
}

function buildJs() {
  const j = (v) => JSON.stringify(v);
  const lines = [
    '/* GENERATED FILE - DO NOT EDIT. Source: brand/tokens.json */',
    '',
    `export const persona = ${j(FACES)};`,
    '',
    'export const color = {'
  ];
  for (const face of FACES) {
    const cols = entries(tokens.personas[face].color)
      .map(([k, v]) => `${j(k)}: ${j(v)}`)
      .join(', ');
    lines.push(`  ${face}: { ${cols} },`);
  }
  lines.push('};');
  lines.push('');
  lines.push('export const font = {');
  for (const face of FACES) {
    const f = tokens.personas[face].font;
    lines.push(`  ${face}: { display: ${j(f.display)}, body: ${j(f.body)}, displayWeight: ${j(f['display-weight'])} },`);
  }
  lines.push(`  mono: ${j(tokens.shared.font.mono)},`);
  lines.push('};');
  lines.push('');
  lines.push(`export const motion = ${JSON.stringify(tokens.shared.motion, null, 2)};`);
  lines.push('');
  lines.push(`export const radius = ${JSON.stringify(tokens.shared.radius, null, 2)};`);
  lines.push('');
  lines.push(`export const space = ${JSON.stringify(tokens.shared.space, null, 2)};`);
  lines.push('');
  lines.push('export default { persona, color, font, motion, radius, space };');
  return `${lines.join('\n')}\n`;
}

const outputs = [
  ['tokens.css', buildCss()],
  ['tokens.js', buildJs()]
];

if (process.argv.includes('--stdout')) {
  process.stdout.write(buildCss());
  process.exit(0);
}

if (process.argv.includes('--check')) {
  let stale = false;
  for (const [name, content] of outputs) {
    let onDisk = null;
    try {
      onDisk = readFileSync(join(here, name), 'utf8');
    } catch {
      onDisk = null;
    }
    if (onDisk !== content) {
      console.error(`brand/${name} is out of date. Run: npm run tokens`);
      stale = true;
    }
  }
  if (stale) process.exit(1);
  console.log('brand tokens are up to date.');
  process.exit(0);
}

for (const [name, content] of outputs) {
  writeFileSync(join(here, name), content);
  console.log(`wrote brand/${name}`);
}
