# Student Management System

Full-stack Student Management System built for the **Zest India IT Pvt Ltd – Full Stack Developer Technical Assignment**.

The solution includes an ASP.NET Core Web API backend with JWT authentication and a React + Tailwind CSS frontend for managing student records.

## Features

### Backend (ASP.NET Core Web API)

- Student CRUD APIs
- JWT Bearer authentication
- Global exception handling middleware
- Structured logging with Serilog
- Swagger/OpenAPI documentation with JWT support
- Layered architecture (Controller → Service → Repository)
- SQL Server database with Entity Framework Core

### Frontend (React + Tailwind CSS)

- JWT login and logout
- Protected routes with session validation
- Student dashboard with summary stats
- Responsive student table (desktop table + mobile cards)
- Create, edit, and delete students
- Client-side search and pagination
- Form validation with server error mapping
- Loading indicators and toast notifications
- Session expiry handling with automatic redirect to login

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Backend  | .NET 8, EF Core 8, SQL Server, JWT, Serilog       |
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS |
| Auth     | JWT Bearer tokens                                 |

## Project Structure

```
zest-india/
├── docker-compose.yml                 # SQL Server for local development
├── frontend/                          # React SPA
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   ├── context/                   # Auth context
│   │   ├── hooks/                     # Custom hooks
│   │   ├── layouts/                   # Page layouts
│   │   ├── pages/                     # Login & Dashboard
│   │   ├── routes/                    # React Router config
│   │   ├── services/                  # API client & services
│   │   └── utils/                     # Token storage & error helpers
│   └── .env.example
└── src/ZestIndia.StudentManagement.Api/  # ASP.NET Core API
    ├── Controllers/
    ├── Services/
    ├── Repositories/
    ├── Data/
    ├── Middleware/
    └── Models/
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) and npm
- SQL Server — **LocalDB**, full SQL Server, or **Docker** (recommended if LocalDB is not installed)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional, for containerized SQL Server)

## Getting Started

### 1. Clone the repository

```powershell
git clone <your-repo-url>
cd zest-india
```

### 2. Start SQL Server (Docker — recommended)

If you don't have LocalDB or SQL Server installed, start SQL Server in Docker:

```powershell
docker compose up -d
```

This starts SQL Server on `localhost:1433` with:
- **SA password:** `ZestIndia@12345`
- **Database:** created automatically on first API run

> **Note:** Wait ~30 seconds after starting the container before running the API.

The Development connection string in `appsettings.Development.json` is preconfigured for this Docker setup.

### 3. Configure and run the backend

```powershell
cd src/ZestIndia.StudentManagement.Api
dotnet restore
$env:ASPNETCORE_ENVIRONMENT="Development"
dotnet run --urls "http://localhost:5000"
```

- API URL: **http://localhost:5000**
- Swagger UI: **http://localhost:5000/swagger**

For LocalDB instead of Docker, use the default `appsettings.json` connection string and run without setting `ASPNETCORE_ENVIRONMENT`.

### 4. Configure and run the frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Ensure `.env` contains:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Open **http://localhost:5173** in your browser.

### 5. Sign in

| Field    | Value       |
| -------- | ----------- |
| Username | `admin`     |
| Password | `Admin@123` |

## API Endpoints

| Method   | Endpoint              | Auth | Description        |
| -------- | --------------------- | ---- | ------------------ |
| `POST`   | `/api/auth/login`     | No   | Obtain JWT token   |
| `GET`    | `/api/students`       | JWT  | List all students  |
| `GET`    | `/api/students/{id}`  | JWT  | Get student by ID  |
| `POST`   | `/api/students`       | JWT  | Create student     |
| `PUT`    | `/api/students/{id}`  | JWT  | Update student     |
| `DELETE` | `/api/students/{id}`  | JWT  | Delete student     |

### Authentication flow

1. `POST /api/auth/login` with credentials → receive `accessToken` and `expiresAtUtc`
2. Frontend stores the token in `sessionStorage`
3. All student requests include `Authorization: Bearer <token>`
4. On 401 or expired session, the user is redirected to the login page

## Database Schema

**Student** table:

| Column       | Type     | Notes                    |
| ------------ | -------- | ------------------------ |
| Id           | int      | Primary key              |
| Name         | string   | Max 100 chars            |
| Email        | string   | Unique, max 150 chars    |
| Age          | int      | Range 1–120              |
| Course       | string   | Max 100 chars            |
| CreatedDate  | datetime | UTC, auto-set on create  |

The database is created automatically on first startup.

## Production Build (Frontend)

```powershell
cd frontend
npm run build
npm run preview
```

## Troubleshooting

| Issue | Solution |
| ----- | -------- |
| CORS errors | Ensure the frontend runs on `http://localhost:5173` and the origin is listed in `appsettings.json` → `Cors:AllowedOrigins` |
| Database connection failed | Start Docker SQL Server with `docker compose up -d`, or install LocalDB / SQL Server |
| LocalDB not found | Use Docker SQL Server (see step 2) and run API with `ASPNETCORE_ENVIRONMENT=Development` |
| 401 on student calls | Log in again; JWT tokens expire after 60 minutes |
| API URL mismatch | Set `VITE_API_BASE_URL=http://localhost:5000` in `frontend/.env` |

## Assignment Checklist

- [x] Student CRUD APIs
- [x] JWT Authentication
- [x] Global Exception Handling
- [x] Logging (Serilog)
- [x] Swagger Documentation
- [x] Layered Architecture
- [x] SQL Server Database
- [x] React Frontend with Tailwind CSS
- [x] Protected Routes & Auth Integration
- [x] Docker SQL Server support
- [x] README with Setup Steps

## License

Built as a technical assignment submission for Zest India IT Pvt Ltd.
