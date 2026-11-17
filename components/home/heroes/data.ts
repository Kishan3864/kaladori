import { getImageProps } from "next/image";
import { fromPrice, getProductsByCategory } from "@/lib/catalog";
import { editorial, posterDeck, posterWall, resized, type EditorialImage } from "@/lib/images";
import { getCatalog } from "@/lib/server/catalog";
import type { HeroData, ImgProps } from "./types";

/** Short copy for each collection stage (no long dashes, fits a phone screen). */
const STORY_COPY: Record<string, string> = {
  sarees: "Banarasi silk, Chanderi and handloom cotton, finished by hand to be handed down.",
  kurtis: "Chikankari, block print and fluid silk, cut in clean lines for every day.",
  pants: "Wide-leg linen, pleated palazzos and slim trousers. The pieces everything else is built on.",
};

const CATEGORY_PHOTOS = editorial.categories as Record<string, EditorialImage | undefined>;

/** Full-screen photograph as optimised <img> attributes (same srcset everywhere, so it downloads once). */
function fullBleed(image: EditorialImage): ImgProps {
  const { props } = getImageProps({
    src: image.src,
    alt: "",
    width: 2000,
    height: 1333,
    sizes: "100vw",
    quality: 75,
  });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes, width: props.width, height: props.height };
}

/**
 * WebGL textures come straight from the Unsplash CDN (it sends CORS headers,
 * resizes on the fly and caches at the edge), as WebP. Uploaded photos
 * (/media/...) are same-origin already and used as they are.
 */
function cdnTexture(src: string, width: number) {
  return src.startsWith("/") ? src : `${resized(src, width)}&fm=webp`;
}

/** Everything the home hero variants draw on, built on the server from the live catalogue. */
export async function getHeroData(): Promise<HeroData> {
  const catalog = await getCatalog();
  const { categories, products } = catalog;

  // A category added in the admin has no editorial photo yet: use its first product.
  const photoFor = (slug: string, name: string): EditorialImage => {
    const editorialPhoto = CATEGORY_PHOTOS[slug];
    if (editorialPhoto) return editorialPhoto;
    const first = getProductsByCategory(catalog, slug)[0];
    return { src: first?.images[0] ?? editorial.hero.src, alt: name };
  };

  return {
    collections: categories.map((category) => {
      const items = getProductsByCategory(catalog, category.slug);
      const photo = photoFor(category.slug, category.name);
      return {
        slug: category.slug,
        name: category.name,
        tagline: category.tagline,
        copy: STORY_COPY[category.slug] ?? category.tagline,
        count: items.length,
        photo,
        photoImg: fullBleed(photo),
        products: items
          .slice(0, 3)
          .map((p) => ({ slug: p.slug, name: p.name, image: resized(p.images[0], 240), price: p.price })),
      };
    }),
    ring: products.map((p) => ({ src: resized(p.images[0], 640), alt: p.name })),
    heroPhoto: { ...editorial.hero, position: "50% 28%", img: fullBleed(editorial.hero) },
    catalog: {
      deck: posterDeck,
      wall: posterWall,
      fromPrice: Object.fromEntries(
        categories.flatMap((c) => {
          const price = fromPrice(catalog, c.slug);
          return price === undefined ? [] : [[c.slug, price]];
        }),
      ),
    },
    textures: {
      products: products.map((p) => ({ url: cdnTexture(p.images[0], 800), aspect: 3 / 4 })),
      // Collection photos up to 4K wide, so full-screen stops stay sharp on large displays.
      landmarks: categories.map((category) => {
        const src = photoFor(category.slug, category.name).src;
        return {
          candidates: [1080, 1920, 2560, 3840].map((width) => ({ width, url: cdnTexture(src, width) })),
          aspect: 3 / 2,
        };
      }),
    },
  };
}
