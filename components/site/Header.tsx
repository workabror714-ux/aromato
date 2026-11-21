import Link from "next/link";
import { CartButton } from "./CartButton";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/katalog", label: "Katalog" },
  { href: "/#brend", label: "Brend" },
  { href: "/#jurnal", label: "Jurnal" },
  { href: "/#aloqa", label: "Aloqa" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          aromato
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/katalog"
            className="hidden text-sm text-ink-muted transition-colors hover:text-ink sm:inline"
            aria-label="Katalogda qidirish"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </Link>
          <CartButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
