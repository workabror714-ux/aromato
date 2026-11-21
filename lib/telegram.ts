import crypto from "node:crypto";

const TELEGRAM_API = "https://api.telegram.org";

function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN ?? null;
}

/**
 * Telegram botidan xabar yuborish (masalan admin guruhiga yangi buyurtma haqida
 * bildirishnoma, yoki mijozga buyurtma tasdiqlangani haqida xabar).
 *
 * MUHIM: bu funksiya hech qachon exception tashlamaydi. Buyurtma allaqachon
 * bazaga saqlangan bo'ladi — Telegram xabari shunchaki qo'shimcha bildirishnoma,
 * va uning tarmoq xatosi (bot o'chgan, token noto'g'ri, internet yo'q) tufayli
 * mijozga "buyurtma saqlanmadi" deb noto'g'ri xato ko'rsatish mumkin emas.
 * TELEGRAM_BOT_TOKEN o'rnatilmagan bo'lsa ham, jim tarzda hech narsa qilmaydi.
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options?: { replyMarkup?: unknown },
) {
  const token = getBotToken();
  if (!token) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN o'rnatilmagan, xabar yuborilmadi.");
    return null;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: options?.replyMarkup,
      }),
    });
    return await handleTelegramResponse(res);
  } catch (err) {
    console.error("[telegram] sendMessage tarmoq xatosi (jim o'tkazib yuborildi):", err);
    return null;
  }
}

async function handleTelegramResponse(res: Response) {
  if (!res.ok) {
    console.error("[telegram] sendMessage xatosi:", await res.text());
    return null;
  }
  return res.json();
}

/**
 * Telegram Mini App'dan kelgan `initData` satrini bot tokeni asosida
 * HMAC-SHA256 orqali tasdiqlaydi. Rasmiy Telegram hujjatlariga muvofiq:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramInitData(
  initData: string,
  maxAgeSeconds = 86400,
): { ok: true; data: Record<string, string> } | { ok: false; reason: string } {
  const token = getBotToken();
  if (!token) return { ok: false, reason: "Bot sozlanmagan" };

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return { ok: false, reason: "hash yo'q" };
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(token).digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) {
    return { ok: false, reason: "Imzo mos kelmadi" };
  }

  const authDate = Number(params.get("auth_date") ?? 0);
  const ageSeconds = Date.now() / 1000 - authDate;
  if (ageSeconds > maxAgeSeconds) {
    return { ok: false, reason: "initData muddati o'tgan" };
  }

  const data: Record<string, string> = {};
  for (const [key, value] of params.entries()) data[key] = value;
  return { ok: true, data };
}

/** Buyurtma holatini o'zbekcha matnga o'giradi (bot xabarlari uchun). */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  yangi: "Yangi",
  tasdiqlandi: "Tasdiqlandi",
  yetkazilmoqda: "Yetkazilmoqda",
  yetkazildi: "Yetkazildi",
  bekor_qilindi: "Bekor qilindi",
};
