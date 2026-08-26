import { useState, useEffect, useRef } from "react";

/** Роздільник-пульс, що домальовується під час прокрутки. */
export default function PulseRule() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="rule" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1000 44" preserveAspectRatio="xMidYMid meet" className="rule-svg">
        <path
          className={"rule-path" + (seen ? " in" : "")}
          d="M0 22 H430 l10 -14 l7 28 l11 -33 l9 24 l7 -5 H1000"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
        />
        <circle className={"rule-dot" + (seen ? " in" : "")} cx="474" cy="22" r="3.4" />
      </svg>
    </div>
  );
}
