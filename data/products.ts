import { unsplash } from "@/lib/images";

export type Category = "sarees" | "kurtis" | "pants";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Price in whole INR. */
  price: number;
  /** Optional original price in whole INR, shown struck through. */
  compareAtPrice?: number;
  colour: string;
  /** Swatch colour for the UI. */
  colourHex: string;
  fabric: string;
  /** One-line editorial summary for cards and meta descriptions. */
  summary: string;
  /** Longer product description (1–2 short paragraphs). */
  description: string;
  details: string[];
  care: string[];
  sizes: string[];
  /** At least three images: [front, alternate, detail]. */
  images: string[];
  isNew?: boolean;
  /** Short badge such as "Limited" or "Handloom". */
  badge?: string;
};

export type CategoryInfo = {
  slug: Category;
  name: string;
  /** Short line for tiles and filters. */
  tagline: string;
  description: string;
};

export const categories: CategoryInfo[] = [
  {
    slug: "sarees",
    name: "Sarees",
    tagline: "Six yards of heritage",
    description:
      "Banarasi silks, Chanderi and handloom cottons — finished by hand and made to be handed down.",
  },
  {
    slug: "kurtis",
    name: "Kurtis",
    tagline: "Light on the skin",
    description:
      "Chikankari, block print and fluid silk, cut in clean modern lines for the working week and beyond.",
  },
  {
    slug: "pants",
    name: "Pants",
    tagline: "The quiet foundation",
    description:
      "Wide-leg linens, pleated palazzos and slim cigarette trousers — the pieces everything else is built on.",
  },
];

const SAREE_SIZES = ["One Size"];
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SAREE_CARE = [
  "Dry clean only",
  "Store folded in muslin, away from direct light",
  "Refold along new lines every few months to protect the zari",
];
const COTTON_CARE = [
  "Gentle hand wash in cold water",
  "Wash dark colours separately",
  "Dry in shade; warm iron on the reverse",
];
const SILK_CARE = ["Dry clean recommended", "Steam to release creases", "Store on a padded hanger"];
const LINEN_CARE = [
  "Machine wash cold on a delicate cycle",
  "Line dry in shade",
  "Iron while slightly damp for a crisp finish",
];

export const products: Product[] = [
  // ——— Sarees ———
  {
    slug: "kesar-banarasi-silk-saree",
    name: "Kesar Banarasi Silk Saree",
    category: "sarees",
    price: 18900,
    colour: "Saffron Gold",
    colourHex: "#C8862B",
    fabric: "Pure Katan silk with real zari",
    summary: "Saffron Katan silk with a hand-woven gold zari border and pallu.",
    description:
      "Woven on a traditional pit loom in Varanasi over nineteen days, Kesar carries a deep saffron ground and an unbroken zari border inspired by temple architecture. The pallu opens into a field of small kalga motifs that catch the light as you move.",
    details: [
      "5.5 m saree with 0.8 m unstitched blouse piece",
      "Pure Katan silk, real zari brocade",
      "Hand-woven on a pit loom in Varanasi",
      "Silk Mark certified",
    ],
    care: SAREE_CARE,
    sizes: SAREE_SIZES,
    images: [
      unsplash("photo-1597897569252-9df44c7de0db", 1400),
      unsplash("photo-1588140686379-1b76a52103dc", 1400),
      unsplash("photo-1768341395956-fed92f537228", 1400),
    ],
    isNew: true,
    badge: "Handloom",
  },
  {
    slug: "noor-chanderi-saree",
    name: "Noor Chanderi Saree",
    category: "sarees",
    price: 9800,
    colour: "Ivory",
    colourHex: "#EFE6D6",
    fabric: "Chanderi silk-cotton",
    summary: "Featherlight ivory Chanderi with a fine gold buta and slim border.",
    description:
      "Noor is all air and light — a sheer silk-cotton Chanderi scattered with tiny gold butis and finished with a restrained tissue border. It drapes softly and weighs almost nothing, made for long days and warm evenings.",
    details: [
      "5.5 m saree with 0.8 m unstitched blouse piece",
      "Silk-cotton Chanderi with zari buti",
      "Woven in Chanderi, Madhya Pradesh",
      "Sheer, lightweight weave",
    ],
    care: SAREE_CARE,
    sizes: SAREE_SIZES,
    images: [
      unsplash("photo-1756483496981-05b741fdd40a", 1400),
      unsplash("photo-1678705730064-a7ecbab4b3fb", 1400),
      unsplash("photo-1787295779668-6ad1171580ff", 1400),
    ],
    isNew: true,
  },
  {
    slug: "raat-rani-organza-saree",
    name: "Raat Rani Organza Saree",
    category: "sarees",
    price: 12400,
    colour: "Midnight Ink",
    colourHex: "#1F2230",
    fabric: "Silk organza with hand embroidery",
    summary: "Midnight silk organza, hand-embroidered with night-blooming jasmine.",
    description:
      "Named for the jasmine that only opens after dark, Raat Rani pairs a crisp midnight organza with clusters of hand-embroidered florals in ivory resham. Each piece takes an artisan close to a week to complete.",
    details: [
      "5.5 m saree with 0.8 m unstitched blouse piece",
      "Pure silk organza, resham thread embroidery",
      "Hand-embroidered in Lucknow",
      "Scalloped, hand-finished edge",
    ],
    care: SAREE_CARE,
    sizes: SAREE_SIZES,
    images: [
      unsplash("photo-1610030469668-8e9f641aaf27", 1400),
      unsplash("photo-1610030469983-98e550d6193c", 1400),
      unsplash("photo-1776005395798-9fc7c1c50e95", 1400),
    ],
    badge: "Limited",
  },
  {
    slug: "gulmohar-handloom-cotton-saree",
    name: "Gulmohar Handloom Cotton Saree",
    category: "sarees",
    price: 6200,
    compareAtPrice: 7400,
    colour: "Gulmohar Red",
    colourHex: "#A2284E",
    fabric: "Handloom mul cotton",
    summary: "Breathable handloom cotton in a deep flame-tree red with a woven stripe.",
    description:
      "An everyday saree with real presence. Gulmohar is woven in soft mul cotton and dyed the deep red of the flame tree in bloom, with a contrast temple border that softens beautifully with every wash.",
    details: [
      "5.5 m saree with 0.8 m unstitched blouse piece",
      "100% handloom mul cotton",
      "Woven in Phulia, West Bengal",
      "Azo-free dyes",
    ],
    care: COTTON_CARE,
    sizes: SAREE_SIZES,
    images: [
      unsplash("photo-1742287724816-4a8a1cc7ad5c", 1400),
      unsplash("photo-1628477116196-48afe0d209e0", 1400),
      unsplash("photo-1717586756136-d9a3eeb1fa6f", 1400),
    ],
  },

  // ——— Kurtis ———
  {
    slug: "ada-chikankari-kurti",
    name: "Ada Chikankari Kurti",
    category: "kurtis",
    price: 4600,
    colour: "Ivory",
    colourHex: "#F1EADF",
    fabric: "Cotton mulmul",
    summary: "Soft ivory mulmul, hand-embroidered in shadow-work chikankari.",
    description:
      "Ada is cut straight and long from the softest cotton mulmul, then hand-embroidered in Lucknow with delicate shadow-work vines. Side slits and a slim mandarin collar keep it clean and modern.",
    details: [
      "Straight fit, falls below the knee",
      "Mandarin collar, concealed placket",
      "Hand chikankari embroidery",
      "Model is 5'8\" and wears size S",
    ],
    care: COTTON_CARE,
    sizes: APPAREL_SIZES,
    images: [
      unsplash("photo-1667665970124-2273c6ef3489", 1400),
      unsplash("photo-1667665970118-f55705003914", 1400),
      unsplash("photo-1745313452052-0e4e341f326c", 1400),
    ],
    isNew: true,
  },
  {
    slug: "neel-block-printed-kurti",
    name: "Neel Block-Printed Kurti",
    category: "kurtis",
    price: 3400,
    colour: "Indigo",
    colourHex: "#2E3F66",
    fabric: "Hand block-printed cotton",
    summary: "Natural indigo cotton, hand block-printed with a small leaf motif.",
    description:
      "Printed by hand in Bagru with carved teak blocks and dyed in natural indigo, Neel has the gentle irregularity only real craft can give. An easy A-line shape with three-quarter sleeves.",
    details: [
      "Relaxed A-line fit, knee length",
      "Round neck with front keyhole",
      "Hand block-printed in Bagru, Rajasthan",
      "Natural indigo dye",
    ],
    care: COTTON_CARE,
    sizes: APPAREL_SIZES,
    images: [
      unsplash("photo-1764740185240-58527413f572", 1400),
      unsplash("photo-1766994063823-ed214f883548", 1400),
      unsplash("photo-1783762774159-b0c266382e2f", 1400),
    ],
  },
  {
    slug: "gulabi-silk-a-line-kurti",
    name: "Gulabi Silk A-Line Kurti",
    category: "kurtis",
    price: 5800,
    colour: "Rose",
    colourHex: "#DE7B9C",
    fabric: "Mulberry silk",
    summary: "A fluid rose-pink silk kurti with a subtle self-woven stripe.",
    description:
      "Gulabi moves like water. Cut on a generous A-line from mulberry silk with a tonal woven stripe, it is finished with covered buttons at the cuff and a softly gathered back yoke.",
    details: [
      "Flared A-line fit, calf length",
      "V-neck, covered-button cuffs",
      "Pure mulberry silk, self stripe",
      "Fully lined in cotton voile",
    ],
    care: SILK_CARE,
    sizes: APPAREL_SIZES,
    images: [
      unsplash("photo-1741847639057-b51a25d42892", 1400),
      unsplash("photo-1762777777819-4d9aa5529368", 1400),
      unsplash("photo-1693990152130-e26786cc6160", 1400),
    ],
    isNew: true,
  },
  {
    slug: "reti-linen-tunic-kurti",
    name: "Reti Linen Tunic Kurti",
    category: "kurtis",
    price: 3900,
    colour: "Desert Sand",
    colourHex: "#D8C6AE",
    fabric: "Washed European linen",
    summary: "A relaxed tunic in washed sand linen, cut short for trousers.",
    description:
      "Reti is our answer to the perfect warm-weather layer: a hip-length tunic in garment-washed linen with deep side pockets and a band collar. Wear it with the Wide-Leg Linen Trouser for an easy tonal look.",
    details: [
      "Relaxed fit, hip length",
      "Band collar, side seam pockets",
      "Garment-washed for softness",
      "Pairs with the Wide-Leg Linen Trouser",
    ],
    care: LINEN_CARE,
    sizes: APPAREL_SIZES,
    // [1] is the look styled with the Wide-Leg Linen Trouser (it is also that
    // trouser's lead image), so it sits in the "alternate view" slot rather
    // than being labelled as a fabric detail. TODO: a dedicated linen detail shot.
    images: [
      unsplash("photo-1733209593218-87dc1bbe4927", 1400),
      unsplash("photo-1789110853687-71692f0e86be", 1400),
      unsplash("photo-1764298493197-a1c1cce57800", 1400),
    ],
  },

  // ——— Pants ———
  {
    slug: "wide-leg-linen-trouser",
    name: "Wide-Leg Linen Trouser",
    category: "pants",
    price: 3200,
    colour: "Sand",
    colourHex: "#D9C9B3",
    fabric: "Washed linen",
    summary: "High-rise, wide-leg trousers in washed linen with a soft pleat.",
    description:
      "A high-waisted, generously cut trouser in washed linen with a single front pleat and an elasticated back waist for comfort. It falls long and straight, skimming the floor with a flat.",
    details: [
      "High rise, wide leg, full length",
      "Single front pleat, side pockets",
      "Flat front waistband, elasticated back",
      "Inside leg 31\" (size S)",
    ],
    care: LINEN_CARE,
    sizes: APPAREL_SIZES,
    images: [
      unsplash("photo-1789110853687-71692f0e86be", 1400),
      unsplash("photo-1780396378407-07411c56389c", 1400),
      unsplash("photo-1789110520148-bb52ba37759b", 1400),
    ],
    isNew: true,
  },
  {
    slug: "pleated-silk-palazzo",
    name: "Pleated Silk Palazzo",
    category: "pants",
    price: 4200,
    colour: "Maroon",
    colourHex: "#841F3F",
    fabric: "Silk crepe",
    summary: "Fluid maroon silk-crepe palazzos with deep knife pleats.",
    description:
      "Designed to be worn with our silk kurtis or simply with a fine knit, these palazzos are cut from weighty silk crepe and pressed into deep knife pleats that swing as you walk.",
    details: [
      "Mid rise, extra-wide leg",
      "Knife pleats, concealed side zip",
      "Silk crepe, half lined",
      "Inside leg 30\" (size S)",
    ],
    care: SILK_CARE,
    sizes: APPAREL_SIZES,
    images: [
      unsplash("photo-1790384073746-e950643afb60", 1400),
      unsplash("photo-1790384071619-de00d80547ac", 1400),
      unsplash("photo-1789110854331-6d3cabfef781", 1400),
    ],
  },
  {
    slug: "everyday-straight-pant",
    name: "Everyday Straight Pant",
    category: "pants",
    price: 2600,
    colour: "Ivory",
    colourHex: "#EFE7DA",
    fabric: "Cotton twill",
    summary: "A clean straight-leg pant in soft cotton twill — the everyday staple.",
    description:
      "The pant we reach for most. Mid-rise and straight through the leg in a soft, substantial cotton twill, with a flat front, welt back pockets and an ankle length that works with everything from sandals to kolhapuris.",
    details: [
      "Mid rise, straight leg, ankle length",
      "Flat front, welt back pockets",
      "Soft cotton twill with a little stretch",
      "Inside leg 27\" (size S)",
    ],
    care: COTTON_CARE,
    sizes: APPAREL_SIZES,
    images: [
      unsplash("photo-1673180608353-63292b332e84", 1400),
      unsplash("photo-1632282005753-29f80ed13c93", 1400),
      unsplash("photo-1789110854083-e4752bded644", 1400),
    ],
  },
  {
    slug: "ink-cigarette-trouser",
    name: "Ink Cigarette Trouser",
    category: "pants",
    price: 2900,
    compareAtPrice: 3400,
    colour: "Ink",
    colourHex: "#1A1A1A",
    fabric: "Cotton-viscose suiting",
    summary: "A slim, sharp cigarette trouser in deep ink suiting.",
    description:
      "Slim, cropped and impeccably straight, this is the trouser that sharpens a flowing kurti. Cut in a soft cotton-viscose suiting with a pressed crease and a discreet side zip.",
    details: [
      "Mid rise, slim leg, cropped",
      "Pressed front crease, side zip",
      "Cotton-viscose suiting",
      "Inside leg 26\" (size S)",
    ],
    care: COTTON_CARE,
    sizes: APPAREL_SIZES,
    images: [
      unsplash("photo-1789110519554-bdca2e4549e5", 1400),
      unsplash("photo-1732588958740-3f70bc2dcd13", 1400),
      unsplash("photo-1604136172384-b2e9c43271ec", 1400),
    ],
  },
];

// ——— Helpers ———

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Category) {
  return products.filter((p) => p.category === category);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function isCategory(value: string | null | undefined): value is Category {
  return value === "sarees" || value === "kurtis" || value === "pants";
}

/** Products flagged as new, in catalogue order. */
export function getNewArrivals(limit = 4) {
  return products.filter((p) => p.isNew).slice(0, limit);
}

/** The category whose pieces are most naturally worn with each category. */
const COMPLEMENT: Record<Category, Category> = {
  sarees: "kurtis",
  kurtis: "pants",
  pants: "kurtis",
};

/**
 * Same-category products first, then the complementary category (a kurti
 * page ends with a trouser, a trouser page with a kurti), then the rest.
 * Excludes the given slug.
 */
export function getRelatedProducts(slug: string, limit = 4) {
  const current = getProduct(slug);
  if (!current) return products.slice(0, limit);
  const complement = COMPLEMENT[current.category];
  const same = products.filter((p) => p.category === current.category && p.slug !== slug);
  const paired = products.filter((p) => p.category === complement);
  const rest = products.filter((p) => p.category !== current.category && p.category !== complement);
  return [...same, ...paired, ...rest].slice(0, limit);
}
