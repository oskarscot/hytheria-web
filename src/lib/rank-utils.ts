export function formatRankName(rank: string | null): string {
  if (!rank) return "Player";

  const rankMap: Record<string, string> = {
    "default": "Player",
    "vip": "VIP",
    "vip_plus": "VIP+",
    "elite": "Elite",
    "admin": "Admin",
  };

  const lowerRank = rank.toLowerCase();
  return rankMap[lowerRank] ?? "Player";
}

export function getRankColor(rank: string | null): string {
  if (!rank) return "bg-slate-700";

  const colorMap: Record<string, string> = {
    "default": "bg-slate-700",
    "vip": "bg-yellow-700",
    "vip_plus": "bg-cyan-800",
    "elite": "bg-purple-800",
    "admin": "bg-red-800",
  };

  const lowerRank = rank.toLowerCase();
  return colorMap[lowerRank] ?? "bg-slate-700";
}
