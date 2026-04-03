import { describe, it, expect } from "vitest";
import { hexToPixel, pixelToHex, hexDistance, hexRing, hexNeighbors } from "../hexMath";

describe("hexToPixel / pixelToHex round-trip", () => {
  it("converts origin to (0, 0)", () => {
    const { px, py } = hexToPixel({ q: 0, r: 0 });
    expect(px).toBe(0);
    expect(py).toBe(0);
  });

  it("round-trips arbitrary coordinates", () => {
    const coords = [
      { q: 1, r: 0 },
      { q: 0, r: 1 },
      { q: -1, r: 2 },
      { q: 3, r: -1 },
    ];
    for (const hex of coords) {
      const { px, py } = hexToPixel(hex);
      const back = pixelToHex(px, py);
      expect(back.q).toBe(hex.q);
      expect(back.r).toBe(hex.r);
    }
  });
});

describe("hexDistance", () => {
  it("returns 0 for same coordinate", () => {
    expect(hexDistance({ q: 3, r: -1 }, { q: 3, r: -1 })).toBe(0);
  });

  it("returns 1 for adjacent hexes", () => {
    const center = { q: 0, r: 0 };
    for (const neighbor of hexNeighbors(center)) {
      expect(hexDistance(center, neighbor)).toBe(1);
    }
  });

  it("returns correct distance for non-adjacent hexes", () => {
    expect(hexDistance({ q: 0, r: 0 }, { q: 2, r: -1 })).toBe(2);
    expect(hexDistance({ q: 0, r: 0 }, { q: 3, r: 0 })).toBe(3);
  });
});

describe("hexRing", () => {
  it("returns single cell at radius 0", () => {
    const result = hexRing({ q: 0, r: 0 }, 0);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ q: 0, r: 0 });
  });

  it("returns 6 cells at radius 1", () => {
    const result = hexRing({ q: 0, r: 0 }, 1);
    expect(result).toHaveLength(6);
    // All cells should be unique
    const keys = new Set(result.map((h) => `${h.q},${h.r}`));
    expect(keys.size).toBe(6);
  });

  it("returns 12 cells at radius 2", () => {
    const result = hexRing({ q: 0, r: 0 }, 2);
    expect(result).toHaveLength(12);
    const keys = new Set(result.map((h) => `${h.q},${h.r}`));
    expect(keys.size).toBe(12);
  });

  it("returns 6*r cells at radius r", () => {
    for (const r of [3, 4, 5]) {
      expect(hexRing({ q: 0, r: 0 }, r)).toHaveLength(6 * r);
    }
  });
});

describe("hexNeighbors", () => {
  it("returns 6 neighbors", () => {
    const n = hexNeighbors({ q: 0, r: 0 });
    expect(n).toHaveLength(6);
  });

  it("all neighbors are at distance 1", () => {
    const center = { q: 2, r: -3 };
    for (const neighbor of hexNeighbors(center)) {
      expect(hexDistance(center, neighbor)).toBe(1);
    }
  });
});
