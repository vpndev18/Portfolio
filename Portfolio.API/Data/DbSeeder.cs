using Microsoft.EntityFrameworkCore;
using Portfolio.API.Features.Projects;

namespace Portfolio.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(PortfolioDbContext db, CancellationToken ct = default)
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
                RepoUrl = "https://github.com/yourname/BoilerplateApi",
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
                RepoUrl = "https://github.com/yourname/Foresight-AI",
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
                RepoUrl = "https://github.com/yourname/ExpenseTracker",
                TechStack = new List<string> { ".NET 8", "EF Core", "SQL Server", "Redis", "Qdrant", "SignalR", "React", "Docker" },
                DisplayOrder = 3
            }
        );

        await db.SaveChangesAsync(ct);
    }
}
