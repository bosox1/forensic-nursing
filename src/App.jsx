import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight, ArrowUpRight, Mail, MapPin, Globe } from "lucide-react";
import Logo from "./components/Logo.jsx";
import RidgeField from "./components/RidgeField.jsx";
import PulseRule from "./components/PulseRule.jsx";
import News from "./components/News.jsx";
import { CONTENT, initials } from "./data/content.js";

const EMAIL = "forensic.nursing@ifnmu.edu.ua"; // TODO: замінити на реальну адресу

export default function App() {
  const [lang, setLang] = useState("uk");
  const [reduced, setReduced] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const t = CONTENT[lang];

  // мова: збереження + <html lang>
  useEffect(() => {
    const saved = localStorage.getItem("fnu-lang");
    if (saved === "uk" || saved === "en") setLang(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("fnu-lang", lang);
  }, [lang]);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const h = (e) => setReduced(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // паралакс від курсора
  useEffect(() => {
    if (reduced) return;
    const hero = heroRef.current;
    if (!hero) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    };
    hero.addEventListener("mousemove", onMove);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  const toggleLang = () => setLang((l) => (l === "uk" ? "en" : "uk"));

  return (
    <div className="root">
      {/* ---------------------------- NAV ---------------------------- */}
      <header className={"nav" + (scrolled ? " solid" : "")}>
        <div className="wrap nav-in">
          <a href="#top" className="brand" onClick={go("top")}>
            <span className="brand-mark"><Logo variant="ink" idp="nav" /></span>
            <span className="brand-txt"><b>Forensic Nursing</b><i>Ukraine</i></span>
          </a>
          <nav className="links">
            {t.nav.map(([label, id]) => (
              <a key={id} href={"#" + id} onClick={go(id)}>{label}</a>
            ))}
            <button className="lang" onClick={toggleLang} aria-label="Switch language">
              <Globe size={15} /> {t.langLabel}
            </button>
            <a href="#kontakt" onClick={go("kontakt")} className="pill">{t.getInvolved}</a>
          </nav>
          <div className="nav-mob">
            <button className="lang" onClick={toggleLang} aria-label="Switch language">
              <Globe size={15} /> {t.langLabel}
            </button>
            <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="drawer">
            {t.nav.map(([label, id]) => (
              <a key={id} href={"#" + id} onClick={go(id)}>{label}</a>
            ))}
            <a href="#kontakt" onClick={go("kontakt")} className="pill">{t.getInvolved}</a>
          </div>
        )}
      </header>

      {/* --------------------------- HERO ---------------------------- */}
      <section id="top" className="hero" ref={heroRef}>
        <RidgeField />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap hero-wrap">
          <div className="hero-copy">
            <div className="eyebrow light"><span className="dot" /> {t.hero.eyebrow}</div>
            <h1>{t.hero.h1a}<br />{t.hero.h1b} <span className="u">{t.hero.hi}</span></h1>
            <p className="lead">{t.hero.lead}</p>
            <div className="hero-cta">
              <a href="#misia" onClick={go("misia")} className="btn primary">
                {t.hero.cta1} <ArrowRight size={18} />
              </a>
              <a href="#partnery" onClick={go("partnery")} className="btn ghost">{t.hero.cta2}</a>
            </div>
            <div className="hero-meta"><span>{t.hero.meta}</span></div>
          </div>

          <div className="hero-mark">
            <div className="mark-parallax">
              <div className="mark-frame">
                <span className="corner tl" /><span className="corner tr" />
                <span className="corner bl" /><span className="corner br" />
                <Logo variant="hero" animated reduced={reduced} idp="hero" />
                <span className="mark-tag">SCAN · ID-2026</span>
              </div>
            </div>
          </div>
        </div>
        <a href="#misia" onClick={go("misia")} className="scrollcue" aria-label={t.hero.scroll}>
          <span /> {t.hero.scroll}
        </a>
      </section>

      <div className="onlight"><div className="wrap"><PulseRule /></div></div>

      {/* -------------------------- МІСІЯ ---------------------------- */}
      <section id="misia" className="sec misia">
        <div className="fp-bg" aria-hidden="true"><Logo variant="ink" idp="bg" /></div>
        <div className="wrap">
          <div className="sec-head reveal"><span className="idx">01</span><span className="kicker">{t.misia.kicker}</span></div>
          <div className="misia-grid">
            <h2 className="reveal statement">
              {t.misia.pre}<span className="u">{t.misia.hi}</span>{t.misia.post}
            </h2>
            <div className="misia-body reveal">
              <p>{t.misia.p1}</p>
              <p>{t.misia.p2}</p>
              <ul className="principles">
                {t.misia.principles.map(([b, s]) => (
                  <li key={b}><b>{b}</b><span>{s}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="onlight"><div className="wrap"><PulseRule /></div></div>

      {/* ------------------------- НАПРЯМИ --------------------------- */}
      <section id="napryamy" className="sec napryamy">
        <div className="wrap">
          <div className="sec-head reveal"><span className="idx">02</span><span className="kicker">{t.napryamy.kicker}</span></div>
          <div className="aims">
            <div className="aims-lead reveal">
              <h2>{t.napryamy.leadA}<br />{t.napryamy.leadB}</h2>
              <p>{t.napryamy.leadP}</p>
            </div>
            <ol className="aims-list">
              {t.napryamy.items.map(([title, d], i) => (
                <li key={title} className="aim reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                  <span className="aim-n">{String(i + 1).padStart(2, "0")}</span>
                  <div className="aim-txt"><h3>{title}</h3><p>{d}</p></div>
                  <ArrowUpRight className="aim-arrow" size={20} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="onlight"><div className="wrap"><PulseRule /></div></div>

      {/* ------------------------- КОМАНДА --------------------------- */}
      <section id="komanda" className="sec komanda">
        <div className="wrap">
          <div className="sec-head reveal"><span className="idx">03</span><span className="kicker">{t.komanda.kicker}</span></div>
          <div className="team-head reveal"><h2>{t.komanda.head}</h2><p className="hint">{t.komanda.hint}</p></div>
          <div className="team-grid">
            {t.komanda.members.map(([name, role, bio], i) => (
              <article key={name} className="member reveal" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                <div className="mono">
                  <svg viewBox="0 0 100 100" className="mono-ridge" aria-hidden="true">
                    {[34, 27, 20].map((r, k) => (
                      <path key={k} d={`M ${50 - r} 62 A ${r} ${r} 0 0 1 ${50 + r} 62`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    ))}
                  </svg>
                  <span className="mono-tx">{initials(name)}</span>
                </div>
                <h3>{name}</h3>
                <p className="role">{role}</p>
                <p className="note">{bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="onlight"><div className="wrap"><PulseRule /></div></div>

      {/* ------------------------ ПАРТНЕРИ --------------------------- */}
      <section id="partnery" className="sec partnery">
        <div className="wrap">
          <div className="sec-head reveal"><span className="idx">04</span><span className="kicker">{t.partnery.kicker}</span></div>
          <div className="team-head reveal"><h2>{t.partnery.head}</h2><p className="hint">{t.partnery.hint}</p></div>
          <div className="logos">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="logo reveal" style={{ transitionDelay: `${i * 45}ms` }} aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>

      <div className="onlight"><div className="wrap"><PulseRule /></div></div>

      {/* ------------------------- НОВИНИ ---------------------------- */}
      <section id="novyny" className="sec novyny">
        <div className="wrap">
          <div className="sec-head reveal"><span className="idx">05</span><span className="kicker">{t.novyny.kicker}</span></div>
          <div className="team-head reveal"><h2>{t.novyny.head}</h2><p className="hint">{t.novyny.hint}</p></div>
          <News t={t.novyny} lang={lang} />
        </div>
      </section>

      {/* ------------------------- КОНТАКТ --------------------------- */}
      <footer id="kontakt" className="foot">
        <div className="wrap foot-wrap">
          <div className="foot-cta reveal">
            <div className="foot-mark"><Logo variant="light" idp="foot" /></div>
            <h2>{t.foot.ctaA}<br />{t.foot.ctaB}</h2>
            <p>{t.foot.ctaP}</p>
            <a href={`mailto:${EMAIL}`} className="btn primary big"><Mail size={18} /> {t.foot.emailBtn}</a>
          </div>
          <div className="foot-cols">
            <div>
              <span className="fh">{t.foot.colProject}</span>
              <a href="#misia" onClick={go("misia")}>{t.nav[0][0]}</a>
              <a href="#napryamy" onClick={go("napryamy")}>{t.nav[1][0]}</a>
              <a href="#komanda" onClick={go("komanda")}>{t.nav[2][0]}</a>
            </div>
            <div>
              <span className="fh">{t.foot.colResources}</span>
              <a href="#partnery" onClick={go("partnery")}>{t.nav[3][0]}</a>
              <a href="#novyny" onClick={go("novyny")}>{t.nav[4][0]}</a>
              <a href="#top" onClick={go("top")}>{t.foot.top}</a>
            </div>
            <div>
              <span className="fh">{t.foot.colContacts}</span>
              <span className="fline"><Mail size={15} /> {EMAIL}</span>
              <span className="fline"><MapPin size={15} /> {t.foot.place}</span>
            </div>
          </div>
        </div>
        <div className="wrap foot-bottom">
          <span>{t.foot.bottom}</span>
          <span className="foot-org">{t.foot.org}</span>
        </div>
      </footer>
    </div>
  );
}
