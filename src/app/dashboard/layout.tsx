import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { Navbar } from "@/components/layout/Navbar";
import { NavbarAuth } from "@/components/layout/NavbarAuth";
import { Footer } from "@/components/layout/Footer";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { CartButton } from "@/components/shop/BuyButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  const linkedAccount = await getLinkedAccountWithPlayer(session.user.id);
  const isLinked = !!linkedAccount;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-yellow-500/30 selection:text-yellow-100 font-sans flex flex-col">
      <Navbar>
          <div className="flex items-center gap-4">
            <CartButton />
            <NavbarAuth />
          </div>
      </Navbar>

      <main className="flex-grow pt-24 pb-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
             <div className="sticky top-24 space-y-4">
                 <div className="p-6 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                       {session.user?.image ? (
                         <img 
                           src={session.user.image} 
                           alt={session.user.name ?? "User"} 
                           className="w-12 h-12 rounded-full border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                         />
                       ) : (
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-xl font-bold text-black border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                            {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
                         </div>
                       )}
                       <div>
                          <div className="text-white font-bold font-display tracking-wide">{session.user?.name}</div>
                       </div>
                    </div>
                    <div className="h-px bg-white/5 my-4" />
                     <DashboardNav isLinked={isLinked} />
                </div>
             </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
             <div className="p-8 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm min-h-[600px]">
                {children}
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
