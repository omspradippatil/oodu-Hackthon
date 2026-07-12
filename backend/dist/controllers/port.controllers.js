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
exports.expenseController = exports.fuelController = exports.maintenanceController = exports.equipmentController = exports.railTrackController = exports.warehouseController = exports.dockController = exports.shipController = void 0;
const schemas = __importStar(require("../validators"));
const services = __importStar(require("../services/port.services"));
const response_1 = require("../utils/response");
// ============================================================================
// SHIP CONTROLLER
// ============================================================================
exports.shipController = {
    async getAll(req, res, next) {
        try {
            const ships = await services.shipService.getAll(req.query);
            return (0, response_1.success)(res, ships, 'Ships retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const ship = await services.shipService.getById(req.params.id);
            if (!ship)
                throw { statusCode: 404, message: 'Ship not found.' };
            return (0, response_1.success)(res, ship, 'Ship retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.shipSchema.parse(req.body);
            const ship = await services.shipService.create(validatedData);
            return (0, response_1.success)(res, ship, 'Ship created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const ship = await services.shipService.update(req.params.id, req.body);
            return (0, response_1.success)(res, ship, 'Ship updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.shipService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Ship deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async dockShip(req, res, next) {
        try {
            const { dockId } = req.body;
            if (!dockId)
                throw { statusCode: 400, message: 'dockId is required.' };
            const ship = await services.shipService.dockShip(req.params.id, dockId);
            return (0, response_1.success)(res, ship, 'Ship docked successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async departShip(req, res, next) {
        try {
            const ship = await services.shipService.departShip(req.params.id);
            return (0, response_1.success)(res, ship, 'Ship departed successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// DOCK CONTROLLER
// ============================================================================
exports.dockController = {
    async getAll(req, res, next) {
        try {
            const docks = await services.dockService.getAll(req.query);
            return (0, response_1.success)(res, docks, 'Docks retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const dock = await services.dockService.getById(req.params.id);
            if (!dock)
                throw { statusCode: 404, message: 'Dock not found.' };
            return (0, response_1.success)(res, dock, 'Dock retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.dockSchema.parse(req.body);
            const dock = await services.dockService.create(validatedData);
            return (0, response_1.success)(res, dock, 'Dock created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const dock = await services.dockService.update(req.params.id, req.body);
            return (0, response_1.success)(res, dock, 'Dock updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.dockService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Dock deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// WAREHOUSE CONTROLLER
// ============================================================================
exports.warehouseController = {
    async getAll(req, res, next) {
        try {
            const warehouses = await services.warehouseService.getAll();
            return (0, response_1.success)(res, warehouses, 'Warehouses retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const warehouse = await services.warehouseService.getById(req.params.id);
            if (!warehouse)
                throw { statusCode: 404, message: 'Warehouse not found.' };
            return (0, response_1.success)(res, warehouse, 'Warehouse retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.warehouseSchema.parse(req.body);
            const warehouse = await services.warehouseService.create(validatedData);
            return (0, response_1.success)(res, warehouse, 'Warehouse created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const warehouse = await services.warehouseService.update(req.params.id, req.body);
            return (0, response_1.success)(res, warehouse, 'Warehouse updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.warehouseService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Warehouse deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// RAIL TRACK CONTROLLER
// ============================================================================
exports.railTrackController = {
    async getAll(req, res, next) {
        try {
            const tracks = await services.railTrackService.getAll();
            return (0, response_1.success)(res, tracks, 'Rail tracks retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const track = await services.railTrackService.getById(req.params.id);
            if (!track)
                throw { statusCode: 404, message: 'Rail track not found.' };
            return (0, response_1.success)(res, track, 'Rail track retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.railTrackSchema.parse(req.body);
            const track = await services.railTrackService.create(validatedData);
            return (0, response_1.success)(res, track, 'Rail track created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const track = await services.railTrackService.update(req.params.id, req.body);
            return (0, response_1.success)(res, track, 'Rail track updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.railTrackService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Rail track deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// EQUIPMENT CONTROLLER
// ============================================================================
exports.equipmentController = {
    async getAll(req, res, next) {
        try {
            const equipment = await services.equipmentService.getAll(req.query);
            return (0, response_1.success)(res, equipment, 'Equipment retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const eq = await services.equipmentService.getById(req.params.id);
            if (!eq)
                throw { statusCode: 404, message: 'Equipment not found.' };
            return (0, response_1.success)(res, eq, 'Equipment retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.equipmentSchema.parse(req.body);
            const eq = await services.equipmentService.create(validatedData);
            return (0, response_1.success)(res, eq, 'Equipment created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const eq = await services.equipmentService.update(req.params.id, req.body);
            return (0, response_1.success)(res, eq, 'Equipment updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.equipmentService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Equipment deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getAvailable(req, res, next) {
        try {
            const equipment = await services.equipmentService.getAvailable();
            return (0, response_1.success)(res, equipment, 'Available equipment retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// MAINTENANCE CONTROLLER
// ============================================================================
exports.maintenanceController = {
    async getAll(req, res, next) {
        try {
            const logs = await services.maintenanceService.getAll(req.query);
            return (0, response_1.success)(res, logs, 'Maintenance logs retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const log = await services.maintenanceService.getById(req.params.id);
            if (!log)
                throw { statusCode: 404, message: 'Maintenance record not found.' };
            return (0, response_1.success)(res, log, 'Maintenance record retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.maintenanceLogSchema.parse(req.body);
            const log = await services.maintenanceService.create(validatedData);
            return (0, response_1.success)(res, log, 'Maintenance record created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const log = await services.maintenanceService.update(req.params.id, req.body);
            return (0, response_1.success)(res, log, 'Maintenance record updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.maintenanceService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Maintenance record deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async open(req, res, next) {
        try {
            const log = await services.maintenanceService.open(req.params.id);
            return (0, response_1.success)(res, log, 'Maintenance record set to in progress');
        }
        catch (err) {
            next(err);
        }
    },
    async close(req, res, next) {
        try {
            const cost = req.body.cost ? parseFloat(req.body.cost) : undefined;
            const log = await services.maintenanceService.close(req.params.id, cost);
            return (0, response_1.success)(res, log, 'Maintenance record closed successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// FUEL CONTROLLER
// ============================================================================
exports.fuelController = {
    async getAll(req, res, next) {
        try {
            const logs = await services.fuelService.getAll(req.query);
            return (0, response_1.success)(res, logs, 'Fuel logs retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const log = await services.fuelService.getById(req.params.id);
            if (!log)
                throw { statusCode: 404, message: 'Fuel log not found.' };
            return (0, response_1.success)(res, log, 'Fuel log retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.fuelLogSchema.parse(req.body);
            const log = await services.fuelService.create(validatedData);
            return (0, response_1.success)(res, log, 'Fuel log created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const log = await services.fuelService.update(req.params.id, req.body);
            return (0, response_1.success)(res, log, 'Fuel log updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.fuelService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Fuel log deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
// ============================================================================
// EXPENSE CONTROLLER
// ============================================================================
exports.expenseController = {
    async getAll(req, res, next) {
        try {
            const expenses = await services.expenseService.getAll(req.query);
            return (0, response_1.success)(res, expenses, 'Expenses retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) {
        try {
            const exp = await services.expenseService.getById(req.params.id);
            if (!exp)
                throw { statusCode: 404, message: 'Expense not found.' };
            return (0, response_1.success)(res, exp, 'Expense retrieved successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async create(req, res, next) {
        try {
            const validatedData = schemas.expenseSchema.parse(req.body);
            const exp = await services.expenseService.create(validatedData);
            return (0, response_1.success)(res, exp, 'Expense created successfully', 201);
        }
        catch (err) {
            next(err);
        }
    },
    async update(req, res, next) {
        try {
            const exp = await services.expenseService.update(req.params.id, req.body);
            return (0, response_1.success)(res, exp, 'Expense updated successfully');
        }
        catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) {
        try {
            await services.expenseService.delete(req.params.id);
            return (0, response_1.success)(res, null, 'Expense deleted successfully');
        }
        catch (err) {
            next(err);
        }
    },
};
