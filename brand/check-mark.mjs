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
import { color, markStrokes, lockup, markSvg, tileSvg, lockupSvg, nodePoints, letterStrokes, splitAccent } from './mark.mjs';

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

/**
 * Every `<path>` in an SVG as `{ d, stroke, width }`, parsed from the markup.
 * The check selects paths by their numeric stroke weight and colour rather than
 * by index, so a change in paint order cannot hide a path from it — the order
 * is a drawing decision, the weights and colours are the invariants.
 */
const pathInfos = (svg) =>
  [...svg.matchAll(/<path\b[^>]*\/>/g)].map((m) => {
    const p = m[0];
    const attr = (name) => {
      const v = p.match(new RegExp(`${name}="([^"]+)"`));
      return v ? v[1] : null;
    };
    return { d: attr('d'), stroke: attr('stroke'), width: Number(attr('stroke-width')) };
  });

// The SVG rounds stroke-width to three decimals, so compare with a tolerance
// wider than that rounding but far narrower than the gap between the weights.
const near = (a, b) => Math.abs(a - b) < 0.01;

/** The `d` attributes in an SVG, in document order. */
const paths = (svg) => [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);

const subpaths = (d) => (d.match(/M/g) || []).length;

const problems = [];

/**
 * `d` must have one `M` per run in `strokes`. A run is a contiguous line; a
 * fresh `M` is what stops the pen drawing across the gap to the next one.
 */
function checkD(label, d, strokes) {
  if (!d) return problems.push(`${label}: no path emitted`);
  const want = runs(strokes);
  const got = subpaths(d);
  if (got !== want) {
    problems.push(
      `${label}: ${got} subpath(s) for ${want} run(s) of strokes — ` +
        `a run of ${want} needs ${want} \`M\`, or the pen draws across the gap`
    );
  }
}

// The mark: one run, so one M — the case that always worked.
checkD('markSvg', paths(markSvg({ nodes: false }))[0], markStrokes());
checkD('markSvg (nodes)', paths(markSvg({ nodes: true }))[0], markStrokes());
checkD('tileSvg', paths(tileSvg({ nodes: false }))[0], markStrokes());
checkD('tileSvg (nodes)', paths(tileSvg({ nodes: true }))[0], markStrokes());

// The lockup: the mark is one run at mark weight; the word is five runs at text
// weight. Select by stroke weight, so a change in paint order cannot hide a
// path from the check.
const lk = lockup('barbuz');
for (const nodes of [false, true]) {
  const svg = lockupSvg({ nodes });
  const suffix = nodes ? ' (nodes)' : '';
  const infos = pathInfos(svg);
  const mark = infos.filter((p) => near(p.width, lk.mark.stroke));
  const word = infos.filter((p) => near(p.width, lk.word.stroke));

  if (mark.length !== 1) problems.push(`lockupSvg${suffix}: expected one mark path, found ${mark.length}`);
  else checkD(`lockupSvg${suffix} — mark`, mark[0].d, lk.mark.strokes);

  // The word splits into ink and accent paths. Each must carry one M per run
  // of *its own* stroke list: the foot chains to the diagonal, so the split
  // itself adds an M, and an aggregate count would be off by that.
  const parts = splitAccent(lk.word.strokes);
  const want = parts.accent.length ? 2 : 1;
  if (word.length !== want) problems.push(`lockupSvg${suffix} — word: expected ${want} path(s), found ${word.length}`);
  const inkPath = word.find((p) => p.stroke !== color.barbuz.accent);
  const footPath = word.find((p) => p.stroke === color.barbuz.accent);
  checkD(`lockupSvg${suffix} — word ink`, inkPath && inkPath.d, parts.ink);
  if (parts.accent.length) checkD(`lockupSvg${suffix} — foot`, footPath && footPath.d, parts.accent);

  // The foot must paint *behind* the word ink, so the ink covers the junction.
  const wordOrder = word.map((p) => (p.stroke === color.barbuz.accent ? 'accent' : 'ink'));
  if (wordOrder.join(',') !== 'accent,ink') {
    problems.push(`lockupSvg${suffix}: word paints ${wordOrder.join(' then ')} — the foot must be behind the ink`);
  }
}

// The word is five runs; assert that directly too, so the count cannot be
// satisfied by accident.
if (runs(lk.word.strokes) !== 'arbuz'.length) {
  problems.push(`lockup word: expected ${'arbuz'.length} runs, got ${runs(lk.word.strokes)}`);
}

// Containment: `b` reaches all four points, every other letter the same three.
// The z's accent foot must not add a point, or the rule stops being exact.
{
  const four = JSON.stringify(nodePoints(letterStrokes('b')));
  const three = JSON.stringify(nodePoints(letterStrokes('a')));
  for (const c of ['r', 'u', 'z']) {
    const got = JSON.stringify(nodePoints(letterStrokes(c)));
    if (got !== three) {
      problems.push(`containment: "${c}" reaches ${got}, expected the same three as "a" ${three}`);
    }
  }
  if (JSON.parse(four).length !== 4) problems.push(`containment: "b" should reach four points, got ${four}`);
  // And the foot must actually be there, in the accent.
  const z = splitAccent(letterStrokes('z'));
  if (z.accent.length !== 1) problems.push(`z foot: expected one accent stroke, got ${z.accent.length}`);
  if (z.ink.length !== 2) problems.push(`z: expected two ink strokes (H + D), got ${z.ink.length}`);
}

if (problems.length) {
  console.error('mark check failed:');
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('mark SVG paths are well-formed (one M per stroke run).');
