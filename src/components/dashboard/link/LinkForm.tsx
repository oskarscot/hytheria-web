"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type LinkFormProps = {
  onSubmit: (code: string) => void;
  isSubmitting: boolean;
  message: string | null;
};

export default function LinkForm({ onSubmit, isSubmitting, message }: LinkFormProps) {
  const [code, setCode] = useState("");

  return (
    <form
      className="mt-6 w-full space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(code.trim());
      }}
    >
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider text-left" htmlFor="link-code">
          Link Code
        </label>
        <div className="relative">
          <input
            id="link-code"
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Enter 6-character code"
            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all font-mono"
            maxLength={6}
          />
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="default"
        className="w-full font-bold shadow-lg shadow-yellow-500/10"
      >
        {isSubmitting ? "Linking..." : "Link Account"}
      </Button>

      {message && (
        <div className={`p-3 rounded-lg text-sm border ${message.includes("failed") || message.includes("error") ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
          {message}
        </div>
      )}
    </form>
  );
}
