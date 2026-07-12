import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { sseManager } from '../utils/sseManager';

const prisma = new PrismaClient();

// ============================================================================
// AUTH SERVICE
// ============================================================================
export const authService = {
  async register(data: any) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'DRIVER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { statusCode: 401, message: 'Invalid credentials.' };
    
    if (user.status === 'INACTIVE') {
      throw { statusCode: 403, message: 'Account is inactive. Contact administrator.' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw { statusCode: 401, message: 'Invalid credentials.' };

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    };
  },

  async refresh(token: string) {
    const decoded = jwtVerifyRefresh(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.status === 'INACTIVE') {
      throw { statusCode: 401, message: 'User not found or inactive.' };
    }
    const accessToken = generateAccessToken(user.id, user.role);
    return { accessToken };
  },

  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, status: true },
    });
  },

  async updateProfile(userId: string, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, status: true },
    });
  },
};

// Helper for JWT refresh verify to prevent circular dependencies
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
const jwtVerifyRefresh = (token: string): any => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

// ============================================================================
// VEHICLE SERVICE
// ============================================================================
export const vehicleService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { registrationNo: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return prisma.vehicle.findMany({
      where,
      include: { driver: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        driver: true,
        trips: { take: 5, orderBy: { createdAt: 'desc' } },
        maintenanceLogs: { take: 5, orderBy: { createdAt: 'desc' } },
        fuelLogs: { take: 5, orderBy: { loggedAt: 'desc' } },
      },
    });
  },

  async create(data: any) {
    return prisma.vehicle.create({ data });
  },

  async update(id: string, data: any) {
    const updated = await prisma.vehicle.update({ where: { id }, data });
    sseManager.broadcast('vehicle_update', updated);
    return updated;
  },

  async delete(id: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (vehicle?.status === 'ON_TRIP') {
      throw { statusCode: 400, message: 'Cannot delete vehicle currently on a trip.' };
    }
    return prisma.vehicle.delete({ where: { id } });
  },

  async getAvailable(minCapacity?: number) {
    const where: any = {
      status: 'AVAILABLE',
    };
    if (minCapacity) {
      where.maxCapacity = { gte: minCapacity };
    }
    return prisma.vehicle.findMany({ where, include: { driver: true } });
  },
};

// ============================================================================
// DRIVER SERVICE
// ============================================================================
export const driverService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { licenseNo: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return prisma.driver.findMany({
      where,
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.driver.findUnique({
      where: { id },
      include: { vehicle: true, trips: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
  },

  async create(data: any) {
    if (data.licenseExpiry) {
      data.licenseExpiry = new Date(data.licenseExpiry);
    }
    return prisma.driver.create({ data });
  },

  async update(id: string, data: any) {
    if (data.licenseExpiry) {
      data.licenseExpiry = new Date(data.licenseExpiry);
    }
    const updated = await prisma.driver.update({ where: { id }, data });
    sseManager.broadcast('driver_update', updated);
    return updated;
  },

  async delete(id: string) {
    const driver = await prisma.driver.findUnique({ where: { id } });
    if (driver?.status === 'ON_TRIP') {
      throw { statusCode: 400, message: 'Cannot delete driver currently on a trip.' };
    }
    return prisma.driver.delete({ where: { id } });
  },

  async getAvailable() {
    return prisma.driver.findMany({
      where: {
        status: 'AVAILABLE',
        licenseExpiry: { gt: new Date() },
      },
    });
  },
};

// ============================================================================
// TRIP SERVICE
// ============================================================================
export const tripService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.vehicleId) where.vehicleId = filters.vehicleId;
    if (filters.driverId) where.driverId = filters.driverId;
    
    return prisma.trip.findMany({
      where,
      include: {
        vehicle: true,
        driver: true,
        container: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
        container: true,
        fuelLogs: true,
        expenses: true,
      },
    });
  },

  async create(data: any) {
    // Generate trip number
    const count = await prisma.trip.count();
    const tripNumber = `TRIP-${String(count + 1).padStart(5, '0')}`;
    return prisma.trip.create({
      data: {
        ...data,
        tripNumber,
        status: 'DRAFT',
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.trip.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.trip.delete({ where: { id } });
  },

  async dispatch(id: string) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    });

    if (!trip) throw { statusCode: 404, message: 'Trip not found.' };
    
    // Validate vehicle and driver availability
    if (trip.vehicle.status !== 'AVAILABLE') {
      throw { statusCode: 422, message: `Vehicle ${trip.vehicle.registrationNo} is not available (Current: ${trip.vehicle.status}).` };
    }
    if (trip.driver.status !== 'AVAILABLE') {
      throw { statusCode: 422, message: `Driver ${trip.driver.name} is not available.` };
    }
    
    // Check driver license expiration
    if (new Date(trip.driver.licenseExpiry) < new Date()) {
      throw { statusCode: 422, message: `Driver ${trip.driver.name} has an expired license.` };
    }

    // Check cargo capacity
    if (trip.cargoWeight > trip.vehicle.maxCapacity) {
      throw { statusCode: 422, message: `Cargo weight exceeds vehicle capacity (Cargo: ${trip.cargoWeight} tons, Capacity: ${trip.vehicle.maxCapacity} tons).` };
    }

    // Atomic transaction
    const [updatedTrip, updatedVehicle, updatedDriver] = await prisma.$transaction([
      prisma.trip.update({
        where: { id },
        data: { status: 'DISPATCHED', dispatchedAt: new Date() },
        include: { vehicle: true, driver: true, container: true },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'ON_TRIP' },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: 'ON_TRIP' },
      }),
    ]);

    // If a container is associated, update container status to IN_TRANSIT
    if (trip.containerId) {
      await prisma.container.update({
        where: { id: trip.containerId },
        data: { status: 'IN_TRANSIT' },
      });
      // Update container request status if any exists
      await prisma.containerRequest.updateMany({
        where: { containerId: trip.containerId, status: 'ASSIGNED' },
        data: { status: 'DISPATCHED' },
      });
    }

    sseManager.broadcast('trip_update', updatedTrip);
    sseManager.broadcast('vehicle_update', updatedVehicle);
    sseManager.broadcast('driver_update', updatedDriver);
    sseManager.broadcast('dashboard_update', { trigger: true });

    return updatedTrip;
  },

  async complete(id: string) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    });

    if (!trip) throw { statusCode: 404, message: 'Trip not found.' };

    const [updatedTrip, updatedVehicle, updatedDriver] = await prisma.$transaction([
      prisma.trip.update({
        where: { id },
        data: { status: 'COMPLETED', completedAt: new Date() },
        include: { vehicle: true, driver: true, container: true },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE' },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    if (trip.containerId) {
      await prisma.container.update({
        where: { id: trip.containerId },
        data: { status: 'DELIVERED' },
      });
      await prisma.containerRequest.updateMany({
        where: { containerId: trip.containerId, status: 'DISPATCHED' },
        data: { status: 'COMPLETED' },
      });
    }

    sseManager.broadcast('trip_update', updatedTrip);
    sseManager.broadcast('vehicle_update', updatedVehicle);
    sseManager.broadcast('driver_update', updatedDriver);
    sseManager.broadcast('dashboard_update', { trigger: true });

    return updatedTrip;
  },

  async cancel(id: string) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    });

    if (!trip) throw { statusCode: 404, message: 'Trip not found.' };

    const [updatedTrip, updatedVehicle, updatedDriver] = await prisma.$transaction([
      prisma.trip.update({
        where: { id },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
        include: { vehicle: true, driver: true, container: true },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE' },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    if (trip.containerId) {
      await prisma.container.update({
        where: { id: trip.containerId },
        data: { status: 'CANCELLED' },
      });
      await prisma.containerRequest.updateMany({
        where: { containerId: trip.containerId },
        data: { status: 'CANCELLED' },
      });
    }

    sseManager.broadcast('trip_update', updatedTrip);
    sseManager.broadcast('vehicle_update', updatedVehicle);
    sseManager.broadcast('driver_update', updatedDriver);
    sseManager.broadcast('dashboard_update', { trigger: true });

    return updatedTrip;
  },
};

// ============================================================================
// CONTAINER SERVICE
// ============================================================================
export const containerService = {
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.search) {
      where.containerCode = { contains: filters.search, mode: 'insensitive' };
    }
    return prisma.container.findMany({
      where,
      include: {
        sourceDock: true,
        destWarehouse: true,
        ship: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return prisma.container.findUnique({
      where: { id },
      include: {
        sourceDock: true,
        destWarehouse: true,
        ship: true,
        trips: true,
        requests: true,
      },
    });
  },

  async create(data: any) {
    return prisma.container.create({ data });
  },

  async update(id: string, data: any) {
    const updated = await prisma.container.update({ where: { id }, data });
    sseManager.broadcast('container_update', updated);
    return updated;
  },

  async delete(id: string) {
    return prisma.container.delete({ where: { id } });
  },

  async getRequests() {
    return prisma.containerRequest.findMany({
      include: {
        container: {
          include: { sourceDock: true, destWarehouse: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async createRequest(data: any) {
    const request = await prisma.containerRequest.create({
      data: {
        containerId: data.containerId,
        requestedBy: data.requestedBy,
        notes: data.notes,
        status: 'PENDING',
      },
      include: { container: true },
    });
    
    // Automatically set container status to ALLOCATED
    await prisma.container.update({
      where: { id: data.containerId },
      data: { status: 'ALLOCATED' },
    });

    sseManager.broadcast('container_update', { id: data.containerId, status: 'ALLOCATED' });
    return request;
  },
};
