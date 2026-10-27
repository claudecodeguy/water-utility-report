import {
  KIND_WATER_AFFILIATE_ENABLED,
} from "@/lib/affiliate/kind/kind-products";
import {
  getKindRecommendations,
  type KindRecommendationContext,
} from "@/lib/affiliate/kind/kind-recommendations";
import KindWaterProductCard from "@/components/kind-water-product-card";

interface Props {
  context: KindRecommendationContext;
}

export default function KindWaterRecommendations({ context }: Props) {
  if (!KIND_WATER_AFFILIATE_ENABLED) return null;

  const recommendations = getKindRecommendations(context, true);
  if (recommendations.length === 0) return null;

  return (
    <section
      id="kind-recommendations"
      aria-labelledby="kind-recommendations-heading"
      className="space-y-4"
    >
      <div>
        <h2
          id="kind-recommendations-heading"
          className="mb-2 font-display text-2xl text-foreground"
        >
          Treatment options for detected contaminants
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Based on the official monitoring data shown above, the following treatment options match one or more of the contaminants detected for this utility.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {recommendations.map((item) => (
          <KindWaterProductCard key={item.product.key} recommendation={item} />
        ))}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Affiliate disclosure: Water Utility Report may earn a commission if you purchase through these links. This does not affect the water-quality data or the treatment matching shown on this page.
      </p>
    </section>
  );
}
