import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramInitData } from "@/lib/telegram";
import { createTelegramSession } from "@/lib/telegram-session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const initData: string | undefined = body?.initData;
  if (!initData) {
    return NextResponse.json({ ok: false, error: "initData yo'q" }, { status: 400 });
  }

  const result = verifyTelegramInitData(initData);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason }, { status: 401 });
  }

  const userJson = result.data.user;
  if (!userJson) {
    return NextResponse.json({ ok: false, error: "Foydalanuvchi ma'lumoti yo'q" }, { status: 400 });
  }

  let user: { id: number; first_name?: string };
  try {
    user = JSON.parse(userJson);
  } catch {
    return NextResponse.json({ ok: false, error: "Foydalanuvchi ma'lumotini o'qib bo'lmadi" }, { status: 400 });
  }

  await createTelegramSession({
    telegramUserId: String(user.id),
    telegramChatId: String(user.id),
    firstName: user.first_name,
  });

  return NextResponse.json({ ok: true });
}
