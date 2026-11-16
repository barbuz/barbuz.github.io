#!/usr/bin/env node
/**
 * Checks the mark's SVG output against the invariant its paths rest on.
 *
 *   node brand/check-mark.mjs
 *
 * A path is a run of strokes drawn with one pen. A stroke carries only its
 * start and end, so the SVG fragment for it is a bare `L`/`Q` that assumes the
 * pen already sits on the stroke's start. That assumption holds only while the
 * strokes form a single continuous line.
 *
 * It does for one letter. It does NOT for a word: `arbuz` is five separate
 * lines, and a run drawn without a fresh `M` between them gets a straight
 * segment across every gap — the letters weld into one blob. The mark has one
 * run and so never showed it; the lockup is what exposes it.
 *
 * So: the number of `M` subpaths in the rendered `d` must equal the number of
 * contiguous runs in the stroke list it was built from. One `M` per run.
 *
 * Runs in CI, next to tokens:check, icons:check and elements:check.
 */
import { markStrokes, lockup, markSvg, tileSvg, lockupSvg } from './mark.mjs';

/** The contiguous runs in a stroke list: a new run starts wherever the pen jumps. */
function runs(strokes) {
  let n = 0;
  let pen = null;
  for (const s of strokes) {
    if (!pen || Math.hypot(s.a[0] - pen[0], s.a[1] - pen[1]) > 1e-6) n++;
    pen = s.b;
  }
  return n;
}

/** The `d` attributes in an SVG, in document order. */
const paths = (svg) => [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);

const subpaths = (d) => (d.match(/M/g) || []).length;

const problems = [];

/**
 * The `d` at `index` in `svg` must have one subpath per run in `strokes`.
 * `index` picks which path to look at when the SVG carries more than one
 * (the lockup emits the mark and the word separately).
 */
function check(label, svg, strokes, index = 0) {
  const want = runs(strokes);
  const ds = paths(svg);
  if (!ds.length) return problems.push(`${label}: no path emitted`);
  if (index >= ds.length) return problems.push(`${label}: expected a path at index ${index}, found ${ds.length}`);
  const got = subpaths(ds[index]);
  if (got !== want) {
    problems.push(
      `${label}: ${got} subpath(s) for ${want} run(s) of strokes — ` +
        `a run of ${want} needs ${want} \`M\`, or the pen draws across the gap`
    );
  }
}

// The mark: one run, so one M — the case that always worked.
check('markSvg', markSvg({ nodes: false }), markStrokes());
check('markSvg (nodes)', markSvg({ nodes: true }), markStrokes());
check('tileSvg', tileSvg({ nodes: false }), markStrokes());
check('tileSvg (nodes)', tileSvg({ nodes: true }), markStrokes());

// The lockup: the mark is path 0 (one run) and the word is path 1 (five runs).
const lk = lockup('barbuz');
check('lockupSvg — mark', lockupSvg({ nodes: false }), lk.mark.strokes, 0);
check('lockupSvg — word', lockupSvg({ nodes: false }), lk.word.strokes, 1);
check('lockupSvg (nodes) — mark', lockupSvg({ nodes: true }), lk.mark.strokes, 0);
check('lockupSvg (nodes) — word', lockupSvg({ nodes: true }), lk.word.strokes, 1);

// The word is five runs; assert that directly too, so the count cannot be
// satisfied by accident.
if (runs(lk.word.strokes) !== 'arbuz'.length) {
  problems.push(`lockup word: expected ${'arbuz'.length} runs, got ${runs(lk.word.strokes)}`);
}

// A word's own path must have as many M as letters.
const wordDs = paths(lockupSvg({ nodes: false }))[1];
if (wordDs && subpaths(wordDs) !== 'arbuz'.length) {
  problems.push(`lockup word: ${subpaths(wordDs)} subpath(s) for ${'arbuz'.length} letters`);
}

if (problems.length) {
  console.error('mark check failed:');
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('mark SVG paths are well-formed (one M per stroke run).');
