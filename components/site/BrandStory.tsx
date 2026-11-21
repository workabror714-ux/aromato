import { BottleArt } from "./BottleArt";
import { BlobShape } from "./BlobShape";

export function BrandStory() {
  return (
    <section id="brend" className="bg-bg-sunken">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-2 md:gap-16">
        <div className="relative order-2 flex items-center justify-center md:order-1">
          <BlobShape className="absolute h-72 w-72 sm:h-80 sm:w-80" fill="var(--gold-soft)" />
          <BottleArt color="#5C3A21" className="relative h-56 w-auto sm:h-64" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Aromato haqida</h2>
          <p className="mt-5 max-w-md leading-relaxed text-ink-muted">
            Aromato — hid orqali hikoya qilish g&rsquo;oyasidan tug&rsquo;ilgan brend. Har bir
            flakon ortida parfyumerlar bilan oylab ishlangan tarkib, sinchkovlik bilan
            tanlangan notalar va his-tuyg&rsquo;ularni uyg&rsquo;otishga qaratilgan maqsad
            turadi.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
            Biz ishonamizki, atir — shunchaki aksessuar emas, balki shaxsning imzosi.
            Shuning uchun har bir kolleksiyamiz cheklangan sonda tayyorlanadi.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <dt className="font-display text-2xl text-ink">12+</dt>
              <dd className="text-sm text-ink-muted">original kompozitsiya</dd>
            </div>
            <div>
              <dt className="font-display text-2xl text-ink">100%</dt>
              <dd className="text-sm text-ink-muted">original tarkib</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
