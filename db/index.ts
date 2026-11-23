import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

/**
 * Nega `@neondatabase/serverless` (Pool, WebSocket orqali) va SHUNCHAKI
 * `neon-http` emas: checkout oqimi (`app/actions/checkout.ts`) buyurtma
 * yaratish + ombordagi qoldiqni kamaytirishni BITTA haqiqiy SQL
 * tranzaksiyasida (BEGIN/COMMIT/ROLLBACK) bajarishi SHART — aks holda
 * parallel ikkita xaridor bir xil variantni bir vaqtda sotib olsa, ombor
 * minus qoldiqqa tushishi mumkin (race condition). `neon-http` drayveri esa
 * HTTP orqali ishlaydi va interaktiv (ko'p bosqichli) tranzaksiyalarni
 * qo'llamaydi. `neon-serverless`ning `Pool`i esa WebSocket orqali doimiy
 * ulanish ochadi va `node-postgres`ga o'xshash to'liq tranzaksiya
 * semantikasini beradi — shu bilan birga Vercel serverless muhitiga mos
 * (ulanishlar soni chegaralangan bo'lsa ham ishlaydi).
 *
 * Node.js muhitida (brauzerdan farqli) WebSocket global emas, shuning uchun
 * `ws` paketi qo'lda bog'lanadi.
 */
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL o'rnatilmagan. Neon Postgres ulanish satrini .env.local (lokal) yoki Vercel " +
      "muhit o'zgaruvchilarida (production) belgilang.",
  );
}

export const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
