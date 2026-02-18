export interface QuestProgress {
  questId: string;
  state: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
  objectiveProgress: Record<string, number>;
  startedAt: number;
  completedAt: number;
  rewardsClaimed: boolean;
}

export interface PlayerQuestState {
  activeQuestId: string | null;
  progress: QuestProgress[];
}
