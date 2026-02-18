"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function PlayNowButton() {
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
    <Button 
      onClick={handleCopyIp} 
      variant="default" 
      className="shadow-[0_0_20px_rgba(234,179,8,0.4)] border-yellow-400/30 font-bold"
    >
      {copied ? "IP COPIED!" : "Play Now"}
    </Button>
  );
}
