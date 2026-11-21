"use client";

import { useCallback, useState } from "react";
import Script from "next/script";

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  initData: string;
  initDataUnsafe?: { user?: { first_name?: string } };
  themeParams?: Record<string, string>;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

/**
 * Telegram Mini App SDK'ni yuklaydi, ready()/expand() chaqiradi va
 * initData'ni serverga yuborib, tasdiqlangan sessiya cookie'sini o'rnatadi.
 * Oddiy brauzerda (Telegram tashqarisida) ochilganda jim ravishda hech
 * narsa qilmaydi — sahifa odatiy veb-sahifa sifatida ishlayveradi.
 *
 * MUHIM: bu komponent `/miniapp` route-group layout'ida joylashgan, ildiz
 * layout'ida emas — shuning uchun `beforeInteractive` strategiyasi
 * (faqat ildiz layout uchun kafolatlangan) ishlatilmaydi. O'rniga SDK
 * tashabbuskori sifatida `Script`ning `onLoad` callback'i ishlatiladi: bu
 * global `window.Telegram` obyekti aniq tayyor bo'lganda ishga tushadi,
 * shuning uchun skript hali yuklanib ulgurmagan paytdagi musobaqa holati
 * (race condition) butunlay yo'q qilinadi.
 */
export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  const handleScriptLoad = useCallback(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      setReady(true);
      return;
    }

    webApp.ready();
    webApp.expand();
    webApp.setHeaderColor?.("#241b14");
    webApp.setBackgroundColor?.("#fbf6ef");

    if (webApp.initData) {
      fetch("/api/telegram/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData: webApp.initData }),
      })
        .catch(() => {})
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={() => setReady(true)}
      />
      <div style={{ visibility: ready ? "visible" : "hidden" }}>{children}</div>
    </>
  );
}
