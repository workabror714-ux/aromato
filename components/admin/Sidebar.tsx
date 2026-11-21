"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin";

const LINKS = [
  { href: "/admin", label: "Umumiy ko'rinish" },
  { href: "/admin/mahsulotlar", label: "Mahsulotlar" },
  { href: "/admin/buyurtmalar", label: "Buyurtmalar" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-bg-elevated">
      <div className="px-6 py-6">
        <p className="font-display text-xl text-ink">aromato</p>
        <p className="text-xs text-ink-faint">Admin panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const active = link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-bg-sunken text-ink" : "text-ink-muted hover:bg-bg-sunken hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAdmin} className="px-3 py-4">
        <button
          type="submit"
          data-testid="logout-submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink-muted transition-colors hover:bg-bg-sunken hover:text-wine"
        >
          Chiqish
        </button>
      </form>
    </aside>
  );
}
