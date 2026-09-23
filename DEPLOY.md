# Deploying vallabhniturkar.com

Three pieces, two providers, all on free tiers.

| Piece | Provider | Free tier |
| --- | --- | --- |
| Postgres | [Neon](https://neon.tech) | 0.5 GB storage, compute auto-suspends when idle |
| API | [Render](https://render.com) | One free web service (Docker); sleeps when idle |
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
                        │  Render — .NET 8 API    │
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
no second DNS lookup, no second TLS handshake. The Render service has no public custom
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
   Render region below — keep these together, the API↔DB round trip is the one hop
   no cache can hide).
2. Copy the connection string and convert it to the form Npgsql expects:
   ```
   Host=HOST;Port=5432;Database=DBNAME;Username=USER;Password=PASSWORD;SSL Mode=Require;Trust Server Certificate=true
   ```

## 2. API — Render

Service: `portfolio-api-p99i` → `https://portfolio-api-p99i.onrender.com`.

In the Render dashboard, create a **Web Service** from `vpndev18/Portfolio`:

| Setting | Value |
| --- | --- |
| Branch | `master` |
| Runtime | Docker |
| Dockerfile path | `Portfolio.API/Dockerfile` |
| Docker build context | `.` (repo root — the Dockerfile copies `Portfolio.API/...`) |
| Health check path | `/health` |
| Auto-deploy | On commit |

Environment variables:

```
ConnectionStrings__Default=Host=...;...;SSL Mode=Require;Trust Server Certificate=true
Admin__Key=generate-a-long-random-string-here
PORT=8080
```

**Migrations and seeding only run when asked.** They are off the startup path
(that used to add a full round trip to a cold Neon compute before the app served
its first request). The seeder is also what syncs project data (e.g. `RepoUrl`)
from `Data/DbSeeder.cs` into existing rows. For a deploy that adds a migration or
changes seed data, add `RunMigrationsOnStartup=true`, deploy, then remove it.

Verify: `curl https://portfolio-api-p99i.onrender.com/health` → `{"status":"ok"}`.

Notes:
- The free tier spins the service down after ~15 min idle; the next uncached
  request waits for a cold boot. The edge cache's `stale-while-revalidate`
  keeps that off most visitors' critical path.
- `/health` touches no database, so a health ping can never wake Neon or block
  on a slow query.
- **Recreated the GitHub repo?** Render links services by repo ID, not name.
  Reconnect under Settings → Build & Deploy → Repository, then Manual Deploy.

## 3. Frontend + edge cache — Cloudflare Workers

The Worker (`Portfolio.Web/worker/index.js`) serves the SPA and proxies `/api/*`.

In the Cloudflare dashboard → **Workers & Pages → your project → Settings**:
- Root directory: `Portfolio.Web`
- Build command: `npm ci && npm run build`
- Deploy command: `npx wrangler deploy`

**Remove the `VITE_API_URL` environment variable if it is still set.** The
frontend now calls `/api/...` on its own origin; leaving the old value pointing
at a separate API host would reintroduce cross-origin requests and CORS.

If the Render service URL changes, update `API_ORIGIN` in
`Portfolio.Web/wrangler.toml`.

## 4. DNS — Cloudflare

Only the site itself needs DNS. Bind `vallabhniturkar.com` and `www` to the
Worker under **Workers & Pages → your project → Settings → Domains & Routes**.

You do **not** need an `api.` record — the Render service is reached by the Worker over
its `.onrender.com` hostname and is never contacted by browsers.

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

- **Admin key**: never commit. Rotate it in the Render service's Environment tab. The
  filter returns `503` when unset — fail-closed by design.
- **Edge cache after an admin edit**: the API output cache is evicted instantly,
  but Cloudflare may still serve a cached copy for up to `s-maxage` (10 min).
  Purge from the Cloudflare dashboard if you need it live immediately.
- **DB backups**: Neon auto-snapshots; `pg_dump "$NEON_URL" -F c -f portfolio.dump`
  for a manual copy.
