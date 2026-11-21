"use client";

import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatUZS } from "@/lib/money";
import { useMounted } from "@/lib/use-mounted";
import { BottleArt } from "@/components/site/BottleArt";

export default function SavatPage() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const mounted = useMounted();

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="mb-3 font-display text-2xl text-ink">Savatingiz bo&rsquo;sh</h1>
        <p className="mb-6 text-ink-muted">
          Katalogdan yoqqan atirni tanlang va savatga qo&rsquo;shing.
        </p>
        <Link
          href="/katalog"
          className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Katalogni ko&rsquo;rish
        </Link>
      </div>
    );
  }

  const total = cartTotal(lines);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="mb-8 font-display text-3xl text-ink">Savat</h1>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="space-y-5 md:col-span-2">
          {lines.map((line) => (
            <div key={line.variantId} className="flex gap-4 border-b border-line pb-5">
              <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-bg-sunken">
                <BottleArt color={line.accentColor} className="h-16 w-auto" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/mahsulot/${line.slug}`} className="text-ink hover:text-clay">
                      {line.name}
                    </Link>
                    <p className="text-sm text-ink-faint">
                      {line.brand} · {line.volumeMl} ml
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.variantId)}
                    className="shrink-0 text-sm text-ink-faint hover:text-wine-soft"
                  >
                    olib tashlash
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      className="h-8 w-8 text-ink-muted hover:text-ink"
                      onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      className="h-8 w-8 text-ink-muted hover:text-ink"
                      onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-ink">{formatUZS(line.price * line.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-line bg-bg-elevated p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">Mahsulotlar</span>
            <span className="text-ink">{lines.length} xil</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Jami</span>
            <span className="font-display text-xl text-ink">{formatUZS(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full rounded-full bg-ink py-3 text-center text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Buyurtma berish
          </Link>
          <Link
            href="/katalog"
            className="block w-full text-center text-sm text-ink-muted transition-colors hover:text-ink"
          >
            Xaridni davom ettirish
          </Link>
        </div>
      </div>
    </div>
  );
}
