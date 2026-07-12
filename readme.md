# Vadhvan GOES Port – Smart Digital Twin Intelligent Platform

> **Smart Transit & Resource Synchronization Platform for Vadhvan Port**  
> Built for the **Odoo Hackathon 2026 – TransitOps Problem Statement**

---

## 🌊 Project Overview

The Vadhvan GOES Port Platform is a **production-ready Enterprise Port Operations ERP** built to digitize and intelligently synchronize all operational resources at Vadhvan Port, Maharashtra — India's upcoming deepest port.

This is **not** a simple fleet management system. It is a **full-stack Port Operations Command Platform** that coordinates:

- 🚢 Ship arrivals & dock allocation
- ⚓ Crane & equipment management  
- 🚛 Fleet (vehicles & drivers)
- 📦 Container tracking (dock → warehouse → rail/road)
- 🏭 Warehouse management
- 🚂 Rail dispatch operations
- 🔧 Maintenance & fuel management
- 📊 Real-time analytics & reports

---

## 🎯 Unique Selling Proposition

### PORT RESOURCE SYNCHRONIZATION

The platform's core USP is **intelligent resource synchronization**:

```
Ship Arrival → Dock Allocation → Crane Assignment → Vehicle Assignment
     ↓               ↓                  ↓                  ↓
Container Queue → Driver Assignment → Dispatch Engine → Delivery
     ↓               ↓                  ↓                  ↓
Warehouse → Rail/Road Movement → Destination
```

Every module communicates with every other module. Status changes propagate automatically via **Server-Sent Events (SSE)** — no manual refresh needed.

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI Framework |
| TypeScript | 5.6 | Type Safety |
| Vite | 6.x | Build Tool |
| Tailwind CSS | 3.x | Styling |
| Shadcn UI | Latest | UI Components |
| React Router | 7.x | Routing |
| React Hook Form + Zod | Latest | Forms & Validation |
| TanStack Query | 5.x | Data Fetching |
| Framer Motion | 11.x | Animations |
| Recharts | 2.x | Charts |
| Lucide React | Latest | Icons |
| Leaflet | 1.9 | Maps |
| Axios | 1.7 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.x | Web Framework |
| TypeScript | 5.x | Type Safety |
| Prisma ORM | 5.x | Database ORM |
| PostgreSQL | 15+ | Database |
| JWT | 9.x | Authentication |
| Bcrypt | 2.x | Password Hashing |
| Helmet | 8.x | Security Headers |
| CORS | 2.x | Cross-Origin |
| Morgan | 1.x | Request Logging |
| Zod | 3.x | Input Validation |
| express-rate-limit | 7.x | Rate Limiting |

---

## 🏗 Project Structure

```
oodu-Hackthon/
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # React Router + Provider setup
│   │   ├── main.tsx                   # Entry point
│   │   ├── index.css                  # Design system CSS
│   │   ├── components/
│   │   │   ├── layouts/               # AppLayout, Sidebar, TopNavBar
│   │   │   ├── ui/                    # StatusBadge, KPICard, etc.
│   │   │   └── charts/               # Recharts wrappers
│   │   ├── pages/
│   │   │   ├── auth/                  # Login
│   │   │   ├── dashboard/             # Operations Dashboard
│   │   │   ├── command-center/        # Port Command Center
│   │   │   ├── fleet/                 # Vehicle Management
│   │   │   ├── drivers/               # Driver Management
│   │   │   ├── trips/                 # Trip Management
│   │   │   ├── containers/            # Container Operations (Kanban)
│   │   │   ├── equipment/             # Equipment Management
│   │   │   ├── maintenance/           # Maintenance Dashboard
│   │   │   ├── fuel/                  # Fuel & Expenses
│   │   │   ├── ships/                 # Ship Arrival Module
│   │   │   ├── docks/                 # Dock Management
│   │   │   ├── warehouses/            # Warehouse Management
│   │   │   ├── rail/                  # Rail Dispatch
│   │   │   ├── reports/               # Reports & Export
│   │   │   ├── analytics/             # Analytics Dashboard
│   │   │   ├── notifications/         # Notification Center
│   │   │   └── settings/              # Settings
│   │   ├── contexts/                  # AuthContext, SSEContext
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── services/                  # Axios API services
│   │   ├── types/                     # TypeScript interfaces
│   │   └── utils/                     # Formatters, helpers
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── index.ts                   # Express app entry
│   │   ├── config/env.ts              # Environment variables
│   │   ├── middlewares/
│   │   │   ├── auth.ts                # JWT authentication
│   │   │   ├── role.ts                # RBAC middleware
│   │   │   ├── errorHandler.ts        # Global error handler
│   │   │   └── rateLimiter.ts         # Rate limiting
│   │   ├── validators/index.ts        # Zod schemas (all modules)
│   │   ├── services/                  # Business logic (15+ services)
│   │   ├── controllers/               # Request handlers
│   │   ├── routes/                    # Express routers
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # PostgreSQL schema (19 models)
│   │   │   └── seed.ts                # Realistic seed data
│   │   └── utils/
│   │       ├── jwt.ts                 # JWT sign/verify
│   │       ├── response.ts            # Response helpers
│   │       └── sseManager.ts          # SSE connection manager
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── Design/                            # UI reference designs (read-only)
├── Schema.sql                         # Original SQL reference
├── AI_MEMORY.md                       # Architecture memory (read first!)
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- PostgreSQL 15+
- npm or yarn

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE vadhvan_port;"

# Copy environment file
cd backend
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/vadhvan_port

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with realistic port data
npm run db:seed
```

### 3. Configure Environment

**Backend `.env`:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/vadhvan_port
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
PORT=5000
NODE_ENV=development
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SSE_URL=http://localhost:5000/api/events
```

### 4. Run Development Servers

```bash
# Terminal 1 – Backend
cd backend
npm run dev

# Terminal 2 – Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Demo Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vadhvanport.in | Admin@123 |
| Operations Manager | manager@vadhvanport.in | Manager@123 |
| Fleet Manager | fleet@vadhvanport.in | Fleet@123 |
| Driver | driver@vadhvanport.in | Driver@123 |

---

## 🏭 Module Documentation

### Port Command Center
The flagship module — a real-time operations command center displaying:
- Live ship positions and dock occupancy
- Container queue and movement tracking
- Resource availability (vehicles, drivers, cranes)
- Port Health Score (composite KPI)
- Active alerts and turnaround monitor

### Smart Resource Recommendation Engine
When a container request is created, the system automatically:
1. Evaluates all available vehicles by capacity, fuel level, health score
2. Evaluates all available drivers by safety score, license validity, experience
3. Scores each vehicle-driver combination
4. Returns the optimal recommendation with reasoning

### Smart Dispatch Engine
Validates all business rules before dispatch:
- Vehicle must be AVAILABLE (not IN_SHOP, ON_TRIP, or RETIRED)
- Driver must be AVAILABLE with valid license
- Cargo weight must not exceed vehicle capacity
- All status changes are **atomic** (Prisma transaction)

### Port Health Score
```
Score = (Fleet Availability × 0.25) + 
        (Equipment Availability × 0.20) + 
        (Trip Completion Rate × 0.20) + 
        (Fuel Efficiency × 0.10) + 
        (Maintenance Uptime × 0.15) + 
        (Dock Utilization × 0.10)

≥90 → EXCELLENT
70-89 → GOOD  
50-69 → AVERAGE
<50 → CRITICAL
```

---

## 🔐 Authentication & Authorization

- **JWT Access Token**: 15 minute expiry, in Authorization header
- **JWT Refresh Token**: 7 day expiry, in httpOnly cookie
- **Bcrypt**: 12 rounds for password hashing
- **Role-Based Access Control**: 5 role levels

| Role | Permissions |
|------|-------------|
| ADMIN | All modules including user management |
| OPERATIONS_MANAGER | Dashboard, trips, ships, docks, reports |
| FLEET_MANAGER | Vehicles, drivers, trips, fuel, maintenance |
| MAINTENANCE_SUPERVISOR | Maintenance, equipment, vehicles (read) |
| DRIVER | Own trips only |

---

## 📊 Database Schema

19 PostgreSQL tables via Prisma ORM:
- `users`, `vehicles`, `drivers`, `trips`
- `ships`, `docks`, `containers`, `container_requests`
- `equipment`, `maintenance_logs`, `fuel_logs`, `expenses`
- `warehouses`, `rail_tracks`, `gps_logs`
- `notifications`, `activity_logs`, `audit_logs`, `settings`

---

## 🌐 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication
```
POST /api/auth/login         # Login
POST /api/auth/register      # Register  
POST /api/auth/logout        # Logout
POST /api/auth/refresh       # Refresh token
GET  /api/auth/profile       # Get profile
PUT  /api/auth/profile       # Update profile
```

### Core Resources
```
/api/vehicles                # Fleet management
/api/drivers                 # Driver management
/api/trips                   # Trip lifecycle
/api/containers              # Container tracking
/api/equipment               # Equipment registry
/api/maintenance             # Maintenance records
/api/fuel                    # Fuel logs
/api/expenses                # Expense tracking
/api/ships                   # Ship arrivals
/api/docks                   # Dock management
/api/warehouses              # Warehouse management
/api/rail-tracks             # Rail dispatch
```

### Intelligence & Analytics
```
GET /api/analytics/kpis      # Dashboard KPIs
GET /api/analytics/charts    # Chart data
GET /api/port-health         # Port Health Score
GET /api/recommend           # Smart recommendation
GET /api/reports/[type]      # Various reports
GET /api/events              # SSE real-time stream
```

---

## 📡 Real-Time Updates (SSE)

The platform uses **Server-Sent Events** for live dashboard updates:

```javascript
const eventSource = new EventSource('/api/events', { withCredentials: true });
eventSource.addEventListener('trip_update', (e) => { /* update UI */ });
eventSource.addEventListener('vehicle_update', (e) => { /* update UI */ });
eventSource.addEventListener('dashboard_update', (e) => { /* refresh KPIs */ });
```

Events emitted on:
- Trip dispatch / completion / cancellation
- Vehicle status changes
- Maintenance open / close
- Container assignment

---

## 🐳 Docker

```bash
# Build and start all services
docker-compose up --build

# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
# DB:       postgresql://localhost:5432
```

### docker-compose.yml
```yaml
version: '3.9'
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: vadhvan_port
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    
  backend:
    build: ./backend
    depends_on: [db]
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/vadhvan_port
    ports: ["5000:5000"]
    
  frontend:
    build: ./frontend
    ports: ["5173:80"]
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

### Backend → Render / Railway
```bash
cd backend
npm run build
# Deploy with DATABASE_URL pointing to production PostgreSQL
```

### Database → Supabase / Render PostgreSQL
```bash
# Set DATABASE_URL in backend environment
# Run: npm run db:migrate
# Run: npm run db:seed
```

---

## 🧪 Build Commands

```bash
# Frontend
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check

# Backend
npm run dev       # Development with hot reload (tsx watch)
npm run build     # TypeScript compile
npm run start     # Production start
npm run db:generate  # Prisma client generate
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Prisma Studio
```

---

## 🎨 Design System

Inspired by **SAP Fiori**, **Oracle Fusion**, **IBM Maximo**, **Stripe Dashboard**, and **Odoo Enterprise**.

| Element | Value |
|---------|-------|
| Font | Inter (Google Fonts) |
| Sidebar | #0B1F33 (Deep Navy) |
| Primary CTA | #2D5BFF (Port Blue) |
| Success | #27AE60 |
| Warning | #F5A623 |
| Error | #E74C3C |
| Background | #F7F9FC |
| Cards | White + soft shadow |

**Design Rules:**
- ✅ Dark sidebar + Light workspace
- ✅ Professional tables with sticky headers
- ✅ Color-coded status badges
- ✅ KPI cards with trend indicators
- ✅ Interactive Recharts charts
- ❌ No landing pages
- ❌ No hero images or ocean backgrounds
- ❌ No 3D illustrations

---

## 📈 Business Rules Enforced

1. Retired vehicles never appear in dispatch list
2. In-maintenance vehicles never appear in dispatch list
3. Vehicles already ON_TRIP cannot be assigned again
4. Drivers with expired licenses cannot be assigned
5. Suspended drivers cannot be assigned
6. Drivers already ON_TRIP cannot be assigned again
7. Cargo weight cannot exceed vehicle maximum capacity
8. Opening maintenance automatically sets vehicle to IN_SHOP
9. Closing maintenance restores vehicle to AVAILABLE (unless RETIRED)
10. Dispatching a trip atomically sets both vehicle and driver to ON_TRIP
11. Completing/cancelling a trip atomically restores availability

---

## 🏆 Hackathon Context

**Event**: Odoo Hackathon 2026  
**Problem Statement**: TransitOps  
**Theme**: Smart Port Operations & Resource Synchronization  
**Inspiration**: Vadhvan Port, Maharashtra – India's upcoming deepest container port

The platform demonstrates how a modern ERP can coordinate the complete operational workflow of a major port through intelligent resource synchronization, reducing manual coordination and minimizing container turnaround time.

---

## 👥 Team

Built with ❤️ for Odoo Hackathon 2026

---

*Last Updated: July 2026*
