import { sql } from "drizzle-orm";
import { pgTable, text, integer, boolean, timestamp, serial, index } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  // Atir oilasi: masalan "Sharqona", "Gulli", "Yog'ochsimon" — katalog filtri uchun.
  family: text("family").notNull(),
  description: text("description").notNull(),
  topNotes: text("top_notes").notNull(),
  heartNotes: text("heart_notes").notNull(),
  baseNotes: text("base_notes").notNull(),
  accentColor: text("accent_color").notNull(), // BottleArt SVG uchun hex rang
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    volumeMl: integer("volume_ml").notNull(),
    price: integer("price").notNull(), // UZS, tiyinsiz butun son
    stock: integer("stock").notNull().default(0),
    sku: text("sku").notNull().unique(),
  },
  (t) => [index("product_variants_product_id_idx").on(t.productId)],
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(), // ARM-YYYYMMDD-XXXX
    customerName: text("customer_name").notNull(),
    phone: text("phone").notNull(),
    region: text("region").notNull(),
    address: text("address").notNull(),
    note: text("note").notNull().default(""),
    paymentMethod: text("payment_method").notNull(), // naqd | click | payme
    status: text("status").notNull().default("yangi"),
    totalAmount: integer("total_amount").notNull(),
    source: text("source").notNull().default("web"), // web | telegram
    telegramUserId: text("telegram_user_id"),
    telegramChatId: text("telegram_chat_id"),
    createdAt: timestamp("created_at", { mode: "date" })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [index("orders_status_idx").on(t.status)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull(),
    variantId: integer("variant_id").notNull(),
    productName: text("product_name").notNull(),
    brand: text("brand").notNull(),
    volumeMl: integer("volume_ml").notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_id_idx").on(t.orderId)],
);

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`now()`),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
