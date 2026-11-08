import type { Metadata } from "next";
import ProductsView from "@/components/ProductsView";

export const metadata: Metadata = {
  title: "Products",
  description: "OstlerTech apps: SyncPass (Android and Windows), AreaPilot, CornerTab, games (Oklar, Beepout, Packle, Hozeni), SyncSite and SyncDia.",
  alternates: { canonical: "/en/products", languages: { tr: "/products", en: "/en/products" } },
};

export default function ProductsPageEn() {
  return <ProductsView lang="en" />;
}
