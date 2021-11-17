# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY Server/*.csproj ./Server/
COPY Server.UnitTest/*.csproj ./Server.UnitTest/
RUN dotnet restore

# copy everything else and build app
COPY Server/. ./Server/
WORKDIR /source/Server
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:3.1
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "Server.dll"]