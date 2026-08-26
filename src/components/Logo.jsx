import { LINE_D, RIDGES } from "../data/logo.js";

/**
 * Фірмовий знак. variant: "ink" | "light" | "hero".
 * animated + !reduced → відтворює bloom-анімацію (лінія + гребені).
 */
export default function Logo({ variant = "ink", animated = false, reduced = false, idp = "l" }) {
  const lineC = variant === "hero" ? "var(--blue)" : variant === "light" ? "#C7D0D6" : "var(--ink)";
  const fpC = variant === "hero" ? "#AFBAC2" : variant === "light" ? "#C7D0D6" : "var(--ink)";
  const play = animated && !reduced;

  return (
    <svg viewBox="0 0 406 259" className="logo-svg" role="img" aria-label="Forensic Nursing Ukraine">
      <defs>
        <clipPath id={`clip-${idp}`}>
          <rect className={play ? "line-reveal" : ""} x="-12" y="-10" width={play ? 0 : 330} height="279" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${idp})`}>
        <path d={LINE_D} fill={lineC} />
      </g>
      {play && <circle className="tip-spark" cx="245" cy="150" r="4.5" fill={lineC} />}
      <g>
        {RIDGES.map((r, i) => (
          <path
            key={i}
            d={r.d}
            fill={fpC}
            className={play ? "fp-ridge" : ""}
            style={play ? { animationDelay: r.delay, transformOrigin: r.origin } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
