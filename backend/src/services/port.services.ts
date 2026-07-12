import { PrismaClient } from '@prisma/client';
import { sseManager } from '../utils/sseManager';

const prisma = new PrismaClient();

// ============================================================================
// SHIP SERVICE
// ============================================================================
export const shipService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { imoNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return prisma.ship.findMany({
      where,
      include: { dock: true },
      orderBy: { arrivalTime: 'asc' },
    });
  },

  async getById(id: string) {
    return prisma.ship.findUnique({
      where: { id },
      include: { dock: true, containers: true },
    });
  },

  async create(data: any) {
    return prisma.ship.create({
      data: {
        ...data,
        arrivalTime: new Date(data.arrivalTime),
        expectedDeparture: data.expectedDeparture ? new Date(data.expectedDeparture) : null,
      },
    });
  },

  async update(id: string, data: any) {
    if (data.arrivalTime) data.arrivalTime = new Date(data.arrivalTime);
    if (data.expectedDeparture) data.expectedDeparture = new Date(data.expectedDeparture);
    return prisma.ship.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.ship.delete({ where: { id } });
  },

  async dockShip(id: string, dockId: string) {
    const ship = await prisma.ship.findUnique({ where: { id } });
    const dock = await prisma.dock.findUnique({ where: { id: dockId } });
    
    if (!ship || !dock) throw { statusCode: 404, message: 'Ship or Dock not found.' };
    if (dock.status !== 'AVAILABLE') throw { statusCode: 422, message: 'Dock is not available.' };

    const [updatedShip, updatedDock] = await prisma.$transaction([
      prisma.ship.update({
        where: { id },
        data: { status: 'DOCKED', dockId },
      }),
      prisma.dock.update({
        where: { id: dockId },
        data: { status: 'OCCUPIED', assignedShipId: id, containerCount: ship.containerCount },
      }),
    ]);

    sseManager.broadcast('ship_update', updatedShip);
    sseManager.broadcast('dock_update', updatedDock);
    sseManager.broadcast('dashboard_update', { trigger: true });

    return updatedShip;
  },

  async departShip(id: string) {
    const ship = await prisma.ship.findUnique({ where: { id } });
    if (!ship) throw { statusCode: 404, message: 'Ship not found.' };
    if (!ship.dockId) throw { statusCode: 422, message: 'Ship is not docked.' };

    const dockId = ship.dockId;
    const [updatedShip, updatedDock] = await prisma.$transaction([
      prisma.ship.update({
        where: { id },
        data: { status: 'DEPARTED', dockId: null },
      }),
      prisma.dock.update({
        where: { id: dockId },
        data: { status: 'AVAILABLE', assignedShipId: null, containerCount: 0 },
      }),
    ]);

    sseManager.broadcast('ship_update', updatedShip);
    sseManager.broadcast('dock_update', updatedDock);
    sseManager.broadcast('dashboard_update', { trigger: true });

    return updatedShip;
  },
};

// ============================================================================
// DOCK SERVICE
// ============================================================================
export const dockService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    return prisma.dock.findMany({
      where,
      include: { assignedShip: true, warehouse: true },
      orderBy: { dockNumber: 'asc' },
    });
  },

  async getById(id: string) {
    return prisma.dock.findUnique({
      where: { id },
      include: { assignedShip: true, warehouse: true },
    });
  },

  async create(data: any) {
    return prisma.dock.create({ data });
  },

  async update(id: string, data: any) {
    return prisma.dock.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.dock.delete({ where: { id } });
  },
};

// ============================================================================
// WAREHOUSE SERVICE
// ============================================================================
export const warehouseService = {
  async getAll() {
    return prisma.warehouse.findMany({
      include: { docks: true },
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: string) {
    return prisma.warehouse.findUnique({
      where: { id },
      include: { docks: true, containers: true },
    });
  },

  async create(data: any) {
    return prisma.warehouse.create({
      data: {
        ...data,
        availableSpace: data.capacity,
        occupiedSpace: 0,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.warehouse.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.warehouse.delete({ where: { id } });
  },
};

// ============================================================================
// RAIL TRACK SERVICE
// ============================================================================
export const railTrackService = {
  async getAll() {
    return prisma.railTrack.findMany({
      orderBy: { trackNumber: 'asc' },
    });
  },

  async getById(id: string) {
    return prisma.railTrack.findUnique({ where: { id } });
  },

  async create(data: any) {
    return prisma.railTrack.create({
      data: {
        ...data,
        departureTime: data.departureTime ? new Date(data.departureTime) : null,
      },
    });
  },

  async update(id: string, data: any) {
    if (data.departureTime) data.departureTime = new Date(data.departureTime);
    return prisma.railTrack.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.railTrack.delete({ where: { id } });
  },
};

// ============================================================================
// EQUIPMENT SERVICE
// ============================================================================
export const equipmentService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    return prisma.equipment.findMany({
      where,
      orderBy: { equipmentNumber: 'asc' },
    });
  },

  async getById(id: string) {
    return prisma.equipment.findUnique({
      where: { id },
      include: { maintenanceLogs: true },
    });
  },

  async create(data: any) {
    return prisma.equipment.create({
      data: {
        ...data,
        maintenanceDue: data.maintenanceDue ? new Date(data.maintenanceDue) : null,
      },
    });
  },

  async update(id: string, data: any) {
    if (data.maintenanceDue) data.maintenanceDue = new Date(data.maintenanceDue);
    return prisma.equipment.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.equipment.delete({ where: { id } });
  },

  async getAvailable() {
    return prisma.equipment.findMany({
      where: { status: 'AVAILABLE' },
    });
  },
};

// ============================================================================
// MAINTENANCE SERVICE
// ============================================================================
export const maintenanceService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    return prisma.maintenanceLogs.findMany({
      where,
      include: { vehicle: true, equipment: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.maintenanceLogs.findUnique({
      where: { id },
      include: { vehicle: true, equipment: true },
    });
  },

  async create(data: any) {
    const maintenance = await prisma.maintenanceLogs.create({
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        status: 'OPEN',
      },
    });

    // If vehicle associated, update vehicle status to IN_SHOP
    if (data.vehicleId) {
      await prisma.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: 'IN_SHOP' },
      });
      sseManager.broadcast('vehicle_update', { id: data.vehicleId, status: 'IN_SHOP' });
    }

    // If equipment associated, update equipment status to MAINTENANCE
    if (data.equipmentId) {
      await prisma.equipment.update({
        where: { id: data.equipmentId },
        data: { status: 'MAINTENANCE' },
      });
    }

    sseManager.broadcast('maintenance_alert', maintenance);
    sseManager.broadcast('dashboard_update', { trigger: true });

    return maintenance;
  },

  async update(id: string, data: any) {
    return prisma.maintenanceLogs.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.maintenanceLogs.delete({ where: { id } });
  },

  async open(id: string) {
    const maintenance = await prisma.maintenanceLogs.update({
      where: { id },
      data: { status: 'IN_PROGRESS' },
    });

    if (maintenance.vehicleId) {
      await prisma.vehicle.update({
        where: { id: maintenance.vehicleId },
        data: { status: 'IN_SHOP' },
      });
    }

    sseManager.broadcast('maintenance_alert', maintenance);
    return maintenance;
  },

  async close(id: string, cost?: number) {
    const log = await prisma.maintenanceLogs.findUnique({ where: { id } });
    if (!log) throw { statusCode: 404, message: 'Maintenance log not found.' };

    const updatedLog = await prisma.maintenanceLogs.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        cost: cost ?? log.cost,
      },
    });

    // Restore vehicle status to AVAILABLE unless it is retired
    if (log.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: log.vehicleId } });
      if (vehicle && vehicle.status !== 'RETIRED') {
        await prisma.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: 'AVAILABLE', healthScore: Math.min(100, vehicle.healthScore + 20) },
        });
        sseManager.broadcast('vehicle_update', { id: log.vehicleId, status: 'AVAILABLE' });
      }
    }

    // Restore equipment status to AVAILABLE
    if (log.equipmentId) {
      const equipment = await prisma.equipment.findUnique({ where: { id: log.equipmentId } });
      if (equipment) {
        await prisma.equipment.update({
          where: { id: log.equipmentId },
          data: { status: 'AVAILABLE', healthScore: Math.min(100, equipment.healthScore + 15) },
        });
      }
    }

    sseManager.broadcast('maintenance_alert', updatedLog);
    sseManager.broadcast('dashboard_update', { trigger: true });

    return updatedLog;
  },
};

// ============================================================================
// FUEL SERVICE
// ============================================================================
export const fuelService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;
    return prisma.fuelLog.findMany({
      where,
      include: { vehicle: true, driver: true, trip: true },
      orderBy: { loggedAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.fuelLog.findUnique({
      where: { id },
      include: { vehicle: true, driver: true, trip: true },
    });
  },

  async create(data: any) {
    const totalCost = data.quantityLitres * data.costPerLitre;
    const log = await prisma.fuelLog.create({
      data: {
        ...data,
        totalCost,
      },
    });

    // Also update vehicle odometer and fuel level
    if (data.distanceCovered) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
      if (vehicle) {
        await prisma.vehicle.update({
          where: { id: data.vehicleId },
          data: {
            odometer: vehicle.odometer + data.distanceCovered,
            fuelLevel: Math.min(100, vehicle.fuelLevel + (data.quantityLitres / 2)), // Simulating refuel
          },
        });
      }
    }

    sseManager.broadcast('dashboard_update', { trigger: true });
    return log;
  },

  async update(id: string, data: any) {
    const totalCost = data.quantityLitres && data.costPerLitre ? data.quantityLitres * data.costPerLitre : undefined;
    return prisma.fuelLog.update({
      where: { id },
      data: {
        ...data,
        totalCost,
      },
    });
  },

  async delete(id: string) {
    return prisma.fuelLog.delete({ where: { id } });
  },
};

// ============================================================================
// EXPENSE SERVICE
// ============================================================================
export const expenseService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.tripId) where.tripId = filters.tripId;
    return prisma.expense.findMany({
      where,
      include: { vehicle: true, trip: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
      include: { vehicle: true, trip: true },
    });
  },

  async create(data: any) {
    const exp = await prisma.expense.create({ data });
    sseManager.broadcast('dashboard_update', { trigger: true });
    return exp;
  },

  async update(id: string, data: any) {
    return prisma.expense.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.expense.delete({ where: { id } });
  },
};
