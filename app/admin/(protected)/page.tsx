import Link from "next/link";
import { getDashboardStats, listOrders } from "@/db/queries";
import { formatUZS } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/telegram";

export const metadata = { title: "Admin — Aromato" };

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([getDashboardStats(), listOrders()]);
  const recentOrders = orders.slice(0, 8);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Umumiy ko&rsquo;rinish</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Jami buyurtmalar" value={String(stats.totalOrders)} />
        <StatCard label="Yangi buyurtmalar" value={String(stats.newOrders)} />
        <StatCard label="Mahsulotlar" value={String(stats.totalProducts)} />
        <StatCard label="Jami tushum" value={formatUZS(stats.totalRevenue)} />
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg text-ink">So&rsquo;nggi buyurtmalar</h2>
          <Link href="/admin/buyurtmalar" className="text-sm text-clay hover:underline">
            Barchasini ko&rsquo;rish
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
          <table className="w-full text-sm">
            <thead className="bg-bg-sunken text-left text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Kod</th>
                <th className="px-4 py-3 font-medium">Mijoz</th>
                <th className="px-4 py-3 font-medium">Holat</th>
                <th className="px-4 py-3 font-medium text-right">Summa</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink">{o.code}</td>
                  <td className="px-4 py-3 text-ink-muted">{o.customerName}</td>
                  <td className="px-4 py-3 text-ink-muted">{ORDER_STATUS_LABELS[o.status] ?? o.status}</td>
                  <td className="px-4 py-3 text-right text-ink">{formatUZS(o.totalAmount)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-faint">
                    Hali buyurtmalar yo&rsquo;q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-elevated p-5">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="mt-2 font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
