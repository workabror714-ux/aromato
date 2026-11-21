"use client";

import { useCartStore, cartCount } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";

export function CartButton() {
  const lines = useCartStore((s) => s.lines);
  const openCart = useCartStore((s) => s.openCart);
  // Zustand persist localStorage'dan hidratsiya client'da sodir bo'ladi,
  // shuning uchun server/client mismatch'dan qochish uchun mount kutamiz.
  const mounted = useMounted();
  const count = mounted ? cartCount(lines) : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-line-strong"
      aria-label="Savatni ochish"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="21" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="17" cy="21" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      <span className="hidden sm:inline">Savat</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[11px] font-medium text-bg">
          {count}
        </span>
      )}
    </button>
  );
}
