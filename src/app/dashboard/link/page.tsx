import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountByUserId } from "@/lib/queries/linked-accounts";
import LinkFormClient from "@/components/dashboard/link/LinkFormClient";
import { Link2, AlertCircle } from "lucide-react";

export default async function DashboardLinkPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountByUserId(session?.user?.id ?? "");

  if (linkedAccount) {
    redirect("/dashboard");
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[500px] text-center max-w-lg mx-auto px-4">
      <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
        <Link2 className="w-8 h-8 text-yellow-500" />
      </div>
      
      <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-4">Link Your Account</h2>
      
      <div className="bg-slate-900/60 p-6 rounded-lg border border-white/5 mb-8 w-full text-left space-y-4">
        <div className="flex gap-3">
           <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
           <div className="space-y-2 text-sm text-slate-400">
              <p>To access the dashboard, you must link your Discord account to your in-game player profile.</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                 <li>Join the Hytheria server: <span className="text-yellow-500 font-mono">play.hytheria.gg</span></li>
                 <li>Type <span className="bg-slate-800 px-1 py-0.5 rounded font-mono text-yellow-200">/link</span> in chat</li>
                 <li>Enter the 6-character code below</li>
              </ol>
           </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
         <LinkFormClient />
      </div>
    </section>
  );
}
