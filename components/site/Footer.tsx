import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer id="aloqa" className="border-t border-line bg-bg-sunken">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-2xl text-ink">aromato</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Tanlangan notalardan yaratilgan atirlar kolleksiyasi. Har bir hid —
              o&rsquo;z hikoyasi bilan.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Do&rsquo;kon</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/katalog" className="hover:text-ink">
                  Barcha atirlar
                </Link>
              </li>
              <li>
                <Link href="/buyurtma" className="hover:text-ink">
                  Buyurtmani kuzatish
                </Link>
              </li>
              <li>
                <Link href="/savat" className="hover:text-ink">
                  Savat
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Aloqa</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>+998 90 123 45 67</li>
              <li>hello@aromato.uz</li>
              <li>Toshkent, O&rsquo;zbekiston</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-ink">Yangiliklardan xabardor bo&rsquo;ling</p>
            <p className="mt-3 text-sm text-ink-muted">
              Yangi kolleksiyalar va eksklyuziv takliflar haqida birinchilardan bo&rsquo;lib bilib oling.
            </p>
            <NewsletterForm className="mt-4" />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Aromato. Barcha huquqlar himoyalangan.</p>
          <p>Telegram orqali ham buyurtma qilish mumkin</p>
        </div>
      </div>
    </footer>
  );
}
