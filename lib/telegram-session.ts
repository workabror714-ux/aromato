import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "aromato_tg_session";
const TTL_SECONDS = 60 * 60 * 2; // 2 soat

function getSecretKey(): Uint8Array {
  const secret = process.env.TELEGRAM_SESSION_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      "TELEGRAM_SESSION_SECRET o'rnatilmagan yoki juda qisqa (.env.local'da kamida 16 belgi kerak)",
    );
  }
  return new TextEncoder().encode(secret);
}

export type TelegramSessionPayload = {
  telegramUserId: string;
  telegramChatId: string;
  firstName?: string;
};

export async function createTelegramSession(payload: TelegramSessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(getSecretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Telegram Mini App iframe/webview ichida ochilgani uchun "lax" ba'zan
    // birinchi so'rovda cookie yubormasligi mumkin — "none" + secure kerak.
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function getTelegramSession(): Promise<TelegramSessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      telegramUserId: payload.telegramUserId as string,
      telegramChatId: payload.telegramChatId as string,
      firstName: payload.firstName as string | undefined,
    };
  } catch {
    return null;
  }
}
