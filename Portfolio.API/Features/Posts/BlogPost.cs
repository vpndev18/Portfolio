namespace Portfolio.API.Features.Posts;

public class BlogPost
{
    public int Id { get; set; }

    public string Slug { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Excerpt { get; set; } = string.Empty;

    // Markdown body, rendered on the frontend with react-markdown.
    public string Content { get; set; } = string.Empty;

    public List<string> Tags { get; set; } = new();

    // Null = draft. Filtered out of public list/detail endpoints.
    public DateTime? PublishedAt { get; set; }

    public int ReadingMinutes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
