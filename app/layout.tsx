import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Outfit } from "next/font/google";
import { getProfile } from "@/lib/store";
import "./globals.css";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Outfit({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#efeae1",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = getProfile();
  const description = `${profile.name} designs and builds websites, then hosts them. Monthly hosting is set by the studio and billed from a private client account.`;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: `${profile.name} | Websites, built and hosted`, template: `%s | ${profile.name}` },
    description,
    openGraph: { title: profile.name, description, type: "website" },
    twitter: { card: "summary_large_image", title: profile.name, description },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
