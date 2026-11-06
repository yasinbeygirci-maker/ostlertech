import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase-admin";
import { supabaseLicenseStore } from "@/lib/server/license";
import { resetMailer } from "@/lib/server/reset-mail";
import { confirmDeviceReset, RESET_TOKEN_PATTERN } from "@/lib/license-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex" };

const STYLE =
  "body{font:17px/1.5 system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem;color:#1a1a1a}button{font:inherit;padding:.7rem 1.2rem;border:0;border-radius:.5rem;background:#1a1a1a;color:#fff;cursor:pointer}button:disabled{opacity:.5}code{display:block;font-size:1.2rem;padding:.8rem;background:#eee;border-radius:.4rem;user-select:all}";

// Belirteç bağlantının #t=... parçasındadır: sunucuya hiç gitmez, günlüğe/Referer'a düşmez. Sayfa onu okuyup POST eder.
// Yeni lisans kodu yanıttan sonra yalnız bu sayfada, bir kez gösterilir (ayrıca e-postayla da gider).
const SCRIPT = `
var b=document.getElementById("b"),m=document.getElementById("m"),k=document.getElementById("k");
var t=(location.hash.match(/[#&]t=([A-Za-z0-9_-]{43})(?:&|$)/)||[])[1];
try{history.replaceState(null,"",location.pathname)}catch(e){}
if(!t){b.hidden=true;m.textContent="Bağlantı geçersiz. Yeni bir bağlantı iste. / Invalid link."}
b.onclick=function(){b.disabled=true;
fetch("/api/areapilot/license/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})})
.then(function(r){return r.json().then(function(j){return{s:r.status,j:j}})})
.then(function(x){
if(x.s===200){b.hidden=true;m.textContent="Tamam: bilgisayarlar sıfırlandı ve lisans kodun yenilendi. Yeni kodu şimdi kaydet; bu sayfada bir daha gösterilmez (e-postana da gönderildi). / Done. Your new license key is below; it is shown only once (also e-mailed).";k.textContent=x.j.key;k.hidden=false}
else if(x.s===429){b.hidden=true;m.textContent="Bu lisansta 30 günde izin verilen sıfırlama sayısı doldu. Lütfen destek ile iletişime geç: destek@ostlertech.com / Reset limit reached; please contact support."}
else if(x.s===410){b.hidden=true;m.textContent="Bağlantı geçersiz, kullanılmış ya da süresi dolmuş. Yeni bağlantı iste. / Link invalid or expired."}
else{m.textContent="Bir hata oldu, sonra tekrar dene. / Something went wrong.";b.disabled=false}})
.catch(function(){m.textContent="Bağlantı kurulamadı. / Network error.";b.disabled=false})}
`;

// GET yalnız onay sayfası gösterir ve işlem YAPMAZ (posta tarayıcıları bağlantıyı önceden açar).
export async function GET() {
  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer"><title>AreaPilot cihaz sıfırlama</title><style>${STYLE}</style></head><body><h1>AreaPilot: bilgisayarları sıfırla</h1>
<p>Bu lisansa kayıtlı tüm bilgisayarların kaydı silinir ve <strong>lisans kodun yenilenir</strong>: eski kod çalışmaz, yeni kod burada bir kez gösterilir. Çizimlerin ve dosyaların etkilenmez. Lisans başına 30 günde en çok 2 kez yapılabilir.</p>
<p lang="en">All computers registered to this license are removed and your license key is replaced: the old key stops working and the new one is shown here once. Allowed twice per 30 days.</p>
<button id="b">Sıfırla / Reset</button><p id="m" role="status"></p><code id="k" hidden></code><script>${SCRIPT}</script></body></html>`;
  return new NextResponse(html, { status: 200, headers: { ...HEADERS, "Content-Type": "text/html; charset=utf-8" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" && RESET_TOKEN_PATTERN.test(body.token) ? body.token : null;
  const result = await confirmDeviceReset(token, "areapilot", supabaseLicenseStore(supabaseAdmin()), resetMailer);
  return NextResponse.json(result.body, { status: result.status, headers: HEADERS });
}
