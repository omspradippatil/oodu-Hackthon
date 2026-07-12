// =============================================================================
// Core Types for Vadhvan GOES Port Platform
// =============================================================================

export type Role = 'ADMIN' | 'OPERATIONS_MANAGER' | 'FLEET_MANAGER' | 'MAINTENANCE_SUPERVISOR' | 'DRIVER';

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';
export type VehicleType = 'TRUCK' | 'TRAILER' | 'FORKLIFT' | 'REACH_STACKER' | 'CRANE_TRUCK';

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';

export type TripStatus = 'DRAFT' | 'APPROVED' | 'DISPATCHED' | 'LOADING' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ContainerStatus = 'WAITING' | 'ALLOCATED' | 'LOADING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export type ContainerRequestStatus = 'PENDING' | 'ASSIGNED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';

export type EquipmentType = 'CRANE' | 'FORKLIFT' | 'REACH_STACKER' | 'TRAILER' | 'MATERIAL_HANDLER';
export type EquipmentStatus = 'AVAILABLE' | 'BUSY' | 'MAINTENANCE' | 'OFFLINE';

export type MaintenanceType = 'OIL_CHANGE' | 'INSPECTION' | 'TYRE_REPLACEMENT' | 'BRAKE_SERVICE' | 'ENGINE_SERVICE' | 'REPAIR' | 'SCHEDULED' | 'EMERGENCY';
export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

export type ShipStatus = 'WAITING' | 'DOCKED' | 'LOADING' | 'UNLOADING' | 'COMPLETED' | 'DEPARTED';
export type DockStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
export type RailTrackStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export type ExpenseType = 'MAINTENANCE' | 'FUEL' | 'TOLL' | 'PARKING' | 'INSURANCE' | 'REPAIR' | 'OTHER';

export type PortHealthRating = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'CRITICAL';

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}

// =============================================================================
// Auth Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// =============================================================================
// Vehicle Types
// =============================================================================

export interface Vehicle {
  id: string;
  registrationNo: string;
  name: string;
  model: string;
  type: VehicleType;
  status: VehicleStatus;
  maxCapacity: number;
  odometer: number;
  fuelLevel: number;
  healthScore: number;
  locationLat?: number;
  locationLng?: number;
  driverId?: string;
  driver?: Driver;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  registrationNo: string;
  name: string;
  model: string;
  type: VehicleType;
  maxCapacity: number;
  odometer?: number;
  fuelLevel?: number;
  healthScore?: number;
}

export interface VehicleStats {
  total: number;
  available: number;
  onTrip: number;
  inShop: number;
  retired: number;
  averageHealthScore: number;
  fleetUtilization: number;
}

// =============================================================================
// Driver Types
// =============================================================================

export interface Driver {
  id: string;
  name: string;
  photoUrl?: string;
  licenseNo: string;
  licenseCategory: string;
  licenseExpiry: string;
  phone: string;
  emergencyContact?: string;
  safetyScore: number;
  experienceYears: number;
  status: DriverStatus;
  vehicleId?: string;
  vehicle?: Vehicle;
  userId?: string;
  completedTrips?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriverFormData {
  name: string;
  licenseNo: string;
  licenseCategory: string;
  licenseExpiry: string;
  phone: string;
  emergencyContact?: string;
  safetyScore?: number;
  experienceYears?: number;
}

// =============================================================================
// Trip Types
// =============================================================================

export interface Trip {
  id: string;
  tripNumber: string;
  containerId?: string;
  container?: Container;
  vehicleId: string;
  vehicle?: Vehicle;
  driverId: string;
  driver?: Driver;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance?: number;
  estimatedTime?: number;
  status: TripStatus;
  priority: Priority;
  notes?: string;
  dispatchedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripFormData {
  containerId?: string;
  vehicleId: string;
  driverId: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance?: number;
  estimatedTime?: number;
  priority?: Priority;
  notes?: string;
}

// =============================================================================
// Container Types
// =============================================================================

export interface Container {
  id: string;
  containerCode: string;
  weight: number;
  priority: Priority;
  status: ContainerStatus;
  sourceDockId?: string;
  sourceDock?: Dock;
  destWarehouseId?: string;
  destWarehouse?: Warehouse;
  shipId?: string;
  ship?: Ship;
  craneId?: string;
  crane?: Equipment;
  createdAt: string;
  updatedAt: string;
}

export interface ContainerRequest {
  id: string;
  containerId: string;
  container?: Container;
  requestedBy: string;
  vehicleId?: string;
  vehicle?: Vehicle;
  driverId?: string;
  driver?: Driver;
  status: ContainerRequestStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Equipment Types
// =============================================================================

export interface Equipment {
  id: string;
  name: string;
  equipmentNumber: string;
  type: EquipmentType;
  status: EquipmentStatus;
  healthScore: number;
  maintenanceDue?: string;
  assignedDockId?: string;
  assignedDock?: Dock;
  operatorId?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Maintenance Types
// =============================================================================

export interface MaintenanceLog {
  id: string;
  vehicleId?: string;
  vehicle?: Vehicle;
  equipmentId?: string;
  equipment?: Equipment;
  type: MaintenanceType;
  description: string;
  technicianName?: string;
  cost: number;
  status: MaintenanceStatus;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Fuel & Expense Types
// =============================================================================

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  driverId?: string;
  driver?: Driver;
  tripId?: string;
  trip?: Trip;
  quantityLitres: number;
  costPerLitre: number;
  totalCost: number;
  mileage?: number;
  distanceCovered?: number;
  loggedAt: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tripId?: string;
  trip?: Trip;
  vehicleId: string;
  vehicle?: Vehicle;
  type: ExpenseType;
  amount: number;
  description?: string;
  createdAt: string;
}

// =============================================================================
// Port Operations Types
// =============================================================================

export interface Ship {
  id: string;
  imoNumber: string;
  name: string;
  arrivalTime: string;
  expectedDeparture?: string;
  dockId?: string;
  dock?: Dock;
  containerCount: number;
  priority: Priority;
  cargoType: string;
  shipLength?: number;
  shipWidth?: number;
  draft?: number;
  status: ShipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Dock {
  id: string;
  dockNumber: string;
  status: DockStatus;
  assignedShipId?: string;
  assignedShip?: Ship;
  assignedCraneId?: string;
  assignedCrane?: Equipment;
  containerCount: number;
  estimatedCompletion?: string;
  warehouseId?: string;
  warehouse?: Warehouse;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  capacity: number;
  availableSpace: number;
  occupiedSpace: number;
  locationLat?: number;
  locationLng?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RailTrack {
  id: string;
  trackNumber: string;
  status: RailTrackStatus;
  capacity: number;
  destination?: string;
  departureTime?: string;
  containerIds: string[];
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Dashboard & Analytics Types
// =============================================================================

export interface DashboardKPIs {
  vehicles: {
    total: number;
    available: number;
    onTrip: number;
    inShop: number;
    retired: number;
    fleetUtilization: number;
  };
  drivers: {
    total: number;
    onDuty: number;
    available: number;
    offDuty: number;
    suspended: number;
  };
  trips: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  containers: {
    total: number;
    waiting: number;
    inTransit: number;
    delivered: number;
  };
  maintenance: {
    open: number;
    due: number;
    totalCostThisMonth: number;
  };
  fuel: {
    costToday: number;
    consumptionToday: number;
  };
  docks: {
    total: number;
    available: number;
    occupied: number;
  };
}

export interface PortHealthScore {
  score: number;
  rating: PortHealthRating;
  components: {
    fleetAvailability: number;
    equipmentAvailability: number;
    tripCompletionRate: number;
    dockUtilization: number;
  };
}

export interface ResourceRecommendation {
  vehicle: Vehicle;
  driver: Driver;
  score: number;
  reasons: string[];
  estimatedDispatchTime: string;
}

// =============================================================================
// Notification Types
// =============================================================================

export interface Notification {
  id: string;
  userId?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  user?: User;
  action: string;
  module: string;
  entityId?: string;
  ipAddress?: string;
  createdAt: string;
}

// =============================================================================
// Chart Data Types
// =============================================================================

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface Settings {
  orgName: string;
  theme: string;
  language: string;
  notificationPrefs: Record<string, boolean>;
}

// =============================================================================
// Filter Types
// =============================================================================

export interface VehicleFilter {
  type?: VehicleType;
  status?: VehicleStatus;
  search?: string;
}

export interface DriverFilter {
  status?: DriverStatus;
  search?: string;
}

export interface TripFilter {
  status?: TripStatus;
  priority?: Priority;
  vehicleId?: string;
  driverId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GpsLog {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  latitude: number;
  longitude: number;
  speed: number;
  isOffline: boolean;
  timestamp: string;
}
