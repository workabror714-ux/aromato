import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Cache Components (PPR) ataylab o'chirilgan: admin sessiyasi, checkout va
  // buyurtma holati sahifalari har bir so'rovda bazadan yangi ma'lumot
  // o'qishi shart — PPR'ning statik qism + keyin to'ldirish modeli bu yerda
  // aniqlikni qurbon qiladi (masalan, eski ombor qoldig'i ko'rsatilib qolishi
  // mumkin). Kichik/o'rta trafikli bu loyiha uchun to'liq dinamik render
  // narxga arzimaydigan murakkablik qo'shmaydi.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
