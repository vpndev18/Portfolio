using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Auth;
using Portfolio.API.Features.Posts;
using Portfolio.API.Features.Projects;
using Portfolio.API.Middleware;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ─── Logging ──────────────────────────────────────────────────────────────
// Replace the default ILogger pipeline with Serilog. Config comes from
// the "Serilog" section in appsettings.json (sinks, levels, enrichers).
builder.Host.UseSerilog((ctx, config) =>
    config.ReadFrom.Configuration(ctx.Configuration));

// ─── Services ─────────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// ─── Output caching ───────────────────────────────────────────────────────
// Public content changes only when the admin edits it, so we cache responses
// in-process and evict by tag on write. This is the second line of defence —
// the Cloudflare Worker in front of us absorbs most reads before they land here.
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("Content", policy => policy
        .Expire(TimeSpan.FromMinutes(5))
        .Tag(CacheTags.Content));
});

// Exception handling: ASP.NET Core 8's IExceptionHandler pattern + ProblemDetails.
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Admin auth filter is read per-request from IConfiguration.
builder.Services.AddScoped<AdminKeyFilter>();

// CORS for the SPA. In dev we always allow http://localhost:5173; in prod
// add the deployed origin(s) to Cors:AllowedOrigins in configuration.
var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();
var allowedOrigins = new[] { "http://localhost:5173" }
    .Concat(configuredOrigins)
    .Distinct()
    .ToArray();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Web", p => p
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

// ─── Middleware pipeline (order matters) ──────────────────────────────────
// ExceptionHandler MUST be first so it catches anything later in the pipeline.
app.UseExceptionHandler();

// Logs one structured line per HTTP request: method, path, status, duration.
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Render terminates TLS at the edge and forwards plain HTTP to the container, so
// an in-container HTTPS redirect would bounce healthy requests. Dev keeps it.
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Web");

// Tell Cloudflare (and browsers) how long public GETs stay fresh. `s-maxage`
// governs the edge cache, `stale-while-revalidate` lets the edge serve slightly
// stale content instantly while it refreshes in the background — so a sleeping
// machine or a suspended Neon compute is never on a visitor's critical path.
app.Use(async (ctx, next) =>
{
    ctx.Response.OnStarting(() =>
    {
        if (HttpMethods.IsGet(ctx.Request.Method)
            && ctx.Response.StatusCode == StatusCodes.Status200OK
            && ctx.Request.Path.StartsWithSegments("/api")
            && !ctx.Request.Path.StartsWithSegments("/api/admin"))
        {
            ctx.Response.Headers.CacheControl =
                "public, max-age=60, s-maxage=600, stale-while-revalidate=86400";
        }
        return Task.CompletedTask;
    });

    await next();
});

app.UseOutputCache();

// ─── Endpoint registration ────────────────────────────────────────────────
app.MapProjectsEndpoints();
app.MapPostsEndpoints();
app.MapAdminPostsEndpoints();

// Cheap liveness probe that never touches the database — used as the Render health
// check so a health ping can't wake Neon or block on a slow query.
app.MapGet("/health", () => Results.Ok(new { status = "ok" }))
   .ExcludeFromDescription();

// ─── Migrate + seed ───────────────────────────────────────────────────────
// Off the startup path by default: this used to run on every cold boot, adding a
// full round-trip to a possibly-suspended Neon compute before the app served its
// first request. Set RunMigrationsOnStartup=true for a deploy that needs it.
if (app.Configuration.GetValue<bool>("RunMigrationsOnStartup"))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

app.Run();
