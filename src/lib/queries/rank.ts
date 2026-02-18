import { getDatabase } from "@/lib/db";

export async function getPlayerRank(username: string): Promise<string | null> {
  const db = await getDatabase();
  const user = await db.collection("lp_users").findOne({ name: { $regex: new RegExp(`^${username}$`, "i") } });

  if (!user) {
    return null;
  }

  return user.primaryGroup ?? null;
}
