import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByCode } from "@/db/queries";
import { formatUZS } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/telegram";

export default async function MiniAppOrderStatusPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = await getOrderByCode(code.toUpperCase());
  if (!order) notFound();

  return (
    <div className="px-4 py-6">
      <p className="text-sm text-ink-muted">Buyurtma</p>
      <h1 className="mt-1 font-display text-2xl text-ink">{order.code}</h1>

      <div className="mt-4 inline-block rounded-full bg-bg-sunken px-4 py-1.5 text-sm text-ink">
        {ORDER_STATUS_LABELS[order.status] ?? order.status}
      </div>

      <div className="mt-6 space-y-2 rounded-2xl border border-line bg-bg-elevated p-5">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">
              {item.productName} × {item.quantity}
            </span>
            <span className="text-ink">{formatUZS(item.lineTotal)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-line pt-2">
          <span className="text-ink-muted">Jami</span>
          <span className="font-display text-ink">{formatUZS(order.totalAmount)}</span>
        </div>
      </div>

      <Link href="/miniapp" className="mt-6 inline-block text-sm text-clay">
        Xaridni davom ettirish
      </Link>
    </div>
  );
}
