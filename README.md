# Миграция генератора программы на Vite + React + TypeScript

Этот репозиторий — стартовая точка для переноса одностраничного демо (`legacy-index.html`) в полноценное приложение на базе
Vite, React, TypeScript и Tailwind CSS.

## Быстрый старт

```bash
npm install
npm run dev
```

- `npm run dev` — запускает локальный dev-сервер Vite с hot-reload.
- `npm run build` — собирает production-бандл (`dist/`) и проверяет типы.
- `npm run preview` — запускает предпросмотр собранного бандла.
- `npm run lint` — запускает ESLint c базовыми правилами для TypeScript и React.
- `npm run test:unit` — запускает Vitest в headless-режиме.
- `npm run test:unit:watch` — открывает Vitest UI (`@vitest/ui`) для интерактивного прогона.
- `npm run test:e2e` — запускает e2e-сценарии Playwright (используется страница `legacy-index.html`).
- `npm run test:e2e:headed` — выполняет e2e-тесты в видимом браузере.

Перед первым запуском e2e-тестов установите браузеры Playwright:

```bash
npx playwright install
```

## Tailwind CSS

Tailwind подключён через файл `src/styles/tailwind.css`. Внутри него скопированы ключевые утилитарные классы из исходного
демо (карточки, модалки, таймер), чтобы можно было использовать существующие стили после переноса компонентов.

## Алиасы импортов

- В `vite.config.ts` настроен алиас `@` → `src/`.
- В `tsconfig.app.json` добавлен `baseUrl` и `paths`, чтобы TypeScript понимал такие импорты.

## Маршрут миграции

- `src/data/` — централизованное хранилище статических коллекций (упражнения, темы недели, конфигурации целей и словари оборудования). Из этих модулей можно импортировать типизированные данные через баррель `src/data/index.ts`.
- `src/utils/` — прикладные утилиты, разделённые по областям (`filters`, `planner`, `random`, `localStorage`) и реэкспортируемые через `src/utils/index.ts`. В частности, здесь живут функции генератора (`packByMinutes`, `rankAlternatives`, `sanitizePlanStore`), которые покрыты юнит-тестами.

## Дальнейшие шаги миграции

1. Вынести статические данные в `src/data` и типизировать структуры.
2. Перенести утилиты работы с random/seed/localStorage в `src/utils` и покрыть их тестами (Vitest).
3. Разбить UI на компоненты и провайдеры, сохранив бизнес-логику генератора.
4. Настроить тестирование (Vitest, React Testing Library, Playwright) и деплой на GitHub Pages.

## Наследие

Оригинальный файл `legacy-index.html` сохранён для удобства сравнения функциональности при дальнейшем переносе.
