import { test, expect } from '@playwright/test'

test.describe('Генерация плана → запуск таймера', () => {
  test('user can generate a plan and start the timer', async ({ page }) => {
    await page.goto('/legacy-index.html')

    await expect(page.getByText('Готовим план на сегодня…')).toBeVisible()
    await expect(page.getByText('Фокус дня')).toBeVisible()

    await page.getByRole('button', { name: 'Запустить таймер' }).first().click()

    const timerSheet = page.locator('.timer-sheet')
    await expect(timerSheet).toBeVisible()
    await expect(timerSheet.getByRole('button', { name: 'Пауза' })).toBeVisible()
  })
})
