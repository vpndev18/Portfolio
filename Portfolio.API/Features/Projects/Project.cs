namespace Portfolio.API.Features.Projects;

public class Project
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string ShortDescription { get; set; } = string.Empty;

    public string LongDescription { get; set; } = string.Empty;

    public string? LiveUrl { get; set; }

    public string? RepoUrl { get; set; }

    public List<string> TechStack { get; set; } = new();

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
