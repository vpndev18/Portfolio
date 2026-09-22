import { useEffect, useState } from 'react'
import { readCache, writeCache } from '@/lib/cache'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  /** True while a cached value is on screen and a fresh copy is in flight. */
  revalidating: boolean
}

/**
 * Fetch with stale-while-revalidate.
 *
 * When `key` is supplied and a cached value exists, that value is returned
 * immediately (`loading: false`) and the network request runs in the background
 * to refresh it. The result: no skeleton flash on repeat visits, and the page
 * stays useful even if the origin is slow to answer.
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  key?: string,
) {
  const cached = key ? readCache<T>(key) : null

  const [state, setState] = useState<FetchState<T>>({
    data: cached,
    loading: cached === null,
    error: null,
    revalidating: cached !== null,
  })

  useEffect(() => {
    let cancelled = false
    const hit = key ? readCache<T>(key) : null

    // Re-seed from cache whenever `deps` change so a second key's result never
    // renders under the previous key's data. Intentionally synchronous: the
    // alternative is one frame of stale content.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      data: hit,
      loading: hit === null,
      error: null,
      revalidating: hit !== null,
    })

    fetcher()
      .then((data) => {
        if (key) writeCache(key, data)
        if (!cancelled) {
          setState({ data, loading: false, error: null, revalidating: false })
        }
      })
      .catch((error) => {
        if (cancelled) return
        const err = error instanceof Error ? error : new Error(String(error))
        // A failed revalidation must not blow away good cached content —
        // showing slightly stale data beats showing an error block.
        setState((prev) =>
          prev.data !== null
            ? { ...prev, revalidating: false }
            : { data: null, loading: false, error: err, revalidating: false },
        )
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
