import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getLinkedAccountWithPlayer } from "@/lib/queries/linked-accounts";
import { getPurchasesByUserId } from "@/lib/queries/shop-pending";

export default async function PaymentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const linkedAccount = await getLinkedAccountWithPlayer(session?.user?.id ?? "");

  if (!linkedAccount) {
    redirect("/dashboard/link");
  }

  const userId = session?.user?.id;
  const purchases = userId ? await getPurchasesByUserId(userId) : [];

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-6">Previous Payments</h2>

      {purchases.length === 0 ? (
        <p className="text-slate-400">No previous payments.</p>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase: any) => (
            <div key={purchase._id.toString()} className="p-4 bg-slate-800/40 border border-white/5 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold">{purchase.productName}</p>
                  <p className="text-slate-400 text-sm">
                    {purchase.billingType === "subscription" ? "Monthly Subscription" : 
                     purchase.billingType === "lifetime" ? "Lifetime" : 
                     `${purchase.durationDays || 30} Days`}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  purchase.status === "fulfilled" ? "bg-green-500/20 text-green-400" :
                  purchase.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                  purchase.status === "failed" ? "bg-red-500/20 text-red-400" :
                  "bg-slate-500/20 text-slate-400"
                }`}>
                  {purchase.status}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-2">
                €{(purchase.amount / 100).toFixed(2)} • {purchase.recipientUsername} • {new Date(purchase.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
