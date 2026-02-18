import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isShopAdmin } from "@/lib/queries/shop";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/");
  }

  const admin = await isShopAdmin(session.user.id);
  
  if (!admin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
