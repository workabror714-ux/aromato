import { ProductCard } from "@/components/site/ProductCard";
import { listProducts } from "@/db/queries";

export const metadata = { title: "Katalog — Aromato" };

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ oila?: string }>;
}) {
  const { oila } = await searchParams;
  const products = await listProducts();
  const families = Array.from(new Set(products.map((p) => p.family)));
  const filtered = oila ? products.filter((p) => p.family === oila) : products;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Katalog</h1>
      <p className="mt-2 text-ink-muted">{products.length} ta atir</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip href="/katalog" active={!oila} label="Barchasi" />
        {families.map((f) => (
          <FilterChip key={f} href={`/katalog?oila=${encodeURIComponent(f)}`} active={oila === f} label={f} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <a
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active ? "border-ink bg-ink text-bg" : "border-line text-ink-muted hover:border-line-strong"
      }`}
    >
      {label}
    </a>
  );
}
