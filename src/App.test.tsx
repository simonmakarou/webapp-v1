import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders roadmap cards and onboarding copy', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Генератор программы: старт миграции на Vite + React + TypeScript',
      }),
    ).toBeInTheDocument()

    const statusPill = screen.getByText('В работе далее')
    expect(statusPill).toHaveClass('bg-indigo-100')

    const roadmapSection = statusPill.closest('section') ?? screen.getByRole('region', { hidden: true })
    const cards = within(roadmapSection!).getAllByRole('article')
    expect(cards).toHaveLength(3)
  })
})
