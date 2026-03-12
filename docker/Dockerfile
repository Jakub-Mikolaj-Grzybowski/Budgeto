# ============================================================
# Dockerfile — backend (.NET 10 API)
# ============================================================

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY global.json Directory.Build.props Directory.Packages.props ./
COPY src/ src/

RUN dotnet restore src/Web/Web.csproj

RUN dotnet publish src/Web/Web.csproj \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:SKIP_NPM_BUILD=true \
    /p:SkipNSwag=true

# ============================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Budgeto.Web.dll"]
