"use client";

import Link from "next/link";
import { useCartStore, cartCount, cartTotal } from "@/lib/cart-store";
import { formatUZS } from "@/lib/money";
import { useMounted } from "@/lib/use-mounted";

export function MiniAppCartBar() {
  const lines = useCartStore((s) => s.lines);
  const mounted = useMounted();

  if (!mounted) return null;
  const count = cartCount(lines);
  if (count === 0) return null;

  return (
    <Link
      href="/miniapp/checkout"
      className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-ink px-5 py-3.5 text-bg shadow-lg"
    >
      <span className="text-sm font-medium">{count} mahsulot</span>
      <span className="text-sm font-semibold">{formatUZS(cartTotal(lines))}</span>
    </Link>
  );
}
