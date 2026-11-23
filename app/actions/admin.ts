"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { admins, products, productVariants, orders } from "@/db/schema";
import { createAdminSession, getAdminSession, clearAdminSession } from "@/lib/auth";
import { sendTelegramMessage, ORDER_STATUS_LABELS } from "@/lib/telegram";
import { loginSchema, productFormSchema, orderStatusSchema, type ProductFormInput } from "@/lib/validators";
import { isUniqueViolation } from "@/db/pg-errors";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAdmin(
  _prev: ActionResult & { error?: string },
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Login va parolni kiriting" };
  }

  const rows = await db.select().from(admins).where(eq(admins.username, parsed.data.username)).limit(1);
  const admin = rows[0];
  if (!admin) {
    return { ok: false, error: "Login yoki parol noto'g'ri" };
  }

  const valid = bcrypt.compareSync(parsed.data.password, admin.passwordHash);
  if (!valid) {
    return { ok: false, error: "Login yoki parol noto'g'ri" };
  }

  await createAdminSession({ adminId: admin.id, username: admin.username });
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/* ------------------------------- Mahsulot ----------------------------- */

export async function upsertProduct(input: ProductFormInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" };
  }
  const data = parsed.data;

  try {
    // Mahsulot + variantlarni bitta tranzaksiyada saqlaymiz: aks holda
    // mahsulot yangilanib, variantlardan biri xato bersa, baza nomuvofiq
    // holatda qolib ketishi mumkin edi.
    await db.transaction(async (tx) => {
      if (data.id) {
        await tx
          .update(products)
          .set({
            slug: data.slug,
            name: data.name,
            brand: data.brand,
            family: data.family,
            description: data.description,
            topNotes: data.topNotes,
            heartNotes: data.heartNotes,
            baseNotes: data.baseNotes,
            accentColor: data.accentColor,
            featured: data.featured,
          })
          .where(eq(products.id, data.id));

        const existingVariantIds = data.variants.filter((v) => v.id).map((v) => v.id as number);
        const currentVariants = await tx
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, data.id));
        for (const existing of currentVariants) {
          if (!existingVariantIds.includes(existing.id)) {
            await tx.delete(productVariants).where(eq(productVariants.id, existing.id));
          }
        }
        for (const v of data.variants) {
          if (v.id) {
            await tx
              .update(productVariants)
              .set({ volumeMl: v.volumeMl, price: v.price, stock: v.stock, sku: v.sku })
              .where(eq(productVariants.id, v.id));
          } else {
            await tx
              .insert(productVariants)
              .values({ productId: data.id, volumeMl: v.volumeMl, price: v.price, stock: v.stock, sku: v.sku });
          }
        }
      } else {
        const insertedRows = await tx
          .insert(products)
          .values({
            slug: data.slug,
            name: data.name,
            brand: data.brand,
            family: data.family,
            description: data.description,
            topNotes: data.topNotes,
            heartNotes: data.heartNotes,
            baseNotes: data.baseNotes,
            accentColor: data.accentColor,
            featured: data.featured,
          })
          .returning();
        const inserted = insertedRows[0];

        for (const v of data.variants) {
          await tx
            .insert(productVariants)
            .values({ productId: inserted.id, volumeMl: v.volumeMl, price: v.price, stock: v.stock, sku: v.sku });
        }
      }
    });

    revalidatePath("/admin/mahsulotlar");
    revalidatePath("/katalog");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("[admin] upsertProduct xato:", err);
    const message = isUniqueViolation(err) ? "Bu slug yoki SKU allaqachon band" : "Saqlashda xatolik yuz berdi";
    return { ok: false, error: message };
  }
}

export async function deleteProduct(productId: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/admin/mahsulotlar");
    revalidatePath("/katalog");
    return { ok: true };
  } catch (err) {
    console.error("[admin] deleteProduct xato:", err);
    return { ok: false, error: "O'chirishda xatolik yuz berdi" };
  }
}

/* -------------------------------- Buyurtma --------------------------------- */

export async function updateOrderStatus(orderId: number, status: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedStatus = orderStatusSchema.safeParse(status);
  if (!parsedStatus.success) return { ok: false, error: "Noto'g'ri holat" };

  try {
    const rows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    const order = rows[0];
    if (!order) return { ok: false, error: "Buyurtma topilmadi" };

    await db
      .update(orders)
      .set({ status: parsedStatus.data, updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/buyurtmalar");
    revalidatePath(`/buyurtma/${order.code}`);

    // Agar buyurtma Telegram orqali kelgan bo'lsa, mijozga holat o'zgarishi
    // haqida xabar beramiz. sendTelegramMessage hech qachon throw qilmaydi,
    // shuning uchun bu yerdagi DB yangilanishi bildirishnoma natijasidan
    // mustaqil — xato faqat log'ga yoziladi.
    if (order.telegramChatId) {
      const label = ORDER_STATUS_LABELS[parsedStatus.data] ?? parsedStatus.data;
      await sendTelegramMessage(
        order.telegramChatId,
        `📦 Buyurtma <b>${order.code}</b> holati: <b>${label}</b>`,
      );
    }

    return { ok: true };
  } catch (err) {
    console.error("[admin] updateOrderStatus xato:", err);
    return { ok: false, error: "Yangilashda xatolik yuz berdi" };
  }
}
