import Link from "next/link";
import { BottleArt } from "./BottleArt";
import { BlobShape } from "./BlobShape";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
      <div className="hero-reveal grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="font-display text-[2.75rem] leading-[1.08] text-ink sm:text-6xl">
            Nozik notalar,
            <br />
            mangu taassurot.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-ink-muted">
            Aromato — har bir hidi o&rsquo;z hikoyasiga ega bo&rsquo;lgan, ehtiyotkorlik
            bilan tanlangan atirlar kolleksiyasi.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/katalog"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Katalogni ko&rsquo;rish
            </Link>
            <Link
              href="/#brend"
              className="rounded-full border border-line-strong px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-bg-sunken"
            >
              Brend haqida
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <BlobShape className="absolute h-[22rem] w-[22rem] sm:h-[26rem] sm:w-[26rem]" />
          <BottleArt color="#8B5E34" className="relative h-72 w-auto drop-shadow-sm sm:h-80" />
        </div>
      </div>
    </section>
  );
}
