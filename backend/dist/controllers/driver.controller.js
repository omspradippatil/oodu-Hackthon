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
exports.getAvailable = exports.deleteDriver = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const driverService = __importStar(require("../services/driver.service"));
const validators_1 = require("../validators");
const response_1 = require("../utils/response");
const getAll = async (req, res, next) => {
    try {
        const { status, page, limit } = req.query;
        const result = await driverService.getAll({
            status: status,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
        (0, response_1.paginated)(res, result.drivers, result.total, result.page, result.limit);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const driver = await driverService.getById(req.params.id);
        (0, response_1.success)(res, driver);
    }
    catch (err) {
        next(err);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const data = validators_1.driverSchema.parse(req.body);
        const driver = await driverService.create(data);
        (0, response_1.success)(res, driver, 'Driver created', 201);
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const data = validators_1.driverSchema.partial().parse(req.body);
        const driver = await driverService.update(req.params.id, data);
        (0, response_1.success)(res, driver, 'Driver updated');
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const deleteDriver = async (req, res, next) => {
    try {
        await driverService.deleteDriver(req.params.id);
        (0, response_1.success)(res, null, 'Driver deleted');
    }
    catch (err) {
        next(err);
    }
};
exports.deleteDriver = deleteDriver;
const getAvailable = async (req, res, next) => {
    try {
        const drivers = await driverService.getAvailable();
        (0, response_1.success)(res, drivers);
    }
    catch (err) {
        next(err);
    }
};
exports.getAvailable = getAvailable;
