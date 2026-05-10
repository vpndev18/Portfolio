using Microsoft.EntityFrameworkCore;
using Portfolio.API.Auth;
using Portfolio.API.Data;

namespace Portfolio.API.Features.Posts;

public static class AdminPostsEndpoints
{
    public static IEndpointRouteBuilder MapAdminPostsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/admin/posts")
            .WithTags("Admin · Posts")
            .AddEndpointFilter<AdminKeyFilter>();

        // List all posts (drafts + published).
        group.MapGet("/", async (PortfolioDbContext db, CancellationToken ct) =>
        {
            var posts = await db.Posts
                .OrderByDescending(p => p.PublishedAt ?? p.UpdatedAt)
                .ToListAsync(ct);
            return Results.Ok(posts);
        });

        group.MapGet("/{id:int}", async (int id, PortfolioDbContext db, CancellationToken ct) =>
        {
            var post = await db.Posts.FindAsync(new object[] { id }, ct);
            return post is null ? Results.NotFound() : Results.Ok(post);
        });

        group.MapPost("/", async (PostUpsert input, PortfolioDbContext db, CancellationToken ct) =>
        {
            var validation = Validate(input);
            if (validation is not null) return validation;

            if (await db.Posts.AnyAsync(p => p.Slug == input.Slug, ct))
            {
                return Results.Conflict(new { error = "A post with that slug already exists." });
            }

            var now = DateTime.UtcNow;
            var post = new BlogPost
            {
                Slug = input.Slug.Trim(),
                Title = input.Title.Trim(),
                Excerpt = input.Excerpt.Trim(),
                Content = input.Content,
                Tags = input.Tags ?? new List<string>(),
                ReadingMinutes = input.ReadingMinutes,
                PublishedAt = input.Publish ? now : null,
                CreatedAt = now,
                UpdatedAt = now,
            };
            db.Posts.Add(post);
            await db.SaveChangesAsync(ct);
            return Results.Created($"/api/admin/posts/{post.Id}", post);
        });

        group.MapPut("/{id:int}", async (int id, PostUpsert input, PortfolioDbContext db, CancellationToken ct) =>
        {
            var validation = Validate(input);
            if (validation is not null) return validation;

            var post = await db.Posts.FindAsync(new object[] { id }, ct);
            if (post is null) return Results.NotFound();

            if (post.Slug != input.Slug && await db.Posts.AnyAsync(p => p.Slug == input.Slug, ct))
            {
                return Results.Conflict(new { error = "A post with that slug already exists." });
            }

            post.Slug = input.Slug.Trim();
            post.Title = input.Title.Trim();
            post.Excerpt = input.Excerpt.Trim();
            post.Content = input.Content;
            post.Tags = input.Tags ?? new List<string>();
            post.ReadingMinutes = input.ReadingMinutes;
            // Preserve original PublishedAt when republishing; clear when unpublishing.
            post.PublishedAt = input.Publish ? (post.PublishedAt ?? DateTime.UtcNow) : null;
            post.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync(ct);
            return Results.Ok(post);
        });

        group.MapDelete("/{id:int}", async (int id, PortfolioDbContext db, CancellationToken ct) =>
        {
            var post = await db.Posts.FindAsync(new object[] { id }, ct);
            if (post is null) return Results.NotFound();
            db.Posts.Remove(post);
            await db.SaveChangesAsync(ct);
            return Results.NoContent();
        });

        return app;
    }

    private static IResult? Validate(PostUpsert input)
    {
        if (string.IsNullOrWhiteSpace(input.Slug)) return Results.BadRequest(new { error = "Slug is required." });
        if (string.IsNullOrWhiteSpace(input.Title)) return Results.BadRequest(new { error = "Title is required." });
        if (string.IsNullOrWhiteSpace(input.Excerpt)) return Results.BadRequest(new { error = "Excerpt is required." });
        if (string.IsNullOrWhiteSpace(input.Content)) return Results.BadRequest(new { error = "Content is required." });
        if (input.ReadingMinutes < 0) return Results.BadRequest(new { error = "ReadingMinutes must be >= 0." });
        return null;
    }
}

public record PostUpsert(
    string Slug,
    string Title,
    string Excerpt,
    string Content,
    List<string>? Tags,
    int ReadingMinutes,
    bool Publish);
