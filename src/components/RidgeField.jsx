import { useMemo } from "react";

/**
 * Фонове поле «гребеневих» контурів для hero.
 * Генерується процедурно (плавні лінії, що закручуються довкола знака).
 */
export default function RidgeField() {
  const lines = useMemo(() => {
    const W = 1200, H = 720, rows = 46, gap = H / rows;
    const cx = 860, cy = 300; // фокус — там, де знак
    const out = [];
    for (let i = 0; i < rows; i++) {
      const y0 = i * gap - 40;
      let d = "";
      for (let x = -40; x <= W + 40; x += 14) {
        const dx = x - cx, dy = y0 - cy;
        const r = Math.sqrt(dx * dx + dy * dy);
        const swirl = Math.sin(r * 0.017 - i * 0.12) * 26 * Math.exp(-r * 0.0016);
        const flow = Math.sin(x * 0.0055 + y0 * 0.018) * 10 + Math.sin(x * 0.013 + i * 0.5) * 5;
        const y = y0 + flow + swirl;
        d += (x === -40 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
      }
      out.push(d);
    }
    return out;
  }, []);

  return (
    <svg className="ridge-field" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ridgeFade" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <mask id="ridgeMask">
          <rect width="1200" height="720" fill="url(#ridgeFade)" />
        </mask>
      </defs>
      <g mask="url(#ridgeMask)">
        {lines.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i % 9 === 4 ? "var(--blue)" : "#7E8C97"}
            strokeOpacity={i % 9 === 4 ? 0.22 : 0.12}
            strokeWidth={i % 9 === 4 ? 1.4 : 1}
          />
        ))}
      </g>
    </svg>
  );
}
