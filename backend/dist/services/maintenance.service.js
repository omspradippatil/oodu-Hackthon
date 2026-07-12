"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeMaintenance = exports.openMaintenance = exports.deleteLog = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const sseManager_1 = require("../utils/sseManager");
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
    if (filters.vehicleId)
        where.vehicleId = filters.vehicleId;
    const [logs, total] = await Promise.all([
        prisma.maintenanceLogs.findMany({
            where, skip, take: limit,
            include: { vehicle: true, equipment: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.maintenanceLogs.count({ where }),
    ]);
    return { logs, total, page, limit };
};
exports.getAll = getAll;
const getById = async (id) => {
    const log = await prisma.maintenanceLogs.findUnique({ where: { id }, include: { vehicle: true, equipment: true } });
    if (!log)
        throw new Error('Maintenance log not found');
    return log;
};
exports.getById = getById;
const create = async (data) => {
    return prisma.maintenanceLogs.create({
        data: {
            ...data,
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        },
        include: { vehicle: true, equipment: true },
    });
};
exports.create = create;
const update = async (id, data) => {
    const log = await prisma.maintenanceLogs.findUnique({ where: { id } });
    if (!log)
        throw new Error('Maintenance log not found');
    return prisma.maintenanceLogs.update({
        where: { id },
        data: {
            ...data,
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        },
    });
};
exports.update = update;
const deleteLog = async (id) => {
    const log = await prisma.maintenanceLogs.findUnique({ where: { id } });
    if (!log)
        throw new Error('Maintenance log not found');
    await prisma.maintenanceLogs.delete({ where: { id } });
};
exports.deleteLog = deleteLog;
const openMaintenance = async (id) => {
    const log = await prisma.maintenanceLogs.findUnique({ where: { id } });
    if (!log)
        throw new Error('Maintenance log not found');
    const updates = [
        prisma.maintenanceLogs.update({ where: { id }, data: { status: 'IN_PROGRESS' } }),
    ];
    if (log.vehicleId) {
        updates.push(prisma.vehicle.update({ where: { id: log.vehicleId }, data: { status: 'IN_SHOP' } }));
    }
    const results = await prisma.$transaction(updates);
    const updatedLog = results[0];
    sseManager_1.sseManager.broadcast('maintenance_update', { event: 'opened', log: updatedLog });
    return updatedLog;
};
exports.openMaintenance = openMaintenance;
const closeMaintenance = async (id) => {
    const log = await prisma.maintenanceLogs.findUnique({ where: { id }, include: { vehicle: true } });
    if (!log)
        throw new Error('Maintenance log not found');
    const now = new Date();
    const updates = [
        prisma.maintenanceLogs.update({ where: { id }, data: { status: 'COMPLETED', completedAt: now } }),
    ];
    if (log.vehicleId && log.vehicle) {
        const newStatus = log.vehicle.status === 'RETIRED' ? 'RETIRED' : 'AVAILABLE';
        updates.push(prisma.vehicle.update({ where: { id: log.vehicleId }, data: { status: newStatus } }));
    }
    const results = await prisma.$transaction(updates);
    const updatedLog = results[0];
    sseManager_1.sseManager.broadcast('maintenance_update', { event: 'closed', log: updatedLog });
    return updatedLog;
};
exports.closeMaintenance = closeMaintenance;
