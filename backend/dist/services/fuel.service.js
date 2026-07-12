"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLog = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAll = async (filters) => {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.vehicleId)
        where.vehicleId = filters.vehicleId;
    const [logs, total] = await Promise.all([
        prisma.fuelLog.findMany({
            where, skip, take: limit,
            include: { vehicle: true, driver: true, trip: true },
            orderBy: { loggedAt: 'desc' },
        }),
        prisma.fuelLog.count({ where }),
    ]);
    return { logs, total, page, limit };
};
exports.getAll = getAll;
const getById = async (id) => {
    const log = await prisma.fuelLog.findUnique({ where: { id }, include: { vehicle: true, driver: true, trip: true } });
    if (!log)
        throw new Error('Fuel log not found');
    return log;
};
exports.getById = getById;
const create = async (data) => {
    const totalCost = data.quantityLitres * data.costPerLitre;
    return prisma.fuelLog.create({
        data: { ...data, totalCost },
        include: { vehicle: true, driver: true },
    });
};
exports.create = create;
const update = async (id, data) => {
    const log = await prisma.fuelLog.findUnique({ where: { id } });
    if (!log)
        throw new Error('Fuel log not found');
    const totalCost = (data.quantityLitres ?? log.quantityLitres) * (data.costPerLitre ?? log.costPerLitre);
    return prisma.fuelLog.update({ where: { id }, data: { ...data, totalCost } });
};
exports.update = update;
const deleteLog = async (id) => {
    const log = await prisma.fuelLog.findUnique({ where: { id } });
    if (!log)
        throw new Error('Fuel log not found');
    await prisma.fuelLog.delete({ where: { id } });
};
exports.deleteLog = deleteLog;
