/**
 * The barbuz mark — shared geometry. Source of truth for the logo.
 *
 * One primitive: a right triangle whose sides are vertical, horizontal and
 * diagonal. Every letter of "barbuz" is a subset of the b's four strokes
 * {S, V, H, D}:
 *
 *   b = S + V + H + D      (the whole — this is the mark)
 *   a = V + H + D
 *   r = V + H
 *   u = V + D
 *   z = H + D
 *
 * Containment is the rule. The b is the whole, every other letter is a piece
 * of it, and the mark is the b. That is why z is never asked to stand alone.
 *
 * Curvature: k > 0 bulges a segment AWAY from its reference point, i.e.
 * outward. k = 0 is a straight line. The mark and the letters share one k, so
 * they are one system rather than two shapes that sit near each other.
 *
 * Pure data and pure functions — no DOM, no dependencies — so the page and the
 * icon generator share exactly one definition. See docs/DESIGN-NOTES.md.
 *
 * Richer geometry? The icon generator rasterizes these strokes by hand, which
 * is exact only while the mark stays lines and quadratics. Filled shapes,
 * gradients or path booleans would break that — see "Why the rasterizer is
 * hand-rolled" in docs/DESIGN-NOTES.md before adding any.
 */

/** Palette, mirrored from brand/tokens.json. */
export const color = {
  barbuz: { bg: '#0a0e17', surface: '#111726', text: '#e7eaf2', muted: '#8a94aa', accent: '#3d7bff' },
  leo: { bg: '#faf8f3', surface: '#ffffff', text: '#1b1a17', muted: '#6e6a5f', accent: '#1d4ed8' }
};

/** The one curvature value. Bulges outward. */
export const K = 0.16;

/** The mark (the b), heavier than the text cut so it survives 16px. */
export const MARK = {
  stroke: 14,
  top: 6,
  base: 94,
  xHeight: 50,
  width: 46
};
MARK.center = [MARK.width / 3, (2 * MARK.xHeight + MARK.base) / 3];

/** The typeface, at its own weight. */
export const TEXT = {
  stroke: 9,
  top: 8,
  base: 100,
  xHeight: 52,
  width: 40,
  gap: 18
};
TEXT.center = [TEXT.width / 3, (2 * TEXT.xHeight + TEXT.base) / 3];

const num = (v) => (Math.round(v * 1000) / 1000).toString();

/* ---------------------------------------------------------------- geometry */

/** A segment: two endpoints, a curvature and the point to bulge away from. */
const seg = (a, b, k = 0, ref = [0, 0]) => ({ a, b, k, ref });

/** The quadratic control point that bulges `s` away from `s.ref` by k*len. */
function control(s) {
  const [ax, ay] = s.a;
  const [bx, by] = s.b;
  const cx = (ax + bx) / 2;
  const cy = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  // n must point away from the reference, so the curve bulges outward.
  if ((s.ref[0] - cx) * nx + (s.ref[1] - cy) * ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  return [cx + nx * s.k * len, cy + ny * s.k * len];
}

/** SVG path fragment for one segment, continuing from the current point. */
function segPath(s) {
  const [bx, by] = s.b;
  if (Math.abs(s.k) < 1e-9) return `L${num(bx)},${num(by)}`;
  const [cx, cy] = control(s);
  return `Q${num(cx)},${num(cy)} ${num(bx)},${num(by)}`;
}

/** Sample a segment to a polyline — for the rasterizer, which needs points. */
export function segPoints(s, n = 48) {
  const [ax, ay] = s.a;
  const [bx, by] = s.b;
  if (Math.abs(s.k) < 1e-9) return [[ax, ay], [bx, by]];
  const [cx, cy] = control(s);
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const mt = 1 - t;
    out.push([
      mt * mt * ax + 2 * mt * t * cx + t * t * bx,
      mt * mt * ay + 2 * mt * t * cy + t * t * by
    ]);
  }
  return out;
}

/* ------------------------------------------------------------------ shapes */

/**
 * The b's four strokes, named. Every letter is a run of these in the order
 * that draws it as one continuous line.
 */
function strokesFor({ top, base, xHeight, width, center }) {
  return {
    S: seg([0, top], [0, base]),                                  // stem
    V: seg([0, xHeight], [0, base]),                              // vertical
    H: seg([0, xHeight], [width, xHeight]),                       // horizontal, left to right
    D: seg([0, base], [width, xHeight], K, center),               // diagonal, bottom-left up
    Vb: seg([0, base], [0, xHeight]),                             // vertical, drawn upward
    Hb: seg([width, xHeight], [0, xHeight]),                      // horizontal, drawn right to left
    Db: seg([width, xHeight], [0, base], K, center)               // diagonal, top-right down
  };
}

/** The mark: the b, at mark weight. One continuous line, no closure needed. */
export function markStrokes() {
  const s = strokesFor(MARK);
  // S already contains V — they are collinear and V lies inside S — so the b
  // draws as S + D + Hb. V stays a separate name because the decomposition is
  // the point: a = V + H + D is the b without the ascender S adds over V.
  return [s.S, s.D, s.Hb];
}

/** A letter's strokes, at text weight. One continuous line, in drawing order. */
export function letterStrokes(ch) {
  const s = strokesFor(TEXT);
  switch (ch) {
    case 'b': return [s.S, s.D, s.Hb];   // stem down, diagonal up, bar back
    case 'a': return [s.V, s.D, s.Hb];   // down, diagonal up, bar back
    case 'r': return [s.Vb, s.H];        // up, bar right
    case 'u': return [s.V, s.D];         // down, diagonal up
    case 'z': return [s.H, s.Db];        // bar right, diagonal down-left
    default: throw new Error(`no letter "${ch}"`);
  }
}

/** All the strokes of the wordmark in absolute coordinates, for rasterizing. */
export function wordStrokes(text = 'barbuz') {
  const adv = TEXT.width + TEXT.gap;
  const strokes = [];
  for (let i = 0; i < text.length; i++) {
    const dx = i * adv;
    for (const s of letterStrokes(text[i])) {
      strokes.push({
        a: [s.a[0] + dx, s.a[1]],
        b: [s.b[0] + dx, s.b[1]],
        k: s.k,
        ref: [s.ref[0] + dx, s.ref[1]]
      });
    }
  }
  return { strokes, stroke: TEXT.stroke, width: (text.length - 1) * adv + TEXT.width, height: TEXT.base };
}

/** The bounding box of a set of strokes, including the stroke width. */
export function bounds(strokes, stroke) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of strokes) {
    for (const [x, y] of segPoints(s, 24)) {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  }
  const h = stroke / 2;
  return { x: x0 - h, y: y0 - h, w: x1 - x0 + stroke, h: y1 - y0 + stroke };
}

/**
 * The mark's default inset inside a square icon tile. One value, shared by
 * every path that places the mark in a square, so the SVG and the raster
 * cannot drift apart.
 */
export const TILE_INSET = 0.66;

/**
 * Fit the mark into a `size`×`size` square, returning the transform that
 * places it. The mark is height-bound, so the scale comes from its height and
 * the result is centred. This is the only place that formula lives.
 */
export function markFit(size, inset = TILE_INSET, stroke = MARK.stroke) {
  const b = bounds(markStrokes(), stroke);
  const s = (size * inset) / Math.max(b.w, b.h);
  return { s, tx: (size - b.w * s) / 2 - b.x * s, ty: (size - b.h * s) / 2 - b.y * s };
}

/* --------------------------------------------------------------------- svg */

/** A stroked path for a run of strokes, starting with an explicit M. */
function strokedPath(strokes) {
  let d = '';
  let first = true;
  for (const s of strokes) {
    if (first) {
      d += `M${num(s.a[0])},${num(s.a[1])}`;
      first = false;
    }
    d += ' ' + segPath(s);
  }
  return d;
}

const svgEl = (vb, size, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${
    size ? ` width="${size}" height="${size}"` : ''
  }>${body}</svg>`;

const strokeAttrs = (stroke) =>
  `fill="none" stroke-width="${num(stroke)}" stroke-linecap="round" stroke-linejoin="round"`;

/** The mark on its own, transparent background. */
export function markSvg({ ink = color.barbuz.accent, size = null, stroke = MARK.stroke } = {}) {
  const strokes = markStrokes();
  const b = bounds(strokes, stroke);
  const vb = `${num(b.x)} ${num(b.y)} ${num(b.w)} ${num(b.h)}`;
  const body = `<path d="${strokedPath(strokes)}" ${strokeAttrs(stroke)} stroke="${ink}"/>`;
  return svgEl(vb, size, body);
}

/** The mark inside the rounded tile — the app-icon shape, as vector. */
export function tileSvg({
  ink = color.barbuz.accent,
  bg = color.barbuz.bg,
  size = 512,
  radius = 0.22,
  inset = TILE_INSET,
  stroke = MARK.stroke
} = {}) {
  const { s, tx, ty } = markFit(size, inset, stroke);
  const rx = size * radius;
  const glyph = `<path d="${strokedPath(markStrokes())}" ${strokeAttrs(stroke)} stroke="${ink}"/>`;
  return svgEl(
    `0 0 ${size} ${size}`,
    size,
    `<rect width="${size}" height="${size}" rx="${num(rx)}" fill="${bg}"/>` +
      `<g transform="translate(${num(tx)},${num(ty)}) scale(${num(s)})">${glyph}</g>`
  );
}

export default {
  color,
  K,
  MARK,
  TEXT,
  TILE_INSET,
  markStrokes,
  letterStrokes,
  markSvg,
  tileSvg,
  markFit,
  bounds,
  segPoints
};
