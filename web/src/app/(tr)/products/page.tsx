import type { Metadata } from "next";
import ProductsView from "@/components/ProductsView";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "OstlerTech uygulamaları: SyncPass (Android ve Windows), AreaPilot, CornerTab, oyunlar (Oklar, Beepout, Packle, Hozeni), SyncSite ve SyncDia.",
  alternates: { canonical: "/products", languages: { tr: "/products", en: "/en/products" } },
};

export default function ProductsPage() {
  return <ProductsView lang="tr" />;
}
