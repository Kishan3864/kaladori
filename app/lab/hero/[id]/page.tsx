import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getHeroData } from "@/components/home/heroes/data";
import { ACTIVE_HERO, HERO_VARIANTS, HomeHero, heroIds, isHeroId } from "@/components/home/heroes/registry";
import { HomeSections } from "@/components/home/home-sections";
import { cn } from "@/lib/utils";

type LabPageProps = { params: Promise<{ id: string }> };

/** Design lab: never indexed (also disallowed in robots.ts). */
export const metadata: Metadata = {
  title: "Hero lab",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return heroIds.map((id) => ({ id }));
}

/**
 * Preview any saved home hero design on the full home page, without changing
 * the live site. A small switcher at the bottom moves between designs.
 */
export default function HeroLabPage(props: LabPageProps) {
  return (
    <Suspense>
      <HeroLab params={props.params} />
    </Suspense>
  );
}

async function HeroLab({ params }: { params: LabPageProps["params"] }) {
  const { id } = await params;
  if (!isHeroId(id)) notFound();

  return (
    <>
      <HomeHero id={id} data={await getHeroData()} />
      <HomeSections />

      <nav
        aria-label="Hero designs"
        className="fixed bottom-4 left-1/2 z-[60] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full bg-ink/90 p-1 text-[12px] text-ivory shadow-lg backdrop-blur no-scrollbar"
      >
        {heroIds.map((heroId) => (
          <Link
            key={heroId}
            href={`/lab/hero/${heroId}`}
            aria-current={heroId === id ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-full px-3.5 py-2 transition-colors",
              heroId === id ? "bg-ivory text-ink" : "hover:bg-ivory/15",
            )}
          >
            {heroId} {HERO_VARIANTS[heroId].name}
            {heroId === ACTIVE_HERO ? " (live)" : ""}
          </Link>
        ))}
      </nav>
    </>
  );
}
