"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useMounted } from "@/lib/use-mounted";

const NAV_LINKS = [
  { href: "/katalog", label: "Katalog" },
  { href: "/#brend", label: "Brend" },
  { href: "/#jurnal", label: "Jurnal" },
  { href: "/#aloqa", label: "Aloqa" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menyuni ochish"
        className="flex h-9 w-9 items-center justify-center text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {/*
        Drawer `document.body`ga portal orqali chiqariladi. Sabab: Header
        `backdrop-blur` classiga ega, va CSS spetsifikatsiyasiga ko'ra
        `backdrop-filter` (xuddi `filter`/`transform` kabi) "position: fixed"
        bolalari uchun yangi containing block yaratadi — shu sababli bu
        panelni to'g'ridan-to'g'ri Header ichida "fixed" qilib qo'ysak, u
        butun ekranga emas, faqat Header o'lchamiga cheklanib qolar edi
        (vizual tekshiruvda aniqlangan haqiqiy xato). Portal shu muammoni
        butunlay chetlab o'tadi.
      */}
      {open && mounted
        ? createPortal(
            <div className="fixed inset-0 z-50">
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-ink/50"
              />
              <div className="relative ml-auto flex h-full w-64 flex-col bg-bg-elevated p-6">
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-display text-xl text-ink">aromato</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Yopish"
                    className="text-ink-muted"
                  >
                    ✕
                  </button>
                </div>
                <nav className="flex flex-col gap-5">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-base text-ink"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
