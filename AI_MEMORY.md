# 🧠 AI_MEMORY.md — Vadhvan GOES Port Platform
> **Last Updated**: 2026-07-12 (Session 2)
> **Purpose**: Prevent context rot. Read this FIRST before any work session.

---

## 📌 PROJECT IDENTITY

| Field | Value |
|-------|-------|
| **Project Name** | Vadhvan GOES Port – Smart Digital Twin Intelligent Platform |
| **Tagline** | Smart Transit & Resource Synchronization Platform for Vadhvan Port |
| **Event** | Odoo Hackathon 2026 – TransitOps Problem Statement |
| **Type** | Enterprise Port Operations ERP (NOT a simple fleet management system) |
| **Real-world Inspiration** | Vadhvan Port, Maharashtra, India |

---

## 🏗 ARCHITECTURE OVERVIEW

### Monorepo Structure
```
oodu-Hackthon/
├── frontend/          ← React 19 + TypeScript + Vite + Tailwind + Shadcn
├── backend/           ← Node.js + Express + TypeScript + Prisma + PostgreSQL
├── Design/            ← Reference UI designs (DO NOT MODIFY)
├── AI_MEMORY.md       ← This file (read first every session)
├── README.md          ← Full project documentation
└── Schema.sql         ← Original SQL reference schema
```

### Frontend Stack
- React 19, TypeScript, Vite
- Tailwind CSS (v3) – custom design system tokens
- Shadcn UI + Radix UI components
- React Router v7 (BrowserRouter, nested routes)
- React Hook Form + Zod (all forms)
- TanStack Query v5 (React Query) – all data fetching
- Framer Motion (animations)
- Recharts (all charts)
- Lucide Icons
- Leaflet + React Leaflet (maps)
- Axios with interceptors (auto token refresh)

### Backend Stack
- Node.js + Express.js + TypeScript
- JWT Authentication: accessToken (15min) + refreshToken (7d, httpOnly cookie)
- Bcrypt (12 rounds), Helmet, CORS, Morgan, Compression
- Prisma ORM → PostgreSQL
- Server-Sent Events (SSE) for real-time updates via sseManager
- Rate limiting (100/15min general, 10/15min auth)
- Zod validation on all inputs
- Role-based access control middleware

---

## 🎨 DESIGN SYSTEM

### Color Palette (from Design/portsync/DESIGN.md)
```
Primary (Deep Navy):     #0B1F33  → tailwind: bg-primary, bg-port-navy (sidebar)
Secondary (Port Blue):   #2D5BFF  → tailwind: bg-secondary (CTAs, active nav)
Success Green:           #27AE60  → tailwind: bg-success, text-success
Warning Orange:          #F5A623  → tailwind: bg-warning, text-warning
Danger Red:              #E74C3C  → tailwind: bg-error, text-error
Background:              #F7F9FC  → tailwind: bg-background
Surface/Cards:           #FFFFFF  → tailwind: bg-surface
Border:                  #C4C6CD  → tailwind: border-outline-variant
Text Primary:            #191C1E  → tailwind: text-on-surface
Text Secondary:          #44474C  → tailwind: text-on-surface-variant
```

### Typography Scale
- `text-display-lg`: 32px/700 – page display headers
- `text-headline-md`: 24px/600 – section headings
- `text-headline-sm`: 20px/600 – card headers
- `text-title-lg`: 18px/600 – subsection titles
- `text-body-md`: 16px/400 – body text
- `text-body-sm`: 14px/400 – secondary text
- `text-label-md`: 12px/600 – labels, table headers
- `text-label-sm`: 11px/500 – micro labels
- `text-data`: 13px/400 – table cell data

### Layout Constants
- Sidebar: 240px expanded, 72px collapsed, bg `#0B1F33`
- TopNav: 64px height, white, shadow
- Cards: `rounded-md`, `border border-outline-variant`, `shadow-card`
- Buttons: `rounded`, primary `#2D5BFF`, secondary `#0B1F33` outline

### CSS Classes (from index.css)
- `.card` – white card base
- `.kpi-card` – KPI card with padding
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`, `.badge-neutral`
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-success`
- `.form-input`, `.form-label`, `.form-error`
- `.data-table` – professional table styles
- `.nav-item-active`, `.nav-item-inactive`
- `.kanban-column`, `.kanban-card`
- `.live-dot` – animated live indicator

---

## 🗄️ DATABASE SCHEMA (PostgreSQL via Prisma)

### Location: `backend/src/prisma/schema.prisma`

### Prisma Model Names (EXACT - use these in code)
1. **User** → table `users`
2. **Vehicle** → table `vehicles`
3. **Driver** → table `drivers`
4. **Ship** → table `ships`
5. **Dock** → table `docks`
6. **Warehouse** → table `warehouses`
7. **RailTrack** → table `rail_tracks`
8. **Container** → table `containers`
9. **ContainerRequest** → table `container_requests`
10. **Equipment** → table `equipment`
11. **Trip** → table `trips`
12. **MaintenanceLogs** → table `maintenance_logs` (**NOTE: plural "Logs"**)
13. **FuelLog** → table `fuel_logs`
14. **Expense** → table `expenses`
15. **Notification** → table `notifications`
16. **ActivityLog** → table `activity_logs`
17. **AuditLog** → table `audit_logs`
18. **GpsLog** → table `gps_logs`
19. **Settings** → table `settings`

### ⚠️ CRITICAL: MaintenanceLogs is PLURAL (not MaintenanceLog)
Always import as: `prisma.maintenanceLogs.findMany(...)` etc.

### Key Enums
```typescript
VehicleStatus: AVAILABLE | ON_TRIP | IN_SHOP | RETIRED
DriverStatus: AVAILABLE | ON_TRIP | OFF_DUTY | SUSPENDED
TripStatus: DRAFT | APPROVED | DISPATCHED | LOADING | IN_TRANSIT | DELIVERED | COMPLETED | CANCELLED
ContainerStatus: WAITING | ALLOCATED | LOADING | IN_TRANSIT | DELIVERED | CANCELLED
EquipmentStatus: AVAILABLE | BUSY | MAINTENANCE | OFFLINE
MaintenanceStatus: OPEN | IN_PROGRESS | COMPLETED
ShipStatus: WAITING | DOCKED | LOADING | UNLOADING | COMPLETED | DEPARTED
DockStatus: AVAILABLE | OCCUPIED | MAINTENANCE
```

---

## 🔐 AUTHENTICATION & ROLES

### JWT Strategy
- Access token: 15min expiry, signed with JWT_SECRET
- Refresh token: 7 days, stored in httpOnly cookie named `refreshToken`
- Bcrypt rounds: 12 (from BCRYPT_ROUNDS env)

### Token Flow
1. POST /api/auth/login → returns accessToken in body + sets refreshToken cookie
2. Frontend stores accessToken in localStorage
3. Axios interceptor adds `Authorization: Bearer {token}` to all requests
4. On 401 response, interceptor calls /api/auth/refresh with cookie
5. If refresh fails → redirect to /login

### Roles & Permissions
| Role | Access Level |
|------|-------------|
| ADMIN | Full access to everything including users management |
| OPERATIONS_MANAGER | Dashboard, trips, containers, ships, docks, reports, analytics |
| FLEET_MANAGER | Vehicles, drivers, trips, fuel, maintenance |
| MAINTENANCE_SUPERVISOR | Maintenance, vehicles (read), equipment |
| DRIVER | Own trips only |

---

## 📁 COMPLETE FOLDER STRUCTURE

### Frontend (`frontend/src/`)
```
├── App.tsx                          ← Router + Provider setup
├── main.tsx                         ← React entry point
├── index.css                        ← Design system CSS
├── components/
│   ├── layouts/
│   │   ├── AppLayout.tsx            ← Sidebar + TopNav + Outlet
│   │   ├── Sidebar.tsx              ← Dark nav sidebar
│   │   └── TopNavBar.tsx            ← Search, notifs, profile
│   ├── ui/
│   │   ├── StatusBadge.tsx          ← Colored status badges
│   │   ├── HealthScore.tsx          ← Color-coded health display
│   │   ├── KPICard.tsx              ← Dashboard KPI cards
│   │   ├── LoadingSpinner.tsx       ← Loading indicator
│   │   ├── EmptyState.tsx           ← Empty table/list state
│   │   └── ConfirmDialog.tsx        ← Delete confirmation
│   ├── charts/
│   │   ├── AreaChartWidget.tsx      ← Recharts AreaChart wrapper
│   │   ├── BarChartWidget.tsx       ← Recharts BarChart wrapper
│   │   ├── PieChartWidget.tsx       ← Recharts PieChart + legend
│   │   └── LineChartWidget.tsx      ← Recharts LineChart wrapper
│   └── forms/ (if needed for complex reusable forms)
├── pages/
│   ├── auth/LoginPage.tsx           ← Enterprise login (2-column)
│   ├── dashboard/DashboardPage.tsx  ← KPIs + charts + alerts
│   ├── command-center/CommandCenterPage.tsx ← Port Command Center
│   ├── fleet/FleetPage.tsx          ← Vehicle CRUD table
│   ├── drivers/DriversPage.tsx      ← Driver CRUD table
│   ├── trips/TripsPage.tsx          ← Trip management + timeline
│   ├── containers/ContainersPage.tsx ← Kanban board + table
│   ├── equipment/EquipmentPage.tsx  ← Equipment cards/table
│   ├── maintenance/MaintenancePage.tsx ← Maintenance dashboard
│   ├── fuel/FuelPage.tsx            ← Fuel & expenses (tabbed)
│   ├── ships/ShipsPage.tsx          ← Ship arrival module
│   ├── docks/DocksPage.tsx          ← Dock management
│   ├── warehouses/WarehousesPage.tsx ← Warehouse management
│   ├── rail/RailPage.tsx            ← Rail dispatch
│   ├── reports/ReportsPage.tsx      ← Reports + CSV export
│   ├── analytics/AnalyticsPage.tsx  ← Analytics charts
│   ├── notifications/NotificationsPage.tsx ← Notification center
│   └── settings/SettingsPage.tsx    ← Settings module
├── hooks/
│   ├── useSSE.ts                    ← EventSource subscription
│   └── useAuth.ts                   ← Re-export from AuthContext
├── contexts/
│   ├── AuthContext.tsx              ← Auth state + login/logout
│   └── SSEContext.tsx               ← SSE connection
├── services/
│   └── api.ts                       ← All Axios API calls
├── types/
│   └── index.ts                     ← All TypeScript interfaces
└── utils/
    └── index.ts                     ← Formatters, helpers, scoring
```

### Backend (`backend/src/`)
```
├── index.ts                         ← Express app entry, all middleware
├── config/
│   └── env.ts                       ← Environment variables config
├── middlewares/
│   ├── auth.ts                      ← JWT verify middleware
│   ├── role.ts                      ← requireRole() factory
│   ├── errorHandler.ts              ← Global error handler
│   └── rateLimiter.ts               ← express-rate-limit configs
├── validators/
│   └── index.ts                     ← All Zod schemas
├── services/
│   ├── auth.service.ts
│   ├── vehicle.service.ts
│   ├── driver.service.ts
│   ├── trip.service.ts              ← dispatch engine (atomic)
│   ├── container.service.ts
│   ├── equipment.service.ts
│   ├── maintenance.service.ts       ← open/close with vehicle status
│   ├── fuel.service.ts
│   ├── expense.service.ts
│   ├── ship.service.ts              ← dock/depart logic
│   ├── dock.service.ts
│   ├── warehouse.service.ts
│   ├── rail.service.ts
│   ├── analytics.service.ts         ← KPIs, charts data
│   ├── report.service.ts
│   ├── portHealth.service.ts        ← Port Health Score formula
│   ├── recommend.service.ts         ← Smart recommendation engine
│   ├── notification.service.ts
│   ├── activityLog.service.ts
│   └── settings.service.ts
├── controllers/
│   └── [module].controller.ts       ← One per service, thin layer
├── routes/
│   └── [module].routes.ts           ← Express Router per module
├── prisma/
│   ├── schema.prisma                ← Complete DB schema
│   └── seed.ts                      ← Seed realistic port data
└── utils/
    ├── jwt.ts                       ← sign/verify JWT
    ├── response.ts                  ← sendSuccess/sendError helpers
    └── sseManager.ts               ← SSE connection manager
```

---

## 🚀 KEY MODULES & BUSINESS LOGIC

### Smart Dispatch Engine (trip.service.ts)
```
dispatch(tripId) → ATOMIC TRANSACTION:
  1. Load trip with vehicle and driver
  2. Validate: vehicle.status === AVAILABLE
  3. Validate: driver.status === AVAILABLE
  4. Validate: driver.licenseExpiry > now()
  5. Validate: trip.cargoWeight <= vehicle.maxCapacity
  6. If any fail → throw 422 error with reason
  7. If all pass → prisma.$transaction([
       trip.update(status=DISPATCHED, dispatchedAt=now()),
       vehicle.update(status=ON_TRIP),
       driver.update(status=ON_TRIP)
     ])
  8. Emit SSE: trip_update, vehicle_update, driver_update
  9. Log activity
```

### Complete Trip (trip.service.ts)
```
complete(tripId) → ATOMIC:
  1. Set trip.status = COMPLETED, completedAt = now()
  2. Set vehicle.status = AVAILABLE
  3. Set driver.status = AVAILABLE
  4. Emit SSE events
```

### Open Maintenance (maintenance.service.ts)
```
open/createMaintenance(data) →
  1. Create MaintenanceLogs record
  2. If vehicleId → set vehicle.status = IN_SHOP
  3. Vehicle disappears from available list automatically
```

### Close Maintenance (maintenance.service.ts)
```
close(id, cost) →
  1. Set MaintenanceLogs.status = COMPLETED, completedAt = now(), cost = finalCost
  2. If vehicleId → check vehicle.status ≠ RETIRED → set vehicle.status = AVAILABLE
  3. Emit SSE events
```

### Smart Recommendation Engine (recommend.service.ts)
```
getRecommendation(cargoWeight, sourceDockId?, destination?) →
  1. Find available vehicles: status=AVAILABLE, maxCapacity >= cargoWeight
  2. Find available drivers: status=AVAILABLE, licenseExpiry > now()
  3. For each (vehicle, driver) pair, compute score:
     fuelScore = vehicle.fuelLevel / 100 * 30
     healthScore = vehicle.healthScore / 100 * 25
     safetyScore = driver.safetyScore / 100 * 25
     expScore = min(driver.experienceYears / 10, 1) * 20
     total = fuelScore + healthScore + safetyScore + expScore
  4. Sort by total score DESC
  5. Return best match with reasons array
```

### Port Health Score Formula (portHealth.service.ts)
```
score = 
  (availableVehicles / totalVehicles) * 25 +
  (availableEquipment / totalEquipment) * 20 +
  (completedTrips / (completedTrips + cancelledTrips + 1)) * 20 +
  (avgFuelEfficiency / maxExpectedEfficiency) * 10 +
  (1 - (inShopVehicles / totalVehicles)) * 15 +
  (availableDocks / totalDocks) * 10

Rating: ≥90 EXCELLENT, 70-89 GOOD, 50-69 AVERAGE, <50 CRITICAL
```

---

## 📡 REAL-TIME (SSE)

### Endpoint: `GET /api/events`
- Returns text/event-stream with proper headers
- sseManager.addClient(res) on connection
- sseManager.broadcast(eventType, data) on state changes

### Event Types
- `dashboard_update` – KPI refresh trigger
- `trip_update` – trip status changed
- `vehicle_update` – vehicle status changed
- `driver_update` – driver status changed
- `maintenance_alert` – maintenance opened/closed
- `container_update` – container status changed
- `notification` – new notification created

### Frontend SSE Hook (SSEContext.tsx)
- Creates EventSource on mount
- Publishes events via context
- React Query invalidateQueries on relevant events

---

## 🌐 API ROUTES REFERENCE

### Auth (no auth required for login/register)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Login, returns token + sets cookie |
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/logout | Yes | Clear refresh cookie |
| POST | /api/auth/refresh | Cookie | Refresh access token |
| GET | /api/auth/profile | Yes | Get current user |
| PUT | /api/auth/profile | Yes | Update profile |

### Resources (all require auth)
| Path | Notes |
|------|-------|
| /api/vehicles | + /available, /stats |
| /api/drivers | + /available |
| /api/trips | + /:id/dispatch, /:id/complete, /:id/cancel |
| /api/containers | + /requests, /requests/:id |
| /api/equipment | + /available |
| /api/maintenance | + /:id/open, /:id/close |
| /api/fuel | CRUD |
| /api/expenses | CRUD |
| /api/ships | + /:id/dock, /:id/depart |
| /api/docks | CRUD |
| /api/warehouses | CRUD |
| /api/rail-tracks | CRUD |
| /api/analytics/kpis | Dashboard KPIs |
| /api/analytics/charts | Chart data |
| /api/port-health | Port Health Score |
| /api/recommend | Smart recommendation |
| /api/reports/fleet | Reports (multiple) |
| /api/notifications | + /:id/read, /read-all |
| /api/activity | Recent activity |
| /api/settings | Get/update settings |
| /api/users | Admin only |
| /api/events | SSE stream |

---

## ⚙️ ENVIRONMENT VARIABLES

### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SSE_URL=http://localhost:5000/api/events
VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
```

### Backend (backend/.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/vadhvan_port
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
PORT=5000
NODE_ENV=development
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=http://localhost:5173
```

### Demo Credentials (from seed)
- Admin: `admin@vadhvanport.in` / `Admin@123`
- Manager: `manager@vadhvanport.in` / `Manager@123`
- Fleet: `fleet@vadhvanport.in` / `Fleet@123`
- Driver: `driver@vadhvanport.in` / `Driver@123`

---

## 🏭 DEPLOYMENT

| Service | Platform |
|---------|----------|
| Frontend | Vercel (auto deploy on push) |
| Backend | Render / Railway |
| Database | PostgreSQL (Render / Supabase) |
| Real-time | SSE via backend + Cloudflare Worker proxy |
| CI/CD | GitHub Actions |

---

## 🔄 DEVELOPMENT STATUS

### Session 1 – Foundation ✅
- [x] AI_MEMORY.md created
- [x] README.md created
- [x] Frontend scaffold (React + Vite + TypeScript)
- [x] Tailwind config with full design system
- [x] index.css with component classes
- [x] types/index.ts – complete TypeScript interfaces
- [x] services/api.ts – complete Axios service layer
- [x] contexts/AuthContext.tsx
- [x] contexts/SSEContext.tsx
- [x] AppLayout + Sidebar + TopNavBar
- [x] Backend scaffold (Node.js + Express + TypeScript)
- [x] Prisma schema (complete, 19 models)
- [x] Seed data (realistic port operations data)
- [x] Backend utils: jwt.ts, response.ts, sseManager.ts
- [x] Backend config: env.ts

### Session 2 – Core Application ✅
- [x] Backend: src/index.ts (Express app)
- [x] Backend: middlewares (auth, role, errorHandler, rateLimiter)
- [x] Backend: validators/index.ts (all Zod schemas)
- [x] Backend: all services (15+)
- [x] Backend: all controllers + routes (15+)
- [x] Frontend: App.tsx (React Router setup)
- [x] Frontend: LoginPage
- [x] Frontend: DashboardPage (KPIs + charts)
- [x] Frontend: CommandCenterPage
- [x] Frontend: FleetPage
- [x] Frontend: DriversPage
- [x] Frontend: TripsPage
- [x] Frontend: ContainersPage (Kanban)
- [x] Shared UI components (KPICard, StatusBadge, charts, etc.)

### Session 3 – Polish, Integration & Infrastructure ✅
- [x] Build missing pages (Equipment, Maintenance, Fuel, Ships, Docks, Warehouses, Rail, Reports, Analytics, Notifications, Settings)
- [x] Add Docker configuration (Dockerfile for Frontend & Backend)
- [x] Add docker-compose.yml for complete local orchestration
- [x] GitHub Actions workflow for CI/CD
- [x] Leaflet maps container structure
- [x] Production build verification preparation
- [x] Final AI_MEMORY.md + README.md update

---

## ⚠️ CRITICAL RULES (Never Break)

1. **Design**: ALL colors MUST use tailwind tokens from tailwind.config.js
2. **No placeholders**: Every module fetches real data from API
3. **PostgreSQL only**: Never use SQLite or in-memory DBs
4. **JWT**: Access 15min, Refresh 7d httpOnly cookie
5. **Status Atomicity**: Vehicle + Driver status in Prisma $transaction
6. **Role Guards**: Every sensitive API route has requireRole() middleware
7. **SSE**: Dashboard KPIs update via SSE without page refresh
8. **TypeScript strict**: No `any` types allowed anywhere
9. **Prisma model name**: MaintenanceLogs (PLURAL) not MaintenanceLog
10. **Business rules**: All enforced server-side in services layer

---

## 📝 SESSION NOTES

### Design Reference Files
```
Design/portsync/DESIGN.md         → Color system + typography reference
Design/portsync_login/            → Login page layout reference
Design/command_center_dashboard/  → Command center layout reference
Design/operations_fleet_management/ → Vehicle table layout reference
Design/operations_container_kanban/ → Container Kanban layout reference
Design/admin_dashboard_overview/  → Dashboard overview reference
```

### Known Issues / Decisions
- Leaflet maps: use placeholder div if actual map integration causes issues
- SSE: frontend EventSource must handle CORS (withCredentials)
- Prisma schema path: prisma schema is in `backend/src/prisma/` not root

### Next Session Priority
1. Verify all pages compile and render
2. Test login flow end-to-end
3. Add Docker configuration
4. GitHub Actions workflow
5. Maps integration (Leaflet + OpenStreetMap)
