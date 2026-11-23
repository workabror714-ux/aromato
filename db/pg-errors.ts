/**
 * `better-sqlite3`da UNIQUE buzilishi xabari matnida "UNIQUE" so'zini
 * o'z ichiga olardi (`err.message.includes("UNIQUE")`). Postgres esa xato
 * turini matn orqali emas, barqaror SQLSTATE kodi orqali bildiradi —
 * unique_violation uchun bu doimo "23505". Node-postgres (va shu orqali
 * `@neondatabase/serverless`) xato obyektiga `.code` maydonini shu SQLSTATE
 * qiymati bilan qo'shadi. Shu sababli endi matn emas, kod tekshiriladi —
 * bu til/lokalizatsiyadan mustaqil va ishonchli usul.
 */
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "23505";
}
