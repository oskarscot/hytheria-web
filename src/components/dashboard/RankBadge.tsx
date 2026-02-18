import { formatRankName, getRankColor } from "@/lib/rank-utils";

interface RankBadgeProps {
  rank: string | null;
  className?: string;
}

export function RankBadge({ rank, className = "" }: RankBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-extrabold uppercase tracking-wider text-white ${getRankColor(rank)} ${className}`}
    >
      {formatRankName(rank)}
    </span>
  );
}
