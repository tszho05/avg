export type RouteKey = 'A' | 'B' | 'C' | null;

export type StageKey = 'start' | 'rusu' | 'star' | 'fleet' | 'drum' | 'complete';

export type GameFlags = {
  route: RouteKey;
  stage: StageKey;
  lastStoryNode: string;
  fogReading: number;
  formationScore: number;
  drumScore: number;
  ending: string | null;
};

export const flags: GameFlags = {
  route: null,
  stage: 'start',
  lastStoryNode: 'opening',
  fogReading: 0,
  formationScore: 0,
  drumScore: 0,
  ending: null,
};

export function resetProgress() {
  flags.route = null;
  flags.stage = 'start';
  flags.lastStoryNode = 'opening';
  flags.fogReading = 0;
  flags.formationScore = 0;
  flags.drumScore = 0;
  flags.ending = null;
}

export function endingQuality() {
  const total = flags.fogReading + flags.formationScore + flags.drumScore;
  if (total >= 11) return '完美';
  if (total >= 8) return '穩健';
  return '驚險';
}
