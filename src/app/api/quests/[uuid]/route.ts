import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getLinkedAccountByUserId } from "@/lib/queries/linked-accounts";
import { getQuestProgress } from "@/lib/queries/quests";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const linkedAccount = await getLinkedAccountByUserId(session.user?.id ?? "");

  if (!linkedAccount) {
    return NextResponse.json({ error: "Account not linked" }, { status: 403 });
  }

  if (linkedAccount.playerUuid !== uuid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const quests = await getQuestProgress(uuid);

  if (!quests) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(quests);
}
