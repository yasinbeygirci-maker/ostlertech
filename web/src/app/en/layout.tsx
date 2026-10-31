import type { ReactNode } from "react";

// /en altındaki bütün sayfalar İngilizce. Kök düzen (app/layout.tsx) <html lang="tr"> verdiği için burada iki katman var:
// 1) lang="en" kapsayıcısı: erişilebilirlik, yazım denetimi ve CSS uppercase (İ/I) için sunucudan gelen HTML'de de doğru dil;
// 2) küçük betik: <html lang> değerini ilk boyamadan önce "en" yapar.
// Kalıcı çözüm kök düzeni dil gruplarına ayırmaktır (app/(tr), app/en ayrı <html>); bu, klasör taşıma gerektirdiği için ayrı işe bırakıldı.
export default function EnLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" className="contents">
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.lang="en"' }} />
      {children}
    </div>
  );
}
