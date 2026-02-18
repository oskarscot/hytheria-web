"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check, Copy } from "lucide-react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button 
      size="sm" 
      variant="ghost" 
      className="w-full border border-white/10 hover:bg-white/5 hover:text-white"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </>
      )}
    </Button>
  );
}
