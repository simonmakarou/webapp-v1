import type { FC } from 'react'

type RoadmapStatus = 'done' | 'next' | 'upcoming'

const roadmap: Array<{ title: string; description: string; status: RoadmapStatus }> = [
  {
    title: 'Инфраструктура Vite + Tailwind',
    description:
      'Базовая среда разработки настроена. Tailwind подключён, глобальные стили и шрифт Inter применяются ко всем страницам.',
    status: 'done',
  },
  {
    title: 'Перенос данных и утилит',
    description:
      'Следующий шаг — разбить доменные данные и вспомогательные функции на типизированные модули в src/data и src/utils.',
    status: 'next',
  },
  {
    title: 'Компонентизация UI',
    description:
      'Компоненты интерфейса будут вынесены по фичам, сохраняя логику генерации программ и таймера.',
    status: 'upcoming',
  },
]

const statusLabel: Record<RoadmapStatus, string> = {
  done: 'Готово',
  next: 'В работе далее',
  upcoming: 'Запланировано',
}

const statusTone: Record<RoadmapStatus, string> = {
  done: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  next: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  upcoming: 'bg-slate-100 text-slate-600 border-slate-200',
}

const App: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 pb-24 pt-16 lg:px-8">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">Migration Toolkit</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Генератор программы: старт миграции на Vite + React + TypeScript
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Репозиторий подготовлен для дальнейшего переноса логики из одностраничного демо. Доступны базовые стили,
            типизированный стек и структура, позволяющая постепенно переносить данные, утилиты и компоненты.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {roadmap.map(({ title, description, status }) => (
            <article key={title} className="card flex h-full flex-col gap-4 border border-slate-100 p-6 shadow-sm">
              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${statusTone[status]}`}
              >
                {statusLabel[status]}
              </span>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="text-sm leading-relaxed text-slate-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="card border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Что дальше?</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Сохранён оригинальный <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">legacy-index.html</code> для
            проверки функциональности. Дальнейшие PR будут постепенно переносить бизнес-логику, писать тесты и готовить
            автоматический деплой на GitHub Pages.
          </p>
          <ul className="instructions mt-6 space-y-3 text-sm text-slate-700">
            <li>Вынести данные упражнений и локализацию в модули внутри <code>src/data</code>.</li>
            <li>Создать набор утилит с сохранением сидов и фильтрацией в <code>src/utils</code>.</li>
            <li>Переработать UI в виде изолированных компонентов и провайдеров.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default App
