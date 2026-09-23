/**
 * Cloudflare Worker sitting in front of the portfolio.
 *
 * Two jobs:
 *   1. Serve the built SPA from the ASSETS binding (static, already at the edge).
 *   2. Proxy /api/* to the Render-hosted .NET API and cache the responses at the
 *      edge, so the origin is only touched on a cache miss.
 *
 * Serving the API from this same Worker means the browser talks to exactly one
 * origin: no CORS preflight, no second DNS lookup, no second TLS handshake.
 */

// Public GETs are cached at the edge. Everything else (admin writes, and any
// request carrying an admin key) always goes straight to the origin.
const EDGE_TTL_SECONDS = 600
const STALE_TTL_SECONDS = 86400

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request)
    }

    const isPublicGet =
      request.method === 'GET' &&
      !url.pathname.startsWith('/api/admin') &&
      !request.headers.has('X-Admin-Key')

    const originUrl = new URL(url.pathname + url.search, env.API_ORIGIN)
    const originRequest = new Request(originUrl, request)

    if (!isPublicGet) {
      return fetch(originRequest)
    }

    // Key the cache on the origin URL only, so unrelated request headers
    // (and any cache-busting query junk) can't fragment the cache.
    const cache = caches.default
    const cacheKey = new Request(originUrl.toString(), { method: 'GET' })

    const cached = await cache.match(cacheKey)
    if (cached) {
      const hit = new Response(cached.body, cached)
      hit.headers.set('X-Edge-Cache', 'HIT')
      return hit
    }

    let originResponse
    try {
      originResponse = await fetch(originRequest)
    } catch {
      return jsonError(502, 'Upstream API is unreachable.')
    }

    if (!originResponse.ok) {
      return originResponse
    }

    const response = new Response(originResponse.body, originResponse)
    response.headers.set(
      'Cache-Control',
      `public, max-age=60, s-maxage=${EDGE_TTL_SECONDS}, stale-while-revalidate=${STALE_TTL_SECONDS}`,
    )
    response.headers.set('X-Edge-Cache', 'MISS')

    // Populate the cache without making the visitor wait for the write.
    ctx.waitUntil(cache.put(cacheKey, response.clone()))

    return response
  },
}

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
