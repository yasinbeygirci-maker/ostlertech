import type { ReactNode } from "react";

// Küçük Markdown çizicisi: yalnız içerik dosyalarında (src/content/*.md) kullanılan biçimleri bilir:
// # ## ### başlık, paragraf, - ve 1. listeleri, | tablolar |, ``` kod ```, **kalın**, `kod`, [metin](adres), çıplak https adresi.
// Yeni kütüphane yok; metin ham HTML olarak yorumlanmaz (React metni kaçırır). Tablolar yatay kaydırılır.

export type Section = { title: string; body: string };

/** Yorum bloklarını (<!-- ... -->) siler. */
export function stripComments(src: string): string {
  return src.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n/g, "\n");
}

/** "## Başlık" satırlarından bölümlere ayırır; ilk "##"dan önceki metin title="" ile döner. */
export function splitSections(src: string): Section[] {
  const out: Section[] = [];
  let cur: Section = { title: "", body: "" };
  for (const line of stripComments(src).split("\n")) {
    const m = /^##\s+(.*)$/.exec(line);
    if (m) {
      out.push(cur);
      cur = { title: m[1].trim(), body: "" };
    } else cur.body += line + "\n";
  }
  out.push(cur);
  return out.filter((s) => s.title || s.body.trim());
}

export function slug(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const LINK = "text-primary hover:text-primary-light underline underline-offset-2 break-words";

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(https?:\/\/[^\s)<]*[^\s)<,.;:])/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[1]) out.push(<strong key={k} className="font-semibold text-foreground">{inline(m[1].slice(2, -2), k)}</strong>);
    else if (m[2]) out.push(<code key={k} className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">{m[2].slice(1, -1)}</code>);
    else if (m[3]) {
      const mm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(m[3])!;
      const ext = /^https?:/.test(mm[2]);
      out.push(<a key={k} href={mm[2]} className={LINK} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>{mm[1]}</a>);
    } else out.push(<a key={k} href={m[4]} className={LINK} target="_blank" rel="noopener">{m[4]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

type Props = {
  source: string;
  /** [[AD]] biçiminde yalnız başına duran paragraflar için yerine konacak öğeler. */
  tokens?: Record<string, ReactNode>;
  /** Tablo satırında ilk hücre bu metinse satır vurgulanır. */
  highlightRow?: string;
  /** Başlık kimlikleri (içindekiler bağlantıları için). */
  headingIds?: boolean;
  /** Arayüz ipuçlarının dili (tablo kaydırma ipucu, kod bloğu etiketi). */
  lang?: "tr" | "en";
};

export function MiniMarkdown({ source, tokens = {}, highlightRow, headingIds = true, lang = "tr" }: Props) {
  const en = lang === "en";
  const lines = stripComments(source).split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let n = 0;
  const key = () => `b${n++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Kod bloğu
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      blocks.push(
        // Uzun satırlar kesilmesin diye alt satıra sarılır; yine de taşan olursa klavyeyle kaydırılabilir.
        <pre key={key()} tabIndex={0} aria-label={en ? "Code block (scrollable)" : "Kod bloğu (kaydırılabilir)"} className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-line bg-surface p-4 sm:p-5 font-mono text-[14px] leading-relaxed text-foreground">{buf.join("\n")}</pre>,
      );
      continue;
    }

    // Başlık
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      const id = headingIds ? slug(text) : undefined;
      const k = key();
      if (level === 1) blocks.push(<h1 key={k} id={id} className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{inline(text, k)}</h1>);
      else if (level === 2) blocks.push(<h2 key={k} id={id} className="scroll-mt-24 pt-6 text-3xl font-extrabold tracking-tight text-white">{inline(text, k)}</h2>);
      else blocks.push(<h3 key={k} id={id} className="scroll-mt-24 pt-3 text-2xl font-bold text-white">{inline(text, k)}</h3>);
      i++;
      continue;
    }

    // Tablo
    if (line.trimStart().startsWith("|") && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) rows.push(splitRow(lines[i++]));
      const k = key();
      blocks.push(
        <div key={k} className="space-y-2">
        <div className="overflow-x-auto rounded-2xl border border-line" tabIndex={0} role="region" aria-label={en ? "Table (scrolls horizontally)" : "Tablo (yatay kaydırılabilir)"}>
          <table className="w-full text-left text-base" style={{ minWidth: `${Math.max(head.length * 9, 30)}rem` }}>
            <thead className="bg-surface text-white">
              <tr>{head.map((c, ci) => <th key={ci} className={`px-4 py-3 font-semibold align-bottom ${ci === 0 ? "sticky left-0 z-10 bg-surface" : ""}`}>{inline(c, `${k}h${ci}`)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r, ri) => (
                <tr key={ri} className={highlightRow && r[0] === highlightRow ? "bg-primary/5" : ""}>
                  {r.map((c, ci) => (
                    <td key={ci} className={`px-4 py-3 align-top leading-relaxed ${ci === 0 ? "sticky left-0 z-10 bg-background font-semibold text-white" : "text-muted"}`}>{inline(c, `${k}r${ri}c${ci}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted" aria-hidden="true">{en ? "Swipe sideways to see all columns." : "Tüm sütunları görmek için yana kaydır."}</p>
        </div>,
      );
      continue;
    }

    // Liste
    const li = /^(\s*)(-|\d+\.)\s+(.*)$/.exec(line);
    if (li) {
      const ordered = li[2] !== "-";
      const items: string[] = [];
      while (i < lines.length) {
        const m = /^(\s*)(-|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (m && (m[2] === "-") === !ordered) { items.push(m[3]); i++; continue; }
        if (items.length && /^\s{2,}\S/.test(lines[i])) { items[items.length - 1] += " " + lines[i].trim(); i++; continue; }
        break;
      }
      const k = key();
      const cls = `${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2 text-lg leading-relaxed text-muted marker:text-muted`;
      const kids = items.map((t, ti) => <li key={ti}>{inline(t, `${k}i${ti}`)}</li>);
      blocks.push(ordered ? <ol key={k} className={cls}>{kids}</ol> : <ul key={k} className={cls}>{kids}</ul>);
      continue;
    }

    // Paragraf
    const buf: string[] = [];
    while (
      i < lines.length && lines[i].trim() && !lines[i].startsWith("```") && !/^#{1,4}\s/.test(lines[i]) &&
      !/^(\s*)(-|\d+\.)\s+/.test(lines[i]) && !lines[i].trimStart().startsWith("|")
    ) buf.push(lines[i++].trim());
    const text = buf.join(" ");
    const k = key();
    const tk = [...text.matchAll(/\[\[([A-Z0-9_]+)\]\]/g)];
    if (tk.length && text.replace(/\[\[[A-Z0-9_]+\]\]/g, "").trim() === "") {
      blocks.push(<div key={k} className="flex flex-wrap gap-3 pt-2">{tk.map((t) => <span key={t[1]}>{tokens[t[1]]}</span>)}</div>);
    } else {
      blocks.push(<p key={k} className="text-lg leading-relaxed text-muted">{inline(text, k)}</p>);
    }
  }
  return <div className="space-y-5">{blocks}</div>;
}
