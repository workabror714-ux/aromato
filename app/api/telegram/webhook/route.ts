import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

/**
 * Telegram botiga yuborilgan yangilanishlarni qabul qiladi. Hozircha faqat
 * `/start` buyrug'ini ishlaydi — foydalanuvchiga Mini App'ni ochish tugmasini
 * yuboradi. Qolgan matnlar e'tiborsiz qoldiriladi.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const update = await req.json().catch(() => null);
  const message = update?.message;
  const chatId = message?.chat?.id;
  const text: string | undefined = message?.text;

  if (chatId && text?.startsWith("/start")) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    await sendTelegramMessage(
      chatId,
      "Aromato do'koniga xush kelibsiz! 🧴\n\nTanlangan atirlar kolleksiyasini ko'rish va buyurtma berish uchun quyidagi tugmani bosing.",
      appUrl
        ? {
            replyMarkup: {
              inline_keyboard: [[{ text: "Do'konni ochish", web_app: { url: `${appUrl}/miniapp` } }]],
            },
          }
        : undefined,
    );
  }

  return NextResponse.json({ ok: true });
}
