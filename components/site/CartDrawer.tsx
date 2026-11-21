"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatUZS } from "@/lib/money";
import { useMounted } from "@/lib/use-mounted";
import { BottleArt } from "./BottleArt";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const mounted = useMounted();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!mounted || !isOpen) return null;

  const total = cartTotal(lines);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Yopish"
        onClick={closeCart}
        className="absolute inset-0 bg-ink/50"
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-bg-elevated">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-xl text-ink">Savat</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-ink-muted transition-colors hover:text-ink"
            aria-label="Yopish"
          >
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-ink-muted">Savatingiz hozircha bo&rsquo;sh</p>
            <Link href="/katalog" onClick={closeCart} className="text-sm text-clay hover:underline">
              Katalogni ko&rsquo;rish
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <div key={line.variantId} className="flex gap-3">
                  <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-md bg-bg-sunken">
                    <BottleArt color={line.accentColor} className="h-14 w-auto" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm leading-snug text-ink">{line.name}</p>
                        <p className="text-xs text-ink-faint">
                          {line.brand} · {line.volumeMl} ml
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.variantId)}
                        className="shrink-0 text-xs text-ink-faint hover:text-wine-soft"
                      >
                        olib tashlash
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          className="h-7 w-7 text-ink-muted hover:text-ink"
                          onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                          aria-label="Kamaytirish"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          className="h-7 w-7 text-ink-muted hover:text-ink"
                          onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                          aria-label="Ko'paytirish"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-ink">{formatUZS(line.price * line.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Jami</span>
                <span className="font-display text-lg text-ink">{formatUZS(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full rounded-full bg-ink py-3 text-center text-sm font-medium text-bg transition-opacity hover:opacity-90"
              >
                Buyurtma berish
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
