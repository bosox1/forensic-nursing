import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/** Стрічка новин: підтягує матеріали рубрики з ifnmu.edu.ua через /api/news (Netlify Function). */
export default function News({ t, lang }) {
  const [state, setState] = useState({ status: "loading", items: [], all: "https://www.ifnmu.edu.ua/" });

  useEffect(() => {
    let alive = true;
    fetch("/api/news", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setState({ status: "ok", items: d.items || [], all: d.all || state.all }))
      .catch(() => alive && setState((s) => ({ ...s, status: "ok", items: [] })));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(lang === "uk" ? "uk-UA" : "en-GB", { day: "2-digit", month: "long", year: "numeric" });
    } catch { return ""; }
  };

  if (state.status === "loading") {
    return (
      <div className="news-grid" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="news">
            <div className="sk" style={{ width: "40%", marginBottom: 18 }} />
            <div className="sk sk1" /><div className="sk sk2" /><div className="sk sk3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {state.items.length > 0 ? (
        <div className="news-grid">
          {state.items.map((n) => (
            <a key={n.id} href={n.link} target="_blank" rel="noopener" className="news">
              {n.image && <div className="news-img"><img src={n.image} alt="" loading="lazy" /></div>}
              <div className="news-top"><span className="chip">{t.source}</span></div>
              <time className="news-date" dateTime={n.date}>{fmt(n.date)}</time>
              <h3>{n.title}</h3>
              {n.excerpt && <p className="news-ex">{n.excerpt}</p>}
              <span className="news-link">{t.read} <ArrowRight size={16} /></span>
            </a>
          ))}
        </div>
      ) : (
        <p className="news-empty">{t.empty}</p>
      )}
      <a href={state.all} target="_blank" rel="noopener" className="news-all">
        {t.all} <ArrowUpRight size={16} />
      </a>
    </>
  );
}
