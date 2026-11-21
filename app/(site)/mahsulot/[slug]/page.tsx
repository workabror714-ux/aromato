import { notFound } from "next/navigation";
import { getProductBySlug, listProducts } from "@/db/queries";
import { BottleArt } from "@/components/site/BottleArt";
import { BlobShape } from "@/components/site/BlobShape";
import { AddToCartForm } from "@/components/site/AddToCartForm";
import { ProductCard } from "@/components/site/ProductCard";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await listProducts();
  const related = all.filter((p) => p.family === product.family && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative flex items-center justify-center rounded-2xl bg-bg-sunken py-16">
          <BlobShape className="absolute h-64 w-64" fill={`${product.accentColor}22`} />
          <BottleArt color={product.accentColor} className="relative h-72 w-auto" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-faint">
            {product.family} · {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-ink-muted">{product.description}</p>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-ink-faint">Yuqori notalar</dt>
              <dd className="text-ink-muted">{product.topNotes}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-ink-faint">O&rsquo;rta notalar</dt>
              <dd className="text-ink-muted">{product.heartNotes}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-ink-faint">Baza notalar</dt>
              <dd className="text-ink-muted">{product.baseNotes}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-ink">O&rsquo;xshash atirlar</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
