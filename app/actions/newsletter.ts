"use server";

import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { subscribeSchema } from "@/lib/validators";

export type SubscribeResult = { ok: true } | { ok: false; error: string };

export async function subscribeNewsletter(input: { email: string }): Promise<SubscribeResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Email noto'g'ri" };
  }

  try {
    db.insert(subscribers).values({ email: parsed.data.email }).run();
    return { ok: true };
  } catch (err) {
    // UNIQUE constraint — allaqachon obuna bo'lgan. Foydalanuvchiga xato
    // sifatida emas, muvaffaqiyat sifatida ko'rsatamiz (email manzili allaqachon
    // ro'yxatda ekanini oshkor qilish shart emas).
    if (err instanceof Error && err.message.includes("UNIQUE")) {
      return { ok: true };
    }
    console.error("[newsletter] obuna xatosi:", err);
    return { ok: false, error: "Obuna bo'lishda xatolik yuz berdi. Qayta urinib ko'ring." };
  }
}
