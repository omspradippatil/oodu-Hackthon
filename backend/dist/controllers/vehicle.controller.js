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
exports.getStats = exports.getAvailable = exports.deleteVehicle = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const vehicleService = __importStar(require("../services/vehicle.service"));
const validators_1 = require("../validators");
const response_1 = require("../utils/response");
const getAll = async (req, res, next) => {
    try {
        const { status, type, page, limit } = req.query;
        const result = await vehicleService.getAll({
            status: status,
            type: type,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
        (0, response_1.paginated)(res, result.vehicles, result.total, result.page, result.limit);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.getById(req.params.id);
        (0, response_1.success)(res, vehicle);
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = validators_1.vehicleSchema.parse(req.body);
        const vehicle = await vehicleService.create(data);
        (0, response_1.success)(res, vehicle, 'Vehicle created', 201);
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = validators_1.vehicleSchema.partial().parse(req.body);
        const vehicle = await vehicleService.update(req.params.id, data);
        (0, response_1.success)(res, vehicle, 'Vehicle updated');
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const deleteVehicle = async (req, res, next) => {
    try {
        await vehicleService.deleteVehicle(req.params.id);
        (0, response_1.success)(res, null, 'Vehicle deleted');
    }
    catch (err) {
        next(err);
    }
};
exports.deleteVehicle = deleteVehicle;
const getAvailable = async (req, res, next) => {
    try {
        const minCapacity = req.query.minCapacity ? parseFloat(req.query.minCapacity) : undefined;
        const vehicles = await vehicleService.getAvailable(minCapacity);
        (0, response_1.success)(res, vehicles);
    }
    catch (err) {
        next(err);
    }
};
exports.getAvailable = getAvailable;
const getStats = async (req, res, next) => {
    try {
        const stats = await vehicleService.getStats();
        (0, response_1.success)(res, stats);
    }
    catch (err) {
        next(err);
    }
};
exports.getStats = getStats;
