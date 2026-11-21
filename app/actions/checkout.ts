"use server";

import { eq } from "drizzle-orm";
import { db, sqlite } from "@/db";
import { products, productVariants, orders, orderItems } from "@/db/schema";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators";
import { generateOrderCode } from "@/db/queries";
import { sendTelegramMessage } from "@/lib/telegram";
import { getTelegramSession } from "@/lib/telegram-session";
import { formatUZS } from "@/lib/money";

export type CheckoutResult =
  | { ok: true; code: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Buyurtmani serverda yaratadi. Narxlar va mavjudlik HAR DOIM bazadan qayta
 * hisoblanadi — clientdan kelgan narx hech qachon ishonib qabul qilinmaydi.
 * Butun amal bitta SQLite tranzaksiyasida bajariladi: stock kamayishi va
 * buyurtma yaratilishi birgalikda muvaffaqiyatli bo'lishi yoki ikkalasi ham
 * bekor qilinishi kerak.
 */
export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Ma'lumotlarni tekshiring", fieldErrors };
  }

  const data = parsed.data;

  // Telegram Mini App'dan kelayotgan bo'lsa, clientdan kelgan telegram ID'larga
  // emas, /api/telegram/auth orqali serverda tasdiqlangan sessiyaga ishonamiz.
  // Bu client-side spoofing'dan himoya qiladi.
  const tgSession = await getTelegramSession();
  if (tgSession) {
    data.source = "telegram";
    data.telegramUserId = tgSession.telegramUserId;
    data.telegramChatId = tgSession.telegramChatId;
  } else if (data.source === "telegram") {
    // Telegram manbasi da'vo qilingan, lekin tasdiqlangan sessiya yo'q — ishonmaymiz.
    data.source = "web";
    data.telegramUserId = undefined;
    data.telegramChatId = undefined;
  }

  let result: ReturnType<typeof runCheckoutTransaction>;
  try {
    result = runCheckoutTransaction(data);
  } catch (err) {
    console.error("[checkout] tranzaksiya xatosi:", err);
    return { ok: false, error: "Buyurtmani saqlashda xatolik yuz berdi. Qayta urinib ko'ring." };
  }
  if (!result.ok) return result;

  // Buyurtma shu nuqtada allaqachon bazaga muvaffaqiyatli saqlangan.
  // Bildirishnoma yuborish (Telegram) muvaffaqiyatsiz bo'lsa ham, mijozga
  // "xatolik" deb ko'rsatilmaydi — faqat log'ga yoziladi. (sendTelegramMessage
  // o'zi ham hech qachon throw qilmaydi, lekin bu try/catch ehtiyot
  // chorasidir — tranzaksiya natijasidan mustaqil bo'lishini kafolatlaydi.)
  try {
    await notifyOrderCreated(result.code, result.summary, data.telegramChatId);
  } catch (err) {
    console.error("[checkout] bildirishnoma xatosi (buyurtma saqlangan, e'tiborsiz qoldirildi):", err);
  }

  return { ok: true, code: result.code };
}

function runCheckoutTransaction(data: CheckoutInput) {
  const transaction = sqlite.transaction(() => {
    let total = 0;
    const resolvedItems: {
      productId: number;
      variantId: number;
      productName: string;
      brand: string;
      volumeMl: number;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }[] = [];

    for (const item of data.items) {
      const variant = db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, item.variantId))
        .get();
      if (!variant || variant.productId !== item.productId) {
        throw new CheckoutError(`Mahsulot variant topilmadi (ID: ${item.variantId})`);
      }
      if (variant.stock < item.quantity) {
        throw new CheckoutError(
          `"${variant.sku}" uchun omborda yetarli mahsulot yo'q (qoldiq: ${variant.stock})`,
        );
      }

      const product = db.select().from(products).where(eq(products.id, item.productId)).get();
      if (!product) throw new CheckoutError("Mahsulot topilmadi");

      const lineTotal = variant.price * item.quantity;
      total += lineTotal;

      resolvedItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        brand: product.brand,
        volumeMl: variant.volumeMl,
        unitPrice: variant.price,
        quantity: item.quantity,
        lineTotal,
      });

      db.update(productVariants)
        .set({ stock: variant.stock - item.quantity })
        .where(eq(productVariants.id, variant.id))
        .run();
    }

    const code = generateOrderCode();
    const insertedOrder = db
      .insert(orders)
      .values({
        code,
        customerName: data.customerName,
        phone: data.phone,
        region: data.region,
        address: data.address,
        note: data.note ?? "",
        paymentMethod: data.paymentMethod,
        status: "yangi",
        totalAmount: total,
        source: data.source,
        telegramUserId: data.telegramUserId,
        telegramChatId: data.telegramChatId,
      })
      .returning()
      .get();

    for (const item of resolvedItems) {
      db.insert(orderItems)
        .values({ orderId: insertedOrder.id, ...item })
        .run();
    }

    return { code, total, items: resolvedItems };
  });

  try {
    const { code, total, items } = transaction();
    return {
      ok: true as const,
      code,
      summary: { total, items, customerName: data.customerName, phone: data.phone },
    };
  } catch (err) {
    if (err instanceof CheckoutError) {
      return { ok: false as const, error: err.message };
    }
    throw err;
  }
}

class CheckoutError extends Error {}

async function notifyOrderCreated(
  code: string,
  summary: {
    total: number;
    items: { productName: string; volumeMl: number; quantity: number }[];
    customerName: string;
    phone: string;
  },
  customerChatId?: string,
) {
  const itemsText = summary.items
    .map((i) => `• ${i.productName} (${i.volumeMl}ml) × ${i.quantity}`)
    .join("\n");

  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (adminChatId) {
    const adminText =
      `🧴 <b>Yangi buyurtma: ${code}</b>\n\n` +
      `${itemsText}\n\n` +
      `Jami: <b>${formatUZS(summary.total)}</b>\n` +
      `Mijoz: ${summary.customerName}\n` +
      `Telefon: ${summary.phone}`;
    await sendTelegramMessage(adminChatId, adminText);
  }

  if (customerChatId) {
    const customerText =
      `✅ Buyurtmangiz qabul qilindi!\n\n` +
      `Kod: <b>${code}</b>\n\n` +
      `${itemsText}\n\n` +
      `Jami: <b>${formatUZS(summary.total)}</b>\n\n` +
      `Holatini kuzatish uchun kodingizni saqlab qo'ying.`;
    await sendTelegramMessage(customerChatId, customerText);
  }
}
