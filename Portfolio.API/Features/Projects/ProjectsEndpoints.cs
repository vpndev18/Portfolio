using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;

namespace Portfolio.API.Features.Projects;

public static class ProjectsEndpoints
{
    public static IEndpointRouteBuilder MapProjectsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects").WithTags("Projects");

        group.MapGet("/", async (PortfolioDbContext db, CancellationToken ct) =>
        {
            var projects = await db.Projects
                .OrderBy(p => p.DisplayOrder)
                .ThenByDescending(p => p.CreatedAt)
                .ToListAsync(ct);

            return Results.Ok(projects);
        })
        .WithName("ListProjects")
        .Produces<List<Project>>();

        group.MapGet("/{slug}", async (string slug, PortfolioDbContext db, CancellationToken ct) =>
        {
            var project = await db.Projects
                .FirstOrDefaultAsync(p => p.Slug == slug, ct);

            return project is null
                ? Results.NotFound()
                : Results.Ok(project);
        })
        .WithName("GetProjectBySlug")
        .Produces<Project>()
        .Produces(StatusCodes.Status404NotFound);

        return app;
    }
}
