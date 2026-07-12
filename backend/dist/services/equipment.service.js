"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailable = exports.deleteEquipment = exports.update = exports.create = exports.getById = exports.getAll = void 0;
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
    const [equipment, total] = await Promise.all([
        prisma.equipment.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
        prisma.equipment.count({ where }),
    ]);
    return { equipment, total, page, limit };
};
exports.getAll = getAll;
const getById = async (id) => {
    const eq = await prisma.equipment.findUnique({ where: { id }, include: { maintenanceLogs: { take: 10, orderBy: { createdAt: 'desc' } } } });
    if (!eq)
        throw new Error('Equipment not found');
    return eq;
};
exports.getById = getById;
const create = async (data) => {
    return prisma.equipment.create({
        data: {
            ...data,
            maintenanceDue: data.maintenanceDue ? new Date(data.maintenanceDue) : undefined,
        },
    });
};
exports.create = create;
const update = async (id, data) => {
    const eq = await prisma.equipment.findUnique({ where: { id } });
    if (!eq)
        throw new Error('Equipment not found');
    return prisma.equipment.update({
        where: { id },
        data: {
            ...data,
            maintenanceDue: data.maintenanceDue ? new Date(data.maintenanceDue) : undefined,
        },
    });
};
exports.update = update;
const deleteEquipment = async (id) => {
    const eq = await prisma.equipment.findUnique({ where: { id } });
    if (!eq)
        throw new Error('Equipment not found');
    await prisma.equipment.delete({ where: { id } });
};
exports.deleteEquipment = deleteEquipment;
const getAvailable = async () => {
    return prisma.equipment.findMany({ where: { status: 'AVAILABLE' }, orderBy: { healthScore: 'desc' } });
};
exports.getAvailable = getAvailable;
