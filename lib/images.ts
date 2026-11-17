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

/**
 * The same Unsplash photo at another source width. Small slots (the hero
 * ring, thumbnails) use their own width: a smaller download, and a distinct
 * URL from the large product-card copy of the photo.
 */
export function resized(url: string, width: number) {
  if (!/[?&]w=\d+/.test(url)) return url; // uploaded photos (/media/...) have no width to change
  return url.replace(/([?&]w=)\d+/, `$1${width}`);
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
      src: unsplash("photo-1617627143750-d86bc21e42bb", 2000),
      alt: "A woman in a coral-red silk saree with a gold zari border, standing between tree trunks",
    },
    kurtis: {
      src: unsplash("photo-1708534246051-7f47b279e94b", 2000),
      alt: "A woman in a wine-red kurta with white chikankari embroidery, seated on the grass",
    },
    pants: {
      src: unsplash("photo-1687825515654-23620796760c", 2000),
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

/**
 * Catalog / poster photography for the home page (Unsplash License: free for
 * commercial use). Replace with the house's own shoot when it is ready.
 * `tone` is the dominant backdrop colour: the hero's room takes it on.
 */
export type CatalogPhoto = EditorialImage & {
  category: "sarees" | "kurtis" | "pants" | "festive";
  tone: string;
  position?: string;
};

const catalog = (id: string, category: CatalogPhoto["category"], tone: string, alt: string, position?: string): CatalogPhoto => ({
  src: unsplash(id, 1600),
  alt,
  category,
  tone,
  position,
});

/** The hero poster deck, in play order. */
export const posterDeck: CatalogPhoto[] = [
  catalog("photo-1610030469983-98e550d6193c", "sarees", "#7d1820", "A woman in a violet and gold silk saree against a red studio backdrop", "50% 25%"),
  catalog("photo-1773439878514-65d4aeb43046", "kurtis", "#20253a", "A woman in a navy embroidered kurta set with a beige dupatta", "50% 25%"),
  catalog("photo-1617633150878-7df1d12a9a57", "festive", "#5a1419", "A bride in a red and gold lehenga with heavy gold jewellery", "50% 20%"),
  catalog("photo-1768289222419-255b80c65259", "pants", "#8a1e1d", "Red floral wide-leg trousers, a hand resting in the pocket", "50% 40%"),
  catalog("photo-1610030469668-8e9f641aaf27", "sarees", "#7f1a1f", "A woman in a black saree with a silver border against a red backdrop", "50% 25%"),
  catalog("photo-1767785829347-cc13bd969514", "kurtis", "#3a2b21", "A woman in a printed co-ord set posing in a warm arched room", "50% 30%"),
  catalog("photo-1610047614301-13c63f00c032", "festive", "#3d2312", "A bride in red and gold, seated under warm light", "50% 25%"),
  catalog("photo-1768289222438-ee2993148ad2", "pants", "#4e2219", "A woman in a red floral co-ord with wide-leg pants", "50% 25%"),
];

/** The poster wall below the hero: two rows of catalog shots. */
export const posterWall: CatalogPhoto[][] = [
  [
    catalog("photo-1727430228383-aa1fb59db8bf", "sarees", "#c9a27a", "A woman in an orange silk saree by the sea"),
    catalog("photo-1745313452052-0e4e341f326c", "kurtis", "#e9e2d8", "A white floral kurta set in a studio"),
    catalog("photo-1654764746225-e63f5e90facd", "festive", "#2b2b30", "A bride in a red lehenga under carved arches"),
    catalog("photo-1789110520665-f07353f0afbe", "pants", "#f4f1ec", "Red palm-print wide-leg trousers"),
    catalog("photo-1679006831648-7c9ea12e5807", "sarees", "#9fb0a8", "A woman in a teal silk saree with temple jewellery"),
    catalog("photo-1764928947261-f5687e0faa4a", "kurtis", "#c8b89a", "A floral co-ord set with a straw bag among palms"),
    catalog("photo-1610047614256-023d7c028d0b", "festive", "#4a1f16", "A bride in red seated in a carved wooden chair"),
    catalog("photo-1763558978011-55404124a148", "pants", "#e8e2d6", "A printed jumpsuit with a straw hat"),
    catalog("photo-1610189012906-4c0aa9b9781e", "sarees", "#a41c24", "A royal blue and gold saree against red"),
    catalog("photo-1741847639057-b51a25d42892", "kurtis", "#ebe4da", "A pink floral kurta and pants in a studio"),
  ],
  [
    catalog("photo-1610173827043-9db50e0d8ef9", "festive", "#7a1a2a", "A bride in pink and red with henna and gold"),
    catalog("photo-1789110854083-e4752bded644", "pants", "#f4f1ec", "White pinstripe high-waisted trousers"),
    catalog("photo-1610030469668-8e9f641aaf27", "sarees", "#7f1a1f", "A black and silver saree against red"),
    catalog("photo-1762777777819-4d9aa5529368", "kurtis", "#e7e1d8", "A pink floral kurta set with a tie neck"),
    catalog("photo-1697684459863-308b1c497ff2", "festive", "#2a2018", "A bride in red at night under golden lights"),
    catalog("photo-1767077280564-6521b1487d83", "pants", "#d9d3c7", "A blue floral co-ord with wide-leg pants"),
    catalog("photo-1678705730064-a7ecbab4b3fb", "sarees", "#7e1b1c", "A cream and red saree with a jasmine garland"),
    catalog("photo-1777888766898-084641327f1a", "kurtis", "#e6dccf", "A printed kurta under blossoms"),
    catalog("photo-1721324807083-e9ddaa99310e", "festive", "#2c3a2e", "A bride in a red and gold lehenga"),
    catalog("photo-1768478701507-24b1c8de2df0", "pants", "#d8cfc1", "A patterned tunic with wide-leg pants"),
  ],
];
