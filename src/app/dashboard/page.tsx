import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { getPlayerStats, getPlayerSkills } from "@/lib/queries/player";
import { getIslandInfo } from "@/lib/queries/island";
import { getPlayerRank } from "@/lib/queries/rank";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RankBadge } from "@/components/dashboard/RankBadge";
import { Coins, Swords, Pickaxe, MapPin, TrendingUp, Clock, Star } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountWithPlayer(session?.user?.id ?? "");

  if (!linkedAccount) {
    redirect("/dashboard/link");
  }

  const playerUuid = linkedAccount.linkedAccount.playerUuid;
  const playerName = linkedAccount.player?.lastKnownName;
  
  const [playerStats, playerSkills, islandInfo, playerRank]: [any, any, any, any] = await Promise.all([
    getPlayerStats(playerUuid),
    getPlayerSkills(playerUuid),
    getIslandInfo(playerUuid),
    playerName ? getPlayerRank(playerName) : Promise.resolve(null)
  ]);

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  const getXpForLevel = (level: number): number => {
    if (level <= 0) return 0;
    return Math.floor(500 * Math.pow(level, 2.2));
  };

  const getSkillLevel = (xp: number | undefined): number => {
    if (!xp || xp <= 0) return 0;
    let level = 0;
    let xpNeeded = 0;
    while (xpNeeded <= xp && level < 50) {
      level++;
      xpNeeded += getXpForLevel(level);
    }
    return Math.max(0, level - 1);
  };

  const getXpProgress = (xp: number | undefined): { current: number; needed: number; percent: number } => {
    if (!xp || xp <= 0) return { current: 0, needed: 500, percent: 0 };
    const level = getSkillLevel(xp);
    const xpForNextLevel = getXpForLevel(level + 1);
    const totalXpForCurrentLevel = Array.from({ length: level }, (_, i) => getXpForLevel(i + 1)).reduce((a, b) => a + b, 0);
    const currentLevelXp = xp - totalXpForCurrentLevel;
    const percent = Math.min(100, (currentLevelXp / xpForNextLevel) * 100);
    return { current: currentLevelXp, needed: xpForNextLevel, percent };
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-wider uppercase">Overview</h2>
          <p className="text-slate-400 font-light mt-1">
            Welcome back, <span className="text-yellow-500 font-semibold">{linkedAccount.player?.lastKnownName ?? session?.user?.name}</span>.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Rank</div>
          <RankBadge rank={playerRank} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Balance" 
          value={formatNumber(playerStats?.coins ?? islandInfo?.bankBalance)} 
          subtitle="coins"
          icon={Coins} 
        />
        <StatsCard 
          title="Combat" 
          value={`Lvl ${getSkillLevel(playerSkills?.skillXp?.COMBAT)}`} 
          subtitle="Combat XP"
          icon={Swords} 
          progress={getXpProgress(playerSkills?.skillXp?.COMBAT).percent}
        />
        <StatsCard 
          title="Mining" 
          value={`Lvl ${getSkillLevel(playerSkills?.skillXp?.MINING)}`} 
          subtitle="Mining XP"
          icon={Pickaxe} 
          progress={getXpProgress(playerSkills?.skillXp?.MINING).percent}
        />
        <StatsCard 
          title="Farming" 
          value={`Lvl ${getSkillLevel(playerSkills?.skillXp?.FARMING)}`} 
          subtitle="Farming XP"
          icon={TrendingUp} 
          progress={getXpProgress(playerSkills?.skillXp?.FARMING).percent}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
            <RecentActivity />
        </div>

        {/* Island Stats */}
        <div className="lg:col-span-1 space-y-6">
           {islandInfo && (
             <div className="p-6 rounded-xl bg-slate-900/40 border border-white/5">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Island Stats</h3>
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm flex items-center gap-2"><MapPin className="w-3 h-3" /> Island Name</span>
                      <span className="text-white font-medium">{islandInfo.islandName || "Unnamed"}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm flex items-center gap-2"><Star className="w-3 h-3" /> Members</span>
                      <span className="text-white font-medium">{islandInfo.members?.length || 1}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm flex items-center gap-2"><Clock className="w-3 h-3" /> Created</span>
                      <span className="text-white font-medium">{new Date(islandInfo.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
             </div>
           )}
        </div>

      </div>
    </section>
  );
}
