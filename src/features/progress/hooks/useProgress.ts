// TODO (Milestone 7): Implement useProgress hook

export function useProgress() {
  return {
    seen: new Set<string>(),
    mastered: new Set<string>(),
    markSeen: (_id: string) => {},
    markMastered: (_id: string) => {},
  };
}
