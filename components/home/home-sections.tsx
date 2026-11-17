import { BrandPromises } from "@/components/home/brand-promises";
import { CraftStatement } from "@/components/home/craft-statement";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Newsletter } from "@/components/home/newsletter";

/** Everything on the home page below the hero (shared by the live page and the hero lab). */
export function HomeSections() {
  return (
    <>
      <BrandPromises className="pt-16 md:pt-24" />
      <NewArrivals />
      <CraftStatement />
      <Newsletter />
    </>
  );
}
