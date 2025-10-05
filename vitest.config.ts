import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, configDefaults } from 'vitest/config'

const isPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isPages ? '/webapp-v1/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
