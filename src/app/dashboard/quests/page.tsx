import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountByDiscordId } from "@/lib/queries/linked-accounts";

export default async function DashboardQuestsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountByDiscordId(session?.user?.id ?? "");

  if (!linkedAccount) {
    redirect("/dashboard/link");
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold">Quests</h2>
      <p className="mt-4 text-slate-600">
        alfhalhfaf
      </p>
    </section>
  );
}
