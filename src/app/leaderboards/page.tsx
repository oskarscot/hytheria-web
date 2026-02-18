import { getLeaderboardData } from "@/lib/queries/leaderboards";
import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";
import { PageLayout } from "@/components/layout/PageLayout";

export const revalidate = 900; // 15 minutes

export default async function LeaderboardsPage() {
  const leaderboard = await getLeaderboardData("coins", 1);

  return (
    <PageLayout active="leaderboards">
      <main className="flex-grow pt-24 pb-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-wider uppercase drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">Leaderboards</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              See who reigns supreme in Hytheria. Top players across various categories.
            </p>
          </div>

          <LeaderboardClient 
            initialData={leaderboard.entries} 
            initialCategory={leaderboard.category} 
          />
        </div>
      </main>
    </PageLayout>
  );
}
