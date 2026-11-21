"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatUZS } from "@/lib/money";
import { useMounted } from "@/lib/use-mounted";
import { createOrder } from "@/app/actions/checkout";

const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Samarqand",
  "Buxoro",
  "Qashqadaryo",
  "Surxondaryo",
  "Navoiy",
  "Jizzax",
  "Sirdaryo",
  "Xorazm",
  "Qoraqalpog'iston",
];

export function CheckoutForm({
  source = "web",
  telegramUserId,
  telegramChatId,
  orderBasePath = "/buyurtma",
}: {
  source?: "web" | "telegram";
  telegramUserId?: string;
  telegramChatId?: string;
  /** Mini App ichida /miniapp/buyurtma ga yo'naltirish uchun. */
  orderBasePath?: string;
}) {
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();
  const mounted = useMounted();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [region, setRegion] = useState(REGIONS[0]);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"naqd" | "click" | "payme">("naqd");

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-ink-muted">
          Savatingiz bo&rsquo;sh — buyurtma berish uchun avval mahsulot tanlang.
        </p>
        <a href="/katalog" className="text-clay hover:underline">
          Katalogni ko&rsquo;rish
        </a>
      </div>
    );
  }

  const total = cartTotal(lines);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    startTransition(async () => {
      const result = await createOrder({
        items: lines.map((l) => ({
          productId: l.productId,
          variantId: l.variantId,
          quantity: l.quantity,
        })),
        customerName,
        phone,
        region,
        address,
        note,
        paymentMethod,
        source,
        telegramUserId,
        telegramChatId,
      });

      if (result.ok) {
        clear();
        router.push(`${orderBasePath}/${result.code}`);
      } else {
        setFormError(result.error);
        if (result.fieldErrors) setErrors(result.fieldErrors);
      }
    });
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Ism familiya" id="customerName" error={errors.customerName}>
          <input
            id="customerName"
            name="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Aziz Karimov"
            required
            className="input"
          />
        </Field>

        <Field label="Telefon raqam" id="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998901234567"
            required
            className="input"
          />
        </Field>

        <Field label="Hudud" id="region" error={errors.region}>
          <select
            id="region"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="input"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="To'liq manzil" id="address" error={errors.address}>
          <textarea
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ko'cha, uy, mo'ljal"
            required
            rows={3}
            className="input resize-none"
          />
        </Field>

        <Field label="Izoh (ixtiyoriy)" id="note">
          <textarea
            id="note"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="input resize-none"
          />
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">To&rsquo;lov usuli</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "naqd", label: "Naqd (yetkazib berishda)" },
                { value: "click", label: "Click" },
                { value: "payme", label: "Payme" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentMethod(opt.value)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  paymentMethod === opt.value
                    ? "border-ink bg-ink text-bg"
                    : "border-line text-ink-muted hover:border-line-strong"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {formError && (
          <p className="rounded-lg bg-wine/10 px-4 py-3 text-sm text-wine">{formError}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-ink py-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Yuborilmoqda…" : "Buyurtmani tasdiqlash"}
        </button>
      </form>

      <aside className="h-fit space-y-4 rounded-2xl border border-line bg-bg-elevated p-6">
        <p className="text-sm font-medium text-ink">Buyurtma tarkibi</p>
        <div className="space-y-3">
          {lines.map((line) => (
            <div key={line.variantId} className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">
                {line.name} ({line.volumeMl}ml) × {line.quantity}
              </span>
              <span className="text-ink">{formatUZS(line.price * line.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="text-ink-muted">Jami</span>
          <span className="font-display text-xl text-ink">{formatUZS(total)}</span>
        </div>
      </aside>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--line);
          background: var(--bg-elevated);
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          color: var(--ink);
        }
        .input:focus-visible {
          border-color: var(--clay);
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-wine">{error}</p>}
    </div>
  );
}
