"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatUZS } from "@/lib/money";
import type { ProductWithVariants } from "@/db/queries";

export function AddToCartForm({
  product,
  checkoutPath = "/checkout",
}: {
  product: ProductWithVariants;
  checkoutPath?: string;
}) {
  const sortedVariants = [...product.variants].sort((a, b) => a.volumeMl - b.volumeMl);
  const [variantId, setVariantId] = useState(sortedVariants[0]?.id);
  const addLine = useCartStore((s) => s.addLine);
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  const variant = sortedVariants.find((v) => v.id === variantId);
  if (!variant) return null;

  const outOfStock = variant.stock <= 0;

  function handleAdd() {
    if (!variant || outOfStock) return;
    addLine({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      volumeMl: variant.volumeMl,
      price: variant.price,
      accentColor: product.accentColor,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Hajm</p>
        <div className="flex gap-2">
          {sortedVariants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariantId(v.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                v.id === variantId
                  ? "border-ink bg-ink text-bg"
                  : "border-line text-ink-muted hover:border-line-strong"
              }`}
            >
              {v.volumeMl} ml
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl text-ink">{formatUZS(variant.price)}</span>
        {variant.stock <= 5 && variant.stock > 0 && (
          <span className="text-xs text-wine">Omborda {variant.stock} dona qoldi</span>
        )}
        {outOfStock && <span className="text-xs text-wine">Hozircha mavjud emas</span>}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 rounded-full bg-ink py-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {justAdded ? "Savatga qo'shildi ✓" : "Savatga qo'shish"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push(checkoutPath);
          }}
          disabled={outOfStock}
          className="flex-1 rounded-full border border-ink py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          Hoziroq xarid qilish
        </button>
      </div>
    </div>
  );
}
