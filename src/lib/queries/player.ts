import { getDatabase } from "@/lib/db";
import { UUID } from "mongodb";
import type { PlayerSkills, PlayerStats, SkillType } from "@/types/player";

const skillTypes: SkillType[] = ["MINING", "FARMING", "CRAFTING", "COMBAT"];

export async function getPlayerStats(uuid: string): Promise<PlayerStats | null> {
  const db = await getDatabase();
  const player = await db
    .collection("players")
    .findOne({ _id: new UUID(uuid) as unknown as never });

  if (!player) {
    return null;
  }

  return {
    uuid: player._id?.toString() ?? uuid,
    lastKnownName: player.lastKnownName ?? "Unknown",
    coins: player.coins ?? 0,
    totalPlaytime: player.totalPlaytime ?? 0,
    scoreboardVisible: player.scoreboardVisible ?? false,
    hasSeenHelp: player.hasSeenHelp ?? false,
    totalBlocksMined: player.totalBlocksMined ?? 0,
    totalCropsHarvested: player.totalCropsHarvested ?? 0,
    bestDungeonWave: player.bestDungeonWave ?? 0,
    lastWorld: player.lastWorld ?? "",
    lastX: player.lastX ?? 0,
    lastY: player.lastY ?? 0,
    lastZ: player.lastZ ?? 0,
    lastYaw: player.lastYaw ?? 0,
    lastPitch: player.lastPitch ?? 0,
    memberOfIsland: player.memberOfIsland ?? null,
    pendingInvitations: player.pendingInvitations ?? [],
    pendingMoneyRequests: player.pendingMoneyRequests ?? [],
    extraAuctionSlots: player.extraAuctionSlots ?? 0,
    chatPreferences: player.chatPreferences ?? null,
    lastLoginDay: player.lastLoginDay ?? 0,
    currentLoginStreak: player.currentLoginStreak ?? 0,
    longestLoginStreak: player.longestLoginStreak ?? 0,
    challenges: player.challenges ?? null,
    playtimeRewardsClaimedToday: player.playtimeRewardsClaimedToday ?? 0,
    lastPlaytimeRewardDay: player.lastPlaytimeRewardDay ?? 0,
  };
}

export async function getPlayerSkills(uuid: string): Promise<PlayerSkills | null> {
  const db = await getDatabase();
  const record = await db
    .collection("skills")
    .findOne({ _id: new UUID(uuid) as unknown as never });

  if (!record) {
    return null;
  }

  const skillXp = skillTypes.reduce((acc, skill) => {
    acc[skill] = record.skillXp?.[skill] ?? 0;
    return acc;
  }, {} as Record<SkillType, number>);

  return {
    uuid: record._id?.toString() ?? uuid,
    skillXp,
  };
}

