import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Water Utility Report — U.S. Drinking Water Quality Directory",
    template: "%s | Water Utility Report",
  },
  description:
    "Find your water utility, understand key contaminants, and discover treatment options. Built from official EPA and public data sources.",
  metadataBase: new URL("https://waterutilityreport.com"),
  openGraph: {
    siteName: "Water Utility Report",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-SX34LEVQZ1" />
    </html>
  );
}
