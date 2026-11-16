import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("bg-sand motion-safe:animate-pulse", className)} />;
}

/** Layout-matching placeholder for the product page while params resolve. */
export function ProductSkeleton() {
  return (
    <div className="pb-20 md:pb-28" role="status" aria-busy="true">
      <span className="sr-only">Loading product</span>

      <div className="shell pt-5 md:pt-8">
        <Block className="h-3 w-48" />
      </div>

      <div className="shell mt-5 md:mt-8 lg:grid lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
        {/* Gallery */}
        <div className="-mx-5 md:-mx-10 lg:col-span-7 lg:mx-0">
          <div className="flex gap-3 overflow-hidden sm:px-5 md:px-10 lg:grid lg:grid-cols-2 lg:px-0 xl:gap-4">
            <Block className="aspect-[4/5] w-full shrink-0 sm:w-[64%] md:w-[58%] lg:col-span-2 lg:w-auto" />
            <Block className="hidden aspect-[4/5] shrink-0 sm:block sm:w-[64%] md:w-[58%] lg:aspect-[3/4] lg:w-auto" />
            <Block className="hidden aspect-[3/4] lg:block" />
          </div>
        </div>

        {/* Info panel */}
        <div className="mt-10 sm:mt-12 lg:col-span-5 lg:mt-0 xl:col-span-4 xl:col-start-9">
          <Block className="h-3 w-20" />
          <Block className="mt-6 h-10 w-11/12 md:h-12" />
          <Block className="mt-3 h-10 w-2/3 md:h-12" />
          <Block className="mt-6 h-5 w-24" />
          <Block className="mt-8 h-4 w-full" />
          <Block className="mt-2.5 h-4 w-4/5" />
          <div className="mt-8 border-t border-line">
            <div className="flex items-center gap-4 border-b border-line py-4">
              <Block className="h-3 w-14" />
              <Block className="h-3 w-28" />
            </div>
            <div className="flex items-center gap-4 border-b border-line py-4">
              <Block className="h-3 w-14" />
              <Block className="h-3 w-40" />
            </div>
          </div>
          <Block className="mt-9 h-3 w-24" />
          <div className="mt-4 grid grid-cols-6 gap-1.5 sm:gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Block key={i} className="h-12" />
            ))}
          </div>
          <div className="mt-8 flex gap-2">
            <Block className="h-[3.25rem] w-[7.5rem]" />
            <div className="h-[3.25rem] flex-1 bg-ink/85" />
          </div>
          <div className="mt-10 border-t border-line">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex h-14 items-center border-b border-line">
                <Block className="h-3 w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
