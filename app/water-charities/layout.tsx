import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Charities & Drinking-Water Assistance Resources",
  description:
    "A neutral resource explaining ways to support clean water access, water testing, and drinking-water transparency. Water Utility Report does not rank, endorse, or verify charities.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://waterutilityreport.com/water-charities" },
};

export default function WaterCharitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
