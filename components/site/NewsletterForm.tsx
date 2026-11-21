"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import clsx from "clsx";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={clsx("flex gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await subscribeNewsletter({ email });
          if (result.ok) {
            setStatus("ok");
            setMessage("Obuna bo'ldingiz — rahmat!");
            setEmail("");
          } else {
            setStatus("error");
            setMessage(result.error);
          }
        });
      }}
    >
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email manzilingiz
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email manzilingiz"
          className="w-full rounded-full border border-line-strong bg-bg-elevated px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:border-clay"
        />
        {status !== "idle" && (
          <p className={clsx("mt-1.5 text-xs", status === "ok" ? "text-ink-muted" : "text-wine")}>
            {message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Obuna
      </button>
    </form>
  );
}
