import { getDatabase } from "@/lib/db";
import { UUID } from "mongodb";
import type { IslandInfo } from "@/types/island";

export async function getIslandInfo(uuid: string): Promise<IslandInfo | null> {
  const db = await getDatabase();
  const island = await db
    .collection("islands")
    .findOne({ _id: new UUID(uuid) as unknown as never });

  if (!island) {
    return null;
  }

  return {
    id: island._id?.toString() ?? uuid,
    islandName: island.islandName ?? "",
    spawnX: island.spawnX ?? 0,
    spawnY: island.spawnY ?? 0,
    spawnZ: island.spawnZ ?? 0,
    spawnYaw: island.spawnYaw ?? 0,
    spawnPitch: island.spawnPitch ?? 0,
    createdAt: island.createdAt ?? 0,
    members: island.members ?? [],
    memberLastOnline: island.memberLastOnline ?? {},
    allowVisitors: island.allowVisitors ?? false,
    pvpEnabled: island.pvpEnabled ?? false,
    mobSpawning: island.mobSpawning ?? false,
    animalSpawning: island.animalSpawning ?? false,
    weatherLock: island.weatherLock ?? "NORMAL",
    timeLock: island.timeLock ?? "NORMAL",
    explosions: island.explosions ?? false,
    fireSpread: island.fireSpread ?? false,
    leafDecay: island.leafDecay ?? false,
    borderSize: island.borderSize ?? 0,
    borderExpansions: island.borderExpansions ?? 0,
    bankBalance: island.bankBalance ?? 0,
    visitorLog: island.visitorLog ?? [],
    announcement: island.announcement ?? "",
    questProgress: island.questProgress ?? {},
    minions: island.minions ?? [],
  };
}
