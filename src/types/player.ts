export interface ChatPreferences {
  showRankTag: boolean;
  useCustomNameColor: boolean;
  nameColor: string;
  messageColor: string;
}

export interface ChallengeState {
  currentDailySeed: number;
  currentWeeklySeed: number;
  dailyProgress: Record<string, number>;
  dailyClaimed: Record<string, boolean>;
  weeklyProgress: number;
  weeklyClaimed: boolean;
}

export interface MoneyRequest {
  fromUuid: string;
  fromName: string;
  amount: number;
  requestedAt: number;
}

export type SkillType = "MINING" | "FARMING" | "CRAFTING" | "COMBAT";

export interface PlayerSkills {
  uuid: string;
  skillXp: Record<SkillType, number>;
}

export interface PlayerStats {
  uuid: string;
  lastKnownName: string;
  coins: number;
  totalPlaytime: number;
  scoreboardVisible: boolean;
  hasSeenHelp: boolean;
  totalBlocksMined: number;
  totalCropsHarvested: number;
  bestDungeonWave: number;
  lastWorld: string;
  lastX: number;
  lastY: number;
  lastZ: number;
  lastYaw: number;
  lastPitch: number;
  memberOfIsland: string | null;
  pendingInvitations: string[];
  pendingMoneyRequests: MoneyRequest[];
  extraAuctionSlots: number;
  chatPreferences: ChatPreferences | null;
  lastLoginDay: number;
  currentLoginStreak: number;
  longestLoginStreak: number;
  challenges: ChallengeState | null;
  playtimeRewardsClaimedToday: number;
  lastPlaytimeRewardDay: number;
}
