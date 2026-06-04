# Stage build - SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src
COPY *.sln ./
COPY DHM.API/*.csproj DHM.API/
COPY DHM.Application/*.csproj DHM.Application/
COPY DHM.Domain/*.csproj DHM.Domain/
COPY DHM.Infrastructure/*.csproj DHM.Infrastructure/
COPY DHM.IntegrationTests/*.csproj DHM.IntegrationTests/
COPY DHM.UnitTests/*.csproj DHM.UnitTests/

RUN dotnet restore DHM.API/DHM.API.csproj

COPY . .
RUN dotnet publish DHM.API/DHM.API.csproj -c Release -o /out /p:UseAppHost=false

# Stage runtime - doar ASP.NET, fara SDK
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine
WORKDIR /app
COPY --from=build /out .
RUN (addgroup -S app 2>/dev/null || true) \
 && (adduser -S -G app app 2>/dev/null || true) \
 && chown -R app:app /app
USER app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "DHM.API.dll"]
