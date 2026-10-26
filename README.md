# Легенды Тайцзи II

Лендинг-регистрация на фестиваль (19 декабря, организатор — [Академия Cheng Long](https://taijipro.com/)).
Next.js (App Router), бэкенд — Directual.

## Структура

- `app/page.tsx` — лендинг, пререндерится статически
- `app/registration-form.tsx` — форма регистрации (клиентский компонент)
- `app/api/register/route.ts` — прокси: валидирует заявку и шлёт в вебхук Directual
- `lib/registration.ts` — общая схема и валидация заявки (клиент + сервер)
- `lib/directual.ts` — работа с Directual (только сервер)
- `assets/brand/`, `public/brand/` — фирменный стиль, вырезан из PDF пресс-волла: пионы, логотип, заголовок, слоган, плашка
- `lib/brand-glyphs.ts` + `app/brand-text.tsx` — заголовки разделов фирменным шрифтом (в PDF он в кривых,
  поэтому есть только буквы из заголовка и слогана: нет М, Я, Б, Ж, Х, Э, Щ, цифр)

Вебхук отвечает `{ paymentNeeded, paymentURL }` (в корне или в `result`):
если оплата нужна — редирект на `paymentURL`, иначе экран «Спасибо».

## Запуск

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Деплой

Vercel, деплой на push в `main`. В настройках проекта нужна переменная
`DIRECTUAL_REGISTER_WEBHOOK` (значение — в `.env.example`).
