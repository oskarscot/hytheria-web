export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  value: number;
}

export interface LeaderboardPage {
  category: string;
  page: number;
  entries: LeaderboardEntry[];
}
