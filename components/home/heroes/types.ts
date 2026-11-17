import type { CatalogPhoto } from "@/lib/images";

/** Optimised <img> attributes from next/image's getImageProps (server-built). */
export type ImgProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
};

export type StoryCollection = {
  slug: string;
  name: string;
  tagline: string;
  copy: string;
  count: number;
  /** Full-bleed campaign photograph for this collection. */
  photo: { src: string; alt: string; position?: string };
  /** The same photograph as ready-made <img> attributes (for variants that slice it). */
  photoImg: ImgProps;
  products: { slug: string; name: string; image: string; price: number }[];
};

export type RingPhoto = { src: string; alt: string };

/** Everything any hero variant may draw on. Built once on the server (./data.ts). */
export type HeroData = {
  collections: StoryCollection[];
  /** Every piece, front view (Hero 01's ring). */
  ring: RingPhoto[];
  /** The campaign hero photograph. */
  heroPhoto: { src: string; alt: string; position?: string; img: ImgProps };
  /** Catalog / poster photography (Hero 05). */
  catalog: {
    deck: CatalogPhoto[];
    wall: CatalogPhoto[][];
    /** Lowest price per category, for "from ₹..." labels. */
    fromPrice: Record<string, number>;
  };
  /** Same-origin texture URLs for the WebGL heroes (optimised by next/image). */
  textures: {
    /** One per product, about 828px wide. */
    products: { url: string; aspect: number }[];
    /** One per collection: every available width, so the client can pick for its screen (up to 3840). */
    landmarks: { candidates: { width: number; url: string }[]; aspect: number }[];
  };
};
