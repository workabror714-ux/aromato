/**
 * Telegram bot webhook'ini o'rnatish uchun yordamchi skript.
 *
 * Ishlatish:
 *   TELEGRAM_BOT_TOKEN=... NEXT_PUBLIC_APP_URL=https://sizning-domeningiz.uz \
 *   TELEGRAM_WEBHOOK_SECRET=... npx tsx scripts/set-telegram-webhook.ts
 *
 * Yoki .env.local faylida shu o'zgaruvchilar bo'lsa, shunchaki:
 *   npm run telegram:set-webhook
 */
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token) throw new Error("TELEGRAM_BOT_TOKEN o'rnatilmagan");
  if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL o'rnatilmagan (https:// bilan, masalan https://aromato.uz)");
  if (appUrl.startsWith("http://localhost")) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL localhost bo'lib turibdi — Telegram webhook faqat ochiq HTTPS manzil bilan ishlaydi. Avval saytni deploy qiling.",
    );
  }

  const webhookUrl = `${appUrl.replace(/\/$/, "")}/api/telegram/webhook`;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret || undefined,
      drop_pending_updates: true,
    }),
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));

  if (!data.ok) {
    process.exitCode = 1;
    return;
  }

  console.log(`\nWebhook o'rnatildi: ${webhookUrl}`);
  if (!secret) {
    console.warn(
      "Ogohlantirish: TELEGRAM_WEBHOOK_SECRET o'rnatilmagan — webhook endpointingiz" +
        " maxfiy token bilan tasdiqlanmaydi. Production uchun buni albatta sozlang.",
    );
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
