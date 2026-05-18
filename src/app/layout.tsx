import type { Metadata } from "next";
import { Syne, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne  = Syne({ subsets: ["latin"], weight: ["400","600","700","800"], variable: "--font-syne", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600"], variable: "--font-inter", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-space", display: "swap" });

export const metadata: Metadata = {
  title: "OffGrid App — Ton impact solaire",
  description: "Suivi CO₂, carte solaire, récompenses et communauté.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${inter.variable} ${space.variable}`}>
      <body className="font-inter bg-forest text-snow antialiased">{children}</body>
    </html>
  );
}
