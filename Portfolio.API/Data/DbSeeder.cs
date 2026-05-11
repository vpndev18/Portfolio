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

    private static async Task SeedProjectsAsync(PortfolioDbContext db, CancellationToken ct)
    {
        if (await db.Projects.AnyAsync(ct))
        {
            return;
        }

        db.Projects.AddRange(
            new Project
            {
                Slug = "boilerplate-api",
                Title = "Boilerplate API",
                ShortDescription = "Reference ASP.NET Core 9 API: JWT auth, EF Core, Serilog, Docker, GitHub Actions CI.",
                LongDescription = "A small reference project demonstrating the full stack of patterns you'd see in a real .NET API: JWT with refresh-token rotation, role-based authorization, repository + unit-of-work over EF Core, Serilog rolling-file logging, FluentValidation, global exception handling, and a CI pipeline with gitleaks + Docker build verification.",
                LiveUrl = null,
                RepoUrl = "https://github.com/vpndev18/BoilerplateApi",
                TechStack = new List<string> { ".NET 9", "ASP.NET Core", "EF Core", "SQL Server", "JWT", "Serilog", "Docker", "GitHub Actions" },
                DisplayOrder = 1
            },
            new Project
            {
                Slug = "foresight-ai",
                Title = "Foresight AI",
                ShortDescription = "Monte Carlo wealth simulator with AI-driven financial advice via Google Gemini.",
                LongDescription = "Predictive financial planning app combining 1,000+ Monte Carlo market simulations with Generative AI insights. Backend uses ASP.NET Core 9 minimal APIs with MediatR and vertical slice architecture; frontend is React 19 with Chart.js. Hosted on Azure with Postgres on Neon.",
                LiveUrl = null,
                RepoUrl = "https://github.com/vpndev18/Foresight-AI",
                TechStack = new List<string> { ".NET 9", "Minimal APIs", "MediatR", "PostgreSQL", "React 19", "Chart.js", "Gemini AI", "Docker" },
                DisplayOrder = 2
            },
            new Project
            {
                Slug = "expense-tracker",
                Title = "Expense Tracker",
                ShortDescription = "Multi-service expense tracker with real-time updates over SignalR and Redis caching.",
                LongDescription = "Full-stack expense tracker using vertical slice architecture. Backend in .NET 8 with EF Core + SQL Server, Redis for caching, Qdrant for semantic search, and SignalR for live group expense updates. Frontend is React with feature-folder organization.",
                LiveUrl = null,
                RepoUrl = "https://github.com/vpndev18/ExpenseTracker",
                TechStack = new List<string> { ".NET 8", "EF Core", "SQL Server", "Redis", "Qdrant", "SignalR", "React", "Docker" },
                DisplayOrder = 3
            }
        );

        await db.SaveChangesAsync(ct);
    }

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
            },
            new BlogPost
            {
                Slug = "ef-core-migrations-on-startup",
                Title = "Auto-migrating on startup: convenience vs. correctness",
                Excerpt = "The one-liner that calls Database.MigrateAsync() at boot is fine — until it isn't. Here's when to keep it and when to rip it out.",
                Tags = new List<string> { ".NET", "EF Core", "DevOps" },
                ReadingMinutes = 4,
                PublishedAt = now.AddDays(-10),
                Content = @"## The pattern

```csharp
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
await db.Database.MigrateAsync();
```

For a single-instance app, this is great. For a multi-replica deployment, you've just signed up for races between concurrent migrators on boot.

## A safer default

- **Single instance / hobby project** → keep it.
- **Multi-replica** → run migrations as a separate one-shot job (init container, GitHub Action, or `dotnet ef database update` in CI) before the new pods start serving traffic."
            },
            new BlogPost
            {
                Slug = "vertical-slice-architecture",
                Title = "Vertical slices made my .NET codebase boring (in a good way)",
                Excerpt = "After two years of feature folders, here's why I won't go back to Controllers/Services/Repositories.",
                Tags = new List<string> { "Architecture", ".NET", "DX" },
                ReadingMinutes = 7,
                PublishedAt = now.AddDays(-21),
                Content = @"## The promise

Group code by **feature**, not by **technical layer**. Each feature is its own folder with its endpoint, handler, validators, and DTOs.

## What I actually got

- **Find-it speed.** New devs locate a feature in under a minute.
- **Smaller blast radius.** A change to `Posts` doesn't cause a merge conflict in `Projects`.
- **Less plumbing.** I deleted my `IPostRepository` interface; the handler talks to `DbContext` directly.

## The trade-offs

You will duplicate code. That's a feature, not a bug — until two slices clearly want the same primitive, leave it alone."
            }
        );

        await db.SaveChangesAsync(ct);
    }
}
