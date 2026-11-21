import { notFound } from "next/navigation";
import Link from "next/link";
import { getJournalPost, journalPosts } from "@/lib/journal";
import { BottleArt } from "@/components/site/BottleArt";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
      <Link href="/#jurnal" className="text-sm text-ink-muted hover:text-ink">
        ← Jurnalga qaytish
      </Link>
      <div
        className="mt-6 flex h-32 w-32 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${post.accentColor}1A` }}
      >
        <BottleArt color={post.accentColor} className="h-24 w-auto" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">{post.title}</h1>
      <div className="mt-8 space-y-5">
        {post.content.map((paragraph, i) => (
          <p key={i} className="max-w-[65ch] leading-relaxed text-ink-muted">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
