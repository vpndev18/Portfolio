# syntax=docker/dockerfile:1.7
# Multi-stage build: SDK image to compile + publish, slim ASP.NET runtime to serve.
# Build context expected at the repo root (so we can reference Portfolio.API/...).
#
#   docker build -t portfolio-api -f Portfolio.API/Dockerfile .
#   docker run --rm -p 8080:8080 \
#     -e ConnectionStrings__Default='Host=...;Port=5432;Database=...;Username=...;Password=...' \
#     -e Admin__Key='your-real-secret' \
#     -e Cors__AllowedOrigins__0='https://vallabh.dev' \
#     portfolio-api

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore as a separate layer for better caching.
COPY Portfolio.API/Portfolio.API.csproj Portfolio.API/
RUN dotnet restore Portfolio.API/Portfolio.API.csproj

COPY Portfolio.API/ Portfolio.API/
RUN dotnet publish Portfolio.API/Portfolio.API.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Run as a non-root user (the aspnet image ships an `app` user pre-created).
USER app

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 8080
ENTRYPOINT ["dotnet", "Portfolio.API.dll"]
