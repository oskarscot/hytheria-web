import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { getQuestProgress } from "@/lib/queries/quests";
import { Shield, BookOpen, Star, Trophy, Target, Lock, CheckCircle, Clock } from "lucide-react";

export default async function DashboardQuestsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountWithPlayer(session?.user?.id ?? "");

  if (!linkedAccount) {
    redirect("/dashboard/link");
  }

  const questProgress = await getQuestProgress(linkedAccount.linkedAccount.playerUuid);

  const getStatusDetails = (quest: { state: string }) => {
    switch (quest.state) {
      case "COMPLETED":
        return { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle };
      case "IN_PROGRESS":
        return { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock };
      default:
        return { color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: Lock };
    }
  };

  const activeQuests = questProgress?.progress.filter(q => q.state === "IN_PROGRESS") || [];
  const completedQuests = questProgress?.progress.filter(q => q.state === "COMPLETED") || [];
  const availableQuests = questProgress?.progress.filter(q => q.state === "AVAILABLE") || [];

  return (
    <section>
       <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
         <div>
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Quest Log</h2>
            <p className="text-slate-400 font-light mt-1">Track your heroic deeds.</p>
         </div>
         <div className="flex gap-2">
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs font-bold uppercase tracking-widest">
               {completedQuests.length} Done
            </div>
            <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-xs font-bold uppercase tracking-widest">
               {activeQuests.length} Active
            </div>
         </div>
      </div>

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div className="mb-8">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Active Quests
           </h3>
           <div className="space-y-4">
              {activeQuests.map((quest, i) => {
                 const details = getStatusDetails(quest);
                 const Icon = details.icon;
                 return (
                    <div key={i} className={`p-6 rounded-xl border ${details.border} ${details.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:scale-[1.01]`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${details.bg} border ${details.border}`}>
                             <Icon className={`w-6 h-6 ${details.color}`} />
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-white">{quest.questId}</h3>
                             <p className="text-slate-400 text-sm">
                               Started: {quest.startedAt > 0 ? new Date(quest.startedAt * 1000).toLocaleDateString() : "Unknown"}
                             </p>
                          </div>
                       </div>
                       
                       <div className="text-right w-full md:w-auto mt-2 md:mt-0">
                          <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${details.color}`}>In Progress</div>
                          <div className="text-xs text-slate-500 font-mono">Rewards Pending</div>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      )}

      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <div className="mb-8">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Available Quests
           </h3>
           <div className="space-y-4">
              {availableQuests.map((quest, i) => {
                 const details = getStatusDetails(quest);
                 const Icon = details.icon;
                 return (
                    <div key={i} className={`p-6 rounded-xl border ${details.border} ${details.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:scale-[1.01]`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${details.bg} border ${details.border}`}>
                             <Icon className={`w-6 h-6 ${details.color}`} />
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-white">{quest.questId}</h3>
                             <p className="text-slate-400 text-sm">Not started yet</p>
                          </div>
                       </div>
                       
                       <div className="text-right w-full md:w-auto mt-2 md:mt-0">
                          <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${details.color}`}>Available</div>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Completed
           </h3>
           <div className="space-y-4">
              {completedQuests.map((quest, i) => {
                 const details = getStatusDetails(quest);
                 const Icon = details.icon;
                 return (
                    <div key={i} className={`p-6 rounded-xl border ${details.border} ${details.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 opacity-75`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${details.bg} border ${details.border}`}>
                             <Icon className={`w-6 h-6 ${details.color}`} />
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-white">{quest.questId}</h3>
                             <p className="text-slate-400 text-sm">
                               Completed: {quest.completedAt > 0 ? new Date(quest.completedAt * 1000).toLocaleDateString() : "Unknown"}
                             </p>
                          </div>
                       </div>
                       
                       <div className="text-right w-full md:w-auto mt-2 md:mt-0">
                          <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${details.color}`}>Completed</div>
                          {quest.rewardsClaimed && <div className="text-xs text-green-500 font-mono">Rewards Claimed</div>}
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      )}

      {(!questProgress || questProgress.progress.length === 0) && (
        <div className="text-center py-12 text-slate-500">
           No quests found. Visit the Town Hall to start your adventure!
        </div>
      )}
    </section>
  );
}
