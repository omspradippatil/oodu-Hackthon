import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { authLimiter } from '../middlewares/rateLimiter';
import * as coreControllers from '../controllers/core.controllers';
import * as portControllers from '../controllers/port.controllers';
import * as intelControllers from '../controllers/intel.controllers';
import { sseManager } from '../utils/sseManager';
import { Request, Response } from 'express';

const router = Router();

// ============================================================================
// REAL-TIME SSE ROUTE
// ============================================================================
router.get('/events', (req: Request, res: Response) => {
  const clientId = `client-${Date.now()}`;
  sseManager.addClient(clientId, res);

  req.on('close', () => {
    sseManager.removeClient(clientId);
  });
});

// ============================================================================
// AUTH ROUTES
// ============================================================================
router.post('/auth/register', authLimiter, coreControllers.authController.register);
router.post('/auth/login', authLimiter, coreControllers.authController.login);
router.post('/auth/logout', authenticate as any, coreControllers.authController.logout);
router.post('/auth/refresh', coreControllers.authController.refresh);
router.get('/auth/profile', authenticate as any, coreControllers.authController.getProfile);
router.put('/auth/profile', authenticate as any, coreControllers.authController.updateProfile);

// ============================================================================
// VEHICLE ROUTES
// ============================================================================
router.get('/vehicles', authenticate as any, coreControllers.vehicleController.getAll);
router.get('/vehicles/available', authenticate as any, coreControllers.vehicleController.getAvailable);
router.get('/vehicles/:id', authenticate as any, coreControllers.vehicleController.getById);
router.post('/vehicles', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, coreControllers.vehicleController.create);
router.put('/vehicles/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, coreControllers.vehicleController.update);
router.delete('/vehicles/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, coreControllers.vehicleController.delete);

// ============================================================================
// DRIVER ROUTES
// ============================================================================
router.get('/drivers', authenticate as any, coreControllers.driverController.getAll);
router.get('/drivers/available', authenticate as any, coreControllers.driverController.getAvailable);
router.get('/drivers/:id', authenticate as any, coreControllers.driverController.getById);
router.post('/drivers', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, coreControllers.driverController.create);
router.put('/drivers/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, coreControllers.driverController.update);
router.delete('/drivers/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, coreControllers.driverController.delete);

// ============================================================================
// TRIP ROUTES
// ============================================================================
router.get('/trips', authenticate as any, coreControllers.tripController.getAll);
router.get('/trips/:id', authenticate as any, coreControllers.tripController.getById);
router.post('/trips', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER') as any, coreControllers.tripController.create);
router.put('/trips/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER') as any, coreControllers.tripController.update);
router.delete('/trips/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, coreControllers.tripController.delete);

router.post('/trips/:id/dispatch', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER') as any, coreControllers.tripController.dispatch);
router.post('/trips/:id/complete', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'DRIVER') as any, coreControllers.tripController.complete);
router.post('/trips/:id/cancel', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER') as any, coreControllers.tripController.cancel);

// ============================================================================
// CONTAINER ROUTES
// ============================================================================
router.get('/containers', authenticate as any, coreControllers.containerController.getAll);
router.get('/containers/requests', authenticate as any, coreControllers.containerController.getRequests);
router.post('/containers/requests', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, coreControllers.containerController.createRequest);
router.get('/containers/:id', authenticate as any, coreControllers.containerController.getById);
router.post('/containers', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, coreControllers.containerController.create);
router.put('/containers/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, coreControllers.containerController.update);
router.delete('/containers/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, coreControllers.containerController.delete);

// ============================================================================
// SHIP ROUTES
// ============================================================================
router.get('/ships', authenticate as any, portControllers.shipController.getAll);
router.get('/ships/:id', authenticate as any, portControllers.shipController.getById);
router.post('/ships', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.shipController.create);
router.put('/ships/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.shipController.update);
router.delete('/ships/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.shipController.delete);
router.post('/ships/:id/dock', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.shipController.dockShip);
router.post('/ships/:id/depart', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.shipController.departShip);

// ============================================================================
// DOCK ROUTES
// ============================================================================
router.get('/docks', authenticate as any, portControllers.dockController.getAll);
router.get('/docks/:id', authenticate as any, portControllers.dockController.getById);
router.post('/docks', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.dockController.create);
router.put('/docks/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.dockController.update);
router.delete('/docks/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.dockController.delete);

// ============================================================================
// WAREHOUSE ROUTES
// ============================================================================
router.get('/warehouses', authenticate as any, portControllers.warehouseController.getAll);
router.get('/warehouses/:id', authenticate as any, portControllers.warehouseController.getById);
router.post('/warehouses', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.warehouseController.create);
router.put('/warehouses/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.warehouseController.update);
router.delete('/warehouses/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.warehouseController.delete);

// ============================================================================
// RAIL TRACK ROUTES
// ============================================================================
router.get('/rail-tracks', authenticate as any, portControllers.railTrackController.getAll);
router.get('/rail-tracks/:id', authenticate as any, portControllers.railTrackController.getById);
router.post('/rail-tracks', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.railTrackController.create);
router.put('/rail-tracks/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.railTrackController.update);
router.delete('/rail-tracks/:id', authenticate as any, requireRole('ADMIN', 'OPERATIONS_MANAGER') as any, portControllers.railTrackController.delete);

// ============================================================================
// EQUIPMENT ROUTES
// ============================================================================
router.get('/equipment', authenticate as any, portControllers.equipmentController.getAll);
router.get('/equipment/available', authenticate as any, portControllers.equipmentController.getAvailable);
router.get('/equipment/:id', authenticate as any, portControllers.equipmentController.getById);
router.post('/equipment', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.equipmentController.create);
router.put('/equipment/:id', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.equipmentController.update);
router.delete('/equipment/:id', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.equipmentController.delete);

// ============================================================================
// MAINTENANCE ROUTES
// ============================================================================
router.get('/maintenance', authenticate as any, portControllers.maintenanceController.getAll);
router.get('/maintenance/:id', authenticate as any, portControllers.maintenanceController.getById);
router.post('/maintenance', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.maintenanceController.create);
router.put('/maintenance/:id', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.maintenanceController.update);
router.delete('/maintenance/:id', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.maintenanceController.delete);
router.post('/maintenance/:id/open', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.maintenanceController.open);
router.post('/maintenance/:id/close', authenticate as any, requireRole('ADMIN', 'MAINTENANCE_SUPERVISOR') as any, portControllers.maintenanceController.close);

// ============================================================================
// FUEL ROUTES
// ============================================================================
router.get('/fuel', authenticate as any, portControllers.fuelController.getAll);
router.get('/fuel/:id', authenticate as any, portControllers.fuelController.getById);
router.post('/fuel', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, portControllers.fuelController.create);
router.put('/fuel/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, portControllers.fuelController.update);
router.delete('/fuel/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, portControllers.fuelController.delete);

// ============================================================================
// EXPENSE ROUTES
// ============================================================================
router.get('/expenses', authenticate as any, portControllers.expenseController.getAll);
router.get('/expenses/:id', authenticate as any, portControllers.expenseController.getById);
router.post('/expenses', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER', 'OPERATIONS_MANAGER') as any, portControllers.expenseController.create);
router.put('/expenses/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER', 'OPERATIONS_MANAGER') as any, portControllers.expenseController.update);
router.delete('/expenses/:id', authenticate as any, requireRole('ADMIN', 'FLEET_MANAGER') as any, portControllers.expenseController.delete);

// ============================================================================
// INTELLIGENCE & ANALYTICS ROUTES
// ============================================================================
router.get('/port-health', authenticate as any, intelControllers.portHealthController.getScore);
router.get('/recommend', authenticate as any, intelControllers.recommendController.getRecommendation);
router.get('/analytics/kpis', authenticate as any, intelControllers.analyticsController.getKPIs);
router.get('/analytics/charts', authenticate as any, intelControllers.analyticsController.getCharts);

// ============================================================================
// REPORTS ROUTES
// ============================================================================
router.get('/reports/fleet', authenticate as any, intelControllers.reportController.getFleetReport);
router.get('/reports/trips', authenticate as any, intelControllers.reportController.getTripReport);
router.get('/reports/fuel', authenticate as any, intelControllers.reportController.getFuelReport);
router.get('/reports/expenses', authenticate as any, intelControllers.reportController.getExpenseReport);
router.get('/reports/maintenance', authenticate as any, intelControllers.reportController.getMaintenanceReport);
router.get('/reports/containers', authenticate as any, intelControllers.reportController.getContainerReport);
router.get('/reports/driver-performance', authenticate as any, intelControllers.reportController.getDriverPerformanceReport);

// ============================================================================
// NOTIFICATION ROUTES
// ============================================================================
router.get('/notifications', authenticate as any, intelControllers.notificationController.getAll);
router.put('/notifications/read-all', authenticate as any, intelControllers.notificationController.markAllRead);
router.put('/notifications/:id/read', authenticate as any, intelControllers.notificationController.markRead);

// ============================================================================
// SETTINGS ROUTES
// ============================================================================
router.get('/settings', authenticate as any, intelControllers.settingsController.get);
router.put('/settings', authenticate as any, requireRole('ADMIN') as any, intelControllers.settingsController.update);

// ============================================================================
// ACTIVITY LOG ROUTES
// ============================================================================
router.get('/activity', authenticate as any, intelControllers.activityLogController.getAll);

// ============================================================================
// ADMIN USERS MANAGEMENT ROUTES
// ============================================================================
router.get('/users', authenticate as any, requireRole('ADMIN') as any, intelControllers.usersController.getAll);
router.get('/users/:id', authenticate as any, requireRole('ADMIN') as any, intelControllers.usersController.getById);
router.post('/users', authenticate as any, requireRole('ADMIN') as any, intelControllers.usersController.create);
router.put('/users/:id', authenticate as any, requireRole('ADMIN') as any, intelControllers.usersController.update);
router.delete('/users/:id', authenticate as any, requireRole('ADMIN') as any, intelControllers.usersController.delete);

export default router;
