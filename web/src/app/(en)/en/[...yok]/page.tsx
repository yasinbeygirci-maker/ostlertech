import { notFound } from "next/navigation";

// /en altında eşleşmeyen her adres buraya düşer ve İngilizce 404'ü (en/not-found.tsx, <html lang="en">) çizer.
// Bu dosya olmadan global-not-found.tsx Türkçe 404 veriyordu (Kerem 2026-11-07 #11). Var olan sayfalar önceliklidir.
export default function EnNotFoundCatchAll() {
  notFound();
}
