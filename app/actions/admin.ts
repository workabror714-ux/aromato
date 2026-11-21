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

  const admin = db.select().from(admins).where(eq(admins.username, parsed.data.username)).get();
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
    if (data.id) {
      db.update(products)
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
        .where(eq(products.id, data.id))
        .run();

      const existingVariantIds = data.variants.filter((v) => v.id).map((v) => v.id as number);
      const currentVariants = db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, data.id))
        .all();
      for (const existing of currentVariants) {
        if (!existingVariantIds.includes(existing.id)) {
          db.delete(productVariants).where(eq(productVariants.id, existing.id)).run();
        }
      }
      for (const v of data.variants) {
        if (v.id) {
          db.update(productVariants)
            .set({ volumeMl: v.volumeMl, price: v.price, stock: v.stock, sku: v.sku })
            .where(eq(productVariants.id, v.id))
            .run();
        } else {
          db.insert(productVariants)
            .values({ productId: data.id, volumeMl: v.volumeMl, price: v.price, stock: v.stock, sku: v.sku })
            .run();
        }
      }
    } else {
      const inserted = db
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
        .returning()
        .get();

      for (const v of data.variants) {
        db.insert(productVariants)
          .values({ productId: inserted.id, volumeMl: v.volumeMl, price: v.price, stock: v.stock, sku: v.sku })
          .run();
      }
    }

    revalidatePath("/admin/mahsulotlar");
    revalidatePath("/katalog");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error("[admin] upsertProduct xato:", err);
    const message = err instanceof Error && err.message.includes("UNIQUE")
      ? "Bu slug yoki SKU allaqachon band"
      : "Saqlashda xatolik yuz berdi";
    return { ok: false, error: message };
  }
}

export async function deleteProduct(productId: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    db.delete(products).where(eq(products.id, productId)).run();
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
    const order = db.select().from(orders).where(eq(orders.id, orderId)).get();
    if (!order) return { ok: false, error: "Buyurtma topilmadi" };

    db.update(orders)
      .set({ status: parsedStatus.data, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .run();

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
