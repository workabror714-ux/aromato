import Link from "next/link";
import { BottleArt } from "./BottleArt";
import { formatUZS } from "@/lib/money";
import type { ProductWithVariants } from "@/db/queries";

export function ProductCard({
  product,
  basePath = "/mahsulot",
}: {
  product: ProductWithVariants;
  basePath?: string;
}) {
  const cheapest = [...product.variants].sort((a, b) => a.price - b.price)[0];

  return (
    <Link
      href={`${basePath}/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-bg-elevated p-5 transition-colors hover:border-line-strong"
    >
      <div
        className="flex h-40 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${product.accentColor}1A` }}
      >
        <BottleArt
          color={product.accentColor}
          className="h-32 w-auto transition-transform duration-300 group-hover:-translate-y-1"
        />
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-ink-faint">{product.family}</p>
        <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
        <p className="mt-1 text-xs text-ink-faint">{product.topNotes}</p>
      </div>
      <div className="mt-4">
        <span className="text-sm text-ink">
          {cheapest ? formatUZS(cheapest.price) : "—"}
        </span>
      </div>
    </Link>
  );
}
