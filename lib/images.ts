/**
 * Image registry. Every remote photo used on the site lives here or in
 * /data/products.ts so placeholders can be swapped for real campaign
 * photography in one place.
 *
 * All photos are Unsplash placeholders (images.unsplash.com is allowed in
 * next.config.ts → images.remotePatterns).
 */

/**
 * Build a sized Unsplash CDN URL from a photo id like "photo-1610030469983-98e550d6193c".
 * `width` is the source next/image resizes from: keep it about twice the
 * largest slot the photo fills (no bigger), so optimisation stays quick.
 */
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
    src: unsplash("photo-1588140686379-1b76a52103dc", 700),
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
    src: unsplash("photo-1569909115134-a0426936c879", 1400),
    alt: "Warp threads in fuchsia, saffron, turquoise and red stretched across a wooden handloom",
  },
  storySecondary: {
    src: unsplash("photo-1727027282611-ced15b0855d0", 1000),
    alt: "Bobbins of dyed yarn in rose, coral and sage lined up along a loom",
  },
  lookbook: [
    {
      src: unsplash("photo-1739429942851-9083ee185d3d", 1300),
      alt: "Lookbook — a printed saree with a violet blouse, walking through a park at golden hour",
    },
    {
      src: unsplash("photo-1708534419572-6e6614a53ca1", 1000),
      alt: "Lookbook — a wine-red chikankari kurta, seated in a city park",
    },
    {
      src: unsplash("photo-1768033976288-9300f5d6f296", 1000),
      alt: "Lookbook — a rose-pink printed kurta and matching wide trousers on a pale stone staircase",
    },
    {
      src: unsplash("photo-1792862288409-6a3dd857bc19", 1300),
      alt: "Lookbook — a blush saree with floral embroidery draped over a cane chair",
    },
    {
      src: unsplash("photo-1763559046515-1b98e82bc6d4", 1100),
      alt: "Lookbook — a maroon paisley kurta with bell sleeves",
    },
    {
      src: unsplash("photo-1673180597733-dafaa1e8b08b", 1000),
      alt: "Lookbook — ivory high-waisted trousers with a black top and a tangerine coat, beside a glass facade",
    },
  ],
  about: {
    src: unsplash("photo-1782232396222-26e60e110927", 1800),
    alt: "A master weaver at a blue-and-orange handloom, golden warp threads fanning out above him",
  },
  aboutSecondary: {
    src: unsplash("photo-1770572274716-1bae682c48f7", 1100),
    alt: "Hanks of freshly dyed yarn drying on wooden racks",
  },
  contact: {
    src: unsplash("photo-1779470703519-05af825e87cd", 1000),
    alt: "Stacks of folded handwoven textiles in red, rose, teal and ochre patterns",
  },
} satisfies Record<string, EditorialImage | EditorialImage[] | Record<string, EditorialImage>>;
