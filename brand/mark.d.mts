/**
 * Types for `brand/mark.mjs`.
 *
 * `mark.mjs` is plain JS — run directly by node, and by the icon generator.
 * It is deliberately not part of the type-checked program, so this declares
 * only the surface the page imports. `npm run icons:check` in CI is what
 * guards the geometry; this guards the call sites.
 */

export declare const color: Record<
  'barbuz' | 'leo',
  Record<'bg' | 'surface' | 'text' | 'muted' | 'accent', string>
>;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Lockup {
  mark: { strokes: unknown[]; stroke: number };
  word: { strokes: unknown[]; stroke: number } | null;
  box: Box;
}

export declare function lockup(name?: string): Lockup;

/**
 * Split a run into the letter's own ink and its accent strokes. The z's foot
 * is the only accent stroke today.
 */
export declare function splitAccent(strokes: unknown[]): {
  ink: unknown[];
  accent: unknown[];
};

export declare function lockupSvg(opts?: {
  name?: string;
  ink?: string;
  accent?: string;
  nodes?: boolean;
  id?: string;
  size?: number | null;
}): string;

export declare function markSvg(opts?: {
  ink?: string;
  size?: number | null;
  stroke?: number;
  nodes?: boolean;
  id?: string;
}): string;

export declare function tileSvg(opts?: {
  ink?: string;
  bg?: string;
  size?: number;
  radius?: number;
  inset?: number;
  stroke?: number;
  nodes?: boolean;
  id?: string;
}): string;
