import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aromato — Nafis atirlar",
  description:
    "Aromato — tanlangan atirlar kolleksiyasi. Onlayn buyurtma, tez yetkazib berish va Telegram orqali xarid.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
