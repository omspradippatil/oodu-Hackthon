import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as schemas from '../validators';
import {
  authService,
  vehicleService,
  driverService,
  tripService,
  containerService,
} from '../services/core.services';
import { success, paginated } from '../utils/response';

// ============================================================================
// AUTH CONTROLLER
// ============================================================================
export const authController = {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.registerSchema.parse(req.body);
      const user = await authService.register(validatedData);
      return success(res, user, 'User registered successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.loginSchema.parse(req.body);
      const result = await authService.login(validatedData.email, validatedData.password);
      
      // Set refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return success(res, { accessToken: result.accessToken, user: result.user }, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.clearCookie('refreshToken');
      return success(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (!token) throw { statusCode: 401, message: 'Refresh token is required.' };
      
      const result = await authService.refresh(token);
      return success(res, result, 'Token refreshed successfully');
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw { statusCode: 401, message: 'Unauthorized' };
      const profile = await authService.getProfile(req.user.id);
      return success(res, profile, 'Profile fetched successfully');
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw { statusCode: 401, message: 'Unauthorized' };
      const profile = await authService.updateProfile(req.user.id, req.body);
      return success(res, profile, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// VEHICLE CONTROLLER
// ============================================================================
export const vehicleController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const vehicles = await vehicleService.getAll(req.query);
      return success(res, vehicles, 'Vehicles retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.getById(req.params.id);
      if (!vehicle) throw { statusCode: 404, message: 'Vehicle not found.' };
      return success(res, vehicle, 'Vehicle retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.vehicleSchema.parse(req.body);
      const vehicle = await vehicleService.create(validatedData);
      return success(res, vehicle, 'Vehicle created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.update(req.params.id, req.body);
      return success(res, vehicle, 'Vehicle updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await vehicleService.delete(req.params.id);
      return success(res, null, 'Vehicle deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async getAvailable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const minCapacity = req.query.minCapacity ? parseFloat(req.query.minCapacity as string) : undefined;
      const vehicles = await vehicleService.getAvailable(minCapacity);
      return success(res, vehicles, 'Available vehicles retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// DRIVER CONTROLLER
// ============================================================================
export const driverController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const drivers = await driverService.getAll(req.query);
      return success(res, drivers, 'Drivers retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const driver = await driverService.getById(req.params.id);
      if (!driver) throw { statusCode: 404, message: 'Driver not found.' };
      return success(res, driver, 'Driver retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.driverSchema.parse(req.body);
      const driver = await driverService.create(validatedData);
      return success(res, driver, 'Driver created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const driver = await driverService.update(req.params.id, req.body);
      return success(res, driver, 'Driver updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await driverService.delete(req.params.id);
      return success(res, null, 'Driver deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async getAvailable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const drivers = await driverService.getAvailable();
      return success(res, drivers, 'Available drivers retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// TRIP CONTROLLER
// ============================================================================
export const tripController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trips = await tripService.getAll(req.query);
      return success(res, trips, 'Trips retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.getById(req.params.id);
      if (!trip) throw { statusCode: 404, message: 'Trip not found.' };
      return success(res, trip, 'Trip retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.tripSchema.parse(req.body);
      const trip = await tripService.create(validatedData);
      return success(res, trip, 'Trip created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.update(req.params.id, req.body);
      return success(res, trip, 'Trip updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await tripService.delete(req.params.id);
      return success(res, null, 'Trip deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async dispatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.dispatch(req.params.id);
      return success(res, trip, 'Trip dispatched successfully');
    } catch (err) {
      next(err);
    }
  },

  async complete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.complete(req.params.id);
      return success(res, trip, 'Trip completed successfully');
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trip = await tripService.cancel(req.params.id);
      return success(res, trip, 'Trip cancelled successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// CONTAINER CONTROLLER
// ============================================================================
export const containerController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const containers = await containerService.getAll(req.query);
      return success(res, containers, 'Containers retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const container = await containerService.getById(req.params.id);
      if (!container) throw { statusCode: 404, message: 'Container not found.' };
      return success(res, container, 'Container retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.containerSchema.parse(req.body);
      const container = await containerService.create(validatedData);
      return success(res, container, 'Container created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const container = await containerService.update(req.params.id, req.body);
      return success(res, container, 'Container updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await containerService.delete(req.params.id);
      return success(res, null, 'Container deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  async getRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const requests = await containerService.getRequests();
      return success(res, requests, 'Container requests retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async createRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = schemas.containerRequestSchema.parse(req.body);
      const request = await containerService.createRequest(validatedData);
      return success(res, request, 'Container request created successfully', 201);
    } catch (err) {
      next(err);
    }
  },
};
