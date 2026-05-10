using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
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

// Exception handling: ASP.NET Core 8's IExceptionHandler pattern + ProblemDetails.
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

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

app.UseHttpsRedirection();

// ─── Endpoint registration ────────────────────────────────────────────────
app.MapProjectsEndpoints();
app.MapPostsEndpoints();

// ─── Migrate + seed on startup ────────────────────────────────────────────
// Convenience for a small single-instance app. We'd reconsider for a
// multi-replica production deployment (race conditions on concurrent migrate).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

app.Run();
