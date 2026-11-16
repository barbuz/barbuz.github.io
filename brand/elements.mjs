/**
 * The barbuz element kit — reusable graphical elements in the mark's style.
 *
 * These are not pieces of the `b`. They are the mark's *grammar* applied to
 * other shapes, so a project can build UI that reads as barbuz without
 * redrawing the logo:
 *
 *   1. Straight or bulged, never both on one edge. An edge that runs with the
 *      axes (vertical or horizontal) is straight; an edge that runs across them
 *      is bulged, by the shared curvature K. The bend marks the diagonal.
 *   2. A 45° discipline. The diagonal is at 45° in the mark; the kit keeps its
 *      diagonals there too, so everything reads as one family.
 *   3. Nodes on corners. The mark's corner device — a knockout hole and a ring
 *      — is available on any element, at any corner.
 *
 * Elements are drawn in a nominal 0..100 box and scaled to `size` by the
 * caller. `elementSvg()` returns the markup; `element()` returns the geometry
 * as segments, for anyone who needs to rasterize or measure it.
 *
 * Everything is lines and quadratics, same as the mark, so the same hand-rolled
 * rasterizer can draw it. See docs/DESIGN-NOTES.md → "The element kit".
 */
import { seg, strokedPath, K, NODE, color } from './mark.mjs';

/** The nominal box every element is drawn in. */
export const BOX = 100;

/* ------------------------------------------------------------------ helpers */

const num = (v) => (Math.round(v * 1000) / 1000).toString();

const isDiagonal = (a, b) =>
  Math.abs(a[0] - b[0]) > 1e-9 && Math.abs(a[1] - b[1]) > 1e-9;

/**
 * Build the edges of an element from a list of points.
 *
 * The rule is applied here once, so no element has to think about it: an edge
 * that is neither vertical nor horizontal bulges outward by `bend`, away from
 * `ref`; an axis-aligned edge stays straight.
 */
function edges(points, { bend = K, ref = [BOX / 3, BOX / 3], close = false } = {}) {
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    segs.push(seg(a, b, isDiagonal(a, b) ? bend : 0, ref));
  }
  if (close && points.length > 2) {
    const a = points[points.length - 1];
    const b = points[0];
    segs.push(seg(a, b, isDiagonal(a, b) ? bend : 0, ref));
  }
  return segs;
}

/* --------------------------------------------------------------- the elements */

/**
 * The kit. Each entry returns segments in the 0..100 box.
 *
 * `stroke` is the nominal stroke weight (0 for filled shapes). `fill` marks a
 * closed shape that reads better solid. `orthogonal` is the documented escape
 * from rule 1, for symbols where the bend would read as a wobble.
 */
const ELEMENTS = {
  /** A corner bracket: two straight arms. The right angle, on its own. */
  corner: () => ({
    segs: edges([[0, 100], [0, 0], [100, 0]], { ref: [40, 60] }),
    stroke: 12
  }),

  /** The primitive closed — the mark's bowl as a standalone shape. */
  wedge: () => ({
    segs: edges([[0, 100], [0, 0], [100, 0]], { ref: [40, 60], close: true }),
    stroke: 0,
    fill: true
  }),

  /** A chevron pointing right: both arms diagonal, both bulged. */
  chevron: () => ({
    segs: edges([[0, 0], [50, 50], [0, 100]], { ref: [0, 50] }),
    stroke: 12
  }),

  /** The chevron closed — the play triangle. */
  play: () => ({
    segs: edges([[0, 0], [50, 50], [0, 100]], { ref: [0, 50], close: true }),
    stroke: 0,
    fill: true
  }),

  /** A chevron pointing up. */
  caret: () => ({
    segs: edges([[0, 100], [50, 50], [100, 100]], { ref: [50, 100] }),
    stroke: 12
  }),

  /** One bulged diagonal — the mark's diagonal as a standalone mark. */
  slash: () => ({
    segs: edges([[0, 100], [100, 0]], { ref: [50, 100] }),
    stroke: 12
  }),

  /** The slash crossed by a straight rule. */
  divider: () => ({
    segs: [
      ...edges([[0, 100], [100, 0]], { ref: [50, 100] }),
      seg([0, 50], [100, 50])
    ],
    stroke: 10
  }),

  /** A straight stem with a bulged diagonal — the b's gesture, abstracted. */
  branch: () => ({
    segs: edges([[0, 0], [0, 100], [100, 0]], { ref: [40, 60] }),
    stroke: 12
  }),

  /** An arrow: straight shaft, bulged head. */
  arrow: () => ({
    segs: [
      seg([0, 50], [62, 50]),
      ...edges([[62, 12], [100, 50], [62, 88]], { ref: [62, 50] })
    ],
    stroke: 10
  }),

  /** A bracket: straight arms only. */
  bracket: () => ({
    segs: edges([[100, 0], [0, 0], [0, 100], [100, 100]], { ref: [50, 50] }),
    stroke: 12
  }),

  /** A bullet: a filled corner triangle. */
  bullet: () => ({
    segs: edges([[0, 0], [100, 0], [0, 100]], { ref: [60, 40], close: true }),
    stroke: 0,
    fill: true
  }),

  /** A tick. Two straight strokes: the bend would read as a wobble here. */
  check: () => ({
    segs: [seg([0, 55], [35, 100]), seg([35, 100], [100, 0])],
    stroke: 12,
    orthogonal: true
  }),

  /** A cross. Straight for the same reason. */
  cross: () => ({
    segs: [seg([0, 0], [100, 100]), seg([100, 0], [0, 100])],
    stroke: 12,
    orthogonal: true
  }),

  /** A dot: the mark's node as a standalone element. */
  dot: () => ({ segs: [], stroke: 0, dot: true }),

  /** A ring: the node's outer form on its own. */
  ring: () => ({ segs: [], stroke: 0, ring: true }),

  /** A progress bar: a track and a filled portion, both capped round. */
  progress: () => ({ segs: [seg([0, 50], [100, 50])], stroke: 16, progress: 0.6 })
};

/** The names in the kit, in a sensible presentation order. */
export const NAMES = [
  'corner', 'wedge', 'chevron', 'play', 'caret', 'slash',
  'divider', 'branch', 'arrow', 'bracket', 'bullet',
  'check', 'cross', 'dot', 'ring', 'progress'
];

/** The geometry of one element, in the 0..100 box. */
export function element(name) {
  const make = ELEMENTS[name];
  if (!make) throw new Error(`no element "${name}"`);
  return make();
}

/* --------------------------------------------------------------------- svg */

/**
 * The node device for an element, as a mask plus rings — the same construction
 * as the mark's, so a corner node looks identical wherever it is used.
 */
function nodes(segs, { stroke, ink, id, size, nodesAt }) {
  const pts = nodesAt || segs.flatMap((s) => [s.a, s.b]);
  const uniq = [];
  for (const p of pts) {
    if (!uniq.some((q) => Math.abs(q[0] - p[0]) < 1e-6 && Math.abs(q[1] - p[1]) < 1e-6)) uniq.push(p);
  }
  const r = stroke * NODE.hole;
  const rect = `x="0" y="0" width="${size}" height="${size}"`;
  const holes = uniq
    .map((p) => `<circle cx="${num(p[0])}" cy="${num(p[1])}" r="${num(r)}" fill="#000"/>`)
    .join('');
  const mask = `<mask id="${id}" maskUnits="userSpaceOnUse" ${rect}><rect ${rect} fill="#fff"/>${holes}</mask>`;
  const rings = uniq
    .map(
      (p) =>
        `<circle cx="${num(p[0])}" cy="${num(p[1])}" r="${num(stroke * NODE.ring)}" fill="none" stroke="${ink}" stroke-width="${num(stroke * NODE.width)}"/>`
    )
    .join('');
  return { mask, rings };
}

/**
 * One element as a standalone SVG.
 *
 * `nodes` adds the corner device. `size` is the rendered square; the element is
 * scaled from its 0..100 box, so the same call works at 16px and 200px.
 */
export function elementSvg(name, {
  ink = color.barbuz.accent,
  size = 48,
  stroke = null,
  nodes: withNodes = false,
  id = `bz-el-${name}`
} = {}) {
  const el = element(name);
  const s = size / BOX;
  const w = (stroke ?? el.stroke) * s;
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;

  if (el.dot || el.ring) {
    const r = (el.ring ? 0.4 : 0.32) * size;
    const c = num(size / 2);
    const shape = el.ring
      ? `<circle cx="${c}" cy="${c}" r="${num(r)}" fill="none" stroke="${ink}" stroke-width="${num(size * 0.11)}"/>`
      : `<circle cx="${c}" cy="${c}" r="${num(r)}" fill="${ink}"/>`;
    return `${open}${shape}</svg>`;
  }

  if (el.progress) {
    const y = num(50 * s - w / 2);
    const track = `<rect x="0" y="${y}" width="${num(size)}" height="${num(w)}" rx="${num(w / 2)}" fill="${ink}" opacity="0.22"/>`;
    const bar = `<rect x="0" y="${y}" width="${num(size * el.progress)}" height="${num(w)}" rx="${num(w / 2)}" fill="${ink}"/>`;
    return `${open}${track}${bar}</svg>`;
  }

  const scaled = el.segs.map((sg) => ({
    a: [sg.a[0] * s, sg.a[1] * s],
    b: [sg.b[0] * s, sg.b[1] * s],
    k: sg.k,
    ref: [sg.ref[0] * s, sg.ref[1] * s]
  }));
  // Shared with the mark, so an element made of several runs — `divider`,
  // `arrow`, `cross` — gets an `M` per run instead of a line across the gap.
  const d = strokedPath(scaled);
  const glyph = el.fill
    ? `<path d="${d} Z" fill="${ink}"/>`
    : `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${num(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;

  if (!withNodes || el.fill) return `${open}${glyph}</svg>`;

  const { mask, rings } = nodes(scaled, { stroke: w, ink, id, size });
  return `${open}${mask}<g mask="url(#${id})">${glyph}</g>${rings}</svg>`;
}

export default { BOX, NAMES, element, elementSvg };
