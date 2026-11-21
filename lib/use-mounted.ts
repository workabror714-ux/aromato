import { useSyncExternalStore } from "react";

function subscribe() {
  // Hech qachon o'zgarmaydigan "store" — faqat server/client farqini bildirish
  // uchun ishlatiladi, shuning uchun obunachi hech narsa qilmaydi.
  return () => {};
}

/**
 * Komponent client'da hidratsiyadan o'tganini bildiradi (server'da va birinchi
 * client render'da `false`, keyingi render'dan `true`). Zustand'ning
 * localStorage'dan hidratsiyasiga bog'liq UI (savat soni va h.k.) uchun
 * server/client mismatch'ning oldini olish uchun ishlatiladi.
 *
 * `useEffect` ichida `setState` chaqirish o'rniga `useSyncExternalStore`
 * ishlatiladi — bu React hooks lint qoidasi (`set-state-in-effect`) talab
 * qiladigan, qo'shimcha render bosqichisiz to'g'ri yondashuv.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
