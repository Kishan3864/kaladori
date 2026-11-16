import { Stitch } from "@/components/home/brand-mark";
import { policies, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const promises = [
  {
    title: "Handwoven in India",
    body: "Woven and finished with artisan families in Varanasi, Chanderi, Lucknow, Bagru and Phulia.",
  },
  {
    title: "Natural fibres",
    body: "Silk, cotton and linen, dyed in small lots. Nothing synthetic hidden in the weave.",
  },
  {
    title: "Complimentary shipping",
    body: `Across India on orders over ₹${site.freeShippingThreshold.toLocaleString("en-IN")}, wrapped in muslin, not plastic.`,
  },
  {
    title: `${policies.returnDays}-day returns`,
    body: `Return or exchange full-price pieces within ${policies.returnDays} days of delivery.`,
  },
] as const;

/**
 * The house promises, set in a quiet hairline-ruled row. Shared by the home,
 * shop and product pages so every page ends on the same brand note.
 */
export function BrandPromises({ className }: { className?: string }) {
  return (
    <section aria-label="The KalaDori promise" className={cn("shell", className)}>
      <ul className="grid grid-cols-1 border-t border-line min-[480px]:grid-cols-2 lg:grid-cols-4 lg:border-b">
        {promises.map((promise, i) => (
          <li
            key={promise.title}
            className={cn(
              "flex gap-4 border-b border-line py-7 md:py-9 lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:pr-0",
              i % 2 === 1 && "min-[480px]:border-l min-[480px]:pl-6 lg:pl-7",
              i % 2 === 0 && "min-[480px]:pr-6",
              i > 0 && "lg:border-l",
            )}
          >
            <Stitch className="mt-1 h-3 w-3 text-maroon" />
            <div>
              <h3 className="eyebrow text-ink">{promise.title}</h3>
              <p className="mt-2.5 max-w-[30ch] text-[14px] leading-relaxed text-stone">{promise.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
