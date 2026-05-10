using Microsoft.EntityFrameworkCore;
using Portfolio.API.Features.Posts;
using Portfolio.API.Features.Projects;

namespace Portfolio.API.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options)
        : base(options) { }

    public DbSet<Project> Projects => Set<Project>();

    public DbSet<BlogPost> Posts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.Property(p => p.Slug).HasMaxLength(120);
            entity.Property(p => p.Title).HasMaxLength(200);
            entity.Property(p => p.ShortDescription).HasMaxLength(500);
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.HasIndex(p => p.PublishedAt);
            entity.Property(p => p.Slug).HasMaxLength(120);
            entity.Property(p => p.Title).HasMaxLength(200);
            entity.Property(p => p.Excerpt).HasMaxLength(500);
        });
    }
}
