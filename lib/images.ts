/**
 * Image registry. Every remote photo used on the site lives here or in
 * /data/products.ts so placeholders can be swapped for real campaign
 * photography in one place.
 *
 * All photos are Unsplash placeholders (images.unsplash.com is allowed in
 * next.config.ts → images.remotePatterns).
 */

/** Build a sized Unsplash CDN URL from a photo id like "photo-1610030469983-98e550d6193c". */
export function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export type EditorialImage = {
  src: string;
  alt: string;
};

/** Editorial (non-product) imagery for home, about and contact. */
export const editorial = {
  hero: {
    src: unsplash("photo-1641699862936-be9f49b1c38d", 2000),
    alt: "A woman in a violet silk saree woven with gold, standing against a warm ochre wall",
  },
  heroSecondary: {
    src: unsplash("photo-1588140686379-1b76a52103dc", 1200),
    alt: "Folds of crimson silk with wide gold zari borders",
  },
  categories: {
    sarees: {
      src: unsplash("photo-1617627143750-d86bc21e42bb", 1400),
      alt: "A woman in a coral-red silk saree with a gold zari border, standing between tree trunks",
    },
    kurtis: {
      src: unsplash("photo-1708534246051-7f47b279e94b", 1400),
      alt: "A woman in a wine-red kurta with white chikankari embroidery, seated on the grass",
    },
    pants: {
      src: unsplash("photo-1687825515654-23620796760c", 1400),
      alt: "A woman in olive wide-leg trousers and a white top against a pale grey wall",
    },
  },
  story: {
    src: unsplash("photo-1707978932202-751b08324daf", 1600),
    alt: "Olive silk taking shape on a wooden handloom, lit by a single shaft of light",
  },
  storySecondary: {
    src: unsplash("photo-1727027282611-ced15b0855d0", 1000),
    alt: "Bobbins of dyed yarn in rose, coral and sage lined up along a loom",
  },
  lookbook: [
    {
      src: unsplash("photo-1739429942851-9083ee185d3d", 1400),
      alt: "Lookbook — a printed saree with a violet blouse, walking through a park at golden hour",
    },
    {
      src: unsplash("photo-1708534419572-6e6614a53ca1", 1200),
      alt: "Lookbook — a wine-red chikankari kurta, seated in a city park",
    },
    {
      src: unsplash("photo-1788999422364-8e0ab68e94b3", 1200),
      alt: "Lookbook — a brown tailored jacket with wide-leg trousers in a stone colonnade",
    },
    {
      src: unsplash("photo-1792862288409-6a3dd857bc19", 1200),
      alt: "Lookbook — a blush saree with floral embroidery draped over a cane chair",
    },
    {
      src: unsplash("photo-1763559046515-1b98e82bc6d4", 1400),
      alt: "Lookbook — a maroon paisley kurta with bell sleeves",
    },
    {
      src: unsplash("photo-1784090985575-5704d02f6375", 1200),
      alt: "Lookbook — sage wide-leg trousers, seen from behind beside a vintage van",
    },
  ],
  about: {
    src: unsplash("photo-1640292343595-889db1c8262e", 2000),
    alt: "A weaver at a wooden handloom, working a black-and-white ikat",
  },
  aboutSecondary: {
    src: unsplash("photo-1770572274716-1bae682c48f7", 1200),
    alt: "Hanks of freshly dyed yarn drying on wooden racks",
  },
  contact: {
    src: unsplash("photo-1558769132-cb1aea458c5e", 1600),
    alt: "Linen and knit garments in natural tones on a studio rail beside dried pampas grass",
  },
} satisfies Record<string, EditorialImage | EditorialImage[] | Record<string, EditorialImage>>;
