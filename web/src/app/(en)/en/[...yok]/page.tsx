import type { Metadata } from "next";
import { notFound } from "next/navigation";

// /en altında eşleşmeyen her adres buraya düşer ve İngilizce 404'ü ((en)/not-found.tsx) çizer.
// Bu dosya olmadan global-not-found.tsx Türkçe 404 veriyordu (Kerem 2026-11-07 #11). Var olan sayfalar önceliklidir.
// Başlık burada da verilir: experimental.globalNotFound açıkken 404 başlığı not-found.tsx'ten değil bu sayfadan okunuyor
// (yoksa sekmede genel EN başlık görünüyordu).
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function EnNotFoundCatchAll() {
  notFound();
}
