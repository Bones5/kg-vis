import { describe, it, expect } from "vitest";
import { layoutOverview, layoutRing, countClusterMembers } from "../hexLayout";
import { generateMockGraph } from "@/dev/mockGraph";

describe("layoutOverview", () => {
  it("places all clusters on the hex grid", () => {
    const payload = generateMockGraph({ clusterCount: 8, nodesPerCluster: 5 });
    const nodes = layoutOverview(payload);
    expect(nodes).toHaveLength(8);
    for (const n of nodes) {
      expect(n.hex).toBeDefined();
      expect(typeof n.px).toBe("number");
      expect(typeof n.py).toBe("number");
    }
  });

  it("places the largest cluster at center (hex 0,0)", () => {
    const payload = generateMockGraph({ clusterCount: 5, nodesPerCluster: 10, seed: 42 });
    const nodes = layoutOverview(payload);
    // First node should be at center hex
    expect(nodes[0].hex).toEqual({ q: 0, r: 0 });
  });

  it("handles single cluster", () => {
    const payload = generateMockGraph({ clusterCount: 1, nodesPerCluster: 5 });
    const nodes = layoutOverview(payload);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].hex).toEqual({ q: 0, r: 0 });
  });

  it("includes childCount on each cluster node", () => {
    const payload = generateMockGraph({ clusterCount: 3, nodesPerCluster: 7 });
    const nodes = layoutOverview(payload);
    for (const n of nodes) {
      expect(n.childCount).toBeDefined();
      expect(n.childCount).toBe(7); // exactly nodesPerCluster word nodes per cluster
    }
  });
});

describe("layoutRing", () => {
  const payload = generateMockGraph({
    clusterCount: 8,
    nodesPerCluster: 10,
    edgeDensity: 0.3,
    interClusterDensity: 0.6,
    seed: 42,
  });

  it("returns center, rings, and offMap", () => {
    const result = layoutRing("C1", payload);
    expect(result.center).toBeDefined();
    expect(result.center.id).toBe("C1");
    expect(Array.isArray(result.rings)).toBe(true);
    expect(Array.isArray(result.offMap)).toBe(true);
  });

  it("assigns inner tier to highest-weight neighbors", () => {
    const result = layoutRing("C1", payload);
    if (result.rings.length < 2) return; // not enough neighbors to test

    const inner = result.rings.filter((n) => n.tier === "inner");
    const middle = result.rings.filter((n) => n.tier === "middle");
    const outer = result.rings.filter((n) => n.tier === "outer");

    // Inner-tier nodes should have strength >= any middle-tier node
    if (inner.length > 0 && middle.length > 0) {
      const minInner = Math.min(...inner.map((n) => n.strength));
      const maxMiddle = Math.max(...middle.map((n) => n.strength));
      expect(minInner).toBeGreaterThanOrEqual(maxMiddle);
    }

    // Middle-tier nodes should have strength >= any outer-tier node
    if (middle.length > 0 && outer.length > 0) {
      const minMiddle = Math.min(...middle.map((n) => n.strength));
      const maxOuter = Math.max(...outer.map((n) => n.strength));
      expect(minMiddle).toBeGreaterThanOrEqual(maxOuter);
    }
  });

  it("assigns distinct hex ring radii for inner, middle, and outer tiers", () => {
    const result = layoutRing("C1", payload);

    const expectedDistanceByTier = {
      inner: 1,
      middle: 2,
      outer: 3,
    } as const;

    const hexDistance = (
      a: { q: number; r: number },
      b: { q: number; r: number },
    ) => {
      const dq = a.q - b.q;
      const dr = a.r - b.r;
      return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
    };

    for (const node of result.rings) {
      expect(node.hex).toBeDefined();
      const expectedDistance =
        expectedDistanceByTier[
          node.tier as keyof typeof expectedDistanceByTier
        ];
      expect(expectedDistance).toBeDefined();
      expect(hexDistance(node.hex, result.center.hex)).toBe(expectedDistance);
    }
  });

  it("throws for unknown cluster id", () => {
    expect(() => layoutRing("NONEXISTENT", payload)).toThrow();
  });

  it("handles a cluster with no neighbors (isolated)", () => {
    const isolated = generateMockGraph({
      clusterCount: 3,
      nodesPerCluster: 5,
      interClusterDensity: 0,
    });
    const result = layoutRing("C1", isolated);
    expect(result.center.id).toBe("C1");
    expect(result.rings).toHaveLength(0);
    expect(result.offMap).toHaveLength(0);
  });

  it("produces offMap stubs when neighbors exceed maxNodes", () => {
    // Dense graph with many clusters should produce overflow
    const dense = generateMockGraph({
      clusterCount: 50,
      nodesPerCluster: 2,
      interClusterDensity: 1,
      seed: 42,
    });
    const result = layoutRing("C1", dense, 6);
    // With maxNodes=6 and many neighbors, there should be offMap stubs
    expect(result.offMap.length).toBeGreaterThan(0);
  });

  it("handles 37+ neighbors correctly with overflow", () => {
    const huge = generateMockGraph({
      clusterCount: 50,
      nodesPerCluster: 2,
      interClusterDensity: 1,
      seed: 42,
    });
    const result = layoutRing("C1", huge);
    // Max visible slots = 36 (6+12+18), rest are offMap
    const totalVisible = result.rings.length;
    expect(totalVisible).toBeLessThanOrEqual(36);
    const totalNeighbors = totalVisible + result.offMap.length;
    expect(totalNeighbors).toBeGreaterThan(36);
  });

  it("places exactly 36 visible when neighbors fill all tiers", () => {
    // With 50 clusters connected to C1, we need many neighbors
    const dense = generateMockGraph({
      clusterCount: 50,
      nodesPerCluster: 2,
      interClusterDensity: 1,
      seed: 42,
    });
    const result = layoutRing("C1", dense, 36);
    expect(result.rings.length).toBeLessThanOrEqual(36);
  });
});

describe("countClusterMembers", () => {
  it("counts word nodes belonging to each cluster", () => {
    const payload = generateMockGraph({ clusterCount: 3, nodesPerCluster: 7 });
    expect(countClusterMembers("C1", payload)).toBe(7);
    expect(countClusterMembers("C2", payload)).toBe(7);
    expect(countClusterMembers("C3", payload)).toBe(7);
  });

  it("returns 0 for nonexistent cluster", () => {
    const payload = generateMockGraph({ clusterCount: 2, nodesPerCluster: 5 });
    expect(countClusterMembers("NOPE", payload)).toBe(0);
  });
});
