namespace Portfolio.API.Auth;

// Endpoint filter that checks the X-Admin-Key header against Admin:Key config.
// This is a deliberately small auth surface for a one-person admin: JWT/Identity
// would be overkill at this stage. Phase 3.5 may upgrade to per-user accounts.
public sealed class AdminKeyFilter : IEndpointFilter
{
    private readonly string? _expected;

    public AdminKeyFilter(IConfiguration config)
    {
        _expected = config["Admin:Key"];
    }

    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        if (string.IsNullOrEmpty(_expected))
        {
            return Results.Problem(
                title: "Admin auth not configured.",
                detail: "Admin:Key must be set in configuration before admin endpoints can be used.",
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var provided = context.HttpContext.Request.Headers["X-Admin-Key"].ToString();
        if (!CryptographicEquals(provided, _expected))
        {
            return Results.Unauthorized();
        }

        return await next(context);
    }

    // Constant-time compare so the response time doesn't leak the key.
    private static bool CryptographicEquals(string a, string b)
    {
        if (a.Length != b.Length)
        {
            return false;
        }
        var result = 0;
        for (var i = 0; i < a.Length; i++)
        {
            result |= a[i] ^ b[i];
        }
        return result == 0;
    }
}
