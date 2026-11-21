"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/admin";
import { ORDER_STATUS_LABELS } from "@/lib/telegram";

const STATUSES = Object.keys(ORDER_STATUS_LABELS);

export function OrderStatusSelect({ orderId, status }: { orderId: number; status: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(async () => {
          await updateOrderStatus(orderId, e.target.value);
          router.refresh();
        })
      }
      className="rounded-lg border border-line bg-bg-elevated px-2.5 py-1.5 text-sm text-ink"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
