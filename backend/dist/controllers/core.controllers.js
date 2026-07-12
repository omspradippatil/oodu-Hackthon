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
Object.defineProperty(exports, "__esModule", { value: true });
exports.containerController = exports.tripController = exports.driverController = exports.vehicleController = exports.authController = void 0;
const schemas = __importStar(require("../validators"));
const core_services_1 = require("../services/core.services");
const response_1 = require("../utils/response");
// ============================================================================
// AUTH CONTROLLER
// ============================================================================
exports.authController = {
    async register(req, res, next) {
        try {
            const validatedData = schemas.registerSchema.parse(req.body);
            const user = await core_services_1.authService.register(validatedData);
            return (0, response_1.success)(res, user, 'User registered successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async login(req, res, next) {
        try {
            const validatedData = schemas.loginSchema.parse(req.body);
            const result = await core_services_1.authService.login(validatedData.email, validatedData.password);
            // Set refresh token cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return (0, response_1.success)(res, { accessToken: result.accessToken, user: result.user }, 'Login successful');
        }
        catch (err) {
            next(err);
        }
    },
    async logout(req, res, next) {
        try {
            res.clearCookie('refreshToken');
            return (0, response_1.success)(res, null, 'Logged out successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async refresh(req, res, next) {
        try {
            const token = req.cookies.refreshToken || req.body.refreshToken;
            if (!token)
                throw { statusCode: 401, message: 'Refresh token is required.' };
            const result = await core_services_1.authService.refresh(token);
            return (0, response_1.success)(res, result, 'Token refreshed successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getProfile(req, res, next) {
        try {
            if (!req.user)
                throw { statusCode: 401, message: 'Unauthorized' };
            const profile = await core_services_1.authService.getProfile(req.user.id);
            return (0, response_1.success)(res, profile, 'Profile fetched successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async updateProfile(req, res, next) {
        try {
            if (!req.user)
                throw { statusCode: 401, message: 'Unauthorized' };
            const profile = await core_services_1.authService.updateProfile(req.user.id, req.body);
            return (0, response_1.success)(res, profile, 'Profile updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// VEHICLE CONTROLLER
// ============================================================================
exports.vehicleController = {
    async getAll(req, res, next) {
        try {
            const vehicles = await core_services_1.vehicleService.getAll(req.query);
            return (0, response_1.success)(res, vehicles, 'Vehicles retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const vehicle = await core_services_1.vehicleService.getById(req.params.id);
            if (!vehicle)
                throw { statusCode: 404, message: 'Vehicle not found.' };
            return (0, response_1.success)(res, vehicle, 'Vehicle retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.vehicleSchema.parse(req.body);
            const vehicle = await core_services_1.vehicleService.create(validatedData);
            return (0, response_1.success)(res, vehicle, 'Vehicle created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const vehicle = await core_services_1.vehicleService.update(req.params.id, req.body);
            return (0, response_1.success)(res, vehicle, 'Vehicle updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await core_services_1.vehicleService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Vehicle deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getAvailable(req, res, next) {
        try {
            const minCapacity = req.query.minCapacity ? parseFloat(req.query.minCapacity) : undefined;
            const vehicles = await core_services_1.vehicleService.getAvailable(minCapacity);
            return (0, response_1.success)(res, vehicles, 'Available vehicles retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// DRIVER CONTROLLER
// ============================================================================
exports.driverController = {
    async getAll(req, res, next) {
        try {
            const drivers = await core_services_1.driverService.getAll(req.query);
            return (0, response_1.success)(res, drivers, 'Drivers retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const driver = await core_services_1.driverService.getById(req.params.id);
            if (!driver)
                throw { statusCode: 404, message: 'Driver not found.' };
            return (0, response_1.success)(res, driver, 'Driver retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.driverSchema.parse(req.body);
            const driver = await core_services_1.driverService.create(validatedData);
            return (0, response_1.success)(res, driver, 'Driver created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const driver = await core_services_1.driverService.update(req.params.id, req.body);
            return (0, response_1.success)(res, driver, 'Driver updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await core_services_1.driverService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Driver deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getAvailable(req, res, next) {
        try {
            const drivers = await core_services_1.driverService.getAvailable();
            return (0, response_1.success)(res, drivers, 'Available drivers retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// TRIP CONTROLLER
// ============================================================================
exports.tripController = {
    async getAll(req, res, next) {
        try {
            const trips = await core_services_1.tripService.getAll(req.query);
            return (0, response_1.success)(res, trips, 'Trips retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const trip = await core_services_1.tripService.getById(req.params.id);
            if (!trip)
                throw { statusCode: 404, message: 'Trip not found.' };
            return (0, response_1.success)(res, trip, 'Trip retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.tripSchema.parse(req.body);
            const trip = await core_services_1.tripService.create(validatedData);
            return (0, response_1.success)(res, trip, 'Trip created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const trip = await core_services_1.tripService.update(req.params.id, req.body);
            return (0, response_1.success)(res, trip, 'Trip updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await core_services_1.tripService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Trip deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async dispatch(req, res, next) {
        try {
            const trip = await core_services_1.tripService.dispatch(req.params.id);
            return (0, response_1.success)(res, trip, 'Trip dispatched successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async complete(req, res, next) {
        try {
            const trip = await core_services_1.tripService.complete(req.params.id);
            return (0, response_1.success)(res, trip, 'Trip completed successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async cancel(req, res, next) {
        try {
            const trip = await core_services_1.tripService.cancel(req.params.id);
            return (0, response_1.success)(res, trip, 'Trip cancelled successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// CONTAINER CONTROLLER
// ============================================================================
exports.containerController = {
    async getAll(req, res, next) {
        try {
            const containers = await core_services_1.containerService.getAll(req.query);
            return (0, response_1.success)(res, containers, 'Containers retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const container = await core_services_1.containerService.getById(req.params.id);
            if (!container)
                throw { statusCode: 404, message: 'Container not found.' };
            return (0, response_1.success)(res, container, 'Container retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.containerSchema.parse(req.body);
            const container = await core_services_1.containerService.create(validatedData);
            return (0, response_1.success)(res, container, 'Container created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const container = await core_services_1.containerService.update(req.params.id, req.body);
            return (0, response_1.success)(res, container, 'Container updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await core_services_1.containerService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Container deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getRequests(req, res, next) {
        try {
            const requests = await core_services_1.containerService.getRequests();
            return (0, response_1.success)(res, requests, 'Container requests retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async createRequest(req, res, next) {
        try {
            const validatedData = schemas.containerRequestSchema.parse(req.body);
            const request = await core_services_1.containerService.createRequest(validatedData);
            return (0, response_1.success)(res, request, 'Container request created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
};
