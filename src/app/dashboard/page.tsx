import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountWithPlayer(session?.user?.id ?? "");

  if (!linkedAccount) {
    redirect("/dashboard/link");
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold">Overview</h2>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Account details</p>
        <div className="mt-3 grid gap-2">
          <p>Discord username: {session?.user?.name ?? "unknown"}</p>
          <p>Discord ID: {session?.user?.id ?? "unknown"}</p>
          <p>Hytale UUID: {linkedAccount.linkedAccount.playerUuid}</p>
          <p>Hytale username: {linkedAccount.player?.lastKnownName ?? "unknown"}</p>
        </div>
      </div>
    </section>
  );
}
