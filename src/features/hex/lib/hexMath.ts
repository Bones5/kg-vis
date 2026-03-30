import type { HexCoord } from "@/shared/types/hex";

export const HEX_SIZE = 48;

/** Flat-top axial hex coordinates to pixel (center point). */
export function hexToPixel(hex: HexCoord, size: number = HEX_SIZE): { px: number; py: number } {
  const px = size * (3 / 2) * hex.q;
  const py = size * (Math.sqrt(3) / 2 * hex.q + Math.sqrt(3) * hex.r);
  return { px, py };
}

/** Pixel to nearest flat-top axial hex coordinate. */
export function pixelToHex(px: number, py: number, size: number = HEX_SIZE): HexCoord {
  const q = (2 / 3) * px / size;
  const r = (-1 / 3) * px / size + (Math.sqrt(3) / 3) * py / size;
  return hexRound({ q, r });
}

function hexRound(hex: { q: number; r: number }): HexCoord {
  const s = -hex.q - hex.r;
  let rq = Math.round(hex.q);
  let rr = Math.round(hex.r);
  let rs = Math.round(s);

  const dq = Math.abs(rq - hex.q);
  const dr = Math.abs(rr - hex.r);
  const ds = Math.abs(rs - s);

  if (dq > dr && dq > ds) {
    rq = -rr - rs;
  } else if (dr > ds) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}

const FLAT_TOP_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

/** All 6 neighbors of a hex coordinate. */
export function hexNeighbors(hex: HexCoord): HexCoord[] {
  return FLAT_TOP_DIRECTIONS.map((d) => ({ q: hex.q + d.q, r: hex.r + d.r }));
}

/** Axial hex distance. */
export function hexDistance(a: HexCoord, b: HexCoord): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

/** Generate all hex coordinates in a ring of given radius around center. */
export function hexRing(center: HexCoord, radius: number): HexCoord[] {
  if (radius === 0) return [{ ...center }];

  const results: HexCoord[] = [];
  // Start at the "east" corner of the ring
  let cur: HexCoord = {
    q: center.q + FLAT_TOP_DIRECTIONS[4].q * radius,
    r: center.r + FLAT_TOP_DIRECTIONS[4].r * radius,
  };

  for (let side = 0; side < 6; side++) {
    for (let step = 0; step < radius; step++) {
      results.push({ ...cur });
      const d = FLAT_TOP_DIRECTIONS[(side + 2) % 6];
      cur = { q: cur.q + d.q, r: cur.r + d.r };
    }
  }

  return results;
}

/** CSS clip-path polygon string for a flat-top hex shape. */
export function hexClipPath(inset: number = 0): string {
  // Flat-top hex: 6 points at 0°, 60°, 120°, 180°, 240°, 300°
  const angles = [0, 60, 120, 180, 240, 300];
  const pct = 50 - inset;
  const points = angles.map((a) => {
    const rad = (a * Math.PI) / 180;
    const x = 50 + pct * Math.cos(rad);
    const y = 50 + pct * Math.sin(rad);
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  });
  return `polygon(${points.join(", ")})`;
}

export function hexKey(hex: HexCoord): string {
  return `${hex.q},${hex.r}`;
}
