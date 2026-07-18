namespace Portfolio.API.Data;

/// <summary>
/// Tags used to group cached responses so admin writes can evict them.
/// One tag covers all public content — the site is small enough that
/// finer-grained invalidation would be complexity without payoff.
/// </summary>
public static class CacheTags
{
    public const string Content = "content";
}
