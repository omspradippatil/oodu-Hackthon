"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailable = exports.deleteDriver = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAll = async (filters) => {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.status)
        where.status = filters.status;
    const [drivers, total] = await Promise.all([
        prisma.driver.findMany({
            where,
            skip,
            take: limit,
            include: { vehicle: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.driver.count({ where }),
    ]);
    return { drivers, total, page, limit };
};
exports.getAll = getAll;
const getById = async (id) => {
    const driver = await prisma.driver.findUnique({
        where: { id },
        include: {
            vehicle: true,
            trips: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
    });
    if (!driver)
        throw new Error('Driver not found');
    return driver;
};
exports.getById = getById;
const create = async (data) => {
    return prisma.driver.create({
        data: {
            ...data,
            licenseExpiry: new Date(data.licenseExpiry),
        },
    });
};
exports.create = create;
const update = async (id, data) => {
    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver)
        throw new Error('Driver not found');
    return prisma.driver.update({
        where: { id },
        data: {
            ...data,
            licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : undefined,
        },
    });
};
exports.update = update;
const deleteDriver = async (id) => {
    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver)
        throw new Error('Driver not found');
    if (driver.status === 'ON_TRIP')
        throw new Error('Cannot delete a driver currently on a trip');
    await prisma.driver.delete({ where: { id } });
};
exports.deleteDriver = deleteDriver;
const getAvailable = async () => {
    const now = new Date();
    return prisma.driver.findMany({
        where: {
            status: 'AVAILABLE',
            licenseExpiry: { gt: now },
        },
        orderBy: { safetyScore: 'desc' },
    });
};
exports.getAvailable = getAvailable;
