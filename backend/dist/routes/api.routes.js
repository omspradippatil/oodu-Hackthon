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
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const role_1 = require("../middlewares/role");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const coreControllers = __importStar(require("../controllers/core.controllers"));
const portControllers = __importStar(require("../controllers/port.controllers"));
const intelControllers = __importStar(require("../controllers/intel.controllers"));
const sseManager_1 = require("../utils/sseManager");
const router = (0, express_1.Router)();
// ============================================================================
// REAL-TIME SSE ROUTE
// ============================================================================
router.get('/events', (req, res) => {
    const clientId = `client-${Date.now()}`;
    sseManager_1.sseManager.addClient(clientId, res);
    req.on('close', () => {
        sseManager_1.sseManager.removeClient(clientId);
    });
});
// ============================================================================
// AUTH ROUTES
// ============================================================================
router.post('/auth/register', rateLimiter_1.authLimiter, coreControllers.authController.register);
router.post('/auth/login', rateLimiter_1.authLimiter, coreControllers.authController.login);
router.post('/auth/logout', auth_1.authenticate, coreControllers.authController.logout);
router.post('/auth/refresh', coreControllers.authController.refresh);
router.get('/auth/profile', auth_1.authenticate, coreControllers.authController.getProfile);
router.put('/auth/profile', auth_1.authenticate, coreControllers.authController.updateProfile);
// ============================================================================
// VEHICLE ROUTES
// ============================================================================
router.get('/vehicles', auth_1.authenticate, coreControllers.vehicleController.getAll);
router.get('/vehicles/available', auth_1.authenticate, coreControllers.vehicleController.getAvailable);
router.get('/vehicles/:id', auth_1.authenticate, coreControllers.vehicleController.getById);
router.post('/vehicles', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), coreControllers.vehicleController.create);
router.put('/vehicles/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), coreControllers.vehicleController.update);
router.delete('/vehicles/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), coreControllers.vehicleController.delete);
// ============================================================================
// DRIVER ROUTES
// ============================================================================
router.get('/drivers', auth_1.authenticate, coreControllers.driverController.getAll);
router.get('/drivers/available', auth_1.authenticate, coreControllers.driverController.getAvailable);
router.get('/drivers/:id', auth_1.authenticate, coreControllers.driverController.getById);
router.post('/drivers', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), coreControllers.driverController.create);
router.put('/drivers/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), coreControllers.driverController.update);
router.delete('/drivers/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), coreControllers.driverController.delete);
// ============================================================================
// TRIP ROUTES
// ============================================================================
router.get('/trips', auth_1.authenticate, coreControllers.tripController.getAll);
router.get('/trips/:id', auth_1.authenticate, coreControllers.tripController.getById);
router.post('/trips', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER'), coreControllers.tripController.create);
router.put('/trips/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER'), coreControllers.tripController.update);
router.delete('/trips/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), coreControllers.tripController.delete);
router.post('/trips/:id/dispatch', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER'), coreControllers.tripController.dispatch);
router.post('/trips/:id/complete', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'DRIVER'), coreControllers.tripController.complete);
router.post('/trips/:id/cancel', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER'), coreControllers.tripController.cancel);
// ============================================================================
// CONTAINER ROUTES
// ============================================================================
router.get('/containers', auth_1.authenticate, coreControllers.containerController.getAll);
router.get('/containers/requests', auth_1.authenticate, coreControllers.containerController.getRequests);
router.post('/containers/requests', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), coreControllers.containerController.createRequest);
router.get('/containers/:id', auth_1.authenticate, coreControllers.containerController.getById);
router.post('/containers', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), coreControllers.containerController.create);
router.put('/containers/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), coreControllers.containerController.update);
router.delete('/containers/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), coreControllers.containerController.delete);
// ============================================================================
// SHIP ROUTES
// ============================================================================
router.get('/ships', auth_1.authenticate, portControllers.shipController.getAll);
router.get('/ships/:id', auth_1.authenticate, portControllers.shipController.getById);
router.post('/ships', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.shipController.create);
router.put('/ships/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.shipController.update);
router.delete('/ships/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.shipController.delete);
router.post('/ships/:id/dock', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.shipController.dockShip);
router.post('/ships/:id/depart', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.shipController.departShip);
// ============================================================================
// DOCK ROUTES
// ============================================================================
router.get('/docks', auth_1.authenticate, portControllers.dockController.getAll);
router.get('/docks/:id', auth_1.authenticate, portControllers.dockController.getById);
router.post('/docks', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.dockController.create);
router.put('/docks/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.dockController.update);
router.delete('/docks/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.dockController.delete);
// ============================================================================
// WAREHOUSE ROUTES
// ============================================================================
router.get('/warehouses', auth_1.authenticate, portControllers.warehouseController.getAll);
router.get('/warehouses/:id', auth_1.authenticate, portControllers.warehouseController.getById);
router.post('/warehouses', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.warehouseController.create);
router.put('/warehouses/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.warehouseController.update);
router.delete('/warehouses/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.warehouseController.delete);
// ============================================================================
// RAIL TRACK ROUTES
// ============================================================================
router.get('/rail-tracks', auth_1.authenticate, portControllers.railTrackController.getAll);
router.get('/rail-tracks/:id', auth_1.authenticate, portControllers.railTrackController.getById);
router.post('/rail-tracks', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.railTrackController.create);
router.put('/rail-tracks/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.railTrackController.update);
router.delete('/rail-tracks/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'OPERATIONS_MANAGER'), portControllers.railTrackController.delete);
// ============================================================================
// EQUIPMENT ROUTES
// ============================================================================
router.get('/equipment', auth_1.authenticate, portControllers.equipmentController.getAll);
router.get('/equipment/available', auth_1.authenticate, portControllers.equipmentController.getAvailable);
router.get('/equipment/:id', auth_1.authenticate, portControllers.equipmentController.getById);
router.post('/equipment', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.equipmentController.create);
router.put('/equipment/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.equipmentController.update);
router.delete('/equipment/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.equipmentController.delete);
// ============================================================================
// MAINTENANCE ROUTES
// ============================================================================
router.get('/maintenance', auth_1.authenticate, portControllers.maintenanceController.getAll);
router.get('/maintenance/:id', auth_1.authenticate, portControllers.maintenanceController.getById);
router.post('/maintenance', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.maintenanceController.create);
router.put('/maintenance/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.maintenanceController.update);
router.delete('/maintenance/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.maintenanceController.delete);
router.post('/maintenance/:id/open', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.maintenanceController.open);
router.post('/maintenance/:id/close', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'MAINTENANCE_SUPERVISOR'), portControllers.maintenanceController.close);
// ============================================================================
// FUEL ROUTES
// ============================================================================
router.get('/fuel', auth_1.authenticate, portControllers.fuelController.getAll);
router.get('/fuel/:id', auth_1.authenticate, portControllers.fuelController.getById);
router.post('/fuel', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), portControllers.fuelController.create);
router.put('/fuel/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), portControllers.fuelController.update);
router.delete('/fuel/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), portControllers.fuelController.delete);
// ============================================================================
// EXPENSE ROUTES
// ============================================================================
router.get('/expenses', auth_1.authenticate, portControllers.expenseController.getAll);
router.get('/expenses/:id', auth_1.authenticate, portControllers.expenseController.getById);
router.post('/expenses', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER', 'OPERATIONS_MANAGER'), portControllers.expenseController.create);
router.put('/expenses/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER', 'OPERATIONS_MANAGER'), portControllers.expenseController.update);
router.delete('/expenses/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN', 'FLEET_MANAGER'), portControllers.expenseController.delete);
// ============================================================================
// INTELLIGENCE & ANALYTICS ROUTES
// ============================================================================
router.get('/port-health', auth_1.authenticate, intelControllers.portHealthController.getScore);
router.get('/recommend', auth_1.authenticate, intelControllers.recommendController.getRecommendation);
router.get('/analytics/kpis', auth_1.authenticate, intelControllers.analyticsController.getKPIs);
router.get('/analytics/charts', auth_1.authenticate, intelControllers.analyticsController.getCharts);
// ============================================================================
// REPORTS ROUTES
// ============================================================================
router.get('/reports/fleet', auth_1.authenticate, intelControllers.reportController.getFleetReport);
router.get('/reports/trips', auth_1.authenticate, intelControllers.reportController.getTripReport);
router.get('/reports/fuel', auth_1.authenticate, intelControllers.reportController.getFuelReport);
router.get('/reports/expenses', auth_1.authenticate, intelControllers.reportController.getExpenseReport);
router.get('/reports/maintenance', auth_1.authenticate, intelControllers.reportController.getMaintenanceReport);
router.get('/reports/containers', auth_1.authenticate, intelControllers.reportController.getContainerReport);
router.get('/reports/driver-performance', auth_1.authenticate, intelControllers.reportController.getDriverPerformanceReport);
// ============================================================================
// NOTIFICATION ROUTES
// ============================================================================
router.get('/notifications', auth_1.authenticate, intelControllers.notificationController.getAll);
router.put('/notifications/read-all', auth_1.authenticate, intelControllers.notificationController.markAllRead);
router.put('/notifications/:id/read', auth_1.authenticate, intelControllers.notificationController.markRead);
// ============================================================================
// SETTINGS ROUTES
// ============================================================================
router.get('/settings', auth_1.authenticate, intelControllers.settingsController.get);
router.put('/settings', auth_1.authenticate, (0, role_1.requireRole)('ADMIN'), intelControllers.settingsController.update);
// ============================================================================
// ACTIVITY LOG ROUTES
// ============================================================================
router.get('/activity', auth_1.authenticate, intelControllers.activityLogController.getAll);
// ============================================================================
// ADMIN USERS MANAGEMENT ROUTES
// ============================================================================
router.get('/users', auth_1.authenticate, (0, role_1.requireRole)('ADMIN'), intelControllers.usersController.getAll);
router.get('/users/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN'), intelControllers.usersController.getById);
router.post('/users', auth_1.authenticate, (0, role_1.requireRole)('ADMIN'), intelControllers.usersController.create);
router.put('/users/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN'), intelControllers.usersController.update);
router.delete('/users/:id', auth_1.authenticate, (0, role_1.requireRole)('ADMIN'), intelControllers.usersController.delete);
exports.default = router;
