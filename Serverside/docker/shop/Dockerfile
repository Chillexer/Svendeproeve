FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 3030
EXPOSE 3031


FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src


COPY ["Shop/Api/ShopApi.csproj", "Shop/Api/"]
COPY ["DataAccess/Database/Database.csproj", "DataAccess/Database/"]
RUN dotnet restore "/src/Shop/Api/ShopApi.csproj"
COPY . .


# Shop
WORKDIR "/src/Shop/Api"
RUN dotnet build "ShopApi.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "ShopApi.csproj" -c Release -o /app/publish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FNO.Shop.ShopApi.dll"]