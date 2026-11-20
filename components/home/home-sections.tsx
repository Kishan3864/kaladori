import { BrandPromises } from "@/components/home/brand-promises";
import { CraftStatement } from "@/components/home/craft-statement";
import { HowToOrder } from "@/components/home/how-to-order";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Newsletter } from "@/components/home/newsletter";

/** Everything on the home page below the hero (shared by the live page and the hero lab). */
export function HomeSections() {
  return (
    <>
      <HowToOrder />
      <BrandPromises className="pt-12 md:pt-16" />
      <NewArrivals />
      <CraftStatement />
      <Newsletter />
    </>
  );
}
