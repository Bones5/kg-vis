import { describe, it, expect } from "vitest";
import { generateMockGraph } from "../mockGraph";

describe("generateMockGraph", () => {
  // ── Determinism ──────────────────────────────────────────────────────
  it("produces identical output for the same seed", () => {
    const a = generateMockGraph({ seed: 99, clusterCount: 4, nodesPerCluster: 5 });
    const b = generateMockGraph({ seed: 99, clusterCount: 4, nodesPerCluster: 5 });
    expect(a).toEqual(b);
  });

  it("produces different output for different seeds", () => {
    const options = {
      clusterCount: 8,
      nodesPerCluster: 5,
      interClusterDensity: 1,
    };
    const a = generateMockGraph({ seed: 1, ...options });
    const b = generateMockGraph({ seed: 2, ...options });
    const aEdges = a.levels["0"].edges.map(
      (e) => `${e.source}-${e.target}-${e.weight}-${e.similarity}`,
    );
    const bEdges = b.levels["0"].edges.map(
      (e) => `${e.source}-${e.target}-${e.weight}-${e.similarity}`,
    );
    // With dense inter-cluster edges and 8 clusters, seeds will produce different weights/similarities
    expect(aEdges).not.toEqual(bEdges);
  });

  it("defaults to seed 42 if none provided", () => {
    const explicit = generateMockGraph({ seed: 42, clusterCount: 4, nodesPerCluster: 5 });
    const implicit = generateMockGraph({ clusterCount: 4, nodesPerCluster: 5 });
    expect(explicit).toEqual(implicit);
  });

  // ── Structure ────────────────────────────────────────────────────────
  it("produces 3 levels with correct node counts", () => {
    const g = generateMockGraph({ clusterCount: 3, nodesPerCluster: 10 });
    expect(g.meta.levels).toBe(3);
    expect(Object.keys(g.levels)).toEqual(["0", "1", "2"]);

    // Level 0: only cluster nodes
    expect(g.levels["0"].nodes).toHaveLength(3);
    expect(g.levels["0"].nodes.every((n) => n.type === "cluster")).toBe(true);

    // Level 2: all nodes
    expect(g.levels["2"].nodes).toHaveLength(3 + 3 * 10);
  });

  it("assigns word nodes to their parent cluster", () => {
    const g = generateMockGraph({ clusterCount: 2, nodesPerCluster: 5 });
    const words = g.levels["2"].nodes.filter((n) => n.type === "word");
    expect(words).toHaveLength(10);
    for (const w of words) {
      expect(w.cluster).toBeDefined();
      expect(["C1", "C2"]).toContain(w.cluster);
    }
  });

  // ── Edge weight ──────────────────────────────────────────────────────
  it("generates edge weights in range [1, 5]", () => {
    const g = generateMockGraph({ clusterCount: 6, nodesPerCluster: 20, edgeDensity: 0.4 });
    for (const level of Object.values(g.levels)) {
      for (const edge of level.edges) {
        expect(edge.weight).toBeGreaterThanOrEqual(1);
        expect(edge.weight).toBeLessThanOrEqual(5);
      }
    }
  });

  // ── Similarity ───────────────────────────────────────────────────────
  it("assigns similarity to all inter-cluster edges", () => {
    const g = generateMockGraph({ clusterCount: 6, nodesPerCluster: 5, interClusterDensity: 0.8 });
    const interEdges = g.levels["0"].edges;
    expect(interEdges.length).toBeGreaterThan(0);
    for (const edge of interEdges) {
      expect(edge.similarity).toBeDefined();
      expect(edge.similarity).toBeGreaterThanOrEqual(0);
      expect(edge.similarity).toBeLessThanOrEqual(1);
    }
  });

  it("assigns similarity to all intra-cluster edges in range [0.7, 1.0]", () => {
    const g = generateMockGraph({ clusterCount: 2, nodesPerCluster: 10, edgeDensity: 0.5 });
    const allEdges = g.levels["2"].edges;
    const clusterIds = new Set(g.levels["0"].nodes.map((n) => n.id));
    // Intra-cluster edges connect two word nodes (neither endpoint is a cluster node)
    const intraEdges = allEdges.filter(
      (e) => !clusterIds.has(e.source as string) && !clusterIds.has(e.target as string)
    );
    expect(intraEdges.length).toBeGreaterThan(0);
    for (const edge of intraEdges) {
      expect(edge.similarity).toBeDefined();
      expect(edge.similarity).toBeGreaterThanOrEqual(0.7);
      expect(edge.similarity).toBeLessThanOrEqual(1.0);
    }
  });

  it("assigns similarity to top-word edges in range [0.8, 1.0]", () => {
    const g = generateMockGraph({ clusterCount: 3, nodesPerCluster: 30, seed: 7 });
    const level2Edges = g.levels["2"].edges;
    const clusterIds = new Set(g.levels["0"].nodes.map((n) => n.id));
    const topWordEdges = level2Edges.filter(
      (e) => clusterIds.has(e.source as string) && (e.target as string).includes("_w")
    );
    expect(topWordEdges.length).toBeGreaterThan(0);
    for (const edge of topWordEdges) {
      expect(edge.similarity).toBeDefined();
      expect(edge.similarity).toBeGreaterThanOrEqual(0.8);
      expect(edge.similarity).toBeLessThanOrEqual(1.0);
    }
  });

  // ── Cluster metadata ────────────────────────────────────────────────
  it("computes cohesion on cluster nodes", () => {
    const g = generateMockGraph({ clusterCount: 4, nodesPerCluster: 10, edgeDensity: 0.3 });
    const clusters = g.levels["0"].nodes;
    for (const c of clusters) {
      expect(c.cohesion).toBeDefined();
      expect(c.cohesion).toBeGreaterThanOrEqual(0);
      expect(c.cohesion).toBeLessThanOrEqual(1);
    }
  });

  it("computes avgImportance on cluster nodes", () => {
    const g = generateMockGraph({ clusterCount: 4, nodesPerCluster: 10 });
    const clusters = g.levels["0"].nodes;
    for (const c of clusters) {
      expect(c.avgImportance).toBeDefined();
      expect(c.avgImportance).toBeGreaterThanOrEqual(0);
      expect(c.avgImportance).toBeLessThanOrEqual(1);
    }
  });

  // ── interClusterDensity ──────────────────────────────────────────────
  it("respects interClusterDensity=0 producing no inter-cluster edges", () => {
    const g = generateMockGraph({
      clusterCount: 6,
      nodesPerCluster: 5,
      interClusterDensity: 0,
    });
    expect(g.levels["0"].edges).toHaveLength(0);
  });

  it("respects interClusterDensity=1 producing max inter-cluster edges", () => {
    const g = generateMockGraph({
      clusterCount: 4,
      nodesPerCluster: 5,
      interClusterDensity: 1,
    });
    // 4 clusters → C(4,2) = 6 possible inter-cluster edges
    expect(g.levels["0"].edges).toHaveLength(6);
  });

  // ── Edge cases ───────────────────────────────────────────────────────
  it("handles clusterCount=1", () => {
    const g = generateMockGraph({ clusterCount: 1, nodesPerCluster: 5 });
    expect(g.levels["0"].nodes).toHaveLength(1);
    expect(g.levels["0"].edges).toHaveLength(0); // no inter-cluster edges possible
    expect(g.levels["2"].nodes).toHaveLength(6);
  });

  it("handles nodesPerCluster=0", () => {
    const g = generateMockGraph({ clusterCount: 3, nodesPerCluster: 0 });
    expect(g.levels["0"].nodes).toHaveLength(3);
    expect(g.levels["2"].nodes).toHaveLength(3); // no word nodes
  });

  it("handles edgeDensity=0 producing no intra-cluster or inter-cluster edges", () => {
    const g = generateMockGraph({
      clusterCount: 4,
      nodesPerCluster: 10,
      edgeDensity: 0,
      interClusterDensity: 0,
    });
    const clusterNodeIds = new Set(g.levels["0"].nodes.map((node) => node.id));

    expect(g.levels["0"].edges).toHaveLength(0);
    // Level 2 edges should only be top-word edges (cluster→word, weight=1)
    expect(
      g.levels["2"].edges.every(
        (edge) =>
          clusterNodeIds.has(edge.source as string) &&
          !clusterNodeIds.has(edge.target as string) &&
          edge.weight === 1
      )
    ).toBe(true);
  });

  // ── Spread affects centroid positions ────────────────────────────────
  it("produces different centroid positions for different spread values", () => {
    const small = generateMockGraph({ clusterCount: 4, nodesPerCluster: 2, spread: 100, seed: 1 });
    const large = generateMockGraph({ clusterCount: 4, nodesPerCluster: 2, spread: 1000, seed: 1 });
    const smallMaxDist = Math.max(
      ...small.levels["0"].nodes.map((n) => Math.hypot(n.x, n.y))
    );
    const largeMaxDist = Math.max(
      ...large.levels["0"].nodes.map((n) => Math.hypot(n.x, n.y))
    );
    expect(largeMaxDist).toBeGreaterThan(smallMaxDist);
  });

  // ── edgeDensity=1 ───────────────────────────────────────────────────
  it("handles edgeDensity=1 producing maximum intra-cluster edges", () => {
    const g = generateMockGraph({
      clusterCount: 2,
      nodesPerCluster: 4,
      edgeDensity: 1,
      seed: 42,
    });
    const clusterIds = new Set(g.levels["0"].nodes.map((n) => n.id));
    const allEdges = g.levels["2"].edges;
    // Count intra-cluster edges (word-to-word within same cluster)
    const wordNodes = g.levels["2"].nodes.filter((n) => n.type === "word");
    const cluster1Words = wordNodes.filter((n) => n.cluster === "C1");
    const cluster2Words = wordNodes.filter((n) => n.cluster === "C2");
    // Verify we have the expected cluster IDs
    expect(clusterIds.size).toBe(2);
    // Max possible intra-cluster edges for C1 = C(n, 2)
    const maxC1 = (cluster1Words.length * (cluster1Words.length - 1)) / 2;
    const maxC2 = (cluster2Words.length * (cluster2Words.length - 1)) / 2;

    const c1Ids = new Set(cluster1Words.map((n) => n.id));
    const c2Ids = new Set(cluster2Words.map((n) => n.id));
    const c1Edges = allEdges.filter(
      (e) => c1Ids.has(e.source as string) && c1Ids.has(e.target as string)
    );
    const c2Edges = allEdges.filter(
      (e) => c2Ids.has(e.source as string) && c2Ids.has(e.target as string)
    );

    // With density=1, all possible edges should exist
    expect(c1Edges.length).toBe(maxC1);
    expect(c2Edges.length).toBe(maxC2);
  });
});
