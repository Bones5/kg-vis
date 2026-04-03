import { useState, useEffect } from "react";
import { GraphPayload } from "@/shared/types/graph";
import { generateMockGraph } from "@/dev/mockGraph";

interface UseGraphDataResult {
  payload: GraphPayload | null;
  loading: boolean;
  error: string | null;
}

/** @internal Exported for testing */
export function parsePositiveInt(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** @internal Exported for testing */
export function parseDensity(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(1, Math.max(0, parsed));
}

export function useGraphData(): UseGraphDataResult {
  const [payload, setPayload] = useState<GraphPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In dev/demo mode, use mock data. In production, fetch from server.
    try {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const params = new URLSearchParams(search);
      const mock = generateMockGraph({
        clusterCount: parsePositiveInt(params.get("mockClusterCount"), 8),
        nodesPerCluster: parsePositiveInt(params.get("mockNodesPerCluster"), 50),
        edgeDensity: parseDensity(params.get("mockEdgeDensity"), 0.3),
        interClusterDensity: params.get("mockInterClusterDensity")
          ? parseDensity(params.get("mockInterClusterDensity"), 0.15)
          : undefined,
        spread: parsePositiveInt(params.get("mockSpread"), 500),
        seed: parsePositiveInt(params.get("mockSeed"), 42),
      });
      setPayload(mock);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error loading graph");
    } finally {
      setLoading(false);
    }
  }, []);

  return { payload, loading, error };
}
