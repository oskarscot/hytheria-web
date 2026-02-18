"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { User } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({ provider: "discord" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <main className="flex-grow flex items-center justify-center relative overflow-hidden py-32">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 -z-10" />

        <div className="relative w-full max-w-md px-4">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent opacity-50 blur-lg" />
            
            <Card className="relative bg-slate-900/80 border border-yellow-900/40 p-8 backdrop-blur-xl shadow-2xl">
                <div className="text-center space-y-2 mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <User className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white uppercase tracking-wider">
                        Welcome Back
                    </h1>
                    <p className="text-slate-400 text-sm font-light">
                        Sign in to manage your account and view your stats.
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={handleDiscordLogin}
                        disabled={isLoading}
                        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-none font-bold shadow-lg shadow-[#5865F2]/20 h-12 relative overflow-hidden group rounded-lg"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? (
                                "Connecting to the Void..."
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.966 2.419-2.176 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.966 2.419-2.176 2.419z" />
                                    </svg>
                                    Sign in with Discord
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500">
                        By signing in, you agree to our <a href="#" className="text-yellow-500 hover:underline">Terms of Service</a> and <a href="#" className="text-yellow-500 hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </Card>
        </div>
      </main>
    </PageLayout>
  );
}
