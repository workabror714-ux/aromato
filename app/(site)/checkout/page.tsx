import { CheckoutForm } from "@/components/site/CheckoutForm";

export const metadata = { title: "Buyurtma berish — Aromato" };
// Sahifaning o'zida dinamik API yo'q (faqat ichidagi Server Action — createOrder
// — bor), shuning uchun build vaqtida statik sifatida keshlanib qolishi mumkin
// edi. Bu holatda checkout formasi POST qilingan Server Action so'rovi
// bajarilmay, keshlangan natija qaytishi ehtimoli bor edi — buyurtmalar
// yaratilmay qolishi mumkin bo'lgan jiddiy xato. Shu uchun aniq dinamik
// qilib belgilandi.
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="mb-8 font-display text-3xl text-ink">Buyurtma berish</h1>
      <CheckoutForm />
    </div>
  );
}
