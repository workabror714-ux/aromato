"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/actions/admin";

export function DeleteProductButton({ productId, productName }: { productId: number; productName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        data-testid="delete-product-trigger"
        className="text-sm text-ink-faint hover:text-wine"
      >
        O&rsquo;chirish
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="text-ink-muted">&ldquo;{productName}&rdquo;ni o&rsquo;chirish?</span>
      <button
        type="button"
        disabled={pending}
        data-testid="delete-product-confirm"
        onClick={() =>
          startTransition(async () => {
            await deleteProduct(productId);
            router.refresh();
          })
        }
        className="font-medium text-wine hover:underline"
      >
        Ha
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="text-ink-faint hover:text-ink">
        Yo&rsquo;q
      </button>
    </span>
  );
}
