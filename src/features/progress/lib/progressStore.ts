// TODO (Milestone 7): Implement progress store with persistence

export interface UserProgress {
  seen: Set<string>;
  mastered: Set<string>;
  lastVisited?: string;
  sessionStart: number;
}

export const defaultProgress: UserProgress = {
  seen: new Set(),
  mastered: new Set(),
  lastVisited: undefined,
  sessionStart: Date.now(),
};
