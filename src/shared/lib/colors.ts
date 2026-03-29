export const CLUSTER_COLOR = "#6366f1";
export const WORD_COLOR = "#94a3b8";
export const HOVERED_COLOR = "#f59e0b";
export const SELECTED_COLOR = "#10b981";
export const EDGE_COLOR = "#334155";

export function importanceToColor(importance: number): string {
  const h = Math.round(220 + importance * 40);
  const s = Math.round(60 + importance * 30);
  const l = Math.round(65 - importance * 20);
  return `hsl(${h}, ${s}%, ${l}%)`;
}
