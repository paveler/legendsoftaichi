# Легенды Тайцзи II

Лендинг-регистрация на фестиваль (19 декабря, организатор — [Академия Cheng Long](https://taijipro.com/)).
Next.js (App Router), бэкенд — Directual.

## Структура

- `app/page.tsx` — лендинг, пререндерится статически
- `app/registration-form.tsx` — форма регистрации (клиентский компонент)
- `app/api/register/route.ts` — прокси: валидирует заявку и шлёт в вебхук Directual
- `lib/registration.ts` — общая схема и валидация заявки (клиент + сервер)
- `lib/directual.ts` — работа с Directual (только сервер)

Вебхук отвечает `{ paymentNeeded, paymentURL }` (в корне или в `result`):
если оплата нужна — редирект на `paymentURL`, иначе экран «Спасибо».

## Запуск

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Деплой

DigitalOcean App Platform, спека в `.do/app.yaml` (деплой на push в `main`).
