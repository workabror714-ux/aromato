import { CheckoutForm } from "@/components/site/CheckoutForm";

// Bu sahifaning o'zida dinamik API yo'q — build vaqtida statik keshlanib,
// Server Action (createOrder) so'rovi bajarilmay qolishi xavfi bor edi.
export const dynamic = "force-dynamic";

export default function MiniAppCheckoutPage() {
  return (
    <div className="px-4 py-5">
      <h1 className="mb-5 font-display text-xl text-ink">Buyurtma berish</h1>
      <CheckoutForm source="telegram" orderBasePath="/miniapp/buyurtma" />
    </div>
  );
}
