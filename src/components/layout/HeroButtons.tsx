"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function HeroButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText("play.hytheria.gg");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Button onClick={handleCopyIp} variant="hero" size="lg" className="w-64 relative">
        <span className="relative z-10">{copied ? "COPIED!" : "COPY IP"}</span>
        <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Button>
      <Link href="https://dc.hytheria.gg" target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="lg" className="w-64 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300">
          <span>DISCORD</span>
        </Button>
      </Link>
    </>
  );
}
