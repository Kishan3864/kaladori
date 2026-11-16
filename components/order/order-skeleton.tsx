import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("bg-sand motion-safe:animate-pulse", className)} />;
}

/** Layout-matching placeholder while the order loads. */
export function OrderSkeleton() {
  return (
    <section className="shell pb-24 pt-10 md:pb-32 md:pt-16" role="status" aria-busy="true">
      <span className="sr-only">Loading your order</span>
      <Block className="h-3 w-40" />
      <Block className="mt-8 h-10 w-4/5 max-w-xl md:h-14" />
      <Block className="mt-5 h-4 w-3/5 max-w-md" />
      <Block className="mt-12 h-16 w-full max-w-3xl" />
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-16">
        <Block className="h-[28rem] lg:col-span-7" />
        <div className="space-y-6 lg:col-span-5 xl:col-span-4 xl:col-start-9">
          <Block className="h-48" />
          <Block className="h-32" />
        </div>
      </div>
    </section>
  );
}
