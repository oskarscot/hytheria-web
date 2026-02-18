import { getDatabase } from "@/lib/db";
import { UUID } from "mongodb";
import type { PlayerQuestState, QuestProgress } from "@/types/quest";

function mapProgressEntries(progress?: Record<string, QuestProgress>) {
  if (!progress) {
    return [];
  }

  return Object.entries(progress).map(([questId, quest]) => ({
    questId,
    state: quest.state ?? "AVAILABLE",
    objectiveProgress: quest.objectiveProgress ?? {},
    startedAt: quest.startedAt ?? 0,
    completedAt: quest.completedAt ?? 0,
    rewardsClaimed: quest.rewardsClaimed ?? false,
  }));
}

export async function getQuestProgress(uuid: string): Promise<PlayerQuestState | null> {
  const db = await getDatabase();
  const record = await db
    .collection("quests")
    .findOne({ _id: new UUID(uuid) as unknown as never });

  if (!record) {
    return null;
  }

  return {
    activeQuestId: record.activeQuestId ?? null,
    progress: mapProgressEntries(record.progress),
  };
}
