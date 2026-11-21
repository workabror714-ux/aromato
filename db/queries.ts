import { desc, eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { products, productVariants, orders, orderItems, type Product, type ProductVariant } from "./schema";

export type ProductWithVariants = Product & { variants: ProductVariant[] };

export async function listProducts(): Promise<ProductWithVariants[]> {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  const variants = await db.select().from(productVariants);
  return rows.map((p) => ({ ...p, variants: variants.filter((v) => v.productId === p.id) }));
}

export async function listFeaturedProducts(limit = 4): Promise<ProductWithVariants[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(desc(products.createdAt))
    .limit(limit);
  const ids = rows.map((p) => p.id);
  if (ids.length === 0) return [];
  const variants = await db.select().from(productVariants).where(inArray(productVariants.productId, ids));
  return rows.map((p) => ({ ...p, variants: variants.filter((v) => v.productId === p.id) }));
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const product = db.select().from(products).where(eq(products.slug, slug)).get();
  if (!product) return null;
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));
  return { ...product, variants };
}

export async function getProductById(id: number): Promise<ProductWithVariants | null> {
  const product = db.select().from(products).where(eq(products.id, id)).get();
  if (!product) return null;
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));
  return { ...product, variants };
}

export function generateOrderCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ARM-${y}${m}${d}-${rand}`;
}

export async function listOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderByCode(code: string) {
  const order = db.select().from(orders).where(eq(orders.code, code)).get();
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export async function getOrderById(id: number) {
  const order = db.select().from(orders).where(eq(orders.id, id)).get();
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export async function getDashboardStats() {
  const allOrders = await db.select().from(orders);
  const allProducts = await db.select().from(products);
  const newOrders = allOrders.filter((o) => o.status === "yangi").length;
  const totalRevenue = allOrders
    .filter((o) => o.status !== "bekor_qilindi")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  return {
    totalOrders: allOrders.length,
    newOrders,
    totalProducts: allProducts.length,
    totalRevenue,
  };
}
