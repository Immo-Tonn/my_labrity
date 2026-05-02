🚀 Labrity Web Studio Website

![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

Современный многоязычный сайт веб-студии, разработанный на Next.js, TypeScript и
Tailwind CSS.

Проект представляет веб-студию Labrity и включает:

- главную страницу (презентация студии)
- портфолио
- страницу контактов
- форму с отправкой заявок в Telegram

# 🌐 Live Demo

🚀 Coming soon

(Add production link after deployment)

---

# ✨ Features

✨ Возможности

✔ Мультиязычность (DE / EN / UA) ✔ Полностью адаптивный дизайн ✔ Форма с
валидацией и отправкой в Telegram ✔ Современный UI / UX ✔ Бургер-меню и
переключение языка ✔ SEO-оптимизированная структура ✔ Чистая архитектура проекта
✔ Высокая производительность

# 🛠 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Forms

- React Hook Form

### Code Quality

- ESLint
- Prettier
- Husky (pre-commit hooks)

---

# 📦 Installation

Clone the repository

````bash


Install dependencies

```bash
npm install
````

Run development server

```bash
npm run dev
```

Open in browser

```
http://localhost:3000
```

---

# 🚀 Build

Create production build

```bash
npm run build
```

Run production server

```bash
npm run start
```

---

🛠 Технологии

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Интеграции

- Telegram Bot API (отправка заявок)

Качество кода

- ESLint
- Prettier
- Husky (pre-commit hooks) 📁 Структура проекта (простое объяснение)

src — основной код проекта

│ ├── app — страницы и роутинг (Next.js) │ └── (site) — основная часть сайта │
├── page.tsx — главная страница │ └── contact — страница контактов │ ├──
components — переиспользуемые компоненты │ ├── common — крупные блоки (например
список услуг) │ └── ui — мелкие UI-компоненты (кнопки, модалки, меню) │ ├──
layout — глобальные элементы сайта │ ├── Header — шапка сайта │ └── Footer —
подвал сайта │ ├── api — работа с внешними сервисами │ └── telegram — отправка
формы в Telegram │ ├── data — тексты сайта (по языкам, JSON) │ ├── utils —
вспомогательные функции │ ├── getData — загрузка данных │ ├── classnames —
работа с классами │ └── LanguageContext — переключение языка │ ├── types — общие
типы TypeScript

⸻

🌍 Локализация

Сайт поддерживает 3 языка:

🇩🇪 Немецкий 🇬🇧 Английский 🇺🇦 Украинский

Контент загружается динамически через:

utils/getData.ts

⸻

📱 Адаптивность

Сайт корректно отображается на:

- мобильных устройствах
- планшетах
- десктопах

Используется подход mobile-first.

⸻

🧾 Юридическая информация

Сайт содержит:

- Datenschutz (политика конфиденциальности)
- Impressum (обязательная информация для Германии)

⸻

🧑‍💻 Автор

Разработано Labrity Web Studio

https://labrity.com 🤖 Интеграция формы через Telegram

Форма отправляет заявки напрямую в Telegram-бота.

⸻

1. Создание бота

1. Открыть Telegram
1. Найти @BotFather
1. Ввести:

/start

4. Создать бота:

/newbot

5. Получить BOT TOKEN

⸻

2. Получение Chat ID

Отправить сообщение боту и открыть:

https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates

Найти:

“id”: 123456789

⸻

3. Создание файла .env.local

В корне проекта создать файл:

.env.local

Добавить:

TELEGRAM_BOT_TOKEN=your_bot_token TELEGRAM_CHAT_ID=your_chat_id

⸻

4. Запуск

npm run dev

Открыть:

http://localhost:3000

Теперь заявки будут приходить в Telegram.
