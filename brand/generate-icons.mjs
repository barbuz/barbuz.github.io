#!/usr/bin/env node
/**
 * Generates the barbuz icon set from brand/mark.mjs.
 *
 *   node brand/generate-icons.mjs            write the assets
 *   node brand/generate-icons.mjs --check    fail if any asset is out of date
 *
 * Writes into static/, which adapter-static copies to build/ verbatim:
 *
 *   favicon.svg              the mark, vector, transparent
 *   favicon.ico              16 / 32 / 48, for legacy tabs
 *   apple-touch-icon.png     180, opaque tile (iOS composites no alpha)
 *   icon-192.png             manifest
 *   icon-512.png             manifest
 *   icon-maskable-512.png    manifest, safe-zone padded for Android masks
 *   og.png                   1200x630 social card, mark + wordmark
 *
 * There is no SVG rasterizer in the toolchain, and adding one would mean a
 * native dependency. The mark is deliberately pure geometry — stroked lines
 * and one quadratic — so it is rasterized here directly: signed distance to
 * each stroke, supersampled for antialiasing. PNG and ICO are encoded by hand.
 * No dependencies, same as generate.mjs.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import {
  color as palette,
  MARK,
  TILE_INSET,
  markStrokes,
  markSvg,
  markFit,
  lockup,
  segPoints
} from './mark.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const STATIC = join(here, '..', 'static');
const CHECK = process.argv.includes('--check');

/* ============================================================== rasterizer */

/** Signed distance from a point to a line segment. */
function distToSegment(px, py, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - a[0]) * dx + (py - a[1]) * dy) / len2 : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
}

/** Coverage of one stroked path at a sample point, as 0..1. */
function coverage(px, py, polylines, halfWidth) {
  let d = Infinity;
  for (const pl of polylines) {
    for (let i = 0; i < pl.length - 1; i++) {
      const dd = distToSegment(px, py, pl[i], pl[i + 1]);
      if (dd < d) d = dd;
    }
  }
  return d <= halfWidth ? 1 : 0;
}

/** Rounded-rect coverage at a sample point. */
function inRoundRect(px, py, size, radius) {
  const r = radius;
  const cx = Math.min(Math.max(px, r), size - r);
  const cy = Math.min(Math.max(py, r), size - r);
  return Math.hypot(px - cx, py - cy) <= r;
}

const SAMPLES = 4; // supersampling factor per axis

/** Device-space bounding box of a strokes layer, including stroke width. */
function layerBBox(layer) {
  if (layer.type !== 'strokes') return null;
  const [tx, ty, s] = layer.transform;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const pl of layer.polylines) {
    for (const [x, y] of pl) {
      const dx = x * s + tx;
      const dy = y * s + ty;
      if (dx < x0) x0 = dx;
      if (dy < y0) y0 = dy;
      if (dx > x1) x1 = dx;
      if (dy > y1) y1 = dy;
    }
  }
  const h = layer.halfWidth * s + 1;
  return [x0 - h, y0 - h, x1 + h, y1 + h];
}

/**
 * Rasterize a scene to RGBA. The scene is a list of layers, painted in order:
 *   { type: 'roundRect', size, radius, color }
 *   { type: 'strokes', polylines, halfWidth, color, transform }
 */
function rasterize(width, height, layers) {
  const px = Buffer.alloc(width * height * 4);
  const step = 1 / SAMPLES;
  const boxes = layers.map(layerBBox);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const fx = x + (sx + 0.5) * step;
          const fy = y + (sy + 0.5) * step;
          let cr = 0, cg = 0, cb = 0, ca = 0;
          for (let li = 0; li < layers.length; li++) {
            const layer = layers[li];
            const box = boxes[li];
            // Skip layers whose box does not contain this sample. Most of a
            // card is empty background, so this is the bulk of the work saved.
            if (box && (fx < box[0] || fy < box[1] || fx > box[2] || fy > box[3])) continue;
            let hit = 0;
            let col;
            if (layer.type === 'roundRect') {
              hit = inRoundRect(fx, fy, layer.size, layer.radius) ? 1 : 0;
              col = layer.color;
            } else {
              let lx = fx, ly = fy;
              if (layer.transform) {
                const [tx, ty, s] = layer.transform;
                lx = (fx - tx) / s;
                ly = (fy - ty) / s;
              }
              hit = coverage(lx, ly, layer.polylines, layer.halfWidth);
              col = layer.color;
            }
            if (hit) {
              // source-over
              cr = col[0]; cg = col[1]; cb = col[2]; ca = 1;
            }
          }
          r += cr; g += cg; b += cb; a += ca;
        }
      }
      const n = SAMPLES * SAMPLES;
      const o = (y * width + x) * 4;
      const alpha = a / n;
      px[o] = Math.round(r / n);
      px[o + 1] = Math.round(g / n);
      px[o + 2] = Math.round(b / n);
      px[o + 3] = Math.round(alpha * 255);
    }
  }
  return px;
}

/* ============================================================ png encoder */

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}

/** Encode RGBA bytes as a PNG. */
function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // colour type: RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ============================================================ ico encoder */

/** Encode PNG images as a multi-size .ico (PNG-compressed entries). */
function encodeIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);      // type: icon
  header.writeUInt16LE(count, 4);
  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const blobs = [];
  images.forEach((img, i) => {
    const o = i * 16;
    dir[o] = img.size >= 256 ? 0 : img.size;
    dir[o + 1] = img.size >= 256 ? 0 : img.size;
    dir[o + 2] = 0;                 // palette count
    dir[o + 3] = 0;                 // reserved
    dir.writeUInt16LE(1, o + 4);    // colour planes
    dir.writeUInt16LE(32, o + 6);   // bits per pixel
    dir.writeUInt32LE(img.png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += img.png.length;
    blobs.push(img.png);
  });
  return Buffer.concat([header, dir, ...blobs]);
}

/* ================================================================= helpers */

const hex = (s) => [
  parseInt(s.slice(1, 3), 16),
  parseInt(s.slice(3, 5), 16),
  parseInt(s.slice(5, 7), 16)
];

/* ================================================================= outputs */

const NIGHT = palette.barbuz.bg;
const ACCENT = palette.barbuz.accent;
const INK = palette.barbuz.text;

// The bare mark is inset less than a tile: no tile padding, and the tab needs
// every pixel of stroke it can get.
const FAVICON_INSET = 0.94;

// A tile that carries its own padding (apple-touch, maskable) insets the mark
// further. The maskable safe zone is the inner 80% of the square, which caps
// the mark at 0.69; 0.62 sits inside that with room to spare.
const PADDED_INSET = 0.62;

function iconTile(size, { ink = ACCENT, bg = NIGHT, radius = 0.22, inset = TILE_INSET } = {}) {
  const { s, tx, ty } = markFit(size, inset);
  return rasterize(size, size, [
    { type: 'roundRect', size, radius: size * radius, color: hex(bg) },
    {
      type: 'strokes',
      polylines: markStrokes().map((st) => segPoints(st, 48)),
      halfWidth: MARK.stroke / 2,
      color: hex(ink),
      transform: [tx, ty, s]
    }
  ]);
}

/** The mark alone on a square transparent canvas — the favicon and the tab. */
function markAlone(size, { ink = ACCENT, inset = FAVICON_INSET } = {}) {
  const { s, tx, ty } = markFit(size, inset);
  return rasterize(size, size, [
    {
      type: 'strokes',
      polylines: markStrokes().map((st) => segPoints(st, 48)),
      halfWidth: MARK.stroke / 2,
      color: hex(ink),
      transform: [tx, ty, s]
    }
  ]);
}

/**
 * The social card: night ground, the lockup centred.
 *
 * The lockup is the mark followed by "arbuz" — the mark is the b, so setting
 * the full name would draw it twice. See `lockup()` in mark.mjs.
 */
function ogCard(w = 1200, h = 630) {
  const lk = lockup('barbuz');

  // One scale for the pair, so the mark and the letters keep their relative
  // sizes; it is the block, not the mark, that is sized to the card.
  const targetH = 216;
  const scale = targetH / lk.box.h;
  const tx = (w - lk.box.w * scale) / 2 - lk.box.x * scale;
  const ty = (h - lk.box.h * scale) / 2 - lk.box.y * scale;

  const layer = (part, ink) => ({
    type: 'strokes',
    polylines: part.strokes.map((s) => segPoints(s, 48)),
    halfWidth: part.stroke / 2,
    color: hex(ink),
    transform: [tx, ty, scale]
  });

  return rasterize(w, h, [
    { type: 'roundRect', size: w, radius: 0, color: hex(NIGHT) },
    layer(lk.mark, ACCENT),
    layer(lk.word, INK)
  ]);
}

/* ==================================================================== main */

const outputs = [];

// favicon.svg — the mark alone, vector, in the accent. A tab has no persona,
// so it is the literal colour rather than a CSS variable.
outputs.push(['favicon.svg', Buffer.from(markSvg({ ink: ACCENT }), 'utf8')]);

// favicon.ico — 16 / 32 / 48. The mark alone, transparent, matching
// favicon.svg. The tile form is for app icons; in a browser tab the tile
// padding only costs legibility, because the mark is tall and narrow and a
// square tile forces it down to a few pixels.
{
  const sizes = [16, 32, 48];
  const images = sizes.map((s) => {
    const px = markAlone(s, { ink: ACCENT, inset: FAVICON_INSET });
    return { size: s, png: encodePng(s, s, px) };
  });
  outputs.push(['favicon.ico', encodeIco(images)]);
}

// apple-touch-icon.png — 180, opaque; iOS ignores transparency and rounds it.
outputs.push(['apple-touch-icon.png', encodePng(180, 180, iconTile(180, { radius: 0, inset: PADDED_INSET }))]);

// manifest icons
outputs.push(['icon-192.png', encodePng(192, 192, iconTile(192))]);
outputs.push(['icon-512.png', encodePng(512, 512, iconTile(512))]);

// maskable: the safe zone is the inner 80%, so the glyph is inset further and
// the tile is a full bleed square (Android applies the mask).
outputs.push(['icon-maskable-512.png', encodePng(512, 512, iconTile(512, { radius: 0, inset: PADDED_INSET }))]);

// og.png — 1200x630 social card
outputs.push(['og.png', encodePng(1200, 630, ogCard())]);

/* write or check */
mkdirSync(STATIC, { recursive: true });
let stale = false;
for (const [name, buf] of outputs) {
  const path = join(STATIC, name);
  if (CHECK) {
    const onDisk = existsSync(path) ? readFileSync(path) : null;
    if (!onDisk || !onDisk.equals(buf)) {
      console.error(`static/${name} is out of date. Run: npm run icons`);
      stale = true;
    }
  } else {
    writeFileSync(path, buf);
    console.log(`wrote static/${name}  (${buf.length} bytes)`);
  }
}
if (CHECK) {
  if (stale) process.exit(1);
  console.log('icon assets are up to date.');
}
