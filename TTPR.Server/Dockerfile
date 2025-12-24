# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy only the project file first
COPY ["TTPR.Server.csproj", "./"]

# Restore dependencies
RUN dotnet restore "./TTPR.Server.csproj"

# Copy the rest of the source code
COPY . .

# Publish the app
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "TTPR.Server.dll"]
