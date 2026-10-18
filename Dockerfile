FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .

RUN mkdir -p /data

ENV ASPNETCORE_HTTP_PORTS=8080
ENV ConnectionStrings__Default="Data Source=/data/inventory.db"

EXPOSE 8080
ENTRYPOINT ["dotnet", "InventoryManagement.dll"]