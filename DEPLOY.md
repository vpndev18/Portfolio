# Deploying vallabhniturkar.com

Three pieces, two providers, all on free tiers.

| Piece | Provider | Free tier |
| --- | --- | --- |
| Postgres | [Neon](https://neon.tech) | 0.5 GB storage, compute auto-suspends when idle |
| API | [Fly.io](https://fly.io) | One `shared-cpu-1x` machine |
| Frontend + edge cache | [Cloudflare Workers](https://workers.cloudflare.com) | 100k requests/day, global CDN |
| DNS | Cloudflare | Free |

## How requests actually flow

```
                     ┌──────────────────────────────┐
   Browser ────────► │  Cloudflare Worker (edge)    │
                     │                              │
                     │  /*      → static SPA assets │──► instant, from edge
                     │  /api/*  → cache lookup      │
                     └───────────────┬──────────────┘
                                     │ cache MISS only
                                     ▼
                        ┌─────────────────────────┐
                        │  Fly.io — .NET 8 API    │
                        │  output cache (5 min)   │
                        └────────────┬────────────┘
                                     │ cache MISS only
                                     ▼
                          ┌────────────────────┐
                          │  Neon Postgres     │
                          └────────────────────┘
```

Everything is served from **one origin**. The Worker owns both the static assets
and `/api/*`, so the browser makes no cross-origin requests: no CORS preflight,
no second DNS lookup, no second TLS handshake. The Fly app has no public custom
domain and is only ever reached by the Worker.

Three cache layers sit between a visitor and the database:

1. **Browser** — `max-age=60`.
2. **Cloudflare edge** — `s-maxage=600`, plus `stale-while-revalidate=86400`, so
   the edge serves instantly and refreshes in the background. A sleeping machine
   or a suspended Neon compute is never on a visitor's critical path.
3. **API output cache** — 5 minutes in-process, evicted by tag the moment the
   admin editor writes a post.

---

## 1. Database — Neon

1. Sign up at neon.tech, create a project in **`us-east-1`** (co-located with the
   Fly region below — keep these together, the API↔DB round trip is the one hop
   no cache can hide).
2. Copy the connection string and convert it to the form Npgsql expects:
   ```
   Host=HOST;Port=5432;Database=DBNAME;Username=USER;Password=PASSWORD;SSL Mode=Require;Trust Server Certificate=true
   ```

## 2. API — Fly.io

`fly.toml` is already in the repo. From `C:\work\Portfolio`:

```bash
fly apps create portfolio-api
fly secrets set \
  ConnectionStrings__Default='Host=...;...;SSL Mode=Require;Trust Server Certificate=true' \
  Admin__Key='generate-a-long-random-string-here'
fly deploy
```

**The first deploy needs the schema created.** Migrations no longer run on every
boot (that used to add a full round trip to a cold Neon compute before the app
served its first request). Run them once, explicitly:

```bash
fly deploy --env RunMigrationsOnStartup=true
```

Then redeploy normally (`fly deploy`) so subsequent boots skip it. Repeat the
`--env` form any time you add a migration.

Verify: `curl https://portfolio-api.fly.dev/health` → `{"status":"ok"}`.

Notes on the config:
- `min_machines_running = 1` — no cold starts.
- `auto_stop_machines = "suspend"` — suspend keeps memory warm, so a resume is
  sub-second rather than a full boot.
- The health check hits `/health`, which touches no database, so a health ping
  can never wake Neon or block on a slow query.

**CORS is no longer needed in production** — the Worker makes the API
same-origin. `Cors:AllowedOrigins` only matters if you ever expose the Fly app
directly.

## 3. Frontend + edge cache — Cloudflare Workers

The Worker (`Portfolio.Web/worker/index.js`) serves the SPA and proxies `/api/*`.

In the Cloudflare dashboard → **Workers & Pages → your project → Settings**:
- Root directory: `Portfolio.Web`
- Build command: `npm ci && npm run build`
- Deploy command: `npx wrangler deploy`

**Remove the `VITE_API_URL` environment variable if it is still set.** The
frontend now calls `/api/...` on its own origin; leaving the old value pointing
at a separate API host would reintroduce cross-origin requests and CORS.

If the Fly app name differs from `portfolio-api`, update `API_ORIGIN` in
`Portfolio.Web/wrangler.toml`.

## 4. DNS — Cloudflare

Only the site itself needs DNS. Bind `vallabhniturkar.com` and `www` to the
Worker under **Workers & Pages → your project → Settings → Domains & Routes**.

You do **not** need an `api.` record — the Fly app is reached by the Worker over
its `.fly.dev` hostname and is never contacted by browsers.

## 5. Smoke test

```bash
# Second call should report HIT
curl -sI https://vallabhniturkar.com/api/projects/ | grep -i -E 'x-edge-cache|cache-control'
```

- `/` — hero, then Experience / Projects / Skills / Writing / Highlights / Contact
- Section rail highlights the section you're in as you scroll
- `/blog/<slug>` — markdown renders, code blocks highlight and copy
- `/admin` — key from `Admin__Key` unlocks; saving a post updates the live site
  immediately (the write evicts the API output cache)
- ⌘K — palette opens

## Operational notes

- **Admin key**: never commit. Rotate with `fly secrets set Admin__Key=…`. The
  filter returns `503` when unset — fail-closed by design.
- **Edge cache after an admin edit**: the API output cache is evicted instantly,
  but Cloudflare may still serve a cached copy for up to `s-maxage` (10 min).
  Purge from the Cloudflare dashboard if you need it live immediately.
- **DB backups**: Neon auto-snapshots; `pg_dump "$NEON_URL" -F c -f portfolio.dump`
  for a manual copy.
