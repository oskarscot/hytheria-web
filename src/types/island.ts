export interface VisitorEntry {
  visitorUuid: string;
  visitorName: string;
  visitTime: number;
}

export interface IslandQuestProgress {
  state: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
  objectiveProgress: Record<string, number>;
  startedAt: number;
  completedAt: number;
  rewardEligiblePlayers: string[];
  rewardsClaimedBy: string[];
}

export interface Minion {
  minionId: string;
  type: string;
  x: number;
  y: number;
  z: number;
  tier: number;
  storedItems: Record<string, number>;
  seedItems: Record<string, number>;
  totalHarvested: number;
  storedFarmingXp: number;
  storedHarvestCount: number;
}

export interface IslandInfo {
  id: string;
  islandName: string;
  spawnX: number;
  spawnY: number;
  spawnZ: number;
  spawnYaw: number;
  spawnPitch: number;
  createdAt: number;
  members: string[];
  memberLastOnline: Record<string, number>;
  allowVisitors: boolean;
  pvpEnabled: boolean;
  mobSpawning: boolean;
  animalSpawning: boolean;
  weatherLock: string;
  timeLock: string;
  explosions: boolean;
  fireSpread: boolean;
  leafDecay: boolean;
  borderSize: number;
  borderExpansions: number;
  bankBalance: number;
  visitorLog: VisitorEntry[];
  announcement: string;
  questProgress: Record<string, IslandQuestProgress>;
  minions: Minion[];
}
