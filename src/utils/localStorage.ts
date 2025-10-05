interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const createMemoryStorage = (): StorageLike => {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value)
    },
  }
}

const resolveStorage = (): StorageLike => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (typeof globalThis.localStorage !== 'undefined') {
    return globalThis.localStorage as StorageLike
  }
  return createMemoryStorage()
}

const storage = resolveStorage()

export const LS = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = storage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },
  set<T>(key: string, value: T): void {
    try {
      storage.setItem(key, JSON.stringify(value))
    } catch {
      /* noop */
    }
  },
}
