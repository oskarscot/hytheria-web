import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageLayout>
      <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-display font-black text-yellow-500/20">404</h1>
          <h2 className="text-3xl font-display font-bold text-white mt-4 mb-2">
            Lost in the Void
          </h2>
          <p className="text-slate-400 mb-8 max-w-md">
            The page you're looking for doesn't exist. It may have been destroyed, 
            or perhaps it never existed in this dimension.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button variant="hero">
                Return Home
              </Button>
            </Link>
            <Link href="/store">
              <Button variant="outline">
                Visit Store
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
