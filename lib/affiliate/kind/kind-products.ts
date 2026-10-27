export type KindProductCategory = "city" | "well" | "drinking-water";

export interface KindProduct {
  key: string;
  model: string;
  title: string;
  sourceProductUrl: string;
  affiliateUrl: string;
  image: string;
  imageSourceUrl: string;
  imageWidth: number;
  imageHeight: number;
  benefits: readonly string[];
  category: KindProductCategory;
  enabled: boolean;
  isUvUpgrade?: boolean;
  maxIronMgL?: number;
  maxManganeseMgL?: number;
  maxHydrogenSulfideMgL?: number;
  minPh?: number;
  maxPh?: number;
}

export const KIND_WATER_AFFILIATE_ENABLED =
  process.env.KIND_WATER_AFFILIATE_ENABLED?.trim().toLowerCase() === "true";

export const KIND_PRODUCTS: readonly KindProduct[] = [
  {
    key: "pro-ro",
    model: "PRO-RO",
    title: "Kind 6-Stage Reverse Osmosis Drinking Water System",
    sourceProductUrl:
      "https://kindwater.com/products/kind-6-stage-reverse-osmosis-drinking-water-system",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fkind-6-stage-reverse-osmosis-drinking-water-system",
    image: "/partners/kind/products/pro-ro.jpg",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/RO-01.jpg?v=1771498723&width=1200",
    imageWidth: 1200,
    imageHeight: 1200,
    benefits: [
      "NSF® certified 6-Stage Reverse Osmosis Drinking Water System",
      "compact under-sink advanced filtration system",
      "remove up to 99% of dangerous contaminants",
    ],
    category: "drinking-water",
    enabled: true,
  },
  {
    key: "ws-aio",
    model: "WS-AIO",
    title: "Smart Metered Chemical-Free Iron, Manganese & Sulfur Filter",
    sourceProductUrl:
      "https://kindwater.com/products/smart-metered-chem-free-iron-manganese-and-sulfur-filter",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fsmart-metered-chem-free-iron-manganese-and-sulfur-filter",
    image: "/partners/kind/products/ws-aio.png",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/1_WS-AIO.png?v=1764023796&width=1200",
    imageWidth: 1200,
    imageHeight: 1200,
    benefits: [
      "smart, chemical-free filtration system",
      "remove iron, manganese, and sulfur",
      "real-time performance monitoring",
    ],
    category: "well",
    enabled: true,
    maxIronMgL: 7,
    maxManganeseMgL: 1,
    maxHydrogenSulfideMgL: 1,
    minPh: 6.5,
    maxPh: 9.5,
  },
  {
    key: "e-1000",
    model: "E-1000",
    title: "Whole House Water Filter",
    sourceProductUrl: "https://kindwater.com/products/whole-house-water-filter",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fwhole-house-water-filter",
    image: "/partners/kind/products/e-1000.jpg",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/1-E-1000.webp?v=1773175057&width=1200",
    imageWidth: 1066,
    imageHeight: 1066,
    benefits: [
      "2-stage system: sediment & carbon",
      "Filters 155+ contaminants including chlorine, pesticides & chemicals",
      "Wall-mounted, no floor space, no tanks",
    ],
    category: "city",
    enabled: true,
  },
  {
    key: "e-2000",
    model: "E-2000",
    title: "Whole House Salt-Free Water Softener",
    sourceProductUrl:
      "https://kindwater.com/products/whole-house-salt-free-water-softener",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fwhole-house-salt-free-water-softener",
    image: "/partners/kind/products/e-2000.jpg",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/1-E-2000_2.webp?v=1773175459&width=1200",
    imageWidth: 1066,
    imageHeight: 1066,
    benefits: [
      "2-stage system: sediment & salt-free softener",
      "Wall-mounted — no floor space, no tanks",
      "NSF® certified parts",
    ],
    category: "city",
    enabled: true,
  },
  {
    key: "e-3000",
    model: "E-3000",
    title: "Whole House Salt-Free Water Softener and Filter Combo",
    sourceProductUrl:
      "https://kindwater.com/products/water-filter-salt-free-softener",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fwater-filter-salt-free-softener",
    image: "/partners/kind/products/e-3000.jpg",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/E-3000_V1.webp?v=1773174397&width=1200",
    imageWidth: 1066,
    imageHeight: 1066,
    benefits: [
      "3-stage system: sediment, carbon & salt-free softener",
      "Filters 155+ contaminants including chlorine, pesticides & chemicals",
      "Wall-mounted — no floor space, no tanks",
    ],
    category: "city",
    enabled: true,
  },
  {
    key: "e-3000uv",
    model: "E-3000UV",
    title: "Whole House Salt-Free Water Softener and Filter Combo with UV",
    sourceProductUrl:
      "https://kindwater.com/products/whole-house-water-filter-and-salt-free-softening-with-uv",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fwhole-house-water-filter-and-salt-free-softening-with-uv",
    image: "/partners/kind/products/e-3000uv.jpg",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/E-3000_UV-V1.webp?v=1773174802&width=1200",
    imageWidth: 1066,
    imageHeight: 1066,
    benefits: [
      "4-stage system: sediment, carbon, salt-free conditioner & UV sterilization",
      "UV lamp sterilizes 99.9% of bacteria, viruses & other microorganisms",
    ],
    category: "city",
    enabled: true,
    isUvUpgrade: true,
  },
  {
    key: "ws-6000",
    model: "WS-6000",
    title: "Whole House Water Filter with Salt-Free Water Softener",
    sourceProductUrl:
      "https://kindwater.com/products/whole-house-water-filter-salt-free-softener-combo",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fwhole-house-water-filter-salt-free-softener-combo",
    image: "/partners/kind/products/ws-6000.png",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/1-WS-6000.png?v=1764021864&width=1200",
    imageWidth: 1200,
    imageHeight: 1200,
    benefits: [
      "high-performance whole-house filtration and salt-free softening system",
      "reduces sediment, chlorine, pesticides, chemical contaminants, and odors",
      "helps prevent scale on pipes, fixtures, and appliances",
    ],
    category: "well",
    enabled: true,
  },
  {
    key: "ws-6000uv",
    model: "WS-6000UV",
    title: "Whole House Water Filter with Salt-Free Water Softener & UV",
    sourceProductUrl:
      "https://kindwater.com/products/whole-house-water-filter-salt-free-softener-combo-with-uv",
    affiliateUrl:
      "https://www.awin1.com/cread.php?awinmid=123784&awinaffid=3130550&ued=https%3A%2F%2Fkindwater.com%2Fproducts%2Fwhole-house-water-filter-salt-free-softener-combo-with-uv",
    image: "/partners/kind/products/ws-6000uv.png",
    imageSourceUrl:
      "https://kindwater.com/cdn/shop/files/1-WS-6000UV.png?v=1764021817&width=1200",
    imageWidth: 1200,
    imageHeight: 1200,
    benefits: [
      "advanced filtration, salt-free softening, and UV purification",
      "reduces sediment, chlorine, pesticides, chemical contaminants, and odors",
      "neutralizes 99.9% of bacteria, viruses, and microorganisms",
    ],
    category: "well",
    enabled: true,
    isUvUpgrade: true,
  },
] as const;

export function isValidKindAffiliateUrl(product: KindProduct): boolean {
  try {
    const url = new URL(product.affiliateUrl);
    return (
      url.hostname === "www.awin1.com" &&
      url.pathname === "/cread.php" &&
      url.searchParams.get("awinmid") === "123784" &&
      url.searchParams.get("awinaffid") === "3130550" &&
      url.searchParams.get("ued") === product.sourceProductUrl
    );
  } catch {
    return false;
  }
}
