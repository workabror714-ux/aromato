/**
 * `Intl.NumberFormat("uz-UZ")` dan ataylab foydalanilmaydi: bu loyihada
 * aniqlandiki, Next.js'ning RSC (server komponent) render yo'li va "use
 * client" komponentlarni serverda SSR qilish yo'li uchun alohida bundle
 * grafikalari ishlatiladi, va ularda uz-UZ uchun minglik ajratuvchi belgi
 * HAR XIL chiqadi (biri vergul, biri bo'sh joy) — bu esa React'ning
 * hidratsiya (hydration) xatosiga olib keladi (server va klient DOM'i mos
 * kelmay qoladi). Shu sababli raqamni minglik guruhlarga ajratish qo'lda,
 * muhitga bog'liq bo'lmagan tarzda amalga oshiriladi — natija server va
 * klientda har doim bir xil bo'lishi kafolatlanadi.
 */
function groupThousands(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const digits = Math.trunc(Math.abs(amount)).toString();
  const groups: string[] = [];
  for (let end = digits.length; end > 0; end -= 3) {
    groups.unshift(digits.slice(Math.max(0, end - 3), end));
  }
  return sign + groups.join(" ");
}

export function formatUZS(amount: number): string {
  return `${groupThousands(amount)} so'm`;
}
