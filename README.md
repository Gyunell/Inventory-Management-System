# Inventory Management System

Full-stack web app for tracking products in an inventory. You can add, edit, delete, search and filter products, and see live statistics about the total number of products, total quantity and the overall inventory value.

This project was made for an internship, mentors heavily helped with backend side

**Live demo:** [Click](https://inv-management-system.runasp.net)

> **Note:** The demo is hosted on a free plan and has no authentication, so anyone can add, edit or delete products. The data may change or be reset at any time.

## Features

- Add, edit and delete products
- Search by id, name, category, price or quantity
- Filter by category
- Dashboard with total products, total quantity and inventory value
- Responsive design

## Tech Stack

- **Backend:** C#, ASP.NET Core (.NET 10), Web API
- **Database:** SQLite with Entity Framework Core (migrations)
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Hosting:** MonsterASP.NET

## API Endpoints

| Method | Endpoint             | Description                                      |
| ------ | -------------------- | ------------------------------------------------ |
| GET    | `/api/products`      | Get all products (supports `search`, `category`) |
| GET    | `/api/products/{id}` | Get a product by ID                              |
| POST   | `/api/products`      | Create a new product                             |
| PUT    | `/api/products/{id}` | Update an existing product                       |
| DELETE | `/api/products/{id}` | Delete a product                                 |

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Git](https://git-scm.com/downloads)

### Run locally

```bash
git clone https://github.com/Gyunell/Inventory-Management-System.git
cd Inventory-Management-System
dotnet run
```

Open the address shown in the terminal (for example `http://localhost:5000`). The database is created automatically on the first run, so no extra setup is needed.

If your browser shows a certificate warning when using `https`, run this command once and restart the app:

```bash
dotnet dev-certs https --trust
```

## Project Structure

```
InventoryManagement/
├── Controllers/    # API controllers
├── Data/           # Database context
├── Migrations/     # EF Core migrations
├── Models/         # Data models
├── wwwroot/        # Frontend (HTML, CSS, JS)
└── Program.cs      # Application entry point
```

## Possible Improvements

- User authentication
- Pagination for large inventories
