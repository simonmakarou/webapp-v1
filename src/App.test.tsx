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

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)

    const nextCard = cards.find((card) => within(card).queryByText('В работе далее'))
    const statusPill = within(nextCard!).getByText('В работе далее')
    expect(statusPill).toHaveClass('bg-indigo-100')
  })
})
