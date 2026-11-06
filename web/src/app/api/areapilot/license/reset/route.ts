import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { supabaseLicenseStore } from "@/lib/server/license";
import { confirmDeviceReset, RESET_TOKEN_PATTERN } from "@/lib/license-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex" };

const STYLE =
  "body{font:17px/1.5 system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem;color:#1a1a1a}button{font:inherit;padding:.7rem 1.2rem;border:0;border-radius:.5rem;background:#1a1a1a;color:#fff;cursor:pointer}button:disabled{opacity:.5}";

// Sayfadaki düğme POST eder; belirteç yalnız biçimi doğrulandıktan sonra (43 karakter, güvenli alfabe) gömülür.
const SCRIPT = (token: string) =>
  `var b=document.getElementById("b"),m=document.getElementById("m");b.onclick=function(){b.disabled=true;fetch("/api/areapilot/license/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:${JSON.stringify(token)}})}).then(function(r){return r.json().then(function(j){return{s:r.status,j:j}})}).then(function(x){m.textContent=x.s===200?"Tamam, bilgisayarlar sıfırlandı. / Done.":x.s===410?"Bağlantı geçersiz, kullanılmış ya da süresi dolmuş. Yeni bağlantı iste. / Link invalid or expired.":"Bir hata oldu, sonra tekrar dene. / Something went wrong.";if(x.s!==200)b.disabled=false}).catch(function(){m.textContent="Bağlantı kurulamadı. / Network error.";b.disabled=false})}`;

// E-postadaki bağlantı buraya gelir. GET yalnız onay sayfası gösterir ve işlem YAPMAZ (posta tarayıcıları bağlantıyı önceden açar).
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const valid = RESET_TOKEN_PATTERN.test(token);
  const body = valid
    ? `<p>Bu lisansa kayıtlı tüm bilgisayarların kaydı silinir; lisansı istediğin bilgisayarda yeniden etkinleştirebilirsin. Çizimlerin ve dosyaların etkilenmez.</p><p lang="en">All computers registered to this license will be removed; you can activate it again on any computer.</p><button id="b">Sıfırla / Reset</button><p id="m" role="status"></p><script>${SCRIPT(token)}</script>`
    : `<p>Bağlantı geçersiz. Yeni bir bağlantı iste. / Invalid link.</p>`;
  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer"><title>AreaPilot cihaz sıfırlama</title><style>${STYLE}</style></head><body><h1>AreaPilot: bilgisayarları sıfırla</h1>${body}</body></html>`;
  return new NextResponse(html, { status: valid ? 200 : 400, headers: { ...HEADERS, "Content-Type": "text/html; charset=utf-8" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const result = await confirmDeviceReset(body?.token, supabaseLicenseStore(supabaseAdmin()));
  return NextResponse.json(result.body, { status: result.status, headers: HEADERS });
}
