import { listOrders } from "@/db/queries";
import { formatUZS } from "@/lib/money";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Buyurtmalar</h1>

      <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
        <table className="w-full text-sm">
          <thead className="bg-bg-sunken text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Kod</th>
              <th className="px-4 py-3 font-medium">Mijoz</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Manba</th>
              <th className="px-4 py-3 font-medium text-right">Summa</th>
              <th className="px-4 py-3 font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-4 py-3 text-ink">{o.code}</td>
                <td className="px-4 py-3 text-ink-muted">{o.customerName}</td>
                <td className="px-4 py-3 text-ink-muted">{o.phone}</td>
                <td className="px-4 py-3 text-ink-muted">{o.source === "telegram" ? "Telegram" : "Veb"}</td>
                <td className="px-4 py-3 text-right text-ink">{formatUZS(o.totalAmount)}</td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink-faint">
                  Hali buyurtmalar yo&rsquo;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
