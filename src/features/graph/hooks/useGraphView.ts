import { create } from "zustand";

interface GraphViewState {
  level: number;
  expandedClusters: Set<string>;
  maxNodes: number;
  lastExpanded?: string;
  setLevel: (level: number) => void;
  toggleCluster: (id: string) => void;
  setMaxNodes: (n: number) => void;
  resetView: () => void;
}

export const useGraphView = create<GraphViewState>((set, get) => ({
  level: 0,
  expandedClusters: new Set<string>(),
  maxNodes: 3000,
  lastExpanded: undefined,
  setLevel: (level) => set({ level }),
  toggleCluster: (id) => {
    const s = new Set(get().expandedClusters);
    s.has(id) ? s.delete(id) : s.add(id);
    set({ expandedClusters: s, lastExpanded: id });
  },
  setMaxNodes: (n) => set({ maxNodes: n }),
  resetView: () =>
    set({ level: 0, expandedClusters: new Set<string>(), lastExpanded: undefined }),
}));
