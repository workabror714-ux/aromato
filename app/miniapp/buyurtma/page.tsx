"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MiniAppTrackOrderPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <div className="px-4 py-8">
      <h1 className="mb-1 font-display text-xl text-ink">Buyurtmani kuzatish</h1>
      <p className="mb-5 text-sm text-ink-muted">Buyurtma kodingizni kiriting.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) router.push(`/miniapp/buyurtma/${code.trim().toUpperCase()}`);
        }}
        className="flex gap-2"
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ARM-20261121-A1B2"
          className="flex-1 rounded-full border border-line-strong bg-bg-elevated px-4 py-2.5 text-sm text-ink"
        />
        <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg">
          Qidirish
        </button>
      </form>
    </div>
  );
}
