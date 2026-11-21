import { requireAdmin } from "@/app/actions/admin";
import { Sidebar } from "@/components/admin/Sidebar";

// Bu segment ostidagi barcha sahifalar (va ularga yo'naltirilgan Server
// Action so'rovlari) doim dinamik render qilinishi SHART: aks holda sahifa
// komponentining o'zida dinamik API chaqiruvi bo'lmagan barglar (masalan,
// "Yangi mahsulot" formasi) build vaqtida statik sifatida keshlanib, keyin
// sessiyasiz holatdagi build-vaqtidagi natija (login'ga redirect) HAR BIR
// so'rov uchun qaytarilib qolishi mumkin edi — bu haqiqiy xavfsizlik va
// funksionallik xatosi bo'lib, aniqlandi va shu qator bilan tuzatildi.
export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
