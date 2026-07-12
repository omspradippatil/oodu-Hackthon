"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogService = exports.settingsService = exports.notificationService = exports.reportService = exports.analyticsService = exports.recommendService = exports.portHealthService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ============================================================================
// PORT HEALTH SERVICE
// ============================================================================
exports.portHealthService = {
    async getScore() {
        const totalVehicles = await prisma.vehicle.count();
        const availVehicles = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
        const inShopVehicles = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } });
        const totalEquipment = await prisma.equipment.count();
        const availEquipment = await prisma.equipment.count({ where: { status: 'AVAILABLE' } });
        const totalDocks = await prisma.dock.count();
        const availDocks = await prisma.dock.count({ where: { status: 'AVAILABLE' } });
        const completedTrips = await prisma.trip.count({ where: { status: 'COMPLETED' } });
        const cancelledTrips = await prisma.trip.count({ where: { status: 'CANCELLED' } });
        // Components calculations
        const fleetAvailability = totalVehicles > 0 ? (availVehicles / totalVehicles) * 100 : 100;
        const equipmentAvailability = totalEquipment > 0 ? (availEquipment / totalEquipment) * 100 : 100;
        const tripTotal = completedTrips + cancelledTrips;
        const tripCompletionRate = tripTotal > 0 ? (completedTrips / tripTotal) * 100 : 100;
        const maintenanceUptime = totalVehicles > 0 ? (1 - (inShopVehicles / totalVehicles)) * 100 : 100;
        const dockUtilization = totalDocks > 0 ? ((totalDocks - availDocks) / totalDocks) * 100 : 0;
        // Port Health Score Composite Formula
        // score = (fleetAvailability * 0.25) + (equipmentAvailability * 0.20) + (tripCompletionRate * 0.20) + (fuelEfficiency * 0.10) + (maintenanceUptime * 0.15) + (dockUtilization * 0.10)
        // We mock fuel efficiency to 85% for calculation
        const fuelEfficiency = 85;
        const score = Math.round((fleetAvailability * 0.25) +
            (equipmentAvailability * 0.20) +
            (tripCompletionRate * 0.20) +
            (fuelEfficiency * 0.10) +
            (maintenanceUptime * 0.15) +
            (dockUtilization * 0.10));
        let rating = 'AVERAGE';
        if (score >= 90)
            rating = 'EXCELLENT';
        else if (score >= 70)
            rating = 'GOOD';
        else if (score < 50)
            rating = 'CRITICAL';
        return {
            score,
            rating,
            components: {
                fleetAvailability: Math.round(fleetAvailability),
                equipmentAvailability: Math.round(equipmentAvailability),
                tripCompletionRate: Math.round(tripCompletionRate),
                maintenanceUptime: Math.round(maintenanceUptime),
                dockUtilization: Math.round(dockUtilization),
            },
        };
    },
};
// ============================================================================
// RECOMMENDATION SERVICE
// ============================================================================
exports.recommendService = {
    async getRecommendation(cargoWeight, sourceDockId, destination) {
        // Find available vehicles with max capacity >= cargoWeight
        const vehicles = await prisma.vehicle.findMany({
            where: {
                status: 'AVAILABLE',
                maxCapacity: { gte: cargoWeight },
            },
        });
        // Find available drivers with valid license
        const drivers = await prisma.driver.findMany({
            where: {
                status: 'AVAILABLE',
                licenseExpiry: { gt: new Date() },
            },
        });
        if (vehicles.length === 0 || drivers.length === 0) {
            throw { statusCode: 404, message: 'No suitable available resources found.' };
        }
        const recommendations = [];
        for (const vehicle of vehicles) {
            for (const driver of drivers) {
                // Scoring formula:
                // fuelScore (30%) + healthScore (25%) + safetyScore (25%) + experienceYears (20%)
                const fuelScore = (vehicle.fuelLevel / 100) * 30;
                const healthScore = (vehicle.healthScore / 100) * 25;
                const safetyScore = (driver.safetyScore / 100) * 25;
                const expScore = (Math.min(driver.experienceYears / 10, 1)) * 20;
                const totalScore = Math.round(fuelScore + healthScore + safetyScore + expScore);
                recommendations.push({
                    vehicle,
                    driver,
                    score: totalScore,
                    reasons: [
                        `Vehicle fuel level is ${vehicle.fuelLevel}%.`,
                        `Vehicle health score is ${vehicle.healthScore}%.`,
                        `Driver safety rating is ${driver.safetyScore}%.`,
                        `Driver has ${driver.experienceYears} years of experience.`,
                        `Capacity matches requirement (${vehicle.maxCapacity} tons).`,
                    ],
                    estimatedDispatchTime: '4 Minutes',
                });
            }
        }
        // Sort by score DESC
        recommendations.sort((a, b) => b.score - a.score);
        return recommendations[0];
    },
};
// ============================================================================
// ANALYTICS & CHARTS SERVICE
// ============================================================================
exports.analyticsService = {
    async getKPIs() {
        // Counts
        const vehicles = await prisma.vehicle.count();
        const availVehicles = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
        const onTripVehicles = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
        const inShopVehicles = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } });
        const retiredVehicles = await prisma.vehicle.count({ where: { status: 'RETIRED' } });
        const drivers = await prisma.driver.count();
        const activeDrivers = await prisma.driver.count({ where: { status: 'AVAILABLE' } });
        const onTripDrivers = await prisma.driver.count({ where: { status: 'ON_TRIP' } });
        const trips = await prisma.trip.count();
        const activeTrips = await prisma.trip.count({ where: { status: 'DISPATCHED' } });
        const pendingTrips = await prisma.trip.count({ where: { status: 'DRAFT' } });
        const completedTrips = await prisma.trip.count({ where: { status: 'COMPLETED' } });
        const cancelledTrips = await prisma.trip.count({ where: { status: 'CANCELLED' } });
        const containers = await prisma.container.count();
        const waitingContainers = await prisma.container.count({ where: { status: 'WAITING' } });
        const transitContainers = await prisma.container.count({ where: { status: 'IN_TRANSIT' } });
        const deliveredContainers = await prisma.container.count({ where: { status: 'DELIVERED' } });
        const openMaintenance = await prisma.maintenanceLogs.count({ where: { status: 'OPEN' } });
        // Sum fuel cost today (rough mock calculation or actual db sum)
        const fuelCostAgg = await prisma.fuelLog.aggregate({
            _sum: { totalCost: true },
        });
        const fuelCostToday = fuelCostAgg._sum.totalCost || 0;
        const docks = await prisma.dock.count();
        const availDocks = await prisma.dock.count({ where: { status: 'AVAILABLE' } });
        const fleetUtilization = vehicles > 0 ? Math.round((onTripVehicles / vehicles) * 100) : 0;
        return {
            vehicles: {
                total: vehicles,
                available: availVehicles,
                onTrip: onTripVehicles,
                inShop: inShopVehicles,
                retired: retiredVehicles,
                fleetUtilization,
            },
            drivers: {
                total: drivers,
                onDuty: activeDrivers + onTripDrivers,
                available: activeDrivers,
                offDuty: drivers - (activeDrivers + onTripDrivers),
                suspended: 0,
            },
            trips: {
                total: trips,
                active: activeTrips,
                pending: pendingTrips,
                completed: completedTrips,
                cancelled: cancelledTrips,
            },
            containers: {
                total: containers,
                waiting: waitingContainers,
                inTransit: transitContainers,
                delivered: deliveredContainers,
            },
            maintenance: {
                open: openMaintenance,
                due: openMaintenance,
                totalCostThisMonth: 12500, // mock sum for dashboard
            },
            fuel: {
                costToday: fuelCostToday,
                consumptionToday: 120, // liters
            },
            docks: {
                total: docks,
                available: availDocks,
                occupied: docks - availDocks,
            },
        };
    },
    async getCharts() {
        // Generate mock analytics trends for chart displays
        const fleetUtilization = [
            { name: 'Mon', value: 65 },
            { name: 'Tue', value: 72 },
            { name: 'Wed', value: 80 },
            { name: 'Thu', value: 78 },
            { name: 'Fri', value: 85 },
            { name: 'Sat', value: 50 },
            { name: 'Sun', value: 45 },
        ];
        const vehicleStatus = [
            { name: 'Available', value: 12, color: '#27AE60' },
            { name: 'On Trip', value: 18, color: '#2D5BFF' },
            { name: 'In Shop', value: 4, color: '#F5A623' },
            { name: 'Retired', value: 2, color: '#BA1A1A' },
        ];
        const fuelConsumption = [
            { name: 'Mon', value: 320 },
            { name: 'Tue', value: 410 },
            { name: 'Wed', value: 450 },
            { name: 'Thu', value: 380 },
            { name: 'Fri', value: 520 },
            { name: 'Sat', value: 200 },
            { name: 'Sun', value: 150 },
        ];
        const tripsPerDay = [
            { name: 'Mon', value: 15 },
            { name: 'Tue', value: 18 },
            { name: 'Wed', value: 22 },
            { name: 'Thu', value: 20 },
            { name: 'Fri', value: 25 },
            { name: 'Sat', value: 10 },
            { name: 'Sun', value: 8 },
        ];
        const maintenanceCost = [
            { name: 'Jan', value: 1200 },
            { name: 'Feb', value: 1800 },
            { name: 'Mar', value: 900 },
            { name: 'Apr', value: 2400 },
            { name: 'May', value: 1500 },
            { name: 'Jun', value: 3100 },
        ];
        return {
            fleetUtilization,
            vehicleStatus,
            fuelConsumption,
            tripsPerDay,
            maintenanceCost,
        };
    },
};
// ============================================================================
// REPORTS SERVICE
// ============================================================================
exports.reportService = {
    async getFleetReport(params) {
        return prisma.vehicle.findMany({
            include: { driver: true },
            orderBy: { healthScore: 'asc' },
        });
    },
    async getTripReport(params) {
        return prisma.trip.findMany({
            include: { vehicle: true, driver: true, container: true },
            orderBy: { createdAt: 'desc' },
        });
    },
    async getFuelReport(params) {
        return prisma.fuelLog.findMany({
            include: { vehicle: true, driver: true },
            orderBy: { loggedAt: 'desc' },
        });
    },
    async getExpenseReport(params) {
        return prisma.expense.findMany({
            include: { vehicle: true, trip: true },
            orderBy: { createdAt: 'desc' },
        });
    },
    async getMaintenanceReport(params) {
        return prisma.maintenanceLogs.findMany({
            include: { vehicle: true, equipment: true },
            orderBy: { createdAt: 'desc' },
        });
    },
    async getContainerReport(params) {
        return prisma.container.findMany({
            include: { sourceDock: true, destWarehouse: true },
            orderBy: { createdAt: 'desc' },
        });
    },
    async getDriverPerformanceReport(params) {
        return prisma.driver.findMany({
            orderBy: { safetyScore: 'desc' },
        });
    },
};
// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================
exports.notificationService = {
    async getAll() {
        return prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },
    async markRead(id) {
        return prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    },
    async markAllRead() {
        return prisma.notification.updateMany({
            where: { read: false },
            data: { read: true },
        });
    },
};
// ============================================================================
// SETTINGS SERVICE
// ============================================================================
exports.settingsService = {
    async get() {
        let settings = await prisma.settings.findUnique({ where: { id: 'settings' } });
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    id: 'settings',
                    orgName: 'Vadhvan Port',
                    theme: 'light',
                    language: 'en',
                    notificationPrefs: {},
                },
            });
        }
        return settings;
    },
    async update(data) {
        return prisma.settings.update({
            where: { id: 'settings' },
            data,
        });
    },
};
// ============================================================================
// ACTIVITY LOG SERVICE
// ============================================================================
exports.activityLogService = {
    async getAll() {
        return prisma.activityLog.findMany({
            include: { user: { select: { id: true, name: true, role: true } } },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    },
};
