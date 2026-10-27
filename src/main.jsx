import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const el = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// У продакшні HTML уже пререндерений (scripts/prerender.mjs) — «оживляємо» його;
// у dev-режимі контейнер порожній — рендеримо з нуля.
if (el.firstElementChild) hydrateRoot(el, app);
else createRoot(el).render(app);
