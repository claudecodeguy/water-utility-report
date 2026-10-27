import assert from "node:assert/strict";
import { accessSync, constants } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { KIND_PRODUCTS, isValidKindAffiliateUrl } from "./kind-products";
import {
  getKindRecommendations,
  type KindContaminantDetection,
  type KindRecommendationContext,
} from "./kind-recommendations";

function detection(
  key: string,
  level: number | null = 1,
  unit: string | null = "mg/L",
  detected = true,
  name = key
): KindContaminantDetection {
  return { key, name, detected, level, unit };
}

function utilityContext(
  detections: readonly KindContaminantDetection[] = [],
  pfasDetected = false
): KindRecommendationContext {
  return {
    pageType: "utility-report",
    pageIdentifier: "example-utility",
    detections,
    pfasDetected,
  };
}

function productKeys(context: KindRecommendationContext, enabled = true): string[] {
  return getKindRecommendations(context, enabled).map(({ product }) => product.key);
}

describe("Kind affiliate configuration", () => {
  it("maps every AWIN destination to its configured Kind product URL", () => {
    assert.equal(KIND_PRODUCTS.length, 8);
    for (const product of KIND_PRODUCTS) {
      assert.equal(isValidKindAffiliateUrl(product), true, product.key);
      const affiliateUrl = new URL(product.affiliateUrl);
      assert.equal(affiliateUrl.searchParams.get("ued"), product.sourceProductUrl);
    }
  });

  it("has a local official hero image for every configured product", () => {
    for (const product of KIND_PRODUCTS) {
      accessSync(resolve(process.cwd(), "public", product.image.replace(/^\//, "")), constants.R_OK);
    }
  });

  it("rejects an AWIN URL whose destination does not match the product", () => {
    const product = KIND_PRODUCTS[0];
    assert.equal(
      isValidKindAffiliateUrl({
        ...product,
        affiliateUrl: product.affiliateUrl.replace(
          encodeURIComponent(product.sourceProductUrl),
          encodeURIComponent(KIND_PRODUCTS[1].sourceProductUrl)
        ),
      }),
      false
    );
  });
});

describe("PRO-RO recommendations", () => {
  it("recommends PRO-RO for detected PFAS", () => {
    assert.deepEqual(productKeys(utilityContext([], true)), ["pro-ro"]);
  });

  it("recommends PRO-RO for detected nitrate", () => {
    assert.deepEqual(productKeys(utilityContext([detection("nitrates")])), ["pro-ro"]);
  });

  it("does not recommend PRO-RO without a supported detection", () => {
    assert.deepEqual(productKeys(utilityContext([detection("arsenic")])), []);
    assert.deepEqual(productKeys(utilityContext([detection("pfas", 0, "ppt", false)])), []);
  });
});

describe("WS-AIO recommendations", () => {
  it("recommends WS-AIO for iron within its ceiling", () => {
    assert.deepEqual(productKeys(utilityContext([detection("iron", 7)])), ["ws-aio"]);
  });

  it("recommends WS-AIO for manganese within its ceiling", () => {
    assert.deepEqual(productKeys(utilityContext([detection("manganese", 1)])), ["ws-aio"]);
  });

  it("suppresses WS-AIO when iron or manganese exceeds its ceiling", () => {
    assert.deepEqual(productKeys(utilityContext([detection("iron", 7.01)])), []);
    assert.deepEqual(productKeys(utilityContext([detection("manganese", 1.01)])), []);
  });

  it("requires comparable measurements for the iron and manganese ceilings", () => {
    assert.deepEqual(productKeys(utilityContext([detection("iron", null)])), []);
    assert.deepEqual(productKeys(utilityContext([detection("manganese", 10, "unknown")])), []);
    assert.deepEqual(
      productKeys(utilityContext([detection("iron-and-manganese", 0.5)])),
      []
    );
  });

  it("enforces hydrogen sulfide and pH restrictions when those values are available", () => {
    assert.deepEqual(
      productKeys(
        utilityContext([
          detection("hydrogen-sulfide", 1),
          detection("ph", 6.5, "pH", true),
          detection("iron", 0.2),
        ])
      ),
      ["ws-aio"]
    );
    assert.deepEqual(
      productKeys(
        utilityContext([
          detection("iron", 0.2),
          detection("ph", 9.51, "pH", true),
        ])
      ),
      []
    );
    assert.deepEqual(
      productKeys(utilityContext([detection("hydrogen-sulfide", 1.01)])),
      []
    );
  });
});

describe("city whole-house recommendations", () => {
  it("uses E-1000 only for explicit chlorine or pesticide detections", () => {
    assert.deepEqual(
      productKeys(utilityContext([detection("chlorine", 0.5, "mg/L", true, "Chlorine")])),
      ["e-1000"]
    );
    assert.deepEqual(
      productKeys(utilityContext([detection("atrazine", 0.01, "mg/L", true, "Atrazine")])),
      ["e-1000"]
    );
    assert.deepEqual(productKeys(utilityContext([detection("vocs")])), []);
    assert.deepEqual(productKeys(utilityContext([detection("chemicals")])), []);
  });

  it("uses E-2000 for measured hardness alone", () => {
    assert.deepEqual(
      productKeys(utilityContext([detection("hardness", 180, "mg/L", true, "Hardness")])),
      ["e-2000"]
    );
  });

  it("uses E-3000 instead of redundant E-1000 and E-2000 for both triggers", () => {
    const recommendations = getKindRecommendations(
      utilityContext([
        detection("chlorine", 0.5, "mg/L", true, "Chlorine"),
        detection("hardness", 180, "mg/L", true, "Hardness"),
      ])
    );
    assert.deepEqual(recommendations.map(({ product }) => product.key), ["e-3000"]);
  });

  it("uses E-3000UV for the combined city trigger only with a microbial detection", () => {
    const recommendations = getKindRecommendations(
      utilityContext([
        detection("chlorine", 0.5, "mg/L", true, "Chlorine"),
        detection("hardness", 180, "mg/L", true, "Hardness"),
        detection("total-coliform", 1, "count", true, "Total coliform"),
      ])
    );
    assert.deepEqual(recommendations.map(({ product }) => product.key), ["e-3000uv"]);
    assert.ok(recommendations[0].triggers.includes("Microbial detection supports UV treatment"));
  });

  it("does not imply UV is necessary when microbial data is absent", () => {
    const recommendations = getKindRecommendations(
      utilityContext([
        detection("chlorine", 0.5, "mg/L", true, "Chlorine"),
        detection("hardness", 180, "mg/L", true, "Hardness"),
      ])
    );
    assert.deepEqual(recommendations.map(({ product }) => product.key), ["e-3000"]);
    assert.equal(recommendations[0].triggers.some((trigger) => trigger.includes("UV")), false);
  });
});

describe("well-water recommendations", () => {
  it("uses WS-6000 only when whole-house filtration and scale context is explicit", () => {
    const context: KindRecommendationContext = {
      pageType: "well-water",
      pageIdentifier: "example-well-guide",
      wellWholeHouseScaleContext: true,
    };
    assert.deepEqual(productKeys(context), ["ws-6000"]);
  });

  it("uses WS-6000UV only when the same context has a microbial detection", () => {
    const context: KindRecommendationContext = {
      pageType: "well-water",
      pageIdentifier: "example-well-guide",
      wellWholeHouseScaleContext: true,
      detections: [detection("e-coli", 1, "count", true, "E. coli")],
    };
    assert.deepEqual(productKeys(context), ["ws-6000uv"]);
  });

  it("does not recommend well systems on a municipal utility report", () => {
    assert.deepEqual(productKeys(utilityContext([detection("hardness")])), ["e-2000"]);
  });
});

describe("feature flag and empty state", () => {
  it("returns no recommendations when the master feature flag is off", () => {
    assert.deepEqual(
      getKindRecommendations(utilityContext([detection("nitrates")]), false),
      []
    );
  });

  it("returns no recommendations when no supported detections exist", () => {
    assert.deepEqual(getKindRecommendations(utilityContext()), []);
  });

  it("supports multiple distinct matches without duplicating products", () => {
    assert.deepEqual(
      productKeys(
        utilityContext([
          detection("pfas", 0.5, "ppt"),
          detection("nitrates", 1),
          detection("chlorine", 0.5, "mg/L", true, "Chlorine"),
        ])
      ),
      ["pro-ro", "e-1000"]
    );
  });
});
