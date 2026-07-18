/**
 * Tiny stale-while-revalidate cache for API reads.
 *
 * Two layers:
 *   - an in-memory Map, so navigating back to a page you already visited is
 *     instant with no network call at all;
 *   - sessionStorage, so a full page reload still paints from cache while the
 *     fresh copy is fetched in the background.
 *
 * Deliberately not React Query: the whole surface is four GET endpoints of
 * rarely-changing content, and a dependency-free 40 lines covers it.
 */

const MEMORY = new Map<string, unknown>()
const STORAGE_PREFIX = 'portfolio:cache:'

// Entries older than this are ignored on read, so a long-lived tab does not
// keep showing yesterday's content after a reload.
const MAX_AGE_MS = 10 * 60 * 1000

interface Envelope<T> {
  at: number
  data: T
}

export function readCache<T>(key: string): T | null {
  if (MEMORY.has(key)) {
    return MEMORY.get(key) as T
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null

    const envelope = JSON.parse(raw) as Envelope<T>
    if (Date.now() - envelope.at > MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_PREFIX + key)
      return null
    }

    MEMORY.set(key, envelope.data)
    return envelope.data
  } catch {
    // Private-mode sessionStorage, quota errors, or malformed JSON — the cache
    // is an optimisation, so any failure just degrades to a normal fetch.
    return null
  }
}

export function writeCache<T>(key: string, data: T): void {
  MEMORY.set(key, data)
  try {
    const envelope: Envelope<T> = { at: Date.now(), data }
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(envelope))
  } catch {
    // Memory layer still works; nothing to do.
  }
}

/** Called after an admin write so the editor never shows its own stale data. */
export function clearCache(): void {
  MEMORY.clear()
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith(STORAGE_PREFIX)) sessionStorage.removeItem(key)
    }
  } catch {
    // ignore
  }
}
