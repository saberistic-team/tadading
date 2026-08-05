import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getPublicBrand } from "../lib/brand";
import "./globals.css";

const brand = getPublicBrand();

export const metadata: Metadata = {
  title: brand.brandName,
  description: brand.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
