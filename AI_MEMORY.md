# 🧠 AI_MEMORY.md — Vadhvan GOES Port Platform
> **Last Updated**: 2026-07-12  
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

### Structure
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
- Tailwind CSS (v3)
- Shadcn UI components
- React Router v6
- React Hook Form + Zod
- TanStack Query (React Query)
- Framer Motion
- Recharts
- Lucide Icons
- Leaflet (maps)

### Backend Stack
- Node.js + Express.js + TypeScript
- JWT Authentication + Refresh Tokens
- Bcrypt, Helmet, CORS, Morgan
- Prisma ORM → PostgreSQL
- Server-Sent Events (SSE) for real-time updates
- Rate limiting, input validation

---

## 🎨 DESIGN SYSTEM (from Design/portsync/DESIGN.md)

### Color Palette
```
Primary (Deep Navy):     #0B1F33  (sidebar, headers)
Secondary (Port Blue):   #2D5BFF  (actions, CTAs)
Success Green:           #27AE60
Warning Orange:          #F5A623
Danger Red:              #E74C3C / #BA1A1A
Background:              #F7F9FC  (neutral grey)
Surface/Cards:           #FFFFFF
Border:                  #E2E8F0 / #C4C6CD
Text Primary:            #191C1E
Text Secondary:          #44474C
```

### Typography
- Font: **Inter** (Google Fonts)
- Display: 32px/700
- Headline: 24px/600, 20px/600
- Body: 16px/400, 14px/400
- Label: 12px/600

### Layout
- Sidebar: 240px expanded, 72px collapsed, bg `#0B1F33`
- Cards: 12px border-radius, 1px border, soft shadow
- Buttons: 8px radius, primary `#2D5BFF`, secondary `#0B1F33` outline
- Tables: 48px row height, zebra striping, sticky headers

### Rules
- NO landing pages, NO hero images, NO ocean backgrounds, NO 3D illustrations
- MUST look like SAP Fiori / Oracle Fusion / Stripe Dashboard / Odoo Enterprise
- Dark sidebar + light workspace

---

## 🗄️ DATABASE SCHEMA (PostgreSQL via Prisma)

### Tables
1. **users** – id, name, email, password_hash, role, status, created_at
2. **roles** – id, name, permissions (JSON)
3. **vehicles** – id, registration_no (UNIQUE), name, model, type, capacity, odometer, fuel_level, health_score, status, driver_id, location_lat, location_lng, created_at
4. **drivers** – id, name, photo_url, license_no (UNIQUE), license_category, license_expiry, phone, emergency_contact, safety_score, experience_years, status, vehicle_id
5. **trips** – id, trip_number, container_id, vehicle_id, driver_id, source, destination, cargo_weight, planned_distance, estimated_time, status, priority, notes, dispatched_at, completed_at
6. **containers** – id, container_code, weight, priority, status, source_dock_id, dest_warehouse_id, ship_id, crane_id
7. **container_requests** – id, container_id, requested_by, status, notes
8. **equipment** – id, name, equipment_number, type (CRANE/FORKLIFT/REACH_STACKER/TRAILER), status, health_score, maintenance_due, assigned_dock_id, operator_id
9. **maintenance_logs** – id, vehicle_id, equipment_id, type, description, technician, cost, status, scheduled_at, completed_at
10. **fuel_logs** – id, vehicle_id, driver_id, trip_id, quantity_litres, cost, mileage, distance_covered, logged_at
11. **expenses** – id, trip_id, vehicle_id, type (MAINTENANCE/FUEL/TOLL/PARKING/INSURANCE/REPAIR), amount, description, created_at
12. **notifications** – id, user_id, type, title, message, read, created_at
13. **activity_logs** – id, user_id, action, module, entity_id, ip_address, created_at
14. **audit_logs** – id, user_id, action, table_name, record_id, old_values, new_values, created_at
15. **warehouses** – id, name, capacity, available_space, location_lat, location_lng
16. **docks** – id, dock_number, status, assigned_ship_id, assigned_crane_id, container_count, warehouse_id
17. **ships** – id, imo_number, name, arrival_time, expected_departure, dock_id, container_count, priority, cargo_type, status, ship_length, ship_width, draft
18. **rail_tracks** – id, track_number, status, capacity, destination, departure_time, container_ids (JSON)
19. **gps_logs** – id, vehicle_id, latitude, longitude, speed, timestamp, is_offline
20. **settings** – id, org_name, theme, language, notification_prefs (JSON)

### Key Relationships
- driver ↔ vehicle (one-to-one current assignment)
- trip → vehicle, driver, container
- container → dock, warehouse, ship, crane
- maintenance_log → vehicle / equipment
- fuel_log → vehicle, driver, trip
- expense → trip, vehicle
- dock → warehouse, ship, crane

---

## 🔐 AUTHENTICATION & ROLES

### JWT Strategy
- Access token: 15min expiry
- Refresh token: 7 days, stored in httpOnly cookie
- Bcrypt rounds: 12

### Roles & Permissions
| Role | Access |
|------|--------|
| Admin | Full access to everything |
| Operations Manager | Dashboard, trips, containers, ships, docks, reports |
| Fleet Manager | Vehicles, drivers, trips, fuel, maintenance |
| Maintenance Supervisor | Maintenance, vehicles (status only), equipment |
| Driver | Own trips only (view + status update) |

---

## 🚀 KEY MODULES

### 1. Port Command Center
- Live overview: ships, docks, cranes, vehicles, drivers, containers
- Port Health Score (composite KPI)
- Real-time SSE updates
- Turnaround Time Monitor

### 2. Smart Resource Recommendation Engine
- When container request created → evaluate all resources
- Score: fuel level, capacity, maintenance status, driver license, distance
- Output: best vehicle + driver + equipment combination with reasoning

### 3. Smart Dispatch Engine
- Validates: vehicle, driver, capacity, maintenance, license, dock, container, warehouse, rail
- Atomic status changes: vehicle → ON_TRIP, driver → ON_TRIP
- Trip completion: restores both to AVAILABLE

### 4. Business Rules (enforced server-side)
- Retired vehicles → never in dispatch list
- In-maintenance vehicles → never in dispatch list  
- Expired driver license → cannot assign
- Suspended drivers → cannot assign
- Vehicle already On Trip → cannot assign again
- Cargo weight > vehicle capacity → rejected
- Maintenance open → vehicle status = IN_SHOP
- Maintenance closed → vehicle status = AVAILABLE (unless RETIRED)

### 5. Port Health Score Formula
```
score = (fleet_availability * 0.25) + 
        (equipment_availability * 0.20) + 
        (trip_completion_rate * 0.20) + 
        (fuel_efficiency * 0.10) + 
        (maintenance_uptime * 0.15) + 
        (dock_utilization * 0.10)
Rating: 90+ = Excellent, 70-89 = Good, 50-69 = Average, <50 = Critical
```

---

## 📡 REAL-TIME (SSE)

- Endpoint: `GET /api/events` (Server-Sent Events)
- Events: `dashboard_update`, `trip_update`, `vehicle_update`, `driver_update`, `maintenance_alert`, `container_update`, `notification`
- Frontend subscribes via `EventSource`
- Cloudflare Worker forwards updates

---

## 🌐 API ROUTES

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile`

### Resources (all protected)
- `/api/vehicles` – CRUD + status change
- `/api/drivers` – CRUD + status change
- `/api/trips` – CRUD + dispatch + complete + cancel
- `/api/containers` – CRUD + tracking
- `/api/equipment` – CRUD
- `/api/maintenance` – CRUD + open + close
- `/api/fuel` – CRUD
- `/api/expenses` – CRUD
- `/api/ships` – CRUD + dock assignment
- `/api/docks` – CRUD
- `/api/warehouses` – CRUD
- `/api/rail-tracks` – CRUD
- `/api/reports` – fleet, fuel, trip, driver, container, vehicle-roi
- `/api/analytics` – aggregated stats
- `/api/notifications` – list, mark read
- `/api/activity-logs` – list
- `/api/settings` – get/update
- `/api/recommend` – Smart Resource Recommendation Engine
- `/api/port-health` – Port Health Score
- `/api/events` – SSE stream

---

## 📁 FOLDER STRUCTURE

### Frontend (`frontend/`)
```
src/
├── components/
│   ├── ui/              (Shadcn base components)
│   ├── layouts/         (AppLayout, Sidebar, TopNav)
│   ├── charts/          (Recharts wrappers)
│   ├── tables/          (DataTable, columns)
│   ├── forms/           (FormFields with RHF+Zod)
│   ├── modals/          (Create/Edit dialogs)
│   ├── cards/           (KPI cards, stat cards)
│   └── maps/            (Leaflet wrapper)
├── pages/
│   ├── auth/            (Login)
│   ├── dashboard/       (Main dashboard)
│   ├── command-center/  (Port Command Center)
│   ├── fleet/           (Vehicle management)
│   ├── drivers/         (Driver management)
│   ├── trips/           (Trip management)
│   ├── containers/      (Container ops + Kanban)
│   ├── equipment/       (Crane, forklift, etc.)
│   ├── maintenance/     (Maintenance dashboard)
│   ├── fuel/            (Fuel & expenses)
│   ├── ships/           (Ship arrival module)
│   ├── docks/           (Dock management)
│   ├── warehouses/      (Warehouse management)
│   ├── rail/            (Rail dispatch)
│   ├── reports/         (Reports & export)
│   ├── analytics/       (Analytics dashboard)
│   ├── notifications/   (Notification center)
│   └── settings/        (Settings)
├── hooks/               (useSSE, useAuth, useFilters, etc.)
├── services/            (API service functions)
├── utils/               (formatters, validators, scoring)
├── types/               (TypeScript interfaces)
├── contexts/            (AuthContext, ThemeContext, SSEContext)
├── routes/              (Protected routes, route config)
└── assets/              (Logo, icons)
```

### Backend (`backend/`)
```
src/
├── controllers/         (Request handlers per module)
├── routes/              (Express router per module)
├── middlewares/         (auth, role, validation, error, rate-limit)
├── services/            (Business logic per module)
├── prisma/              (schema.prisma, seed.ts)
├── utils/               (jwt, bcrypt, response helpers, SSE manager)
├── validators/          (Zod schemas per module)
├── config/              (env config, cors config)
├── logs/                (Morgan logs)
└── uploads/             (Vehicle/driver photos)
```

---

## ⚙️ ENVIRONMENT VARIABLES

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_SSE_URL=http://localhost:5000/api/events
VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
```

### Backend (`.env`)
```
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

---

## 🏭 DEPLOYMENT

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | PostgreSQL (Render / Supabase) |
| Real-time | SSE via backend + Cloudflare Worker |
| CI/CD | GitHub Actions |

---

## 🔄 DEVELOPMENT STATUS

### Phase 1 – Foundation ✅ (Session 1)
- [x] AI_MEMORY.md created
- [x] README.md created
- [ ] Frontend project scaffolded
- [ ] Backend project scaffolded
- [ ] Prisma schema created
- [ ] Seed data created

### Phase 2 – Core Modules
- [ ] Authentication (Login + JWT)
- [ ] Dashboard (KPIs + charts)
- [ ] Fleet Management (CRUD)
- [ ] Driver Management (CRUD)
- [ ] Trip Management (lifecycle)
- [ ] Container Operations (Kanban)
- [ ] Equipment Management

### Phase 3 – Advanced Modules
- [ ] Port Command Center
- [ ] Ship Arrival Module
- [ ] Dock Management
- [ ] Smart Resource Recommendation
- [ ] Smart Dispatch Engine
- [ ] Maintenance Module
- [ ] Fuel & Expense

### Phase 4 – Intelligence & Real-time
- [ ] SSE real-time updates
- [ ] Port Health Score
- [ ] Analytics & Reports
- [ ] Maps Module (Leaflet)
- [ ] Warehouse Management
- [ ] Rail Dispatch

### Phase 5 – Polish & Deploy
- [ ] Notifications Center
- [ ] Settings Module
- [ ] Activity & Audit Logs
- [ ] Docker setup
- [ ] GitHub Actions CI/CD
- [ ] Production build verified

---

## ⚠️ CRITICAL RULES (Never Break)

1. **Business Logic**: All validation happens server-side in services layer
2. **Design**: Colors MUST match portsync DESIGN.md palette
3. **No placeholders**: Every module must be functional
4. **PostgreSQL only**: Never use SQLite
5. **JWT**: Access 15min, Refresh 7d, httpOnly cookies
6. **Status Atomicity**: Vehicle + Driver status changes are atomic in transactions
7. **Role Guards**: Every API endpoint has role middleware
8. **SSE**: Dashboard KPIs update via SSE without page refresh
9. **Seed Data**: Always seed realistic port operations data
10. **TypeScript strict**: No `any` types, proper interfaces everywhere

---

## 📝 NOTES FOR FUTURE SESSIONS

- Design files in `Design/` are reference-only — read `Design/portsync/DESIGN.md` for the color system
- The design uses Public Sans + Inter fonts
- Primary color `#0B1F33` = Deep Navy (sidebar)
- Secondary color `#2D5BFF` = Port Blue (CTAs)  
- The `command_center_dashboard` design shows the Port Command Center layout
- The `operations_fleet_management` design shows the vehicle table layout
- The `operations_container_kanban` shows the Kanban board
- The `portsync_login` shows the login page layout
