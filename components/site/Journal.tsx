import Link from "next/link";
import { journalPosts } from "@/lib/journal";
import { BottleArt } from "./BottleArt";

export function Journal() {
  return (
    <section id="jurnal" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <h2 className="font-display text-3xl text-ink sm:text-4xl">Jurnal</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {journalPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/jurnal/${post.slug}`}
            className="group flex gap-5 rounded-2xl border border-line bg-bg-elevated p-5 transition-colors hover:border-line-strong"
          >
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${post.accentColor}1A` }}
            >
              <BottleArt color={post.accentColor} className="h-14 w-auto" />
            </div>
            <div>
              <h3 className="font-display text-lg text-ink">{post.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
