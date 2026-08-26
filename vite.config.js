import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "/" — сайт на власному субдомені (корінь).
// Якщо колись розміщуватимете у підкаталозі, змініть base на "/шлях/".
export default defineConfig({
  base: "/",
  plugins: [react()],
});
