import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLinkedAccountByDiscordId } from "@/lib/queries/linked-accounts";
import LinkFormClient from "@/app/dashboard/link/LinkFormClient";

export default async function DashboardLinkPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountByDiscordId(session?.user?.id ?? "");

  if (linkedAccount) {
    redirect("/dashboard");
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold">Link Account</h2>
      <p className="mt-4 text-slate-600">
        Enter the 6-character code from the in-game /link command.
      </p>
      <LinkFormClient />
    </section>
  );
}
