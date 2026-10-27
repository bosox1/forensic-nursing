// Після збірки рендерить React у статичний HTML і вставляє його в dist/index.html,
// щоб пошуковики й соцмережі бачили весь текст сайту без виконання JavaScript.
// Також оновлює дату в sitemap.xml.
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);

const file = resolve(root, "dist/index.html");
const html = await readFile(file, "utf8");
if (!html.includes("<!--app-html-->")) throw new Error("placeholder <!--app-html--> not found");
await writeFile(file, html.replace("<!--app-html-->", render()));

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  resolve(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://forensicnursing.ifnmu.edu.ua/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
);
await rm(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("prerender: ok");
