import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    return NextResponse.json({ linked: false });
  }

  const linked = await getLinkedAccountWithPlayer(session.user.id);
  
  return NextResponse.json({
    linked: !!linked,
    username: linked?.player?.lastKnownName || null,
  });
}
