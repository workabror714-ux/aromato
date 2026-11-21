import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin kirish — Aromato" };
// Ehtiyot chorasi: bu sahifada o'zida dinamik API yo'q, lekin login Server
// Action'i orqali ishlaydi — statik keshlanish xavfidan butunlay xoli bo'lishi
// uchun aniq dinamik qilib belgilandi.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-sunken px-5">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-bg-elevated p-8">
        <p className="font-display text-2xl text-ink">aromato</p>
        <p className="mt-1 mb-6 text-sm text-ink-muted">Admin panelga kirish</p>
        <LoginForm />
      </div>
    </div>
  );
}
