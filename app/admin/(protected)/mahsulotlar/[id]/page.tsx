import { notFound } from "next/navigation";
import { getProductById } from "@/db/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">{product.name}ni tahrirlash</h1>
      <ProductForm product={product} />
    </div>
  );
}
