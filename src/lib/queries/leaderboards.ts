import { getDatabase } from "@/lib/db";
import { UUID } from "mongodb";

function calculateLevel(xp: number): number {
  if (xp <= 0) return 0;

  let level = 0;
  let xpNeeded = 0;
  while (xpNeeded <= xp && level < 50) {
    level++;
    xpNeeded += getXpForLevel(level);
  }
  return Math.max(0, level - 1);
}

function getXpForLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(500 * Math.pow(level, 2.2));
}

function uuidToString(id: any): string {
  if (!id) return "";
  if (id instanceof UUID) return id.toString();
  if (typeof id === "string") return id;
  if (id.toString) return id.toString();
  return "";
}

export async function getLeaderboardData(category: string, page = 1, pageSize = 20) {
  const db = await getDatabase();
  const skip = (page - 1) * pageSize;

  const [players, skills] = await Promise.all([
    db.collection("players").find({}).toArray(),
    db.collection("skills").find({}).toArray(),
  ]);

  const skillMap = new Map<string, any>();
  
  skills.forEach((skill: any) => {
    const uuid = uuidToString(skill._id);
    if (uuid) {
      skillMap.set(uuid, skill.skillXp ?? {});
    }
  });

  let entries = players.map((player: any) => {
    const uuid = uuidToString(player._id);
    const playerSkills = skillMap.get(uuid) ?? {};
    
    let value = 0;
    switch (category) {
      case "coins":
        value = Number(player?.coins ?? 0);
        break;
      case "blocks_mined":
        value = Number(player?.totalBlocksMined ?? 0);
        break;
      case "crops_harvested":
        value = Number(player?.totalCropsHarvested ?? 0);
        break;
      case "playtime":
        value = Number(player?.totalPlaytime ?? 0);
        break;
      case "dungeon_wave":
        value = Number(player?.bestDungeonWave ?? 0);
        break;
      case "mining_level":
        value = calculateLevel(Number(playerSkills?.MINING ?? 0));
        break;
      case "farming_level":
        value = calculateLevel(Number(playerSkills?.FARMING ?? 0));
        break;
      case "combat_level":
        value = calculateLevel(Number(playerSkills?.COMBAT ?? 0));
        break;
      case "crafting_level":
        value = calculateLevel(Number(playerSkills?.CRAFTING ?? 0));
        break;
      case "fishing_level":
        value = calculateLevel(Number(playerSkills?.FISHING ?? 0));
        break;
      default:
        value = Number(player?.coins ?? 0);
    }

    return {
      playerName: player.lastKnownName ?? "Unknown",
      value,
      category,
    };
  });

  entries.sort((a: any, b: any) => b.value - a.value);

  const paginatedEntries = entries.slice(skip, skip + pageSize).map((entry: any, index: number) => ({
    rank: skip + index + 1,
    playerName: entry.playerName,
    value: entry.value,
  }));

  return {
    category,
    page,
    entries: paginatedEntries,
  };
}
