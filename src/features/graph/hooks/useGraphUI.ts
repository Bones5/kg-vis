import { create } from "zustand";
import { GraphNode } from "@/shared/types/graph";

interface GraphUIState {
  hovered?: GraphNode;
  selected?: GraphNode;
  setHovered: (n?: GraphNode) => void;
  setSelected: (n?: GraphNode) => void;
}

export const useGraphUI = create<GraphUIState>((set) => ({
  hovered: undefined,
  selected: undefined,
  setHovered: (n) => set({ hovered: n }),
  setSelected: (n) => set({ selected: n }),
}));
