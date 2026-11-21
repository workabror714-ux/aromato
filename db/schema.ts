import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
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

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
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
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("orders_status_idx").on(t.status)],
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
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

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
});

export const subscribers = sqliteTable("subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
