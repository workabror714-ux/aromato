import { Hero } from "@/components/site/Hero";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { BrandStory } from "@/components/site/BrandStory";
import { SignatureHighlight } from "@/components/site/SignatureHighlight";
import { Journal } from "@/components/site/Journal";
import { listFeaturedProducts, getProductBySlug } from "@/db/queries";

export default async function HomePage() {
  const [featured, signature] = await Promise.all([
    listFeaturedProducts(4),
    getProductBySlug("oud-royale"),
  ]);

  return (
    <>
      <Hero />
      <FeaturedGrid products={featured} />
      <BrandStory />
      {signature && <SignatureHighlight product={signature} />}
      <Journal />
    </>
  );
}
