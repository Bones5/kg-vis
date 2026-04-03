import { describe, it, expect } from "vitest";
import { routeEdges, computeContactPairs } from "../edgeRouter";
import { layoutOverview } from "../hexLayout";
import { generateMockGraph } from "@/dev/mockGraph";

describe("computeContactPairs", () => {
  it("detects hex-adjacent nodes as contact pairs", () => {
    const payload = generateMockGraph({ clusterCount: 7, nodesPerCluster: 3 });
    const nodes = layoutOverview(payload);
    const pairs = computeContactPairs(nodes);

    // With 7 clusters in a honeycomb, the center node (ring 0) has up to 6 neighbors (ring 1)
    // so there should be several contact pairs
    expect(pairs.size).toBeGreaterThan(0);

    // Each pair key should be "id:id" format
    for (const pair of pairs) {
      expect(pair).toMatch(/^.+:.+$/);
    }
  });

  it("returns empty set for a single node", () => {
    const payload = generateMockGraph({ clusterCount: 1, nodesPerCluster: 2 });
    const nodes = layoutOverview(payload);
    expect(nodes).toHaveLength(1);
    const pairs = computeContactPairs(nodes);
    expect(pairs.size).toBe(0);
  });
});

describe("routeEdges", () => {
  it("routes edges that are not contact pairs", () => {
    const payload = generateMockGraph({ clusterCount: 8, nodesPerCluster: 5, edgeDensity: 0.3 });
    const nodes = layoutOverview(payload);
    const contactPairs = computeContactPairs(nodes);
    const level0 = payload.levels["0"];
    const routed = routeEdges(nodes, level0.edges, contactPairs);

    // Each routed edge should have segments
    for (const edge of routed) {
      expect(edge.segments.length).toBeGreaterThan(0);
      expect(edge.weight).toBeGreaterThanOrEqual(1);
      expect(edge.sourceId).toBeDefined();
      expect(edge.targetId).toBeDefined();
    }
  });

  it("skips contact pairs (no drawn edge for hex-adjacent nodes)", () => {
    const payload = generateMockGraph({ clusterCount: 7, nodesPerCluster: 3, interClusterDensity: 1 });
    const nodes = layoutOverview(payload);
    const contactPairs = computeContactPairs(nodes);
    const level0 = payload.levels["0"];
    const routed = routeEdges(nodes, level0.edges, contactPairs);

    // Contact-paired edges should not appear in routed output
    for (const edge of routed) {
      const pairKey = `${edge.sourceId}:${edge.targetId}`;
      const pairKeyRev = `${edge.targetId}:${edge.sourceId}`;
      expect(contactPairs.has(pairKey) || contactPairs.has(pairKeyRev)).toBe(false);
    }
  });

  it("returns empty array when no edges exist", () => {
    const payload = generateMockGraph({ clusterCount: 3, nodesPerCluster: 2, interClusterDensity: 0 });
    const nodes = layoutOverview(payload);
    const contactPairs = computeContactPairs(nodes);
    const routed = routeEdges(nodes, [], contactPairs);
    expect(routed).toHaveLength(0);
  });

  it("preserves edge weight from input", () => {
    const payload = generateMockGraph({ clusterCount: 4, nodesPerCluster: 3, interClusterDensity: 0.5 });
    const nodes = layoutOverview(payload);
    const contactPairs = computeContactPairs(nodes);
    const level0 = payload.levels["0"];
    const routed = routeEdges(nodes, level0.edges, contactPairs);

    // Each routed edge weight should match the input edge weight
    for (const routedEdge of routed) {
      const inputEdge = level0.edges.find(
        (e) =>
          (e.source === routedEdge.sourceId && e.target === routedEdge.targetId) ||
          (e.source === routedEdge.targetId && e.target === routedEdge.sourceId)
      );
      if (inputEdge) {
        expect(routedEdge.weight).toBe(inputEdge.weight ?? 1);
      }
    }
  });

  it("falls back to direct line when all cells are occupied", () => {
    // Create a scenario with many nodes filling the grid
    const payload = generateMockGraph({
      clusterCount: 20,
      nodesPerCluster: 2,
      interClusterDensity: 0.3,
      seed: 42,
    });
    const nodes = layoutOverview(payload);
    const contactPairs = computeContactPairs(nodes);
    const level0 = payload.levels["0"];
    const routed = routeEdges(nodes, level0.edges, contactPairs);

    // All routed edges should have at least one segment
    for (const edge of routed) {
      expect(edge.segments.length).toBeGreaterThan(0);
    }
  });

  it("handles edges referencing unknown nodes gracefully", () => {
    const payload = generateMockGraph({ clusterCount: 3, nodesPerCluster: 2 });
    const nodes = layoutOverview(payload);
    const contactPairs = computeContactPairs(nodes);

    const badEdges = [{ source: "UNKNOWN_A", target: "UNKNOWN_B", weight: 1 }];
    const routed = routeEdges(nodes, badEdges, contactPairs);
    expect(routed).toHaveLength(0);
  });
});
