import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.number().int().positive(),
  variantId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Savat bo'sh"),
  customerName: z.string().trim().min(2, "Ismingizni to'liq kiriting").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+998\d{9}$/, "Telefon raqam +998XXXXXXXXX ko'rinishida bo'lishi kerak"),
  region: z.string().trim().min(2, "Hududni tanlang"),
  address: z.string().trim().min(5, "Manzilni to'liqroq kiriting").max(400),
  note: z.string().trim().max(400).optional(),
  paymentMethod: z.enum(["naqd", "click", "payme"]),
  source: z.enum(["web", "telegram"]).default("web"),
  telegramUserId: z.string().optional(),
  telegramChatId: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productVariantFormSchema = z.object({
  id: z.number().int().positive().optional(),
  volumeMl: z.number().int().positive(),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  sku: z.string().trim().min(1),
});

export const productFormSchema = z.object({
  id: z.number().int().positive().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug faqat lotin harflari, raqam va chiziqchadan iborat bo'lsin"),
  name: z.string().trim().min(2).max(120),
  brand: z.string().trim().min(1).max(80),
  family: z.string().trim().min(1).max(60),
  description: z.string().trim().min(10).max(2000),
  topNotes: z.string().trim().min(1).max(200),
  heartNotes: z.string().trim().min(1).max(200),
  baseNotes: z.string().trim().min(1).max(200),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Rang #RRGGBB formatida bo'lishi kerak"),
  featured: z.boolean().default(false),
  variants: z.array(productVariantFormSchema).min(1, "Kamida bitta hajm/narx qo'shing"),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Login kiriting"),
  password: z.string().min(1, "Parol kiriting"),
});

export const orderStatusSchema = z.enum([
  "yangi",
  "tasdiqlandi",
  "yetkazilmoqda",
  "yetkazildi",
  "bekor_qilindi",
]);

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email manzilini to'g'ri kiriting"),
});
