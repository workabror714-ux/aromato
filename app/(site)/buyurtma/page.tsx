"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackOrderPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md px-5 py-20 sm:px-8">
      <h1 className="mb-2 font-display text-3xl text-ink">Buyurtmani kuzatish</h1>
      <p className="mb-8 text-ink-muted">
        Buyurtma kodingizni kiriting (masalan, ARM-20261121-A1B2).
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) router.push(`/buyurtma/${code.trim().toUpperCase()}`);
        }}
        className="flex gap-2"
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ARM-20261121-A1B2"
          className="flex-1 rounded-full border border-line-strong bg-bg-elevated px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-clay"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Qidirish
        </button>
      </form>
    </div>
  );
}
