import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { ProductWithVariants } from "@/db/queries";

export function FeaturedGrid({ products }: { products: ProductWithVariants[] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Saralangan atirlar</h2>
        <Link href="/katalog" className="hidden text-sm text-ink-muted hover:text-ink sm:inline">
          Barchasini ko&rsquo;rish
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link href="/katalog" className="mt-6 inline-block text-sm text-ink-muted hover:text-ink sm:hidden">
        Barchasini ko&rsquo;rish
      </Link>
    </section>
  );
}
