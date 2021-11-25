#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 3010
EXPOSE 3011

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src


COPY ["User/Api/UserApi.csproj", "User/Api/"]
COPY ["Auth/Auth0Library/Auth0Library.csproj", "Auth/Auth0Library/"]
RUN dotnet restore "/src/User/Api/UserApi.csproj"
COPY . .

WORKDIR "/src/User/Api"
RUN dotnet build "UserApi.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "UserApi.csproj" -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FNO.User.UserApi.dll"]