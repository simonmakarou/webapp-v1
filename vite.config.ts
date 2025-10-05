import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import packageJson from './package.json' assert { type: 'json' }

type PackageMetadata = {
  name?: string
  homepage?: string
}

const packageMetadata = packageJson as PackageMetadata

const normalizeBasePath = (value?: string) => {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

const inferBaseFromPackageJson = () => {
  if (
    typeof packageMetadata?.homepage === 'string' &&
    packageMetadata.homepage.trim().length > 0
  ) {
    try {
      const homepageUrl = new URL(packageMetadata.homepage)
      return normalizeBasePath(homepageUrl.pathname)
    } catch {
      return normalizeBasePath(packageMetadata.homepage)
    }
  }

  if (
    typeof packageMetadata?.name === 'string' &&
    packageMetadata.name.trim().length > 0
  ) {
    return normalizeBasePath(`/${packageMetadata.name}`)
  }

  return undefined
}

const base =
  normalizeBasePath(process.env.BASE_PATH) ?? inferBaseFromPackageJson() ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
