import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/queries/leaderboards";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "coins";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  if (!Number.isFinite(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  const leaderboard = await getLeaderboard(category, page);
  return NextResponse.json(leaderboard);
}
