import "dotenv/config";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db, pool } from "./index";
import { products, productVariants, admins } from "./schema";

type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  family: string;
  description: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  accentColor: string;
  featured: boolean;
  basePrice: number; // 30ml narxi — 50ml va 100ml shundan hisoblanadi
};

const seedProducts: SeedProduct[] = [
  {
    slug: "noir-absolu",
    name: "Noir Absolu",
    brand: "Aromato",
    family: "Sharqona",
    description:
      "Kechqurun uchun yaratilgan qalin va sirli hid. Qora murch va bergamot bilan boshlanib, qoʻyuq oud va iliq vanilga aylanadi — bir marta surtilsa, kech boʻyi hamroh boʻladi.",
    topNotes: "Bergamot, qora murch",
    heartNotes: "Oud, safran",
    baseNotes: "Mushk, vanil",
    accentColor: "#8B5E34",
    featured: true,
    basePrice: 210000,
  },
  {
    slug: "opal-blanc",
    name: "Opal Blanc",
    brand: "Aromato",
    family: "Gulli",
    description:
      "Yengil va tiniq gulli kompozitsiya. Pion va mandarin ochiqligi yosmin hamda oq choyning nafisligiga uzatiladi — kunduzgi, ishonchli tanlov.",
    topNotes: "Pion, mandarin",
    heartNotes: "Yosmin, oq choy",
    baseNotes: "Oq mushk, sandal yog'ochi",
    accentColor: "#D8B4A0",
    featured: false,
    basePrice: 185000,
  },
  {
    slug: "ember-rose",
    name: "Ember Rose",
    brand: "Aromato",
    family: "Gulli",
    description:
      "Klassik atirgulga zamonaviy nafas. Qizil murchning achchiqligi damashq atirgulini uyg'otadi, patchuli esa hidga chuqurlik qo'shadi.",
    topNotes: "Qizil murch, bergamot",
    heartNotes: "Damashq atirguli",
    baseNotes: "Patchuli, mushk",
    accentColor: "#B5495B",
    featured: true,
    basePrice: 195000,
  },
  {
    slug: "santal-nur",
    name: "Santal Nur",
    brand: "Aromato",
    family: "Yog'ochsimon",
    description:
      "Iliq va silliq yog'ochsimon hid. Sandal yog'ochining boyligi kedr va amber bilan uyg'unlashib, ishonch va osoyishtalik hissini beradi.",
    topNotes: "Kardamon, bergamot",
    heartNotes: "Sandal yog'ochi",
    baseNotes: "Kedr, amber",
    accentColor: "#A67C52",
    featured: false,
    basePrice: 200000,
  },
  {
    slug: "citrine-aura",
    name: "Citrine Aura",
    brand: "Aromato",
    family: "Sitrusli",
    description:
      "Quyoshli va energiya beruvchi sitrus kompozitsiyasi. Greypfrut va neroli yengillik baxsh etadi, oq choy esa hidni tiniq ushlab turadi.",
    topNotes: "Bergamot, greypfrut",
    heartNotes: "Neroli",
    baseNotes: "Oq choy, mushk",
    accentColor: "#D9A441",
    featured: true,
    basePrice: 165000,
  },
  {
    slug: "oud-royale",
    name: "Oud Royale",
    brand: "Aromato",
    family: "Sharqona",
    description:
      "To'plamning eng hashamatli hidi. Safran va qora choy bilan boshlanib, asl oud va charm notalariga, so'ngra iliq amberga aylanadi.",
    topNotes: "Safran, qora choy",
    heartNotes: "Oud, atirgul",
    baseNotes: "Charm, amber",
    accentColor: "#5C3A21",
    featured: true,
    basePrice: 320000,
  },
  {
    slug: "iris-soie",
    name: "Iris Soie",
    brand: "Aromato",
    family: "Pudrasimon",
    description:
      "Ipaksimon va pudrasimon, nafis ayollarga xos hid. Binafsha va iris bir-biriga uyg'unlashib, oq mushk bilan yumshoq yakunlanadi.",
    topNotes: "Binafsha, bergamot",
    heartNotes: "Iris",
    baseNotes: "Oq mushk, kedr",
    accentColor: "#C9B8D8",
    featured: false,
    basePrice: 190000,
  },
  {
    slug: "noir-tabac",
    name: "Noir Tabac",
    brand: "Aromato",
    family: "Sharqona",
    description:
      "Erkaklar uchun qalin va xarakterli hid. Tamaki bargi tonka loviyasi va romning iliqligi bilan uyg'unlashadi.",
    topNotes: "Tamaki bargi",
    heartNotes: "Tonka loviyasi",
    baseNotes: "Rom, vanil",
    accentColor: "#4A3626",
    featured: false,
    basePrice: 230000,
  },
  {
    slug: "jasmin-lune",
    name: "Jasmin Lune",
    brand: "Aromato",
    family: "Gulli",
    description:
      "Tungi gulzorni eslatuvchi sezgir kompozitsiya. Yosmin sambac va ylang-ylang sandal yog'ochi bilan yumshoq tugaydi.",
    topNotes: "Bergamot, mandarin",
    heartNotes: "Yosmin sambac, ylang-ylang",
    baseNotes: "Sandal yog'ochi, mushk",
    accentColor: "#E8C7D8",
    featured: false,
    basePrice: 180000,
  },
  {
    slug: "vetiver-gri",
    name: "Vetiver Gri",
    brand: "Aromato",
    family: "Yog'ochsimon",
    description:
      "Yerga yaqin, tabiiy va erkin hid. Vetiver greypfrut bilan yengillashadi, kedr esa izchillik beradi — kundalik hamroh.",
    topNotes: "Greypfrut, bergamot",
    heartNotes: "Vetiver",
    baseNotes: "Kedr, mushk",
    accentColor: "#6B7A5E",
    featured: false,
    basePrice: 175000,
  },
  {
    slug: "ambre-dore",
    name: "Ambre Doré",
    brand: "Aromato",
    family: "Sharqona",
    description:
      "Oltin rangli, iliq amber hidi. Dolchin va mandarin benzoin orqali qalinlashib, vanil bilan shirin yakunlanadi.",
    topNotes: "Mandarin, dolchin",
    heartNotes: "Benzoin",
    baseNotes: "Amber, vanil",
    accentColor: "#C98A3B",
    featured: false,
    basePrice: 205000,
  },
  {
    slug: "fleur-blanche",
    name: "Fleur Blanche",
    brand: "Aromato",
    family: "Gulli",
    description:
      "Oq gullarning bayrami. Tuberoza va gardeniya to'yingan buket hosil qiladi, oq mushk esa uni teriga yaqinlashtiradi.",
    topNotes: "Bergamot, pion",
    heartNotes: "Tuberoza, gardeniya",
    baseNotes: "Oq mushk",
    accentColor: "#F0E6D6",
    featured: false,
    basePrice: 195000,
  },
];

function priceForVolume(basePrice: number, volumeMl: number): number {
  const multiplier = volumeMl === 30 ? 1 : volumeMl === 50 ? 1.5 : 2.3;
  return Math.round((basePrice * multiplier) / 1000) * 1000;
}

async function run() {
  console.log("Bazani tozalash...");
  // TRUNCATE ... CASCADE — Postgres'da barcha bog'liq jadvallarni (FK orqali)
  // birgalikda va tezda tozalaydi; qatorma-qator DELETE'dan farqli, buyruqlar
  // tartibiga bog'liq emas.
  await db.execute(
    sql`TRUNCATE TABLE order_items, orders, product_variants, products, admins, subscribers RESTART IDENTITY CASCADE`,
  );

  console.log("Mahsulotlar qo'shilmoqda...");
  for (const p of seedProducts) {
    const insertedRows = await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        family: p.family,
        description: p.description,
        topNotes: p.topNotes,
        heartNotes: p.heartNotes,
        baseNotes: p.baseNotes,
        accentColor: p.accentColor,
        featured: p.featured,
      })
      .returning();
    const inserted = insertedRows[0];

    for (const volumeMl of [30, 50, 100]) {
      await db.insert(productVariants).values({
        productId: inserted.id,
        volumeMl,
        price: priceForVolume(p.basePrice, volumeMl),
        stock: volumeMl === 100 ? 15 : 30,
        sku: `${p.slug}-${volumeMl}ml`.toUpperCase(),
      });
    }
  }

  console.log("Admin foydalanuvchi yaratilmoqda...");
  // MUHIM: `??` faqat null/undefined uchun ishlaydi — .env faylida
  // `ADMIN_SEED_PASSWORD=` deb bo'sh qoldirilsa, qiymat "" (bo'sh satr)
  // bo'ladi, `??` buni tan olmaydi va natijada bo'sh parolli admin
  // yaratilib qolishi mumkin edi. Shuning uchun bo'sh/probel satrlar ham
  // "o'rnatilmagan" deb hisoblanadi.
  const envUsername = process.env.ADMIN_SEED_USERNAME?.trim();
  const envPassword = process.env.ADMIN_SEED_PASSWORD?.trim();
  const username = envUsername || "admin";
  const defaultPassword = envPassword || "Aromato2026!";
  const passwordHash = bcrypt.hashSync(defaultPassword, 10);
  await db.insert(admins).values({
    username,
    passwordHash,
    name: "Aromato Admin",
  });

  console.log(`\n${seedProducts.length} ta mahsulot va 1 ta admin yaratildi.`);
  console.log(`Admin login: ${username} / ${defaultPassword}`);
  console.log("MUHIM: production'da ushbu parolni .env orqali albatta o'zgartiring.");
}

run()
  .catch((err) => {
    console.error("Seed xatosi:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
