import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createLinkedAccountByCode } from "@/lib/queries/linked-accounts";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = (await request.json()) as { code?: string };

  if (!code || code.length !== 6) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const rateKey = `${session.user?.id ?? "anonymous"}:${getClientIp(request)}`;
  const limitResult = rateLimit(rateKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);

  if (!limitResult.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        resetAt: limitResult.resetAt,
      },
      { status: 429 }
    );
  }

  const linkedAccount = await createLinkedAccountByCode(session.user?.id ?? "", code);

  if (!linkedAccount) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  return NextResponse.json(linkedAccount);
}
