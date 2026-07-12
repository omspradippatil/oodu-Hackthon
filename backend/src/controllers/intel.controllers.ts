import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as services from '../services/intel.services';
import { success } from '../utils/response';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// PORT HEALTH CONTROLLER
// ============================================================================
export const portHealthController = {
  async getScore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await services.portHealthService.getScore();
      return success(res, result, 'Port health score fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// RECOMMENDATION CONTROLLER
// ============================================================================
export const recommendController = {
  async getRecommendation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cargoWeight = req.query.cargoWeight ? parseFloat(req.query.cargoWeight as string) : undefined;
      if (!cargoWeight) throw { statusCode: 400, message: 'cargoWeight query parameter is required.' };
      
      const sourceDockId = req.query.sourceDockId as string;
      const destination = req.query.destination as string;

      const recommendation = await services.recommendService.getRecommendation(cargoWeight, sourceDockId, destination);
      return success(res, recommendation, 'Resource recommendation generated successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// ANALYTICS CONTROLLER
// ============================================================================
export const analyticsController = {
  async getKPIs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const kpis = await services.analyticsService.getKPIs();
      return success(res, kpis, 'Dashboard KPIs fetched successfully');
    } catch (err) {
      next(err);
    }
  },

  async getCharts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const charts = await services.analyticsService.getCharts();
      return success(res, charts, 'Analytics charts fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// REPORTS CONTROLLER
// ============================================================================
export const reportController = {
  async getFleetReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await services.reportService.getFleetReport(req.query);
      return success(res, report, 'Fleet report retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getTripReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await services.reportService.getTripReport(req.query);
      return success(res, report, 'Trip report retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getFuelReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await services.reportService.getFuelReport(req.query);
      return success(res, report, 'Fuel report retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getExpenseReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await services.reportService.getExpenseReport(req.query);
      return success(res, report, 'Expense report retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getMaintenanceReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await services.reportService.getMaintenanceReport(req.query);
      return success(res, report, 'Maintenance report retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getContainerReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await services.reportService.getContainerReport(req.query);
      return success(res, report, 'Container report retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getDriverPerformanceReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await services.reportService.getDriverPerformanceReport(req.query);
      return success(res, report, 'Driver performance report retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// NOTIFICATIONS CONTROLLER
// ============================================================================
export const notificationController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifs = await services.notificationService.getAll();
      return success(res, notifs, 'Notifications retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async markRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notif = await services.notificationService.markRead(req.params.id);
      return success(res, notif, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  },

  async markAllRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await services.notificationService.markAllRead();
      return success(res, null, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// SETTINGS CONTROLLER
// ============================================================================
export const settingsController = {
  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const settings = await services.settingsService.get();
      return success(res, settings, 'Settings retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const settings = await services.settingsService.update(req.body);
      return success(res, settings, 'Settings updated successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// ACTIVITY LOG CONTROLLER
// ============================================================================
export const activityLogController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const logs = await services.activityLogService.getAll();
      return success(res, logs, 'Activity logs retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};

// ============================================================================
// ADMIN USERS CONTROLLER
// ============================================================================
import bcrypt from 'bcryptjs';
export const usersController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
      return success(res, users, 'Users retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
      });
      if (!user) throw { statusCode: 404, message: 'User not found.' };
      return success(res, user, 'User retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) {
        throw { statusCode: 400, message: 'Email, password, and name are required.' };
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, passwordHash, name, role: role || 'DRIVER' },
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
      });
      return success(res, user, 'User created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, name, role, status, password } = req.body;
      const data: any = {};
      if (email) data.email = email;
      if (name) data.name = name;
      if (role) data.role = role;
      if (status) data.status = status;
      if (password) data.passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data,
        select: { id: true, email: true, name: true, role: true, status: true },
      });
      return success(res, user, 'User updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await prisma.user.delete({ where: { id: req.params.id } });
      return success(res, null, 'User deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};
