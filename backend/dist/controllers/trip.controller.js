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
exports.cancel = exports.complete = exports.dispatch = exports.deleteTrip = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const tripService = __importStar(require("../services/trip.service"));
const validators_1 = require("../validators");
const response_1 = require("../utils/response");
const getAll = async (req, res, next) => {
    try {
        const { status, priority, vehicleId, driverId, page, limit } = req.query;
        const result = await tripService.getAll({
            status: status,
            priority: priority,
            vehicleId: vehicleId,
            driverId: driverId,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
        (0, response_1.paginated)(res, result.trips, result.total, result.page, result.limit);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const trip = await tripService.getById(req.params.id);
        (0, response_1.success)(res, trip);
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = validators_1.tripSchema.parse(req.body);
        const trip = await tripService.create(data);
        (0, response_1.success)(res, trip, 'Trip created', 201);
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = validators_1.tripSchema.partial().parse(req.body);
        const trip = await tripService.update(req.params.id, data);
        (0, response_1.success)(res, trip, 'Trip updated');
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const deleteTrip = async (req, res, next) => {
    try {
        await tripService.deleteTrip(req.params.id);
        (0, response_1.success)(res, null, 'Trip deleted');
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTrip = deleteTrip;
const dispatch = async (req, res, next) => {
    try {
        const trip = await tripService.dispatch(req.params.id);
        (0, response_1.success)(res, trip, 'Trip dispatched');
    }
    catch (err) {
        next(err);
    }
};
exports.dispatch = dispatch;
const complete = async (req, res, next) => {
    try {
        const trip = await tripService.complete(req.params.id);
        (0, response_1.success)(res, trip, 'Trip completed');
    }
    catch (err) {
        next(err);
    }
};
exports.complete = complete;
const cancel = async (req, res, next) => {
    try {
        const trip = await tripService.cancel(req.params.id);
        (0, response_1.success)(res, trip, 'Trip cancelled');
    }
    catch (err) {
        next(err);
    }
};
exports.cancel = cancel;
