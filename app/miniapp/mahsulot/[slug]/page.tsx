import { notFound } from "next/navigation";
import { getProductBySlug } from "@/db/queries";
import { BottleArt } from "@/components/site/BottleArt";
import { AddToCartForm } from "@/components/site/AddToCartForm";

export default async function MiniAppProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="px-4 py-5">
      <div
        className="flex items-center justify-center rounded-2xl py-10"
        style={{ backgroundColor: `${product.accentColor}1A` }}
      >
        <BottleArt color={product.accentColor} className="h-44 w-auto" />
      </div>

      <p className="mt-4 text-xs uppercase tracking-wide text-ink-faint">{product.family}</p>
      <h1 className="mt-1 font-display text-2xl text-ink">{product.name}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{product.description}</p>

      <div className="mt-6">
        <AddToCartForm product={product} checkoutPath="/miniapp/checkout" />
      </div>
    </div>
  );
}
