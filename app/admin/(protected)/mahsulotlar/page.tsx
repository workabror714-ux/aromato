import Link from "next/link";
import { listProducts } from "@/db/queries";
import { formatUZS } from "@/lib/money";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Mahsulotlar</h1>
        <Link
          href="/admin/mahsulotlar/yangi"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          + Yangi mahsulot
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
        <table className="w-full text-sm">
          <thead className="bg-bg-sunken text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nomi</th>
              <th className="px-4 py-3 font-medium">Oila</th>
              <th className="px-4 py-3 font-medium">Hajmlar</th>
              <th className="px-4 py-3 font-medium">Saralangan</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink-muted">{p.family}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {p.variants.map((v) => `${v.volumeMl}ml (${formatUZS(v.price)})`).join(", ")}
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.featured ? "Ha" : "Yo'q"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/mahsulotlar/${p.id}`} className="text-sm text-clay hover:underline">
                      Tahrirlash
                    </Link>
                    <DeleteProductButton productId={p.id} productName={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
