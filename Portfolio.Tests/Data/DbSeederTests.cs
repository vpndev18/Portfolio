using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Features.Posts;
using Portfolio.API.Features.Projects;

namespace Portfolio.Tests.Data;

public class DbSeederTests
{
    [Fact]
    public async Task SeedAsync_WhenDbIsEmpty_AddsSeedProjects()
    {
        await using var db = CreateDb();

        await DbSeeder.SeedAsync(db);

        var projects = await db.Projects.ToListAsync();
        Assert.NotEmpty(projects);
        Assert.All(projects, p =>
        {
            Assert.False(string.IsNullOrWhiteSpace(p.Slug));
            Assert.False(string.IsNullOrWhiteSpace(p.Title));
            Assert.NotEmpty(p.TechStack);
        });
    }

    [Fact]
    public async Task SeedAsync_AssignsUniqueSlugs()
    {
        await using var db = CreateDb();

        await DbSeeder.SeedAsync(db);

        var slugs = await db.Projects.Select(p => p.Slug).ToListAsync();
        Assert.Equal(slugs.Count, slugs.Distinct().Count());
    }

    [Fact]
    public async Task SeedAsync_IsIdempotent_DoesNotDuplicateOnSecondRun()
    {
        await using var db = CreateDb();

        await DbSeeder.SeedAsync(db);
        var countAfterFirst = await db.Projects.CountAsync();

        await DbSeeder.SeedAsync(db);
        var countAfterSecond = await db.Projects.CountAsync();

        Assert.Equal(countAfterFirst, countAfterSecond);
    }

    [Fact]
    public async Task SeedAsync_RemovesProjects_NoLongerInSeed()
    {
        await using var db = CreateDb();
        db.Projects.Add(new Project
        {
            Slug = "retired-project",
            Title = "Retired project",
            ShortDescription = "x",
            LongDescription = "x",
            TechStack = new List<string> { "x" },
            DisplayOrder = 99
        });
        await db.SaveChangesAsync();

        await DbSeeder.SeedAsync(db);

        var slugs = await db.Projects.Select(p => p.Slug).ToListAsync();
        Assert.DoesNotContain("retired-project", slugs);
        Assert.NotEmpty(slugs);
    }

    [Fact]
    public async Task SeedAsync_RefreshesFields_OnProjectsThatAlreadyExist()
    {
        // The seeder is the single source of truth for projects: a row that
        // already exists is updated in place, which is how corrections such as
        // a moved repository URL reach an environment that was seeded earlier.
        await using var db = CreateDb();
        await DbSeeder.SeedAsync(db);

        var seeded = await db.Projects.FirstAsync();
        var slug = seeded.Slug;
        seeded.RepoUrl = "https://github.com/vpndev18/stale-url";
        seeded.Title = "Stale title";
        await db.SaveChangesAsync();

        await DbSeeder.SeedAsync(db);

        var refreshed = await db.Projects.SingleAsync(p => p.Slug == slug);
        Assert.NotEqual("https://github.com/vpndev18/stale-url", refreshed.RepoUrl);
        Assert.NotEqual("Stale title", refreshed.Title);
    }

    [Fact]
    public async Task SeedAsync_SeedsPosts_WithUniqueSlugsAndPublishedDates()
    {
        await using var db = CreateDb();

        await DbSeeder.SeedAsync(db);

        var posts = await db.Posts.ToListAsync();
        Assert.NotEmpty(posts);
        Assert.All(posts, p =>
        {
            Assert.False(string.IsNullOrWhiteSpace(p.Slug));
            Assert.False(string.IsNullOrWhiteSpace(p.Title));
            Assert.NotNull(p.PublishedAt);
            Assert.NotEmpty(p.Tags);
        });
        var slugs = posts.Select(p => p.Slug).ToList();
        Assert.Equal(slugs.Count, slugs.Distinct().Count());
    }

    [Fact]
    public async Task SeedAsync_DoesNotDuplicatePosts_OnSecondRun()
    {
        await using var db = CreateDb();

        await DbSeeder.SeedAsync(db);
        var firstCount = await db.Posts.CountAsync();

        await DbSeeder.SeedAsync(db);
        var secondCount = await db.Posts.CountAsync();

        Assert.Equal(firstCount, secondCount);
    }

    [Fact]
    public async Task SeedAsync_DoesNotSeedPosts_WhenAnyPostExists()
    {
        await using var db = CreateDb();
        db.Posts.Add(new BlogPost
        {
            Slug = "existing-post",
            Title = "Existing",
            Excerpt = "x",
            Content = "x",
            Tags = new List<string> { "x" },
            PublishedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        await DbSeeder.SeedAsync(db);

        var posts = await db.Posts.ToListAsync();
        Assert.Single(posts);
        Assert.Equal("existing-post", posts[0].Slug);
    }

    private static PortfolioDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new PortfolioDbContext(options);
    }
}
