"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertProduct } from "@/app/actions/admin";
import type { ProductWithVariants } from "@/db/queries";

type VariantRow = {
  id?: number;
  volumeMl: number;
  price: number;
  stock: number;
  sku: string;
};

export function ProductForm({ product }: { product?: ProductWithVariants }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState(product?.slug ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "Aromato");
  const [family, setFamily] = useState(product?.family ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [topNotes, setTopNotes] = useState(product?.topNotes ?? "");
  const [heartNotes, setHeartNotes] = useState(product?.heartNotes ?? "");
  const [baseNotes, setBaseNotes] = useState(product?.baseNotes ?? "");
  const [accentColor, setAccentColor] = useState(product?.accentColor ?? "#A9793C");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.length
      ? product.variants.map((v) => ({ id: v.id, volumeMl: v.volumeMl, price: v.price, stock: v.stock, sku: v.sku }))
      : [{ volumeMl: 30, price: 0, stock: 0, sku: "" }],
  );

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await upsertProduct({
        id: product?.id,
        slug,
        name,
        brand,
        family,
        description,
        topNotes,
        heartNotes,
        baseNotes,
        accentColor,
        featured,
        variants,
      });
      if (result.ok) {
        router.push("/admin/mahsulotlar");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nomi" id="name">
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="field"
          />
        </Field>
        <Field label="Slug (URL)" id="slug">
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="masalan-nomi"
            required
            className="field"
          />
        </Field>
        <Field label="Brend" id="brand">
          <input
            id="brand"
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="field"
          />
        </Field>
        <Field label="Oila (masalan: Gulli, Sharqona)" id="family">
          <input
            id="family"
            name="family"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            required
            className="field"
          />
        </Field>
      </div>

      <Field label="Tavsif" id="description">
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          className="field resize-none"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Yuqori notalar" id="topNotes">
          <input id="topNotes" name="topNotes" value={topNotes} onChange={(e) => setTopNotes(e.target.value)} required className="field" />
        </Field>
        <Field label="O'rta notalar" id="heartNotes">
          <input id="heartNotes" name="heartNotes" value={heartNotes} onChange={(e) => setHeartNotes(e.target.value)} required className="field" />
        </Field>
        <Field label="Baza notalar" id="baseNotes">
          <input id="baseNotes" name="baseNotes" value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} required className="field" />
        </Field>
      </div>

      <div className="flex items-center gap-4">
        <Field label="Aksent rang" id="accentColor">
          <div className="flex items-center gap-2">
            <input
              id="accentColor"
              name="accentColor"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-14 rounded border border-line bg-transparent"
            />
            <span className="text-sm text-ink-muted">{accentColor}</span>
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          Saralanganlar orasida ko&rsquo;rsatish
        </label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Hajm va narxlar</p>
          <button
            type="button"
            onClick={() => setVariants((prev) => [...prev, { volumeMl: 50, price: 0, stock: 0, sku: "" }])}
            className="text-sm text-clay hover:underline"
          >
            + Hajm qo&rsquo;shish
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={v.id ?? `new-${i}`} className="grid grid-cols-[1fr_1fr_1fr_1.4fr_auto] gap-2">
              <input
                type="number"
                value={v.volumeMl}
                onChange={(e) => updateVariant(i, { volumeMl: Number(e.target.value) })}
                placeholder="Hajm (ml)"
                className="field"
                data-testid={`variant-volume-${i}`}
              />
              <input
                type="number"
                value={v.price}
                onChange={(e) => updateVariant(i, { price: Number(e.target.value) })}
                placeholder="Narx (so'm)"
                className="field"
                data-testid={`variant-price-${i}`}
              />
              <input
                type="number"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                placeholder="Ombor"
                className="field"
                data-testid={`variant-stock-${i}`}
              />
              <input
                value={v.sku}
                onChange={(e) => updateVariant(i, { sku: e.target.value })}
                placeholder="SKU"
                className="field"
                data-testid={`variant-sku-${i}`}
              />
              <button
                type="button"
                onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={variants.length <= 1}
                className="text-ink-faint hover:text-wine disabled:opacity-30"
                aria-label="O'chirish"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-wine/10 px-4 py-3 text-sm text-wine">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        data-testid="product-form-submit"
        className="rounded-lg bg-ink px-6 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saqlanmoqda…" : "Saqlash"}
      </button>

      <style jsx global>{`
        .field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--line);
          background: var(--bg-elevated);
          padding: 0.55rem 0.8rem;
          font-size: 0.875rem;
          color: var(--ink);
        }
        .field:focus-visible {
          border-color: var(--clay);
          outline: none;
        }
      `}</style>
    </form>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
