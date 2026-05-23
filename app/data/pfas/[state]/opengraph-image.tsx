import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { getStatePfasSummary } from "@/lib/data/pfas-state";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const states = await prisma.state.findMany({
    where: {
      utilities: {
        some: { pfas_records: { some: { validated: true, suppressed: false } } },
      },
    },
    select: { slug: true },
  });
  return states.map((s) => ({ state: s.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const data = await getStatePfasSummary(stateSlug);

  const stateName =
    data?.state.name ??
    stateSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const utilitiesTested = data?.utilities_tested ?? 0;
  const aboveMcl = data?.utilities_above_any_mcl ?? 0;
  const year = new Date().getFullYear();

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0F1B2D",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", marginBottom: 24 }}>
          <span
            style={{
              color: "#F59E0B",
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            EPA UCMR 5 Monitoring Data
          </span>
        </div>
        <div style={{ display: "flex", marginBottom: 36 }}>
          <span
            style={{
              color: "white",
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            PFAS in {stateName} Drinking Water
          </span>
        </div>
        <div style={{ display: "flex", gap: 48, marginBottom: 60 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Utilities tested
            </span>
            <span style={{ color: "white", fontSize: 42, fontWeight: 700 }}>
              {utilitiesTested.toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Above EPA MCL
            </span>
            <span
              style={{
                color: aboveMcl > 0 ? "#F59E0B" : "white",
                fontSize: 42,
                fontWeight: 700,
              }}
            >
              {aboveMcl.toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Year
            </span>
            <span style={{ color: "white", fontSize: 42, fontWeight: 700 }}>
              {year}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <span
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 20,
                fontFamily: "monospace",
              }}
            >
              waterutilityreport.com
            </span>
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.35)",
              borderRadius: 100,
              padding: "10px 24px",
            }}
          >
            <span
              style={{
                color: "#F59E0B",
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              EPA UCMR 5
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
