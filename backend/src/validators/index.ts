import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'MAINTENANCE_SUPERVISOR', 'DRIVER']).optional(),
});

export const vehicleSchema = z.object({
  registrationNo: z.string().min(3),
  name: z.string().min(2),
  model: z.string().min(2),
  type: z.enum(['TRUCK', 'TRAILER', 'FORKLIFT', 'REACH_STACKER', 'CRANE_TRUCK']),
  maxCapacity: z.number().positive(),
  odometer: z.number().nonnegative().optional(),
  fuelLevel: z.number().min(0).max(100).optional(),
  healthScore: z.number().min(0).max(100).optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional(),
});

export const driverSchema = z.object({
  name: z.string().min(2),
  licenseNo: z.string().min(5),
  licenseCategory: z.string().min(1),
  licenseExpiry: z.string().datetime() || z.date() || z.string(), // Parseable date
  phone: z.string().min(8),
  emergencyContact: z.string().optional(),
  safetyScore: z.number().min(0).max(100).optional(),
  experienceYears: z.number().nonnegative().optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).optional(),
});

export const tripSchema = z.object({
  containerId: z.string().optional().nullable(),
  vehicleId: z.string().min(1),
  driverId: z.string().min(1),
  source: z.string().min(1),
  destination: z.string().min(1),
  cargoWeight: z.number().positive(),
  plannedDistance: z.number().positive().optional().nullable(),
  estimatedTime: z.number().positive().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  notes: z.string().optional().nullable(),
});

export const containerSchema = z.object({
  containerCode: z.string().min(3),
  weight: z.number().positive(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['WAITING', 'ALLOCATED', 'LOADING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
  sourceDockId: z.string().optional().nullable(),
  destWarehouseId: z.string().optional().nullable(),
  shipId: z.string().optional().nullable(),
  craneId: z.string().optional().nullable(),
});

export const containerRequestSchema = z.object({
  containerId: z.string().min(1),
  requestedBy: z.string().min(1),
  notes: z.string().optional().nullable(),
});

export const equipmentSchema = z.object({
  name: z.string().min(2),
  equipmentNumber: z.string().min(3),
  type: z.enum(['CRANE', 'FORKLIFT', 'REACH_STACKER', 'TRAILER', 'MATERIAL_HANDLER']),
  status: z.enum(['AVAILABLE', 'BUSY', 'MAINTENANCE', 'OFFLINE']).optional(),
  healthScore: z.number().min(0).max(100).optional(),
  maintenanceDue: z.string().optional().nullable(),
  assignedDockId: z.string().optional().nullable(),
  operatorId: z.string().optional().nullable(),
});

export const maintenanceLogSchema = z.object({
  vehicleId: z.string().optional().nullable(),
  equipmentId: z.string().optional().nullable(),
  type: z.enum(['OIL_CHANGE', 'INSPECTION', 'TYRE_REPLACEMENT', 'BRAKE_SERVICE', 'ENGINE_SERVICE', 'REPAIR', 'SCHEDULED', 'EMERGENCY']),
  description: z.string().min(5),
  technicianName: z.string().optional().nullable(),
  cost: z.number().nonnegative().optional(),
  scheduledAt: z.string().optional().nullable(),
});

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1),
  driverId: z.string().optional().nullable(),
  tripId: z.string().optional().nullable(),
  quantityLitres: z.number().positive(),
  costPerLitre: z.number().positive(),
  mileage: z.number().positive().optional().nullable(),
  distanceCovered: z.number().positive().optional().nullable(),
});

export const expenseSchema = z.object({
  tripId: z.string().optional().nullable(),
  vehicleId: z.string().min(1),
  type: z.enum(['MAINTENANCE', 'FUEL', 'TOLL', 'PARKING', 'INSURANCE', 'REPAIR', 'OTHER']),
  amount: z.number().positive(),
  description: z.string().optional().nullable(),
});

export const shipSchema = z.object({
  imoNumber: z.string().min(5),
  name: z.string().min(2),
  arrivalTime: z.string(),
  expectedDeparture: z.string().optional().nullable(),
  containerCount: z.number().nonnegative().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  cargoType: z.string().min(2),
  shipLength: z.number().positive().optional().nullable(),
  shipWidth: z.number().positive().optional().nullable(),
  draft: z.number().positive().optional().nullable(),
  status: z.enum(['WAITING', 'DOCKED', 'LOADING', 'UNLOADING', 'COMPLETED', 'DEPARTED']).optional(),
});

export const dockSchema = z.object({
  dockNumber: z.string().min(1),
  warehouseId: z.string().optional().nullable(),
});

export const warehouseSchema = z.object({
  name: z.string().min(2),
  capacity: z.number().positive(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
});

export const railTrackSchema = z.object({
  trackNumber: z.string().min(1),
  capacity: z.number().positive(),
  destination: z.string().optional().nullable(),
  departureTime: z.string().optional().nullable(),
});
