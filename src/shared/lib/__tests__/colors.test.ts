import { describe, it, expect } from "vitest";
import { distinctColor, DISTINCT_PALETTE } from "../colors";

describe("distinctColor", () => {
  it("returns palette colors for indices within the palette range", () => {
    for (let i = 0; i < DISTINCT_PALETTE.length; i++) {
      expect(distinctColor(i)).toBe(DISTINCT_PALETTE[i]);
    }
  });

  it("returns HSL strings for indices beyond the palette", () => {
    for (let i = DISTINCT_PALETTE.length; i < DISTINCT_PALETTE.length + 5; i++) {
      expect(distinctColor(i)).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
    }
  });

  it("generates unique colors for the first 30 indices", () => {
    const colors = new Set<string>();
    for (let i = 0; i < 30; i++) {
      colors.add(distinctColor(i));
    }
    expect(colors.size).toBe(30);
  });

  it("clamps negative indices to 0", () => {
    expect(distinctColor(-1)).toBe(DISTINCT_PALETTE[0]);
    expect(distinctColor(-100)).toBe(DISTINCT_PALETTE[0]);
  });

  it("floors fractional indices", () => {
    expect(distinctColor(0.9)).toBe(DISTINCT_PALETTE[0]);
    expect(distinctColor(2.5)).toBe(DISTINCT_PALETTE[2]);
  });

  it("returns the same color for the same index (deterministic)", () => {
    expect(distinctColor(15)).toBe(distinctColor(15));
    expect(distinctColor(42)).toBe(distinctColor(42));
  });
});
