import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByCode } from "@/db/queries";
import { formatUZS } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/telegram";

export default async function OrderStatusPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = await getOrderByCode(code.toUpperCase());
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <p className="text-sm text-ink-muted">Buyurtma</p>
      <h1 className="mt-1 font-display text-3xl text-ink">{order.code}</h1>

      <div className="mt-6 inline-block rounded-full bg-bg-sunken px-4 py-1.5 text-sm text-ink">
        {ORDER_STATUS_LABELS[order.status] ?? order.status}
      </div>

      <div className="mt-8 space-y-3 rounded-2xl border border-line bg-bg-elevated p-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">
              {item.productName} ({item.volumeMl}ml) × {item.quantity}
            </span>
            <span className="text-ink">{formatUZS(item.lineTotal)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="text-ink-muted">Jami</span>
          <span className="font-display text-lg text-ink">{formatUZS(order.totalAmount)}</span>
        </div>
      </div>

      <dl className="mt-8 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="w-32 shrink-0 text-ink-faint">Qabul qiluvchi</dt>
          <dd className="text-ink-muted">{order.customerName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-32 shrink-0 text-ink-faint">Telefon</dt>
          <dd className="text-ink-muted">{order.phone}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-32 shrink-0 text-ink-faint">Manzil</dt>
          <dd className="text-ink-muted">
            {order.region}, {order.address}
          </dd>
        </div>
      </dl>

      <Link href="/katalog" className="mt-10 inline-block text-sm text-clay hover:underline">
        Xaridni davom ettirish
      </Link>
    </div>
  );
}
