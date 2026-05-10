# Deploying vallabh.dev

Three pieces, three providers. All have free tiers that cover this kind of personal-portfolio traffic.

| Piece | Provider | Free tier |
| --- | --- | --- |
| Postgres | [Neon](https://neon.tech) | 0.5 GB storage, autoscale paused after inactivity |
| API | [Fly.io](https://fly.io) (or [Render](https://render.com)) | One small VM is free; sleeps when idle |
| Frontend | [Cloudflare Pages](https://pages.cloudflare.com) | Unlimited static traffic, global CDN |
| DNS | Cloudflare (already set up) | Free |

> If you'd rather have one box host everything, see "Single-host alternative" at the bottom.

---

## 1. Database — Neon

1. Sign up at neon.tech with GitHub.
2. **Create project** → Region: pick the one closest to where the API will run (`Singapore` or `Mumbai` if you go AWS, `London` for Fly's `lhr`).
3. From the dashboard, copy the **connection string** (it looks like `postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require`).
4. Convert it to the form Npgsql expects:
   ```
   Host=HOST;Port=5432;Database=DBNAME;Username=USER;Password=PASSWORD;SSL Mode=Require;Trust Server Certificate=true
   ```
   Save this — it's `ConnectionStrings__Default` for the API.

## 2. API — Fly.io

```bash
# from C:\work\Portfolio
fly launch --no-deploy --copy-config --name portfolio-api --dockerfile Portfolio.API/Dockerfile
# answer "no" to the Postgres prompt — we're using Neon.
```

This generates a `fly.toml`. Open it and confirm it has:

```toml
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
```

Set the secrets:

```bash
fly secrets set \
  ConnectionStrings__Default='Host=...;...;SSL Mode=Require;Trust Server Certificate=true' \
  Admin__Key='generate-a-long-random-string-here' \
  Cors__AllowedOrigins__0='https://vallabh.dev' \
  Cors__AllowedOrigins__1='https://www.vallabh.dev'
```

Deploy:

```bash
fly deploy
```

The first deploy creates the machine; on success Fly prints something like `https://portfolio-api.fly.dev`. **Hit `https://portfolio-api.fly.dev/api/projects/`** in a browser — you should see the seeded JSON. The migration + seed run automatically on first boot.

## 3. Frontend — Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick your repo. **Configure build:**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory (advanced): `Portfolio.Web`
4. **Environment variables:**
   - `VITE_API_URL` = `https://api.vallabh.dev`
5. Click **Save and Deploy**. First build takes ~2 min. You'll get a `*.pages.dev` URL — confirm the site loads and `/projects` shows data.

## 4. DNS — Cloudflare

Assuming `vallabh.dev` is already in Cloudflare:

1. **DNS → Records → Add record**
   - Type: `CNAME`
   - Name: `@` (apex)
   - Target: `<your-project>.pages.dev`
   - Proxy: **Proxied** (orange cloud)
2. **Add another record**
   - Type: `CNAME`
   - Name: `www`
   - Target: `vallabh.dev`
   - Proxy: Proxied
3. **Add the API subdomain**
   - Type: `CNAME`
   - Name: `api`
   - Target: `portfolio-api.fly.dev`
   - Proxy: **DNS only** (grey cloud) — Fly handles its own TLS, and proxying through Cloudflare-Free can break some `Host` header expectations. Switch to Proxied later once you've added the custom hostname inside Fly (`fly certs add api.vallabh.dev`).
4. **Hook up the apex** in Cloudflare Pages: **Pages → your project → Custom domains → Set up a custom domain → `vallabh.dev`**. Cloudflare auto-issues TLS within minutes.
5. **Hook up the API subdomain** in Fly:
   ```bash
   fly certs add api.vallabh.dev
   ```
   Wait ~30 s. Visit `https://api.vallabh.dev/api/projects/` — should return JSON.
6. Back in Pages, update `VITE_API_URL` to `https://api.vallabh.dev` (it was already, this is just to confirm) and trigger a rebuild.

## 5. Smoke test

- `https://vallabh.dev/` — landing page, hero loads
- `https://vallabh.dev/projects` — projects render, filter pills work
- `https://vallabh.dev/blog/<slug>` — markdown + code copy works
- `https://vallabh.dev/admin` — login screen; key from `Admin__Key` secret unlocks
- ⌘K — palette opens with all routes

## Operational notes

- **Admin key**: never commit. Rotate via `fly secrets set Admin__Key=…`. Filter returns `503` if missing — fail-closed by design.
- **Migrations**: run on API startup. Adding a new entity? Add a migration locally with `dotnet ef migrations add Name --project Portfolio.API`, commit, push, redeploy.
- **DB backups**: Neon auto-snapshots on the free tier, but you can also pull a dump:
  ```bash
  pg_dump "$NEON_URL" -F c -f portfolio.dump
  ```
- **Cold starts**: Fly's free machine sleeps after a few min of inactivity. First request after sleep takes ~3–5 s. If that bothers you, set `min_machines_running = 1` (still free, just consumes more of your monthly hours).

---

## Single-host alternative

If you want one box for everything (no separate frontend host):

1. Build the SPA inside the API Docker image and serve it via `app.UseStaticFiles()` + a fallback endpoint that returns `index.html` for non-`/api` paths.
2. Skip Cloudflare Pages entirely. Point `vallabh.dev` straight at Fly via `fly certs add vallabh.dev`.
3. Drop `VITE_API_URL` (frontend hits `/api` on the same origin).

Trade-off: API now serves bytes it doesn't need to. Fine for portfolio scale; not worth it once you have real traffic.
