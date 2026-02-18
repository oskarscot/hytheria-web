"use client";

import { useState } from "react";

type LinkFormProps = {
  onSubmit: (code: string) => void;
  isSubmitting: boolean;
  message: string | null;
};

export default function LinkForm({ onSubmit, isSubmitting, message }: LinkFormProps) {
  const [code, setCode] = useState("");

  return (
    <form
      className="mt-6 max-w-sm space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(code.trim());
      }}
    >
      <label className="block text-sm font-medium text-slate-700" htmlFor="link-code">
        Link code
      </label>
      <input
        id="link-code"
        name="code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Enter 6-character code"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Linking..." : "Link account"}
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
