"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = exports.getRequests = exports.deleteContainer = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAll = async (filters) => {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.status)
        where.status = filters.status;
    if (filters.priority)
        where.priority = filters.priority;
    const [containers, total] = await Promise.all([
        prisma.container.findMany({ where, skip, take: limit, include: { sourceDock: true, destWarehouse: true, ship: true }, orderBy: { createdAt: 'desc' } }),
        prisma.container.count({ where }),
    ]);
    return { containers, total, page, limit };
};
exports.getAll = getAll;
const getById = async (id) => {
    const c = await prisma.container.findUnique({ where: { id }, include: { sourceDock: true, destWarehouse: true, ship: true, requests: true } });
    if (!c)
        throw new Error('Container not found');
    return c;
};
exports.getById = getById;
const create = async (data) => {
    return prisma.container.create({ data: { ...data, status: 'WAITING' } });
};
exports.create = create;
const update = async (id, data) => {
    const c = await prisma.container.findUnique({ where: { id } });
    if (!c)
        throw new Error('Container not found');
    return prisma.container.update({ where: { id }, data });
};
exports.update = update;
const deleteContainer = async (id) => {
    const c = await prisma.container.findUnique({ where: { id } });
    if (!c)
        throw new Error('Container not found');
    await prisma.container.delete({ where: { id } });
};
exports.deleteContainer = deleteContainer;
const getRequests = async (filters) => {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.status)
        where.status = filters.status;
    const [requests, total] = await Promise.all([
        prisma.containerRequest.findMany({ where, skip, take: limit, include: { container: true }, orderBy: { createdAt: 'desc' } }),
        prisma.containerRequest.count({ where }),
    ]);
    return { requests, total, page, limit };
};
exports.getRequests = getRequests;
const createRequest = async (data) => {
    return prisma.containerRequest.create({ data, include: { container: true } });
};
exports.createRequest = createRequest;
