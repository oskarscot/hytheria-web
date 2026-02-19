"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type ResultType = "success" | "canceled" | "error";

export default function CheckoutResultPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ResultType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = searchParams.get("type");
    const message = searchParams.get("message");
    if (type === "success" || type === "canceled" || type === "error") {
      setResult(type);
    } else {
      setResult("error");
    }
    setErrorMessage(message);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (result === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Successful!</h1>
          <p className="text-slate-400 mb-4">
            Thank you for your purchase. Your order is being processed and will be granted shortly.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            If your rewards haven’t appeared yet, run <span className="font-mono text-slate-300">/claim</span> in-game.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/dashboard">
              <Button variant="hero" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/store">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (result === "canceled") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Purchase Canceled</h1>
          <p className="text-slate-400 mb-4">
            Your purchase was canceled. No charges have been made to your payment method.
          </p>
          {errorMessage && (
            <p className="text-sm text-slate-500 mb-8">Error: {errorMessage}</p>
          )}
          <div className="space-y-4">
            <Link href="/store">
              <Button variant="hero" className="w-full">
                Try Again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h1>
        <p className="text-slate-400 mb-4">
          An error occurred while processing your purchase. Please try again or contact support.
        </p>
        {errorMessage && (
          <p className="text-sm text-slate-500 mb-8">Error: {errorMessage}</p>
        )}
        <div className="space-y-4">
          <Link href="/store">
            <Button variant="hero" className="w-full">
              Return to Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
