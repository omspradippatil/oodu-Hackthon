"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.railTrackSchema = exports.warehouseSchema = exports.dockSchema = exports.shipSchema = exports.expenseSchema = exports.fuelLogSchema = exports.maintenanceLogSchema = exports.equipmentSchema = exports.containerRequestSchema = exports.containerSchema = exports.tripSchema = exports.driverSchema = exports.vehicleSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'MAINTENANCE_SUPERVISOR', 'DRIVER']).optional(),
});
exports.vehicleSchema = zod_1.z.object({
    registrationNo: zod_1.z.string().min(3),
    name: zod_1.z.string().min(2),
    model: zod_1.z.string().min(2),
    type: zod_1.z.enum(['TRUCK', 'TRAILER', 'FORKLIFT', 'REACH_STACKER', 'CRANE_TRUCK']),
    maxCapacity: zod_1.z.number().positive(),
    odometer: zod_1.z.number().nonnegative().optional(),
    fuelLevel: zod_1.z.number().min(0).max(100).optional(),
    healthScore: zod_1.z.number().min(0).max(100).optional(),
    status: zod_1.z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional(),
});
exports.driverSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    licenseNo: zod_1.z.string().min(5),
    licenseCategory: zod_1.z.string().min(1),
    licenseExpiry: zod_1.z.string().datetime() || zod_1.z.date() || zod_1.z.string(), // Parseable date
    phone: zod_1.z.string().min(8),
    emergencyContact: zod_1.z.string().optional(),
    safetyScore: zod_1.z.number().min(0).max(100).optional(),
    experienceYears: zod_1.z.number().nonnegative().optional(),
    status: zod_1.z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).optional(),
});
exports.tripSchema = zod_1.z.object({
    containerId: zod_1.z.string().optional().nullable(),
    vehicleId: zod_1.z.string().min(1),
    driverId: zod_1.z.string().min(1),
    source: zod_1.z.string().min(1),
    destination: zod_1.z.string().min(1),
    cargoWeight: zod_1.z.number().positive(),
    plannedDistance: zod_1.z.number().positive().optional().nullable(),
    estimatedTime: zod_1.z.number().positive().optional().nullable(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.containerSchema = zod_1.z.object({
    containerCode: zod_1.z.string().min(3),
    weight: zod_1.z.number().positive(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: zod_1.z.enum(['WAITING', 'ALLOCATED', 'LOADING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
    sourceDockId: zod_1.z.string().optional().nullable(),
    destWarehouseId: zod_1.z.string().optional().nullable(),
    shipId: zod_1.z.string().optional().nullable(),
    craneId: zod_1.z.string().optional().nullable(),
});
exports.containerRequestSchema = zod_1.z.object({
    containerId: zod_1.z.string().min(1),
    requestedBy: zod_1.z.string().min(1),
    notes: zod_1.z.string().optional().nullable(),
});
exports.equipmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    equipmentNumber: zod_1.z.string().min(3),
    type: zod_1.z.enum(['CRANE', 'FORKLIFT', 'REACH_STACKER', 'TRAILER', 'MATERIAL_HANDLER']),
    status: zod_1.z.enum(['AVAILABLE', 'BUSY', 'MAINTENANCE', 'OFFLINE']).optional(),
    healthScore: zod_1.z.number().min(0).max(100).optional(),
    maintenanceDue: zod_1.z.string().optional().nullable(),
    assignedDockId: zod_1.z.string().optional().nullable(),
    operatorId: zod_1.z.string().optional().nullable(),
});
exports.maintenanceLogSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().optional().nullable(),
    equipmentId: zod_1.z.string().optional().nullable(),
    type: zod_1.z.enum(['OIL_CHANGE', 'INSPECTION', 'TYRE_REPLACEMENT', 'BRAKE_SERVICE', 'ENGINE_SERVICE', 'REPAIR', 'SCHEDULED', 'EMERGENCY']),
    description: zod_1.z.string().min(5),
    technicianName: zod_1.z.string().optional().nullable(),
    cost: zod_1.z.number().nonnegative().optional(),
    scheduledAt: zod_1.z.string().optional().nullable(),
});
exports.fuelLogSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().min(1),
    driverId: zod_1.z.string().optional().nullable(),
    tripId: zod_1.z.string().optional().nullable(),
    quantityLitres: zod_1.z.number().positive(),
    costPerLitre: zod_1.z.number().positive(),
    mileage: zod_1.z.number().positive().optional().nullable(),
    distanceCovered: zod_1.z.number().positive().optional().nullable(),
});
exports.expenseSchema = zod_1.z.object({
    tripId: zod_1.z.string().optional().nullable(),
    vehicleId: zod_1.z.string().min(1),
    type: zod_1.z.enum(['MAINTENANCE', 'FUEL', 'TOLL', 'PARKING', 'INSURANCE', 'REPAIR', 'OTHER']),
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string().optional().nullable(),
});
exports.shipSchema = zod_1.z.object({
    imoNumber: zod_1.z.string().min(5),
    name: zod_1.z.string().min(2),
    arrivalTime: zod_1.z.string(),
    expectedDeparture: zod_1.z.string().optional().nullable(),
    containerCount: zod_1.z.number().nonnegative().optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    cargoType: zod_1.z.string().min(2),
    shipLength: zod_1.z.number().positive().optional().nullable(),
    shipWidth: zod_1.z.number().positive().optional().nullable(),
    draft: zod_1.z.number().positive().optional().nullable(),
    status: zod_1.z.enum(['WAITING', 'DOCKED', 'LOADING', 'UNLOADING', 'COMPLETED', 'DEPARTED']).optional(),
});
exports.dockSchema = zod_1.z.object({
    dockNumber: zod_1.z.string().min(1),
    warehouseId: zod_1.z.string().optional().nullable(),
});
exports.warehouseSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    capacity: zod_1.z.number().positive(),
    locationLat: zod_1.z.number().optional().nullable(),
    locationLng: zod_1.z.number().optional().nullable(),
});
exports.railTrackSchema = zod_1.z.object({
    trackNumber: zod_1.z.string().min(1),
    capacity: zod_1.z.number().positive(),
    destination: zod_1.z.string().optional().nullable(),
    departureTime: zod_1.z.string().optional().nullable(),
});
