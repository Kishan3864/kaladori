import { HeroPhotoRing } from "./hero-01-photo-ring";
import { HeroPleats } from "./hero-02-pleats";
import { HeroGalleryFlight } from "./hero-03-gallery-flight";
import { HeroCinema } from "./hero-04-cinema";
import { HeroPosterDeck } from "./hero-05-poster-deck";
import type { HeroData } from "./types";

/**
 * Every home hero design ever made, numbered and kept. Nothing is deleted:
 * the client compares them at /lab/hero/<id> and picks which one is live.
 *
 * To apply a design to the home page, change ACTIVE_HERO below.
 * To add a design, create hero-NN-name.tsx and register it here.
 */
export const HERO_VARIANTS = {
  "01": {
    name: "Photo Ring",
    summary: "A ring of product photos turning in 3D; scroll opens each collection full screen.",
    Component: HeroPhotoRing,
  },
  "02": {
    name: "Pleats",
    summary: "Full-screen photo cut into 3D pleats that fold over, one by one, to the next collection.",
    Component: HeroPleats,
  },
  "03": {
    name: "Gallery Flight",
    summary: "WebGL: the camera glides through floating photos to full-screen collection stops; lotus stitches itself.",
    Component: HeroGalleryFlight,
  },
  "04": {
    name: "Cinema",
    summary: "Opening plays like a brand film (cross-fading collection shots, bold logo, player bar); collections pan in 3D.",
    Component: HeroCinema,
  },
  "05": {
    name: "Poster Deck",
    summary: "A 3D deck of catalog posters that page-turn on their own; the room takes each poster's colour; a tilted poster wall below.",
    Component: HeroPosterDeck,
  },
} as const;

export type HeroId = keyof typeof HERO_VARIANTS;

/** The hero shown on the live home page. */
export const ACTIVE_HERO: HeroId = "05";

export const heroIds = Object.keys(HERO_VARIANTS) as HeroId[];

export function isHeroId(value: string): value is HeroId {
  return value in HERO_VARIANTS;
}

export function HomeHero({ id, data }: { id: HeroId; data: HeroData }) {
  const { Component } = HERO_VARIANTS[id];
  return <Component data={data} />;
}
