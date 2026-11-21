"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/admin";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, { ok: true });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
          Login
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-line bg-bg-elevated px-4 py-2.5 text-sm text-ink focus-visible:border-clay"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Parol
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-line bg-bg-elevated px-4 py-2.5 text-sm text-ink focus-visible:border-clay"
        />
      </div>
      {!state.ok && <p className="text-sm text-wine">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-ink py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Kirilmoqda…" : "Kirish"}
      </button>
    </form>
  );
}
