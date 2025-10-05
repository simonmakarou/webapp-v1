import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isPages ? '/webapp-v1/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
