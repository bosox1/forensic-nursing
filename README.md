# Forensic Nursing Ukraine

Односторінковий сайт проєкту (ІФНМУ). Стек: **React 18 + Vite + Tailwind**.
Двомовний (українська / англійська), знак і анімація — з фірмового SVG.

## Запуск локально

```bash
npm install
npm run dev      # http://localhost:5173
```

## Збірка

```bash
npm run build    # у папку dist/
npm run preview  # локальний перегляд зібраного
```

## Деплой на Netlify

Репозиторій уже містить `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Достатньо під'єднати Git-репозиторій до Netlify — решта підхопиться автоматично.
Для субдомену ІФНМУ додайте його в Netlify → Domain settings і пропишіть DNS
(CNAME на Netlify) на боці домену університету.

## Де що редагувати

| Що | Файл |
|----|------|
| **Усі тексти (UA + EN)** | `src/data/content.js` |
| **Команда** (імена, ролі, описи) | `src/data/content.js` → `komanda.members` |
| **Новини** | автоматично з ifnmu.edu.ua — див. розділ «Новини» нижче |
| **Пошта** | `src/App.jsx` → константа `EMAIL` |
| Кольори / шрифт / стилі | `src/index.css` (токени у `:root`) + `tailwind.config.js` |
| Знак і його анімація | `src/components/Logo.jsx`, дані — `src/data/logo.js` |
| Фон hero | `src/components/RidgeField.jsx` |
| Мета-теги, favicon, шрифт | `index.html`, `public/favicon.svg` |

### Новини

Новини підтягуються автоматично з рубрики на **ifnmu.edu.ua** (WordPress REST API)
через Netlify Function `netlify/functions/news.mjs` → адреса `/api/news`.
Відповідь кешується на CDN Netlify на 30 хв.

Яку рубрику брати — задається змінною середовища в Netlify
(**Site configuration → Environment variables**):

| Змінна | Значення |
|--------|----------|
| `NEWS_CATEGORY` | ID або slug рубрики (напр. `123` чи `forensic-nursing`) |
| `NEWS_SOURCE` | необов'язково, за замовчуванням `https://www.ifnmu.edu.ua` |

Після зміни змінної — **Deploys → Trigger deploy**. Якщо рубрика не задана або сайт
ІФНМУ недоступний, секція показує «Новини скоро з'являться» і посилання на сайт ІФНМУ.
У `npm run dev` функції немає — там завжди буде цей запасний стан (для повної перевірки: `netlify dev`).

## SEO

- `npm run build` пререндерить сторінку в статичний HTML (`scripts/prerender.mjs`) —
  пошуковики бачать увесь текст без JavaScript; генерує `sitemap.xml`.
- `public/robots.txt`, canonical, Open Graph (`og-image.jpg` 1200×630), JSON-LD (Organization + WebSite)
  — у `index.html`.

## Доступність

Анімації вимикаються за `prefers-reduced-motion`, є фокус-стани та семантична розмітка.
