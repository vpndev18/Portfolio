using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;

namespace Portfolio.API.Features.Posts;

public static class PostsEndpoints
{
    public static IEndpointRouteBuilder MapPostsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/posts").WithTags("Posts");

        group.MapGet("/", async (PortfolioDbContext db, CancellationToken ct) =>
        {
            var posts = await db.Posts
                .Where(p => p.PublishedAt != null)
                .OrderByDescending(p => p.PublishedAt)
                .Select(p => new PostListItem(
                    p.Slug,
                    p.Title,
                    p.Excerpt,
                    p.Tags,
                    p.PublishedAt!.Value,
                    p.ReadingMinutes))
                .ToListAsync(ct);

            return Results.Ok(posts);
        })
        .WithName("ListPosts")
        .Produces<List<PostListItem>>();

        group.MapGet("/{slug}", async (string slug, PortfolioDbContext db, CancellationToken ct) =>
        {
            var post = await db.Posts
                .FirstOrDefaultAsync(p => p.Slug == slug && p.PublishedAt != null, ct);

            return post is null
                ? Results.NotFound()
                : Results.Ok(post);
        })
        .WithName("GetPostBySlug")
        .Produces<BlogPost>()
        .Produces(StatusCodes.Status404NotFound);

        return app;
    }
}

public record PostListItem(
    string Slug,
    string Title,
    string Excerpt,
    List<string> Tags,
    DateTime PublishedAt,
    int ReadingMinutes);
