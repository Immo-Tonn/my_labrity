# 💆 Massage Studio Landing Page

![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

Modern **multilingual landing page** for a massage studio built with **Next.js,
TypeScript and Tailwind CSS**.

The website presents massage services, allows users to contact the studio
through a form and includes required legal sections such as **Datenschutz** and
**Impressum**.

---

# 🌐 Live Demo

🚀 Coming soon

(Add production link after deployment)

---

# ✨ Features

✔ Multilingual website (DE / EN / UA)  
✔ Responsive design (mobile / tablet / desktop)  
✔ Contact form with validation  
✔ Modern UI and smooth UX  
✔ Datenschutz & Impressum modals  
✔ Clean component architecture  
✔ SEO-friendly structure  
✔ Optimized performance

---

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

# 📁 Project Structure

```

|-- public -> static files
|-- src -> source directory with the main application code
  |-- actions -> asynchronous functions that are executed on the server
  |-- app -> pages and routing
    |-- / --> routing group for main UI

  |-- components -> folder with reusable components
    |-- common -> base sections/block components (accordion, form, slider, etc.)
    |-- ui -> small reusable components (button, modal, etc.)
      |-- NameComponent -> folders for each component
        |-- NameComponent.tsx -> main component
        |-- NameComponent.module.css -> file for special components styles
        |-- index.ts -> file for re-export
        |-- NameComponent.types.ts -> file for special components types (props)
  |-- layout -> components that are used as a main template (header, footer)
      |-- NameLayout -> folders for each component layout
        |-- NameLayout.tsx -> main component layout
        |-- NameLayout.module.css -> file for special components layout styles
        |-- index.ts -> file for re-export
        |-- NameLayout.types.ts -> file for special components layout types(props)
  |-- sections -> folder with section components
      |-- NameComponent -> folders for each component section
        |-- NameComponent.tsx -> main component section
        |-- NameComponent.module.css -> file for special section components styles
        |-- index.ts -> file for re-export
        |-- NameComponent.types.ts -> file for special section components types(props)
  |-- data -> static data for the project (json)
  |-- types -> folder with reusable type definitions
  |-- utils -> additional reusable functions

```

---

# 🌍 Localization

The website supports multiple languages:

- 🇩🇪 German
- 🇬🇧 English
- 🇺🇦 Ukrainian

Content is loaded dynamically using:

```
utils/getData.ts
```

---

# 📱 Responsive Design

The layout is optimized for:

- mobile devices
- tablets
- desktops

Built with a **mobile-first approach** using Tailwind CSS.

---

# 🧾 Legal

The website includes legally required pages for German websites:

- Datenschutz
- Impressum

---

# 🧑‍💻 Author

Developed by **Labrity Web Studio**

🌐 https://labrity.com

---

# ⭐ Contributing

Pull requests are welcome.  
For major changes please open an issue first.

---

# 📄 License

MIT License

## 🤖 Тестирование формы через Telegram-бота

Каждый разработчик может тестировать форму отправки сообщений через **своего
Telegram-бота**.  
Это нужно для того, чтобы тестовые сообщения **не отправлялись в основной бот
проекта**.

Следуйте инструкции ниже.

---

### 1️⃣ Создание Telegram-бота

1. Откройте **Telegram**
2. Найдите **@BotFather**
3. Запустите бота командой:

```
/start
```

4. Создайте нового бота:

```
/newbot
```

5. Введите:

- имя бота (например: `Massage Test Bot`)
- username бота (например: `massage_test_bot`)

После этого BotFather отправит вам **BOT TOKEN**, например:

```
123456789:AAExampleTokenExampleToken
```

Сохраните этот токен — он понадобится для `.env`.

---

### 2️⃣ Получение Chat ID

1. Напишите **любое сообщение** вашему боту (например: `test`).

2. Откройте в браузере:

```
https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
```

Пример:

```
https://api.telegram.org/bot123456789:AAExampleTokenExampleToken/getUpdates
```

3. В ответе найдите поле:

```
"chat": {
"id": 123456789
}
```

Это число — ваш **CHAT_ID**.

---

### 3️⃣ Создание `.env.local`

В **корне проекта** создайте файл:

```
.env.local
```

Добавьте туда данные вашего бота:

```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

Пример:

```
TELEGRAM_BOT_TOKEN=123456789:AAExampleTokenExampleToken
TELEGRAM_CHAT_ID=123456789
```

---

### 4️⃣ Запуск проекта

Запустите проект:

```
npm run dev
```

Откройте в браузере:

```
http://localhost:3000
```

Теперь при отправке **контактной формы** сообщение будет приходить **в ваш
Telegram-бот**.

---

### ⚠️ Важно

Файл `.env.local` **нельзя загружать в GitHub**.

Проверьте, чтобы он был в `.gitignore`:

```
.env
.env.local
.env.*
```

---

### 🧪 Как выглядит сообщение

После отправки формы вы должны получить сообщение примерно такого вида:

```
Новая заявка с сайта

Имя: John Doe
Телефон: +49 123456789
Сообщение: Хочу записаться на массаж
```

---

### 🚀 Продакшн

В production версии сайта бот будет подключён к **общей Telegram-группе
команды**, чтобы все участники могли получать заявки с сайта.
