"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.refreshTokenService = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const login = async (data) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
        throw new Error('Invalid email or password');
    const isMatch = await bcryptjs_1.default.compare(data.password, user.passwordHash);
    if (!isMatch)
        throw new Error('Invalid email or password');
    if (user.status === 'INACTIVE')
        throw new Error('Account is inactive');
    const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        },
    };
};
exports.login = login;
const register = async (data) => {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new Error('Email already registered');
    const passwordHash = await bcryptjs_1.default.hash(data.password, env_1.env.BCRYPT_ROUNDS);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role ?? 'DRIVER',
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });
    return user;
};
exports.register = register;
const refreshTokenService = async (token) => {
    const payload = (0, jwt_1.verifyRefreshToken)(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user)
        throw new Error('User not found');
    if (user.status === 'INACTIVE')
        throw new Error('Account is inactive');
    const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
    return { accessToken };
};
exports.refreshTokenService = refreshTokenService;
const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user)
        throw new Error('User not found');
    return user;
};
exports.getProfile = getProfile;
const updateProfile = async (userId, data) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });
    return user;
};
exports.updateProfile = updateProfile;
