"use client";

import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@/types/leaderboard";
import { RankBadge } from "@/components/dashboard/RankBadge";
import { Button } from "@/components/ui/Button";

function formatPlaytime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

interface LeaderboardClientProps {
  initialData: LeaderboardEntry[];
  initialCategory: string;
}

export function LeaderboardClient({ initialData, initialCategory }: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [entries, setEntries] = useState(initialData);
  const [playerRanks, setPlayerRanks] = useState<Record<string, string>>({});

  const categories = [
    { id: "coins", label: "Balance" },
    { id: "blocks_mined", label: "Blocks Mined" },
    { id: "crops_harvested", label: "Crops Harvested" },
    { id: "playtime", label: "Playtime" },
    { id: "dungeon_wave", label: "Dungeon Wave" },
    { id: "mining_level", label: "Mining" },
    { id: "farming_level", label: "Farming" },
    { id: "combat_level", label: "Combat" },
    { id: "crafting_level", label: "Crafting" },
    { id: "fishing_level", label: "Fishing" },
  ];

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`/api/leaderboards?category=${activeTab}`);
        const data = await res.json();
        setEntries(data.entries);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      }
    }

    fetchLeaderboard();
  }, [activeTab]);

  useEffect(() => {
    async function fetchRanks() {
      const playerNames = entries.map(e => e.playerName).join(",");
      if (!playerNames) return;
      
      try {
        const res = await fetch(`/api/ranks?players=${playerNames}`);
        const data = await res.json();
        setPlayerRanks(data);
      } catch (e) {}
    }

    if (entries.length > 0) {
      fetchRanks();
    }
  }, [entries]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-white/5 pb-4">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeTab === cat.id ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Table - Responsive Wrapper */}
      <div className="rounded-xl overflow-hidden border border-white/5 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4 text-center w-20">#</th>
                <th className="px-6 py-4 text-left">Player</th>
                <th className="px-6 py-4 text-right">
                  {categories.find((c) => c.id === activeTab)?.label ?? "Score"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-light">
                    No data available for this category yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr
                    key={entry.playerName} // Use playerName as key if rank changes
                    className="group hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-center">
                      <div
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shadow-lg ring-1 ring-inset ${
                          entry.rank === 1
                            ? "bg-yellow-500/20 text-yellow-400 ring-yellow-500/50"
                            : entry.rank === 2
                            ? "bg-slate-300/20 text-slate-200 ring-slate-400/50"
                            : entry.rank === 3
                            ? "bg-amber-700/20 text-amber-500 ring-amber-700/50"
                            : "bg-slate-800 text-slate-500 ring-transparent"
                        }`}
                      >
                        {entry.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-950 border border-white/10 group-hover:border-yellow-500/50 transition-colors shrink-0">
                            <img
                              src={`https://hyvatar.io/render/${entry.playerName}?size=128&rotate=0`}
                              alt={entry.playerName}
                              className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="text-slate-100 font-bold font-display tracking-wide group-hover:text-yellow-400 transition-colors">
                              {entry.playerName}
                            </span>
                            {playerRanks[entry.playerName] && playerRanks[entry.playerName] !== "default" && (
                              <div className="scale-90 origin-left sm:scale-100">
                                <RankBadge rank={playerRanks[entry.playerName]} />
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-yellow-500 font-mono font-bold text-lg drop-shadow-[0_0_10px_rgba(234,179,8,0.2)] whitespace-nowrap">
                        {activeTab === "playtime" ? formatPlaytime(Number(entry.value)) : Number(entry.value).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
