import { getDatabase } from "@/lib/db";
import type { LeaderboardPage } from "@/types/leaderboard";

const PAGE_SIZE = 20;

export async function getLeaderboard(category: string, page = 1): Promise<LeaderboardPage> {
  const db = await getDatabase();
  const skip = (page - 1) * PAGE_SIZE;

  const entries = await db
    .collection("leaderboards")
    .find({ category })
    .sort({ value: -1 })
    .skip(skip)
    .limit(PAGE_SIZE)
    .toArray();

  return {
    category,
    page,
    entries: entries.map((entry, index) => ({
      rank: skip + index + 1,
      playerName: entry.playerName ?? "Unknown",
      value: entry.value ?? 0,
    })),
  };
}
