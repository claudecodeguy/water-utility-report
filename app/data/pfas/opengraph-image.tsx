import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            EPA UCMR 5 · 2023–2025
          </span>
        </div>
        <div style={{ display: "flex", marginBottom: 28 }}>
          <span
            style={{
              color: "white",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            PFAS in U.S. Drinking Water
          </span>
        </div>
        <div style={{ display: "flex", marginBottom: 64 }}>
          <span
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 30,
            }}
          >
            State-by-state monitoring data from EPA UCMR 5
          </span>
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
              {year} Data
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
