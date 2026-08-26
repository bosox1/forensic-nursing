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
| **Новини** | `src/data/content.js` → `novyny.items` (пара `["Категорія", "Заголовок"]`) |
| **Пошта** | `src/App.jsx` → константа `EMAIL` |
| Кольори / шрифт / стилі | `src/index.css` (токени у `:root`) + `tailwind.config.js` |
| Знак і його анімація | `src/components/Logo.jsx`, дані — `src/data/logo.js` |
| Фон hero | `src/components/RidgeField.jsx` |
| Мета-теги, favicon, шрифт | `index.html`, `public/favicon.svg` |

### Новини

Зараз новини — це простий масив у `content.js`. Щоб додати новину, допишіть пару
`["Категорія", "Заголовок"]` у `novyny.items` (окремо для `uk` та `en`).
Коли знадобиться — сюди легко під'єднати підтягування стрічки з офіційного сайту
ІФНМУ (RSS або парсинг): структура даних для цього вже підготовлена.

## Доступність

Анімації вимикаються за `prefers-reduced-motion`, є фокус-стани та семантична розмітка.
