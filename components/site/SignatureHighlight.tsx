import Link from "next/link";
import { BottleArt } from "./BottleArt";
import { BlobShape } from "./BlobShape";
import { formatUZS } from "@/lib/money";
import type { ProductWithVariants } from "@/db/queries";

export function SignatureHighlight({ product }: { product: ProductWithVariants }) {
  const cheapest = [...product.variants].sort((a, b) => a.price - b.price)[0];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-wide text-ink-faint">Mavsum tanlovi</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Fasl hidini kashf eting
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-ink-muted">
            Har fasl Aromato bitta hidni alohida ajratib ko&rsquo;rsatadi — eng boy
            kompozitsiyamiz, eng chuqur taassurot qoldiradigani.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-ink p-8 text-bg sm:p-10">
          <div>
            <p className="text-xs uppercase tracking-wide text-bg/60">Yangi taqdimot</p>
            <h3 className="mt-2 font-display text-2xl">{product.name}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-bg/75">
              {product.description}
            </p>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="relative flex shrink-0 items-center justify-center">
              <BlobShape className="absolute h-32 w-32" fill="rgba(251,246,239,0.08)" />
              <BottleArt color="#D8B987" className="relative h-36 w-auto" />
            </div>
            <div className="text-right">
              {cheapest && <p className="mb-3 text-sm text-bg/80">{formatUZS(cheapest.price)}dan</p>}
              <Link
                href={`/mahsulot/${product.slug}`}
                className="inline-block rounded-full bg-bg px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
              >
                Hoziroq xarid qiling
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
