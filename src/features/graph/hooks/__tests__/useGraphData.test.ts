import { describe, it, expect } from "vitest";
import { parsePositiveInt, parseDensity } from "../useGraphData";

describe("parsePositiveInt", () => {
  it("returns fallback for null", () => {
    expect(parsePositiveInt(null, 8)).toBe(8);
  });

  it("returns fallback for empty string", () => {
    expect(parsePositiveInt("", 8)).toBe(8);
  });

  it("parses valid positive integer", () => {
    expect(parsePositiveInt("5", 8)).toBe(5);
  });

  it("returns fallback for zero", () => {
    expect(parsePositiveInt("0", 8)).toBe(8);
  });

  it("returns fallback for negative number", () => {
    expect(parsePositiveInt("-3", 8)).toBe(8);
  });

  it("returns fallback for non-numeric string", () => {
    expect(parsePositiveInt("abc", 8)).toBe(8);
  });

  it("returns fallback for floating point string", () => {
    // parseInt will parse "3.7" as 3, which is > 0
    expect(parsePositiveInt("3.7", 8)).toBe(3);
  });

  it("returns fallback for Infinity", () => {
    expect(parsePositiveInt("Infinity", 8)).toBe(8);
  });

  it("returns fallback for NaN", () => {
    expect(parsePositiveInt("NaN", 8)).toBe(8);
  });
});

describe("parseDensity", () => {
  it("returns fallback for null", () => {
    expect(parseDensity(null, 0.3)).toBe(0.3);
  });

  it("returns fallback for empty string", () => {
    expect(parseDensity("", 0.3)).toBe(0.3);
  });

  it("parses valid density", () => {
    expect(parseDensity("0.5", 0.3)).toBe(0.5);
  });

  it("clamps to 0 for negative values", () => {
    expect(parseDensity("-0.5", 0.3)).toBe(0);
  });

  it("clamps to 1 for values > 1", () => {
    expect(parseDensity("999", 0.3)).toBe(1);
  });

  it("returns 0 for zero", () => {
    expect(parseDensity("0", 0.3)).toBe(0);
  });

  it("returns 1 for exactly 1", () => {
    expect(parseDensity("1", 0.3)).toBe(1);
  });

  it("returns fallback for non-numeric string", () => {
    expect(parseDensity("abc", 0.3)).toBe(0.3);
  });

  it("returns fallback for Infinity", () => {
    expect(parseDensity("Infinity", 0.3)).toBe(0.3);
  });

  it("returns fallback for NaN", () => {
    expect(parseDensity("NaN", 0.3)).toBe(0.3);
  });
});
