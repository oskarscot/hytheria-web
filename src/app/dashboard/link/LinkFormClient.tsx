"use client";

import { useState } from "react";
import LinkForm from "@/app/dashboard/link/LinkForm";

export default function LinkFormClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (code: string) => {
    if (!code) {
      setMessage("Enter a code to link.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setMessage(payload.error ?? "Link failed.");
        return;
      }

      setMessage("Linked! Refreshing...");
      window.location.href = "/dashboard";
    } catch (error) {
      setMessage("Link failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinkForm onSubmit={handleSubmit} isSubmitting={isSubmitting} message={message} />
  );
}
