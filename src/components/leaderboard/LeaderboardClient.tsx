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

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-white/5">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-widest">
              <th className="px-4 py-4 text-left font-bold w-24">Rank</th>
              <th className="px-4 py-4 text-left font-bold">Player</th>
              <th className="px-4 py-4 text-right font-bold w-40">
                {categories.find((c) => c.id === activeTab)?.label}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No data available
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.rank}
                  className="bg-slate-900/40 hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-yellow-600 text-white"
                          : entry.rank === 2
                          ? "bg-slate-400 text-black"
                          : entry.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://hyvatar.io/render/${entry.playerName}?size=128&rotate=0`}
                        alt={entry.playerName}
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="text-white font-bold font-display">
                        {entry.playerName}
                      </span>
                      {playerRanks[entry.playerName] && playerRanks[entry.playerName] !== "default" && (
                        <RankBadge rank={playerRanks[entry.playerName]} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-yellow-400 font-mono font-bold">
                      {activeTab === "playtime" ? formatPlaytime(entry.value) : entry.value.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
