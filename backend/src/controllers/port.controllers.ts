import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as schemas from '../validators';
import * as services from '../services/port.services';
import { success } from '../utils/response';

// ============================================================================
// SHIP CONTROLLER
// ============================================================================
export const shipController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ships = await services.shipService.getAll(req.query);
      return success(res, ships, 'Ships retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ship = await services.shipService.getById(req.params.id);
      if (!ship) throw { statusCode: 404, message: 'Ship not found.' };
      return success(res, ship, 'Ship retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.shipSchema.parse(req.body);
      const ship = await services.shipService.create(validatedData);
      return success(res, ship, 'Ship created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ship = await services.shipService.update(req.params.id, req.body);
      return success(res, ship, 'Ship updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.shipService.delete(req.params.id);
      return success(res, null, 'Ship deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async dockShip(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { dockId } = req.body;
      if (!dockId) throw { statusCode: 400, message: 'dockId is required.' };
      const ship = await services.shipService.dockShip(req.params.id, dockId);
      return success(res, ship, 'Ship docked successfully');
    } catch (err) {
      next(err);
    }
  },

  async departShip(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ship = await services.shipService.departShip(req.params.id);
      return success(res, ship, 'Ship departed successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// DOCK CONTROLLER
// ============================================================================
export const dockController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const docks = await services.dockService.getAll(req.query);
      return success(res, docks, 'Docks retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dock = await services.dockService.getById(req.params.id);
      if (!dock) throw { statusCode: 404, message: 'Dock not found.' };
      return success(res, dock, 'Dock retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.dockSchema.parse(req.body);
      const dock = await services.dockService.create(validatedData);
      return success(res, dock, 'Dock created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dock = await services.dockService.update(req.params.id, req.body);
      return success(res, dock, 'Dock updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.dockService.delete(req.params.id);
      return success(res, null, 'Dock deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// WAREHOUSE CONTROLLER
// ============================================================================
export const warehouseController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const warehouses = await services.warehouseService.getAll();
      return success(res, warehouses, 'Warehouses retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const warehouse = await services.warehouseService.getById(req.params.id);
      if (!warehouse) throw { statusCode: 404, message: 'Warehouse not found.' };
      return success(res, warehouse, 'Warehouse retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.warehouseSchema.parse(req.body);
      const warehouse = await services.warehouseService.create(validatedData);
      return success(res, warehouse, 'Warehouse created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const warehouse = await services.warehouseService.update(req.params.id, req.body);
      return success(res, warehouse, 'Warehouse updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.warehouseService.delete(req.params.id);
      return success(res, null, 'Warehouse deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// RAIL TRACK CONTROLLER
// ============================================================================
export const railTrackController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tracks = await services.railTrackService.getAll();
      return success(res, tracks, 'Rail tracks retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const track = await services.railTrackService.getById(req.params.id);
      if (!track) throw { statusCode: 404, message: 'Rail track not found.' };
      return success(res, track, 'Rail track retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.railTrackSchema.parse(req.body);
      const track = await services.railTrackService.create(validatedData);
      return success(res, track, 'Rail track created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const track = await services.railTrackService.update(req.params.id, req.body);
      return success(res, track, 'Rail track updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.railTrackService.delete(req.params.id);
      return success(res, null, 'Rail track deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// EQUIPMENT CONTROLLER
// ============================================================================
export const equipmentController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const equipment = await services.equipmentService.getAll(req.query);
      return success(res, equipment, 'Equipment retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eq = await services.equipmentService.getById(req.params.id);
      if (!eq) throw { statusCode: 404, message: 'Equipment not found.' };
      return success(res, eq, 'Equipment retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.equipmentSchema.parse(req.body);
      const eq = await services.equipmentService.create(validatedData);
      return success(res, eq, 'Equipment created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eq = await services.equipmentService.update(req.params.id, req.body);
      return success(res, eq, 'Equipment updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.equipmentService.delete(req.params.id);
      return success(res, null, 'Equipment deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async getAvailable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const equipment = await services.equipmentService.getAvailable();
      return success(res, equipment, 'Available equipment retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// MAINTENANCE CONTROLLER
// ============================================================================
export const maintenanceController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const logs = await services.maintenanceService.getAll(req.query);
      return success(res, logs, 'Maintenance logs retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const log = await services.maintenanceService.getById(req.params.id);
      if (!log) throw { statusCode: 404, message: 'Maintenance record not found.' };
      return success(res, log, 'Maintenance record retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.maintenanceLogSchema.parse(req.body);
      const log = await services.maintenanceService.create(validatedData);
      return success(res, log, 'Maintenance record created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const log = await services.maintenanceService.update(req.params.id, req.body);
      return success(res, log, 'Maintenance record updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.maintenanceService.delete(req.params.id);
      return success(res, null, 'Maintenance record deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async open(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const log = await services.maintenanceService.open(req.params.id);
      return success(res, log, 'Maintenance record set to in progress');
    } catch (err) {
      next(err);
    }
  },

  async close(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cost = req.body.cost ? parseFloat(req.body.cost) : undefined;
      const log = await services.maintenanceService.close(req.params.id, cost);
      return success(res, log, 'Maintenance record closed successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// FUEL CONTROLLER
// ============================================================================
export const fuelController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const logs = await services.fuelService.getAll(req.query);
      return success(res, logs, 'Fuel logs retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const log = await services.fuelService.getById(req.params.id);
      if (!log) throw { statusCode: 404, message: 'Fuel log not found.' };
      return success(res, log, 'Fuel log retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.fuelLogSchema.parse(req.body);
      const log = await services.fuelService.create(validatedData);
      return success(res, log, 'Fuel log created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const log = await services.fuelService.update(req.params.id, req.body);
      return success(res, log, 'Fuel log updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.fuelService.delete(req.params.id);
      return success(res, null, 'Fuel log deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// EXPENSE CONTROLLER
// ============================================================================
export const expenseController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const expenses = await services.expenseService.getAll(req.query);
      return success(res, expenses, 'Expenses retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const exp = await services.expenseService.getById(req.params.id);
      if (!exp) throw { statusCode: 404, message: 'Expense not found.' };
      return success(res, exp, 'Expense retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.expenseSchema.parse(req.body);
      const exp = await services.expenseService.create(validatedData);
      return success(res, exp, 'Expense created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const exp = await services.expenseService.update(req.params.id, req.body);
      return success(res, exp, 'Expense updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.expenseService.delete(req.params.id);
      return success(res, null, 'Expense deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};
