"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.complete = exports.dispatch = exports.deleteTrip = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const sseManager_1 = require("../utils/sseManager");
const prisma = new client_1.PrismaClient();
let tripCounter = 0;
const generateTripNumber = () => {
    const ts = Date.now().toString().slice(-6);
    tripCounter = (tripCounter + 1) % 1000;
    return `TRP-${ts}-${String(tripCounter).padStart(3, '0')}`;
};
const getAll = async (filters) => {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.status)
        where.status = filters.status;
    if (filters.priority)
        where.priority = filters.priority;
    if (filters.vehicleId)
        where.vehicleId = filters.vehicleId;
    if (filters.driverId)
        where.driverId = filters.driverId;
    const [trips, total] = await Promise.all([
        prisma.trip.findMany({
            where,
            skip,
            take: limit,
            include: { vehicle: true, driver: true, container: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.trip.count({ where }),
    ]);
    return { trips, total, page, limit };
};
exports.getAll = getAll;
const getById = async (id) => {
    const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
            vehicle: true,
            driver: true,
            container: true,
            fuelLogs: true,
            expenses: true,
        },
    });
    if (!trip)
        throw new Error('Trip not found');
    return trip;
};
exports.getById = getById;
const create = async (data) => {
    const tripNumber = generateTripNumber();
    return prisma.trip.create({
        data: { ...data, tripNumber },
        include: { vehicle: true, driver: true },
    });
};
exports.create = create;
const update = async (id, data) => {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip)
        throw new Error('Trip not found');
    if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
        throw new Error(`Cannot update a trip with status ${trip.status}`);
    }
    return prisma.trip.update({ where: { id }, data, include: { vehicle: true, driver: true } });
};
exports.update = update;
const deleteTrip = async (id) => {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip)
        throw new Error('Trip not found');
    if (trip.status === 'DISPATCHED' || trip.status === 'IN_TRANSIT') {
        throw new Error('Cannot delete an active trip');
    }
    await prisma.trip.delete({ where: { id } });
};
exports.deleteTrip = deleteTrip;
const dispatch = async (id) => {
    const trip = await prisma.trip.findUnique({
        where: { id },
        include: { vehicle: true, driver: true },
    });
    if (!trip)
        throw new Error('Trip not found');
    if (trip.status !== 'DRAFT' && trip.status !== 'APPROVED') {
        throw new Error(`Trip cannot be dispatched from status ${trip.status}`);
    }
    const vehicle = trip.vehicle;
    const driver = trip.driver;
    if (vehicle.status !== 'AVAILABLE')
        throw new Error(`Vehicle is not available (status: ${vehicle.status})`);
    if (driver.status !== 'AVAILABLE')
        throw new Error(`Driver is not available (status: ${driver.status})`);
    const now = new Date();
    if (driver.licenseExpiry < now)
        throw new Error('Driver license has expired');
    if (trip.cargoWeight > vehicle.maxCapacity) {
        throw new Error(`Cargo weight (${trip.cargoWeight}) exceeds vehicle capacity (${vehicle.maxCapacity})`);
    }
    const [updatedTrip] = await prisma.$transaction([
        prisma.trip.update({
            where: { id },
            data: { status: 'DISPATCHED', dispatchedAt: now },
            include: { vehicle: true, driver: true },
        }),
        prisma.vehicle.update({ where: { id: vehicle.id }, data: { status: 'ON_TRIP' } }),
        prisma.driver.update({ where: { id: driver.id }, data: { status: 'ON_TRIP' } }),
    ]);
    sseManager_1.sseManager.broadcast('trip_update', { event: 'dispatched', trip: updatedTrip });
    return updatedTrip;
};
exports.dispatch = dispatch;
const complete = async (id) => {
    const trip = await prisma.trip.findUnique({
        where: { id },
        include: { vehicle: true, driver: true },
    });
    if (!trip)
        throw new Error('Trip not found');
    if (trip.status !== 'DISPATCHED' && trip.status !== 'IN_TRANSIT' && trip.status !== 'LOADING') {
        throw new Error(`Trip cannot be completed from status ${trip.status}`);
    }
    const now = new Date();
    const [updatedTrip] = await prisma.$transaction([
        prisma.trip.update({
            where: { id },
            data: { status: 'COMPLETED', completedAt: now },
            include: { vehicle: true, driver: true },
        }),
        prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } }),
        prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } }),
    ]);
    sseManager_1.sseManager.broadcast('trip_update', { event: 'completed', trip: updatedTrip });
    return updatedTrip;
};
exports.complete = complete;
const cancel = async (id) => {
    const trip = await prisma.trip.findUnique({
        where: { id },
        include: { vehicle: true, driver: true },
    });
    if (!trip)
        throw new Error('Trip not found');
    if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
        throw new Error(`Trip is already ${trip.status}`);
    }
    const now = new Date();
    const vehicleStatus = trip.vehicle.status === 'ON_TRIP' ? 'AVAILABLE' : trip.vehicle.status;
    const driverStatus = trip.driver.status === 'ON_TRIP' ? 'AVAILABLE' : trip.driver.status;
    const [updatedTrip] = await prisma.$transaction([
        prisma.trip.update({
            where: { id },
            data: { status: 'CANCELLED', cancelledAt: now },
            include: { vehicle: true, driver: true },
        }),
        prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: vehicleStatus } }),
        prisma.driver.update({ where: { id: trip.driverId }, data: { status: driverStatus } }),
    ]);
    sseManager_1.sseManager.broadcast('trip_update', { event: 'cancelled', trip: updatedTrip });
    return updatedTrip;
};
exports.cancel = cancel;
