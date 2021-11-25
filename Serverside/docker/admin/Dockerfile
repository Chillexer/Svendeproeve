FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 3020
EXPOSE 3021

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Admin/Api/AdminApi.csproj", "Admin/Api/"]
COPY ["DataAccess/Database/Database.csproj", "DataAccess/Database/"]
COPY ["Auth/Auth0Library/Auth0Library.csproj", "Auth/Auth0Library/"]
RUN dotnet restore "/src/Admin/Api/AdminApi.csproj"
COPY . .

# Admin
WORKDIR "/src/Admin/Api"
RUN dotnet build "AdminApi.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "AdminApi.csproj" -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FNO.Admin.AdminApi.dll"]

