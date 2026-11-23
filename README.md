# Aromato — to'liq funksional atir do'koni

Next.js 16 (App Router) ustida qurilgan parfyumeriya e-commerce sayti: ommaviy
katalog, savat, buyurtma oqimi, admin panel va Telegram Mini App/bot
integratsiyasi. Dizayn Pinterest'da topilgan "Scentaris" mockup'idan ilhomlanib,
asl Aromato brendi, ranglari va matnlari bilan qayta ishlab chiqilgan.

## Texnologiyalar

- **Next.js 16.4.6** (App Router, Turbopack, Server Actions) + TypeScript
- **Tailwind CSS v4** (`@theme inline`)
- **Drizzle ORM** + **Postgres** (Vercel-managed Neon integratsiyasi, `@neondatabase/serverless` Pool orqali — WebSocket asosida, haqiqiy tranzaksiya qo'llab-quvvatlaydi)
- **Zod** — validatsiya, **Zustand** — savat holati (localStorage'da saqlanadi)
- **jose** (JWT) — admin va Telegram Mini App sessiyalari, **bcryptjs** — parollar
- **Playwright** — E2E smoke test (`scripts/e2e-smoke.mjs`)

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # va DATABASE_URL'ni to'ldiring (Neon connection string)
npm run db:push              # sxemani bazaga qo'llash
npm run db:seed              # 12 ta namuna mahsulot + admin foydalanuvchi
npm run dev                  # http://localhost:3000
```

Vercel'ga ulangan loyihada `DATABASE_URL`ni qo'lda yozish shart emas — Neon
integratsiyasi qo'shilgach, `vercel env pull .env.local` buyrug'i uni
avtomatik tortib oladi.

Production uchun:

```bash
npm run build
npm run start
```

### Admin panel

`/admin/login` — `.env.local`dagi `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD`
bilan kiring (standart: `admin` / `Aromato2026!`). **Production'ga chiqishdan
oldin bu parolni albatta o'zgartiring** — `db/seed.ts` ishga tushganda
`.env.local`dagi qiymatni ishlatadi, shuning uchun parolni shu yerda
o'zgartirib, bazani qayta seed qilish kifoya.

### Telegram bot / Mini App

1. `.env.local`ga `TELEGRAM_BOT_TOKEN` va `TELEGRAM_ADMIN_CHAT_ID` qo'shing.
2. Saytni ochiq (https) domenga deploy qiling — webhook faqat HTTPS bilan ishlaydi.
3. `NEXT_PUBLIC_APP_URL`ni haqiqiy domeningizga o'zgartiring.
4. `npm run telegram:set-webhook` — webhook'ni o'rnatadi.
5. Mini App: BotFather orqali bot menyusiga `https://domen.uz/miniapp` havolasini
   qo'shing.

## Muhit o'zgaruvchilari (`.env.local`)

`.env.example` faylida barcha o'zgaruvchilar namunasi bor. Eng muhimlari:

| O'zgaruvchi | Tavsif |
|---|---|
| `DATABASE_URL` | Postgres (Neon) connection string |
| `ADMIN_SESSION_SECRET` / `TELEGRAM_SESSION_SECRET` | JWT imzolash kalitlari — kamida 32 tasodifiy belgi. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` bilan generatsiya qiling |
| `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD` | `db:seed` ishga tushganda yaratiladigan admin login/parol |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_ADMIN_CHAT_ID` / `TELEGRAM_WEBHOOK_SECRET` | Telegram integratsiyasi uchun (bo'sh qoldirilsa, bot funksiyalari jim o'tkazib yuboriladi — sayt baribir ishlaydi) |
| `NEXT_PUBLIC_APP_URL` | Saytning ochiq manzili (webhook va havolalar uchun) |

## Test

```bash
npm run lint
npm run build && npm run start -- -p 3000   # boshqa terminalda / fonda
node scripts/e2e-smoke.mjs                  # admin CRUD + to'liq xarid oqimini tekshiradi
```

E2E test admin login, mahsulot yaratish/tahrirlash/o'chirish, ommaviy xarid
oqimi va buyurtma holatini yangilashni to'liq avtomatik tekshiradi.

## Arxitektura bo'yicha qarorlar va ma'lum cheklovlar

Quyidagilar ataylab qilingan qarorlar yoki hozircha ongli ravishda qoldirilgan
masalalar — shaffoflik uchun aniq yozib qo'yilgan:

- **`cacheComponents: false`** (`next.config.ts`) — Next.js'ning yangi Cache
  Components (PPR) rejimi ataylab o'chirilgan. Admin sessiyasi, checkout va
  buyurtma holati sahifalari har doim bazadan eng yangi ma'lumotni o'qishi
  shart; PPR'ning "statik qobiq + keyin to'ldirish" modeli bu yerda aniqlikni
  murakkablikka almashtirishga arzimaydi.
- **Server Action + dinamik layout kombinatsiyasi** — `/admin/*`, `/checkout`
  va `/miniapp/checkout` sahifalari `export const dynamic = "force-dynamic"`
  bilan aniq belgilangan. Sababi: sahifaning o'zida dinamik API chaqiruvi
  bo'lmasa-da (masalan, faqat ajdod layout `cookies()` ishlatadi), Next.js
  build paytida bu sahifani statik deb xato xulosa chiqarib, unga yuborilgan
  Server Action so'rovlarini (masalan, buyurtma yaratish yoki mahsulot
  saqlash) build vaqtidagi natija bilan keshlab qo'yishi mumkin edi — bu haqiqiy,
  qidirib topilgan va tuzatilgan xato edi.
- **Baza qatlami SQLite'dan Postgres'ga (Neon) ko'chirildi** — Vercel
  serverless funksiyalari doimiy/umumiy fayl tizimiga ega emas, shuning
  uchun fayl asosidagi `better-sqlite3` production'da ishlamaydi (yozuvlar
  invokatsiyalar orasida yo'qolib qolardi). `@neondatabase/serverless`ning
  `Pool` (WebSocket) drayveri ataylab tanlangan — `neon-http` emas — chunki
  checkout oqimi (ombor qoldig'ini kamaytirish + buyurtma yaratish) haqiqiy
  ko'p-bosqichli SQL tranzaksiyasini (`db.transaction`) talab qiladi, buni
  `neon-http` qo'llamaydi.
- **Narx formatlash (`lib/money.ts`)** — `Intl.NumberFormat("uz-UZ")` ataylab
  ishlatilmaydi. Aniqlandiki, shu muhitda Next.js'ning server-komponent
  render yo'li va "use client" komponentlarni serverda SSR qilish yo'li
  uchun alohida bundle grafikalari ishlatiladi, va ularda uz-UZ minglik
  ajratuvchi belgisi har xil chiqib, React hidratsiya xatosiga olib kelardi.
  Shu sababli raqam minglik guruhlarga qo'lda, muhitga bog'liq bo'lmagan
  holda ajratiladi.
- **Mobil navigatsiya portal orqali render qilinadi** (`MobileNav.tsx`) —
  `Header`dagi `backdrop-blur` CSS xossasi `position: fixed` bolalar uchun
  yangi "containing block" yaratadi (CSS spetsifikatsiyasi talabi), shuning
  uchun menyu paneli to'g'ridan-to'g'ri Header ichida joylashtirilsa, u butun
  ekranga emas, faqat Header o'lchamiga cheklanib qolar edi. `createPortal`
  bilan `document.body`ga chiqarish bu muammoni hal qiladi.
- **`drizzle-kit` dev-bog'liqligi** — `npm audit` `drizzle-kit`ning ichki
  `esbuild` bog'liqligida 4 ta "moderate" darajali zaiflik borligini
  ko'rsatadi. Bu faqat **dev vaqtidagi migratsiya CLI** orqali ishlatiladi,
  production runtime'ga kirmaydi. Tuzatish `drizzle-kit`ni eski, breaking
  change'li versiyaga tushirishni talab qiladi — kichik loyiha uchun bu
  xavf/foyda nisbati mos emas deb hisoblab, ongli ravishda tuzatilmay
  qoldirildi. Vaqti kelganda `npm audit` va `drizzle-kit` yangilanishlarini
  kuzatib boring.
- **Telegram xabarnomalari hech qachon buyurtmani bekor qilmaydi** —
  `sendTelegramMessage` ichki xatoni hech qachon tashqariga otmaydi (har doim
  `try/catch` bilan o'ralgan). Checkout tranzaksiyasi (bazaga yozish) va
  Telegram xabarnomasi butunlay mustaqil bosqichlar: Telegram server ishdan
  chiqsa ham, mijoz hech qachon "buyurtma saqlanmadi" degan noto'g'ri xabar
  olmaydi.

## Loyiha tuzilishi

```
app/
  (site)/        — ommaviy sayt: bosh sahifa, katalog, mahsulot, savat, checkout, jurnal
  admin/         — admin panel (login + (protected) guruh)
  miniapp/       — Telegram Mini App sahifalari
  api/telegram/  — webhook va Mini App autentifikatsiya endpointlari
  actions/       — Server Actions (checkout, admin)
components/
  site/ admin/ miniapp/
db/              — Drizzle sxema, so'rovlar, seed skripti
lib/             — auth, telegram, cart-store, validatorlar, yordamchi funksiyalar
scripts/         — webhook o'rnatish, E2E smoke test
```
