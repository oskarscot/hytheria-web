import { NextResponse } from "next/server";
import { getPlayerRank } from "@/lib/queries/rank";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const players = searchParams.get("players")?.split(",").filter(Boolean) ?? [];

  const ranks: Record<string, string> = {};
  
  for (const player of players) {
    try {
      const rank = await getPlayerRank(player);
      if (rank) {
        ranks[player] = rank;
      }
    } catch (error) {
      console.error(`Error fetching rank for ${player}:`, error);
    }
  }

  return NextResponse.json(ranks);
}
