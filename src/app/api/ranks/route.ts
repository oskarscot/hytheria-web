import { NextResponse } from "next/server";
import { getPlayerRank } from "@/lib/queries/rank";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const players = searchParams.get("players")?.split(",").filter(Boolean) ?? [];

  const ranks: Record<string, string> = {};
  for (const player of players) {
    const rank = await getPlayerRank(player);
    if (rank) {
      ranks[player] = rank;
    }
  }

  return NextResponse.json(ranks);
}
