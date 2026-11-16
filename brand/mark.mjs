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

/**
 * The node device: a knockout hole with a ring, as multiples of the stroke
 * width. A node sits on a stroke endpoint, where the round cap already is.
 *
 * The hole is what makes it work. The mark is drawn in the accent, so an
 * accent node on the mark would be invisible; carrying the contrast in the
 * hole rather than in the node's own colour lets one device read on both the
 * accent mark and the ink word.
 */
export const NODE = { hole: 0.42, ring: 0.42, width: 0.2 };

const num = (v) => (Math.round(v * 1000) / 1000).toString();

/* ---------------------------------------------------------------- geometry */

/**
 * A segment: two endpoints, a curvature and the point to bulge away from.
 * Exported so the element library draws with the same machinery, and so a
 * diagonal bulges by the same rule wherever it appears.
 */
export const seg = (a, b, k = 0, ref = [0, 0]) => ({ a, b, k, ref });

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
export function segPath(s) {
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

/**
 * The lockup: the mark, then the rest of the name.
 *
 * The mark IS the b, so the word beside it is "arbuz". Setting the full name
 * would draw the b twice — the mark once as a mark, then again as a letter.
 *
 * The mark is scaled so its bowl — baseline to x-height — matches the text's,
 * and the two share a baseline, so the b's bowl sits level with a, r, u and z.
 * Its ascender ends up a little taller and its stroke a little heavier than the
 * text's, because the mark is a heavier cut; that is the point, not a defect.
 *
 * Everything comes back in the text's coordinate space (baseline `TEXT.base`,
 * x-height `TEXT.xHeight`), so a caller scales and centres the pair as one.
 */
export function lockup(name = 'barbuz') {
  if (name[0] !== 'b') throw new Error(`the lockup needs a name starting with b, got "${name}"`);

  const s = (TEXT.base - TEXT.xHeight) / (MARK.base - MARK.xHeight);
  const dy = TEXT.base - MARK.base * s;
  const place = (st, dx) => ({
    a: [st.a[0] * s + dx, st.a[1] * s + dy],
    b: [st.b[0] * s + dx, st.b[1] * s + dy],
    k: st.k,
    ref: [st.ref[0] * s + dx, st.ref[1] * s + dy]
  });
  const shift = (st, dx) => ({
    ...st,
    a: [st.a[0] + dx, st.a[1]],
    b: [st.b[0] + dx, st.b[1]],
    ref: [st.ref[0] + dx, st.ref[1]]
  });

  const mark = { strokes: markStrokes().map((st) => place(st, 0)), stroke: MARK.stroke * s };
  const markBox = bounds(mark.strokes, mark.stroke);

  // A name of just "b" is the mark on its own — no word to set beside it.
  let word = null;
  if (name.length > 1) {
    const w = wordStrokes(name.slice(1));
    const wb = bounds(w.strokes, w.stroke);
    // One letter gap, measured ink to ink: the advance minus the ink a letter
    // occupies. The mark is wider than a text b, so the word starts further
    // right than it would after a plain letter — that is what keeps the
    // spacing even rather than opening a hole after the mark.
    const dx = markBox.x + markBox.w + (TEXT.gap - TEXT.stroke) - wb.x;
    word = { strokes: w.strokes.map((st) => shift(st, dx)), stroke: w.stroke };
  }

  const parts = word ? [mark, word] : [mark];
  const boxes = parts.map((p) => bounds(p.strokes, p.stroke));
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return {
    mark,
    word,
    box: {
      x,
      y,
      w: Math.max(...boxes.map((b) => b.x + b.w)) - x,
      h: Math.max(...boxes.map((b) => b.y + b.h)) - y
    }
  };
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
 * The distinct points a set of strokes runs between.
 *
 * Every stroke in the system ends on one of four points — the primitive's
 * corners — so this returns at most four, and returns them in the primitive's
 * own order: P1 the tip of the ascender, P2 the foot, P3 the shoulder, P4 the
 * right angle. Containment is then node-set containment: the b touches all
 * four, and every other letter touches P2, P3 and P4 only.
 */
export function nodePoints(strokes) {
  const found = [];
  for (const s of strokes) {
    for (const p of [s.a, s.b]) {
      if (!found.some((q) => Math.abs(q[0] - p[0]) < 1e-6 && Math.abs(q[1] - p[1]) < 1e-6)) {
        found.push([p[0], p[1]]);
      }
    }
  }
  // Sort into the primitive's own order rather than discovery order, so the
  // result does not depend on how the caller happened to draw the strokes.
  return found.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
}

/** Sample a circle to a polyline — for the rasterizer, which needs points. */
export function circlePoints(cx, cy, r, n = 48) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    out.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
  }
  return out;
}

/** The node device resolved to concrete radii, for a run of strokes. */
export function nodeCircles(strokes, stroke, node = NODE) {
  return nodePoints(strokes).map(([cx, cy]) => ({
    cx,
    cy,
    hole: stroke * node.hole,
    ring: stroke * node.ring,
    width: stroke * node.width
  }));
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

/**
 * The contiguous runs in a stroke list: a new run starts wherever the pen
 * jumps. One letter is one run; a word is one run per letter.
 */
export function strokeRuns(strokes) {
  let n = 0;
  let pen = null;
  for (const s of strokes) {
    if (!pen || Math.hypot(s.a[0] - pen[0], s.a[1] - pen[1]) > 1e-6) n++;
    pen = s.b;
  }
  return n;
}

/** A stroked path for a run of strokes, starting an explicit M per subpath. */
export function strokedPath(strokes) {
  let d = '';
  let pen = null;
  for (const s of strokes) {
    // Start a new subpath whenever the pen is not already at the stroke's
    // start. One letter is a single continuous line, so this never fires for
    // it; a word is several lines, and without this the `L` would draw a
    // segment straight across the gap between two letters.
    if (!pen || Math.hypot(s.a[0] - pen[0], s.a[1] - pen[1]) > 1e-6) {
      d += (d ? ' ' : '') + `M${num(s.a[0])},${num(s.a[1])}`;
    }
    d += (d ? ' ' : '') + segPath(s);
    pen = s.b;
  }
  return d;
}

// A size sets the width and scales the height by the viewBox's own aspect, so a
// wide viewBox (the lockup) is not squashed into a square.
const svgEl = (vb, size, body) => {
  let dims = '';
  if (size) {
    const [, , w, h] = vb.split(' ').map(Number);
    dims = ` width="${size}" height="${num((size * h) / w)}"`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${dims}>${body}</svg>`;
};

const strokeAttrs = (stroke) =>
  `fill="none" stroke-width="${num(stroke)}" stroke-linecap="round" stroke-linejoin="round"`;

/**
 * The node device as SVG: a mask that punches the holes out of the strokes,
 * plus the rings that sit in them.
 *
 * A mask rather than a disc of ground colour, so the hole is a real hole and
 * the mark reads on any background — including the transparent favicon, where
 * a ground-coloured disc would show as a solid dot.
 *
 * `id` must be unique within the document, and `box` is the run's bounding box
 * in its own coordinate space (the mask has to cover everything it keeps).
 */
export function nodeDevice(strokes, { stroke, ink, id, box, node = NODE } = {}) {
  const circles = nodeCircles(strokes, stroke, node);
  const rect = `x="${num(box.x)}" y="${num(box.y)}" width="${num(box.w)}" height="${num(box.h)}"`;
  const holes = circles
    .map((c) => `<circle cx="${num(c.cx)}" cy="${num(c.cy)}" r="${num(c.hole)}" fill="#000"/>`)
    .join('');
  const mask =
    `<mask id="${id}" maskUnits="userSpaceOnUse" ${rect}>` +
    `<rect ${rect} fill="#fff"/>${holes}</mask>`;
  const rings = circles
    .map(
      (c) =>
        `<circle cx="${num(c.cx)}" cy="${num(c.cy)}" r="${num(c.ring)}" fill="none" stroke="${ink}" stroke-width="${num(c.width)}"/>`
    )
    .join('');
  return { mask, rings };
}

/**
 * The mark on its own, transparent background.
 *
 * `nodes` is on by default — the node device is part of the mark, so it ships.
 * The mask makes it a real hole, which is what lets the transparent favicon
 * carry it.
 */
export function markSvg({
  ink = color.barbuz.accent,
  size = null,
  stroke = MARK.stroke,
  nodes = true,
  id = 'bz-nodes'
} = {}) {
  const strokes = markStrokes();
  const b = bounds(strokes, stroke);
  const vb = `${num(b.x)} ${num(b.y)} ${num(b.w)} ${num(b.h)}`;
  const glyph = `<path d="${strokedPath(strokes)}" ${strokeAttrs(stroke)} stroke="${ink}"/>`;
  if (!nodes) return svgEl(vb, size, glyph);
  const { mask, rings } = nodeDevice(strokes, { stroke, ink, id, box: b });
  return svgEl(vb, size, `${mask}<g mask="url(#${id})">${glyph}</g>${rings}`);
}

/** The mark inside the rounded tile — the app-icon shape, as vector. */
export function tileSvg({
  ink = color.barbuz.accent,
  bg = color.barbuz.bg,
  size = 512,
  radius = 0.22,
  inset = TILE_INSET,
  stroke = MARK.stroke,
  nodes = true,
  id = 'bz-nodes'
} = {}) {
  const { s, tx, ty } = markFit(size, inset, stroke);
  const rx = size * radius;
  const strokes = markStrokes();
  const glyph = `<path d="${strokedPath(strokes)}" ${strokeAttrs(stroke)} stroke="${ink}"/>`;
  const rect = `<rect width="${size}" height="${size}" rx="${num(rx)}" fill="${bg}"/>`;
  if (!nodes) {
    return svgEl(
      `0 0 ${size} ${size}`,
      size,
      rect + `<g transform="translate(${num(tx)},${num(ty)}) scale(${num(s)})">${glyph}</g>`
    );
  }
  const box = bounds(strokes, stroke);
  const { mask, rings } = nodeDevice(strokes, { stroke, ink, id, box });
  return svgEl(
    `0 0 ${size} ${size}`,
    size,
    rect +
      `<g transform="translate(${num(tx)},${num(ty)}) scale(${num(s)})">` +
      `${mask}<g mask="url(#${id})">${glyph}</g>${rings}</g>`
  );
}

/**
 * The lockup as one SVG: the mark, then the rest of the name, with the node
 * device on both. The node radii are per-part, because the mark is a heavier
 * cut than the letters — a node sized to the word would be too small on the
 * mark, and vice versa.
 */
export function lockupSvg({
  name = 'barbuz',
  ink = color.barbuz.text,
  accent = color.barbuz.accent,
  nodes = true,
  id = 'bz',
  size = null
} = {}) {
  const lk = lockup(name);
  const vb = `${num(lk.box.x)} ${num(lk.box.y)} ${num(lk.box.w)} ${num(lk.box.h)}`;
  const markPath = `<path d="${strokedPath(lk.mark.strokes)}" ${strokeAttrs(lk.mark.stroke)} stroke="${accent}"/>`;
  const wordPath = lk.word
    ? `<path d="${strokedPath(lk.word.strokes)}" ${strokeAttrs(lk.word.stroke)} stroke="${ink}"/>`
    : '';
  if (!nodes) return svgEl(vb, size, markPath + wordPath);

  // Two masks, because the mark and the letters are different weights and so
  // have different node radii. Both use the lockup's own box, so a mask can
  // never clip the run it belongs to.
  const markId = `${id}-mark-nodes`;
  const wordId = `${id}-word-nodes`;
  const markDev = nodeDevice(lk.mark.strokes, { stroke: lk.mark.stroke, ink: accent, id: markId, box: lk.box });
  const wordDev = lk.word
    ? nodeDevice(lk.word.strokes, { stroke: lk.word.stroke, ink, id: wordId, box: lk.box })
    : { mask: '', rings: '' };
  const body =
    markDev.mask + wordDev.mask +
    `<g mask="url(#${markId})">${markPath}</g>` +
    (lk.word ? `<g mask="url(#${wordId})">${wordPath}</g>` : '') +
    markDev.rings + wordDev.rings;
  return svgEl(vb, size, body);
}

export default {
  color,
  K,
  MARK,
  TEXT,
  NODE,
  TILE_INSET,
  markStrokes,
  letterStrokes,
  wordStrokes,
  lockup,
  bounds,
  strokeRuns,
  strokedPath,
  nodePoints,
  nodeCircles,
  circlePoints,
  nodeDevice,
  markSvg,
  tileSvg,
  lockupSvg,
  markFit,
  lockup,
  bounds,
  segPoints
};
