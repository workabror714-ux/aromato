/**
 * Playwright orqali to'liq oqim smoke-testi: admin login → mahsulot CRUD →
 * katalogda ko'rinishi → checkout → buyurtma holati → admin buyurtma statusi.
 *
 * Ishlatish:
 *   npm run build && npm run start -- -p 3000   # boshqa terminalda
 *   node scripts/e2e-smoke.mjs
 *
 * CHROMIUM_PATH environment o'zgaruvchisi orqali boshqa Chromium yo'lini
 * ko'rsatish mumkin (standart: Playwright o'z-o'zidan topadi).
 */
import { chromium } from "playwright";

const executablePath = process.env.CHROMIUM_PATH || undefined;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});

const base = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_USER = process.env.ADMIN_SEED_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_SEED_PASSWORD || "Aromato2026!";

function ok(label) {
  console.log(`OK   ${label}`);
}

// --- Admin: login ---
await page.goto(`${base}/admin`);
await page.waitForURL(/\/admin\/login/);
ok("admin: unauthenticated redirect to login");

await page.fill("#username", ADMIN_USER);
await page.fill("#password", ADMIN_PASS);
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin$/);
ok("admin: login with seeded credentials");

// --- Admin: create a product ---
await page.goto(`${base}/admin/mahsulotlar/yangi`);
await page.fill("#name", "Test Parfyum");
await page.fill("#slug", "test-parfyum-e2e");
await page.fill("#brand", "Aromato");
await page.fill("#family", "Test");
await page.fill("#description", "E2E test uchun yaratilgan vaqtinchalik mahsulot tavsifi.");
await page.fill("#topNotes", "Test nota");
await page.fill("#heartNotes", "Test nota");
await page.fill("#baseNotes", "Test nota");
await page.fill('[data-testid="variant-volume-0"]', "50");
await page.fill('[data-testid="variant-price-0"]', "150000");
await page.fill('[data-testid="variant-stock-0"]', "10");
await page.fill('[data-testid="variant-sku-0"]', "TEST-E2E-50ML");
// E'tibor: sahifada Sidebar'ning "Chiqish" tugmasi ham type="submit" bo'lib,
// DOM'da ProductForm'dan OLDIN keladi — umumiy button[type="submit"]
// selektori shu logout tugmasini bosib yuborishi mumkin edi. Shuning uchun
// aniq data-testid orqali maqsadli tugma tanlanadi.
await page.click('[data-testid="product-form-submit"]');
await page.waitForURL(/\/admin\/mahsulotlar$/);
ok("admin: create a new product");

// --- Public: product visible in catalog ---
await page.goto(`${base}/katalog`);
await page.waitForSelector("text=Test Parfyum");
ok("public: new product visible in catalog");

// --- Admin: edit the product ---
await page.goto(`${base}/admin/mahsulotlar`);
await page.click('tr:has-text("Test Parfyum") >> text=Tahrirlash');
await page.waitForSelector("#name");
await page.fill("#name", "Test Parfyum (tahrirlangan)");
await page.click('[data-testid="product-form-submit"]');
await page.waitForURL(/\/admin\/mahsulotlar$/);
await page.waitForSelector("text=Test Parfyum (tahrirlangan)");
ok("admin: edit the test product");

// --- Public: full purchase flow ---
await page.goto(`${base}/mahsulot/oud-royale`);
await page.click('button:has-text("Savatga qo\'shish")');
await page.goto(`${base}/checkout`);
await page.fill('input[placeholder*="Aziz"]', "Playwright Test");
await page.fill('input[placeholder="+998901234567"]', "+998901112233");
await page.fill('textarea[placeholder*="mo\'ljal"]', "Chilonzor, 10-uy");
await page.click('button[type="submit"]:has-text("Buyurtmani tasdiqlash")');
await page.waitForURL(/\/buyurtma\/ARM-/, { timeout: 10000 });
const orderUrl = page.url();
console.log("  order url:", orderUrl);
ok("public: full purchase flow");

// --- Admin: order visible and status updatable ---
await page.goto(`${base}/admin/buyurtmalar`);
await page.waitForSelector("text=Playwright Test");
const statusSelect = page.locator('tr:has-text("Playwright Test") select');
await statusSelect.selectOption("tasdiqlandi");
await page.waitForTimeout(500);
ok("admin: new order visible and status updatable");

// --- Admin: delete the test product ---
// Eslatma: tugma matni tipografik apostrof (U+2019, o'chirish) bilan
// chiqariladi, oddiy ASCII apostrof bilan emas — shuning uchun matn bo'yicha
// emas, data-testid orqali aniq tanlanadi.
await page.goto(`${base}/admin/mahsulotlar`);
const row = page.locator('tr:has-text("Test Parfyum (tahrirlangan)")');
await row.locator('[data-testid="delete-product-trigger"]').click();
await row.locator('[data-testid="delete-product-confirm"]').click();
await page.waitForTimeout(500);
ok("admin: delete the test product");

if (errors.length > 0) {
  console.error("\nConsole/page errors detected:");
  for (const e of errors) console.error(" -", e);
  process.exitCode = 1;
} else {
  ok("no console/page errors observed");
}

await browser.close();
console.log("\nDONE");
