import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import { listProducts } from "@/db/queries";

export default async function MiniAppHomePage() {
  const products = await listProducts();

  return (
    <div className="px-4 py-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-display text-xl text-ink">aromato</p>
        <Link href="/miniapp/buyurtma" className="text-xs text-ink-muted">
          Buyurtmani kuzatish
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} basePath="/miniapp/mahsulot" />
        ))}
      </div>
    </div>
  );
}
