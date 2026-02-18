import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { getIslandInfo } from "@/lib/queries/island";
import { Hammer, Coins, Users, Settings, Shield, MapPin, Clock, Lock, Unlock } from "lucide-react";

export default async function DashboardIslandPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountWithPlayer(session?.user?.id ?? "");

  if (!linkedAccount) {
    redirect("/dashboard/link");
  }

  const islandInfo = await getIslandInfo(linkedAccount.linkedAccount.playerUuid);

  return (
    <section>
       <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
         <div>
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider">My Island</h2>
            <p className="text-slate-400 font-light mt-1">Manage your Skyblock realm.</p>
         </div>
         <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 font-mono text-sm uppercase tracking-widest font-bold">
            {islandInfo?.islandName || "Unnamed Island"}
         </div>
      </div>

      {islandInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Island Settings */}
           <div className="p-6 rounded-xl bg-slate-900/40 border border-white/5 hover:border-yellow-500/30 transition-all group">
              <Settings className="w-8 h-8 text-slate-600 group-hover:text-yellow-500 mb-4 transition-colors" />
              <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400 flex items-center gap-2">{islandInfo.pvpEnabled ? <Unlock className="w-3 h-3 text-red-500"/> : <Lock className="w-3 h-3 text-green-500"/>} PvP</span>
                   <span className="text-white">{islandInfo.pvpEnabled ? "Enabled" : "Disabled"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400 flex items-center gap-2"><Shield className="w-3 h-3"/> Mob Spawning</span>
                   <span className="text-white">{islandInfo.mobSpawning ? "On" : "Off"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400 flex items-center gap-2"><MapPin className="w-3 h-3"/> Border Size</span>
                   <span className="text-white">{islandInfo.borderSize}x{islandInfo.borderSize}</span>
                </div>
              </div>
           </div>

           {/* Members */}
           <div className="p-6 rounded-xl bg-slate-900/40 border border-white/5 hover:border-yellow-500/30 transition-all group">
              <Users className="w-8 h-8 text-slate-600 group-hover:text-yellow-500 mb-4 transition-colors" />
              <h3 className="text-xl font-bold text-white mb-2">Members</h3>
              <p className="text-slate-400 text-sm mb-4">You have <span className="text-white font-bold">{islandInfo.members?.length || 1}</span> member(s) on your island.</p>
              <div className="flex flex-wrap gap-2">
                 {islandInfo.members?.slice(0, 5).map((member, i) => (
                    <div key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                       {member.slice(0, 8)}...
                    </div>
                 ))}
                 {(islandInfo.members?.length || 0) > 5 && (
                    <div className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-500">
                       +{islandInfo.members.length - 5} more
                    </div>
                 )}
              </div>
           </div>

           {/* Bank */}
           <div className="p-6 rounded-xl bg-slate-900/40 border border-white/5 hover:border-yellow-500/30 transition-all group">
              <Coins className="w-8 h-8 text-slate-600 group-hover:text-yellow-500 mb-4 transition-colors" />
              <h3 className="text-xl font-bold text-white mb-2">Bank</h3>
              <div className="text-2xl font-mono text-yellow-400 font-bold mb-1">{islandInfo.bankBalance?.toLocaleString() || 0}g</div>
              <p className="text-slate-500 text-xs">Interest Rate: 2.5%</p>
           </div>

           {/* Minions */}
           <div className="p-6 rounded-xl bg-slate-900/40 border border-white/5 hover:border-yellow-500/30 transition-all group col-span-1 md:col-span-2 lg:col-span-3">
              <Hammer className="w-8 h-8 text-slate-600 group-hover:text-yellow-500 mb-4 transition-colors" />
              <h3 className="text-xl font-bold text-white mb-2">Minions</h3>
              <p className="text-slate-400 text-sm mb-4">You have <span className="text-white font-bold">{islandInfo.minions?.length || 0}</span> active minions.</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                 {islandInfo.minions?.slice(0, 8).map((minion, i) => (
                    <div key={i} className="aspect-square bg-slate-800 rounded flex flex-col items-center justify-center text-xs text-slate-500 border border-white/5">
                       <span className="text-yellow-500 font-bold">{minion.tier}</span>
                       <span className="text-[10px]">{minion.type.slice(0,3)}</span>
                    </div>
                 ))}
                 {(!islandInfo.minions || islandInfo.minions.length === 0) && (
                    <div className="col-span-full text-center py-4 text-slate-600 text-sm">
                       No minions yet. Purchase one from the Minion Shop.
                    </div>
                 )}
              </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
           No island data found. Join the server to create your island!
        </div>
      )}
    </section>
  );
}
