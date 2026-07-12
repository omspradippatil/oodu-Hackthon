"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = exports.activityLogController = exports.settingsController = exports.notificationController = exports.reportController = exports.analyticsController = exports.recommendController = exports.portHealthController = void 0;
const services = __importStar(require("../services/intel.services"));
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ============================================================================
// PORT HEALTH CONTROLLER
// ============================================================================
exports.portHealthController = {
    async getScore(req, res, next) {
        try {
            const result = await services.portHealthService.getScore();
            return (0, response_1.success)(res, result, 'Port health score fetched successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// RECOMMENDATION CONTROLLER
// ============================================================================
exports.recommendController = {
    async getRecommendation(req, res, next) {
        try {
            const cargoWeight = req.query.cargoWeight ? parseFloat(req.query.cargoWeight) : undefined;
            if (!cargoWeight)
                throw { statusCode: 400, message: 'cargoWeight query parameter is required.' };
            const sourceDockId = req.query.sourceDockId;
            const destination = req.query.destination;
            const recommendation = await services.recommendService.getRecommendation(cargoWeight, sourceDockId, destination);
            return (0, response_1.success)(res, recommendation, 'Resource recommendation generated successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// ANALYTICS CONTROLLER
// ============================================================================
exports.analyticsController = {
    async getKPIs(req, res, next) {
        try {
            const kpis = await services.analyticsService.getKPIs();
            return (0, response_1.success)(res, kpis, 'Dashboard KPIs fetched successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getCharts(req, res, next) {
        try {
            const charts = await services.analyticsService.getCharts();
            return (0, response_1.success)(res, charts, 'Analytics charts fetched successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// REPORTS CONTROLLER
// ============================================================================
exports.reportController = {
    async getFleetReport(req, res, next) {
        try {
            const report = await services.reportService.getFleetReport(req.query);
            return (0, response_1.success)(res, report, 'Fleet report retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getTripReport(req, res, next) {
        try {
            const report = await services.reportService.getTripReport(req.query);
            return (0, response_1.success)(res, report, 'Trip report retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getFuelReport(req, res, next) {
        try {
            const report = await services.reportService.getFuelReport(req.query);
            return (0, response_1.success)(res, report, 'Fuel report retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getExpenseReport(req, res, next) {
        try {
            const report = await services.reportService.getExpenseReport(req.query);
            return (0, response_1.success)(res, report, 'Expense report retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getMaintenanceReport(req, res, next) {
        try {
            const report = await services.reportService.getMaintenanceReport(req.query);
            return (0, response_1.success)(res, report, 'Maintenance report retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getContainerReport(req, res, next) {
        try {
            const report = await services.reportService.getContainerReport(req.query);
            return (0, response_1.success)(res, report, 'Container report retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getDriverPerformanceReport(req, res, next) {
        try {
            const report = await services.reportService.getDriverPerformanceReport(req.query);
            return (0, response_1.success)(res, report, 'Driver performance report retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// NOTIFICATIONS CONTROLLER
// ============================================================================
exports.notificationController = {
    async getAll(req, res, next) {
        try {
            const notifs = await services.notificationService.getAll();
            return (0, response_1.success)(res, notifs, 'Notifications retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async markRead(req, res, next) {
        try {
            const notif = await services.notificationService.markRead(req.params.id);
            return (0, response_1.success)(res, notif, 'Notification marked as read');
        }
        catch (err) {
            next(err);
        }
    },
    async markAllRead(req, res, next) {
        try {
            await services.notificationService.markAllRead();
            return (0, response_1.success)(res, null, 'All notifications marked as read');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// SETTINGS CONTROLLER
// ============================================================================
exports.settingsController = {
    async get(req, res, next) {
        try {
            const settings = await services.settingsService.get();
            return (0, response_1.success)(res, settings, 'Settings retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const settings = await services.settingsService.update(req.body);
            return (0, response_1.success)(res, settings, 'Settings updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// ACTIVITY LOG CONTROLLER
// ============================================================================
exports.activityLogController = {
    async getAll(req, res, next) {
        try {
            const logs = await services.activityLogService.getAll();
            return (0, response_1.success)(res, logs, 'Activity logs retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// ADMIN USERS CONTROLLER
// ============================================================================
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.usersController = {
    async getAll(req, res, next) {
        try {
            const users = await prisma.user.findMany({
                select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            });
            return (0, response_1.success)(res, users, 'Users retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.params.id },
                select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
            });
            if (!user)
                throw { statusCode: 404, message: 'User not found.' };
            return (0, response_1.success)(res, user, 'User retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const { email, password, name, role } = req.body;
            if (!email || !password || !name) {
                throw { statusCode: 400, message: 'Email, password, and name are required.' };
            }
            const passwordHash = await bcryptjs_1.default.hash(password, 12);
            const user = await prisma.user.create({
                data: { email, passwordHash, name, role: role || 'DRIVER' },
                select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
            });
            return (0, response_1.success)(res, user, 'User created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const { email, name, role, status, password } = req.body;
            const data = {};
            if (email)
                data.email = email;
            if (name)
                data.name = name;
            if (role)
                data.role = role;
            if (status)
                data.status = status;
            if (password)
                data.passwordHash = await bcryptjs_1.default.hash(password, 12);
            const user = await prisma.user.update({
                where: { id: req.params.id },
                data,
                select: { id: true, email: true, name: true, role: true, status: true },
            });
            return (0, response_1.success)(res, user, 'User updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await prisma.user.delete({ where: { id: req.params.id } });
            return (0, response_1.success)(res, null, 'User deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
