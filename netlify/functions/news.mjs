// Netlify Function: тягне новини потрібної рубрики з офіційного сайту ІФНМУ (WordPress REST API)
// і віддає їх фронтенду в компактному вигляді. Відповідь кешується на CDN Netlify на 30 хв,
// тож сайт ІФНМУ отримує максимум ~2 запити на годину, а відвідувачі — миттєвий відгук.
//
// Налаштування (Netlify → Site configuration → Environment variables), обидва необов'язкові:
//   NEWS_CATEGORY — ID або slug рубрики на ifnmu.edu.ua (наприклад 123 або "forensic-nursing")
//   NEWS_SOURCE   — базова адреса WordPress (за замовчуванням https://www.ifnmu.edu.ua)

const DEFAULT_CATEGORY = "forensic-nursing"; // рубрика «Forensic_nursing» на ifnmu.edu.ua (змінна NEWS_CATEGORY її перекриває)
const PER_PAGE = 6;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", laquo: "«", raquo: "»", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };
const decode = (s = "") =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
const text = (html = "") => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").replace(/\s*\[…\]\s*$/, "…").trim();

const json = (body, status = 200, cacheSeconds = 1800) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Netlify-CDN-Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`,
    },
  });

async function wp(base, path) {
  const res = await fetch(base + "/wp-json/wp/v2/" + path, {
    headers: { Accept: "application/json", "User-Agent": "ForensicNursingUkraine/1.0 (+https://forensicnursing.ifnmu.edu.ua)" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`WP ${res.status} on ${path}`);
  return res.json();
}

export default async () => {
  const base = (process.env.NEWS_SOURCE || "https://www.ifnmu.edu.ua").replace(/\/+$/, "");
  const cat = String(process.env.NEWS_CATEGORY || DEFAULT_CATEGORY).trim();
  if (!cat) return json({ items: [], all: base + "/", note: "NEWS_CATEGORY not set" }, 200, 300);

  try {
    // slug → ID (якщо задано не число)
    let catId = cat, catLink = null;
    const found = await wp(base, /^\d+$/.test(cat) ? `categories/${cat}?_fields=id,link` : `categories?slug=${encodeURIComponent(cat)}&_fields=id,link`);
    const c = Array.isArray(found) ? found[0] : found;
    if (!c?.id) return json({ items: [], all: base + "/", note: "category not found" }, 200, 300);
    catId = c.id;
    catLink = c.link;

    const posts = await wp(
      base,
      `posts?categories=${catId}&per_page=${PER_PAGE}&_embed=wp:featuredmedia&_fields=id,date,link,title,excerpt,_links,_embedded`
    );

    const items = posts.map((p) => {
      const m = p._embedded?.["wp:featuredmedia"]?.[0];
      const sizes = m?.media_details?.sizes || {};
      const img = (sizes.medium_large || sizes.large || sizes.medium || {}).source_url || m?.source_url || null;
      const excerpt = text(p.excerpt?.rendered);
      return {
        id: p.id,
        date: p.date,
        link: p.link,
        title: text(p.title?.rendered),
        excerpt: excerpt.length > 180 ? excerpt.slice(0, 177).replace(/\s+\S*$/, "") + "…" : excerpt,
        image: img,
      };
    });

    return json({ items, all: catLink || base + "/" });
  } catch (e) {
    console.error("[news]", e);
    return json({ items: [], all: base + "/", error: true }, 200, 120);
  }
};

export const config = { path: "/api/news" };
