import { getDatabase } from "@/lib/db";

export async function getServerStats() {
  const db = await getDatabase();

  const [playerCount, islandCount, totalPlaytime] = await Promise.all([
    db.collection("players").countDocuments(),
    db.collection("islands").countDocuments(),
    db.collection("players").aggregate([
      { $group: { _id: null, total: { $sum: "$totalPlaytime" } } }
    ]).toArray()
  ]);

  const playtimeHours = totalPlaytime[0]?.total 
    ? Math.floor(totalPlaytime[0].total / 3600000) 
    : 0;

  return {
    players: playerCount,
    islands: islandCount,
    playtimeHours,
  };
}
