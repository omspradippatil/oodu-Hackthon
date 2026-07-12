"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getAvailable = exports.deleteVehicle = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAll = async (filters) => {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.status)
        where.status = filters.status;
    if (filters.type)
        where.type = filters.type;
    const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
            where,
            skip,
            take: limit,
            include: { driver: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.vehicle.count({ where }),
    ]);
    return { vehicles, total, page, limit };
};
exports.getAll = getAll;
const getById = async (id) => {
    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
            driver: true,
            trips: { orderBy: { createdAt: 'desc' }, take: 10 },
            maintenanceLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
    });
    if (!vehicle)
        throw new Error('Vehicle not found');
    return vehicle;
};
exports.getById = getById;
const create = async (data) => {
    return prisma.vehicle.create({ data });
};
exports.create = create;
const update = async (id, data) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle)
        throw new Error('Vehicle not found');
    return prisma.vehicle.update({ where: { id }, data });
};
exports.update = update;
const deleteVehicle = async (id) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle)
        throw new Error('Vehicle not found');
    if (vehicle.status === 'ON_TRIP')
        throw new Error('Cannot delete a vehicle that is currently on a trip');
    await prisma.vehicle.delete({ where: { id } });
};
exports.deleteVehicle = deleteVehicle;
const getAvailable = async (minCapacity) => {
    const where = {
        status: 'AVAILABLE',
    };
    if (minCapacity !== undefined) {
        where.maxCapacity = { gte: minCapacity };
    }
    return prisma.vehicle.findMany({
        where,
        include: { driver: true },
        orderBy: { healthScore: 'desc' },
    });
};
exports.getAvailable = getAvailable;
const getStats = async () => {
    const [total, available, onTrip, inShop, retired] = await Promise.all([
        prisma.vehicle.count(),
        prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
        prisma.vehicle.count({ where: { status: 'ON_TRIP' } }),
        prisma.vehicle.count({ where: { status: 'IN_SHOP' } }),
        prisma.vehicle.count({ where: { status: 'RETIRED' } }),
    ]);
    const fleetUtilization = total > 0 ? Math.round((onTrip / total) * 100) : 0;
    return { total, available, onTrip, inShop, retired, fleetUtilization };
};
exports.getStats = getStats;
