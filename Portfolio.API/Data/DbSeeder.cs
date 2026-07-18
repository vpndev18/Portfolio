using Microsoft.EntityFrameworkCore;
using Portfolio.API.Features.Posts;
using Portfolio.API.Features.Projects;

namespace Portfolio.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(PortfolioDbContext db, CancellationToken ct = default)
    {
        await SeedProjectsAsync(db, ct);
        await SeedPostsAsync(db, ct);
    }

    /// <summary>
    /// Projects have no admin UI, so this file is their source of truth and the
    /// seeder *syncs* rather than seeds-once: entries are upserted by slug and
    /// any project no longer listed here is removed. That means edits like a
    /// rename reach an already-populated database on the next deploy, instead of
    /// silently doing nothing because the table was non-empty.
    ///
    /// Posts are handled differently — see SeedPostsAsync.
    /// </summary>
    private static async Task SeedProjectsAsync(PortfolioDbContext db, CancellationToken ct)
    {
        var seed = new[]
        {
            new Project
            {
                Slug = "foresight-ai",
                Title = "Foresight AI",
                ShortDescription = "Monte Carlo wealth simulator with AI-driven financial advice via Google Gemini.",
                LongDescription = "Predictive financial planning app combining 1,000+ Monte Carlo market simulations with Generative AI insights. Backend uses ASP.NET Core 9 minimal APIs with MediatR and vertical slice architecture; frontend is React 19 with Chart.js. Hosted on Azure with Postgres on Neon.",
                LiveUrl = null,
                RepoUrl = "https://github.com/vpndev18/Foresight-AI",
                TechStack = new List<string> { ".NET 9", "Minimal APIs", "MediatR", "PostgreSQL", "React 19", "Chart.js", "Gemini AI", "Docker" },
                DisplayOrder = 1
            },
            new Project
            {
                Slug = "finquery",
                Title = "FinQuery",
                ShortDescription = "Multi-service expense tracker with real-time updates over SignalR and Redis caching.",
                LongDescription = "Full-stack expense tracker using vertical slice architecture. Backend in .NET 8 with EF Core + SQL Server, Redis for caching, Qdrant for semantic search, and SignalR for live group expense updates. Frontend is React with feature-folder organization.",
                LiveUrl = null,
                RepoUrl = "https://github.com/vpndev18/FinQuery",
                TechStack = new List<string> { ".NET 8", "EF Core", "SQL Server", "Redis", "Qdrant", "SignalR", "React", "Docker" },
                DisplayOrder = 2
            }
        };

        var existing = await db.Projects.ToListAsync(ct);
        var seedSlugs = seed.Select(p => p.Slug).ToHashSet();

        foreach (var incoming in seed)
        {
            var current = existing.FirstOrDefault(p => p.Slug == incoming.Slug);
            if (current is null)
            {
                db.Projects.Add(incoming);
                continue;
            }

            current.Title = incoming.Title;
            current.ShortDescription = incoming.ShortDescription;
            current.LongDescription = incoming.LongDescription;
            current.LiveUrl = incoming.LiveUrl;
            current.RepoUrl = incoming.RepoUrl;
            current.TechStack = incoming.TechStack;
            current.DisplayOrder = incoming.DisplayOrder;
        }

        // Drop projects that were removed from the seed (e.g. renamed slugs).
        db.Projects.RemoveRange(existing.Where(p => !seedSlugs.Contains(p.Slug)));

        await db.SaveChangesAsync(ct);
    }

    /// <summary>
    /// Unlike projects, posts are editable through /admin — so this only seeds an
    /// empty table. Syncing here would overwrite or delete things you wrote.
    /// </summary>
    private static async Task SeedPostsAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Posts.AnyAsync(ct))
        {
            return;
        }

        var now = DateTime.UtcNow;

        db.Posts.AddRange(
            new BlogPost
            {
                Slug = "minimal-apis-vs-controllers",
                Title = "Minimal APIs vs Controllers in ASP.NET Core",
                Excerpt = "When the new minimal API style actually pays off, and when reaching for controllers is still the right call.",
                Tags = new List<string> { ".NET", "ASP.NET Core", "API design" },
                ReadingMinutes = 6,
                PublishedAt = now.AddDays(-3),
                Content = @"## Why this matters

Minimal APIs in .NET 8/9 are great for small surfaces — but they're not a free lunch.

### Where minimal APIs win

- **Tiny endpoints**: a handler that's three lines doesn't deserve a controller.
- **Vertical slices**: each feature owns its endpoint registration (`MapXEndpoints`) and lives next to its handler.
- **Faster cold start** for serverless-style workloads.

### Where controllers still make sense

- **Filters and conventions** that span many endpoints.
- **Heavy model binding** with custom binders.
- **Teams that want one-screen-per-endpoint** for readability.

### My rule of thumb

Default to minimal APIs for new projects. Promote a feature to a controller the day you find yourself copy-pasting attribute soup across handlers."
            }
        );

        await db.SaveChangesAsync(ct);
    }
}
