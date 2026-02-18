import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { getPlayerStats, getPlayerSkills } from "@/lib/queries/player";
import { getIslandInfo } from "@/lib/queries/island";
import { getQuestProgress } from "@/lib/queries/quests";
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
  
  const [playerStats, playerSkills, islandInfo, questProgress, playerRank] = await Promise.all([
    getPlayerStats(playerUuid),
    getPlayerSkills(playerUuid),
    getIslandInfo(playerUuid),
    getQuestProgress(playerUuid),
    playerName ? getPlayerRank(playerName) : Promise.resolve(null)
  ]);

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  const getSkillLevel = (xp: number | undefined) => {
    if (!xp) return "1";
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    return level.toString();
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
          subtitle="Gold Coins"
          icon={Coins} 
        />
        <StatsCard 
          title="Combat" 
          value={`Lvl ${getSkillLevel(playerSkills?.skillXp?.COMBAT)}`} 
          subtitle="Combat XP"
          icon={Swords} 
        />
        <StatsCard 
          title="Mining" 
          value={`Lvl ${getSkillLevel(playerSkills?.skillXp?.MINING)}`} 
          subtitle="Mining XP"
          icon={Pickaxe} 
        />
        <StatsCard 
          title="Farming" 
          value={`Lvl ${getSkillLevel(playerSkills?.skillXp?.FARMING)}`} 
          subtitle="Farming XP"
          icon={TrendingUp} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
            <RecentActivity />
        </div>

        {/* Active Quest */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-900/20 to-slate-900/40 border border-yellow-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10">
                 <h3 className="text-lg font-display font-bold text-yellow-100 mb-2">Active Quest</h3>
                 
                 {questProgress?.activeQuestId ? (
                   <>
                     <div className="mb-4">
                        <p className="text-sm font-bold text-white">Quest ID: {questProgress.activeQuestId}</p>
                        <p className="text-xs text-slate-400 italic">Main Questline</p>
                     </div>
                     
                     <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2 border border-white/5">
                        <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 w-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                     </div>
                     <div className="flex justify-between text-xs text-slate-500 font-mono uppercase tracking-wider">
                        <span>In Progress</span>
                     </div>
                   </>
                 ) : (
                   <div className="text-sm text-slate-400">
                      No active quest. Visit the Town Hall to begin your adventure.
                   </div>
                 )}
              </div>
           </div>

           {/* Island Stats */}
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
