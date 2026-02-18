import { NextResponse } from "next/server";
import { getLeaderboardData } from "@/lib/queries/leaderboards";

export const revalidate = 900; // 15 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "coins";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  if (!Number.isFinite(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  try {
    const leaderboard = await getLeaderboardData(category, page);
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
  }
}
