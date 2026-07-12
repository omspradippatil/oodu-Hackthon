import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Users ───────────────────────────────────────────────────────────────
  const passwordRounds = 12;
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'om@gmail.com' },
      update: {},
      create: {
        email: 'om@gmail.com',
        passwordHash: await bcrypt.hash('om123', passwordRounds),
        name: 'Om Patil',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@vadhvanport.com' },
      update: {},
      create: {
        email: 'admin@vadhvanport.com',
        passwordHash: await bcrypt.hash('Admin@123', passwordRounds),
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ops@vadhvanport.com' },
      update: {},
      create: {
        email: 'ops@vadhvanport.com',
        passwordHash: await bcrypt.hash('Ops@123', passwordRounds),
        name: 'Operations Manager',
        role: 'OPERATIONS_MANAGER',
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'fleet@vadhvanport.com' },
      update: {},
      create: {
        email: 'fleet@vadhvanport.com',
        passwordHash: await bcrypt.hash('Fleet@123', passwordRounds),
        name: 'Fleet Manager',
        role: 'FLEET_MANAGER',
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'maintenance@vadhvanport.com' },
      update: {},
      create: {
        email: 'maintenance@vadhvanport.com',
        passwordHash: await bcrypt.hash('Maint@123', passwordRounds),
        name: 'Maintenance Supervisor',
        role: 'MAINTENANCE_SUPERVISOR',
        status: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'driver1@vadhvanport.com' },
      update: {},
      create: {
        email: 'driver1@vadhvanport.com',
        passwordHash: await bcrypt.hash('Driver@123', passwordRounds),
        name: 'Rajesh Kumar',
        role: 'DRIVER',
        status: 'ACTIVE',
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // ─── Warehouses ──────────────────────────────────────────────────────────
  const warehouses = await Promise.all([
    prisma.warehouse.upsert({
      where: { id: 'wh-001' },
      update: {},
      create: {
        id: 'wh-001',
        name: 'Warehouse Alpha',
        capacity: 50000,
        availableSpace: 35000,
        occupiedSpace: 15000,
        locationLat: 21.1702,
        locationLng: 72.8311,
      },
    }),
    prisma.warehouse.upsert({
      where: { id: 'wh-002' },
      update: {},
      create: {
        id: 'wh-002',
        name: 'Warehouse Beta',
        capacity: 80000,
        availableSpace: 60000,
        occupiedSpace: 20000,
        locationLat: 21.1750,
        locationLng: 72.8340,
      },
    }),
    prisma.warehouse.upsert({
      where: { id: 'wh-003' },
      update: {},
      create: {
        id: 'wh-003',
        name: 'Warehouse Gamma',
        capacity: 30000,
        availableSpace: 10000,
        occupiedSpace: 20000,
        locationLat: 21.1680,
        locationLng: 72.8290,
      },
    }),
  ]);
  console.log(`✅ Created ${warehouses.length} warehouses`);

  // ─── Docks ───────────────────────────────────────────────────────────────
  const docks = await Promise.all([
    prisma.dock.upsert({
      where: { dockNumber: 'DOCK-01' },
      update: {},
      create: { dockNumber: 'DOCK-01', status: 'AVAILABLE', containerCount: 0, warehouseId: 'wh-001' },
    }),
    prisma.dock.upsert({
      where: { dockNumber: 'DOCK-02' },
      update: {},
      create: { dockNumber: 'DOCK-02', status: 'OCCUPIED', containerCount: 45, warehouseId: 'wh-001' },
    }),
    prisma.dock.upsert({
      where: { dockNumber: 'DOCK-03' },
      update: {},
      create: { dockNumber: 'DOCK-03', status: 'AVAILABLE', containerCount: 0, warehouseId: 'wh-002' },
    }),
    prisma.dock.upsert({
      where: { dockNumber: 'DOCK-04' },
      update: {},
      create: { dockNumber: 'DOCK-04', status: 'MAINTENANCE', containerCount: 0, warehouseId: 'wh-002' },
    }),
    prisma.dock.upsert({
      where: { dockNumber: 'DOCK-05' },
      update: {},
      create: { dockNumber: 'DOCK-05', status: 'AVAILABLE', containerCount: 12, warehouseId: 'wh-003' },
    }),
    prisma.dock.upsert({
      where: { dockNumber: 'DOCK-06' },
      update: {},
      create: { dockNumber: 'DOCK-06', status: 'OCCUPIED', containerCount: 78, warehouseId: 'wh-003' },
    }),
  ]);
  console.log(`✅ Created ${docks.length} docks`);

  // ─── Ships ───────────────────────────────────────────────────────────────
  const ships = await Promise.all([
    prisma.ship.upsert({
      where: { imoNumber: 'IMO9234567' },
      update: {},
      create: {
        imoNumber: 'IMO9234567',
        name: 'MV Bharati Samudra',
        arrivalTime: new Date('2026-07-10T08:00:00Z'),
        expectedDeparture: new Date('2026-07-14T18:00:00Z'),
        dockId: docks[1].id,
        containerCount: 450,
        priority: 'HIGH',
        cargoType: 'General Cargo',
        shipLength: 200,
        shipWidth: 32,
        draft: 11.5,
        status: 'DOCKED',
      },
    }),
    prisma.ship.upsert({
      where: { imoNumber: 'IMO9345678' },
      update: {},
      create: {
        imoNumber: 'IMO9345678',
        name: 'MV Sagar Nidhi',
        arrivalTime: new Date('2026-07-12T14:00:00Z'),
        expectedDeparture: new Date('2026-07-16T10:00:00Z'),
        containerCount: 320,
        priority: 'MEDIUM',
        cargoType: 'Bulk Cargo',
        shipLength: 180,
        shipWidth: 28,
        draft: 9.5,
        status: 'WAITING',
      },
    }),
    prisma.ship.upsert({
      where: { imoNumber: 'IMO9456789' },
      update: {},
      create: {
        imoNumber: 'IMO9456789',
        name: 'MV Gangotri',
        arrivalTime: new Date('2026-07-08T06:00:00Z'),
        expectedDeparture: new Date('2026-07-12T20:00:00Z'),
        dockId: docks[5].id,
        containerCount: 600,
        priority: 'CRITICAL',
        cargoType: 'Container Cargo',
        shipLength: 250,
        shipWidth: 40,
        draft: 13.5,
        status: 'UNLOADING',
      },
    }),
    prisma.ship.upsert({
      where: { imoNumber: 'IMO9567890' },
      update: {},
      create: {
        imoNumber: 'IMO9567890',
        name: 'MV Kaveri Express',
        arrivalTime: new Date('2026-07-15T09:00:00Z'),
        expectedDeparture: new Date('2026-07-18T15:00:00Z'),
        containerCount: 280,
        priority: 'LOW',
        cargoType: 'Refrigerated Cargo',
        shipLength: 170,
        shipWidth: 25,
        draft: 8.5,
        status: 'WAITING',
      },
    }),
    prisma.ship.upsert({
      where: { imoNumber: 'IMO9678901' },
      update: {},
      create: {
        imoNumber: 'IMO9678901',
        name: 'MV Brahmputra',
        arrivalTime: new Date('2026-07-05T12:00:00Z'),
        expectedDeparture: new Date('2026-07-11T08:00:00Z'),
        containerCount: 400,
        priority: 'HIGH',
        cargoType: 'Chemical Tanker',
        shipLength: 220,
        shipWidth: 35,
        draft: 12.0,
        status: 'COMPLETED',
      },
    }),
  ]);
  console.log(`✅ Created ${ships.length} ships`);

  // ─── Equipment ───────────────────────────────────────────────────────────
  const equipment = await Promise.all([
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-CR-001' },
      update: {},
      create: { name: 'Gantry Crane Alpha', equipmentNumber: 'EQ-CR-001', type: 'CRANE', status: 'AVAILABLE', healthScore: 92, assignedDockId: docks[0].id },
    }),
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-CR-002' },
      update: {},
      create: { name: 'Gantry Crane Beta', equipmentNumber: 'EQ-CR-002', type: 'CRANE', status: 'BUSY', healthScore: 85, assignedDockId: docks[1].id },
    }),
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-FK-001' },
      update: {},
      create: { name: 'Forklift Unit 1', equipmentNumber: 'EQ-FK-001', type: 'FORKLIFT', status: 'AVAILABLE', healthScore: 96 },
    }),
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-FK-002' },
      update: {},
      create: { name: 'Forklift Unit 2', equipmentNumber: 'EQ-FK-002', type: 'FORKLIFT', status: 'MAINTENANCE', healthScore: 45, maintenanceDue: new Date('2026-07-20') },
    }),
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-RS-001' },
      update: {},
      create: { name: 'Reach Stacker 1', equipmentNumber: 'EQ-RS-001', type: 'REACH_STACKER', status: 'AVAILABLE', healthScore: 88 },
    }),
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-RS-002' },
      update: {},
      create: { name: 'Reach Stacker 2', equipmentNumber: 'EQ-RS-002', type: 'REACH_STACKER', status: 'BUSY', healthScore: 78, assignedDockId: docks[5].id },
    }),
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-MH-001' },
      update: {},
      create: { name: 'Material Handler 1', equipmentNumber: 'EQ-MH-001', type: 'MATERIAL_HANDLER', status: 'AVAILABLE', healthScore: 91 },
    }),
    prisma.equipment.upsert({
      where: { equipmentNumber: 'EQ-TR-001' },
      update: {},
      create: { name: 'Port Trailer 1', equipmentNumber: 'EQ-TR-001', type: 'TRAILER', status: 'OFFLINE', healthScore: 30, maintenanceDue: new Date('2026-07-15') },
    }),
  ]);
  console.log(`✅ Created ${equipment.length} equipment`);

  // ─── Vehicles ────────────────────────────────────────────────────────────
  const vehicleData = [
    { registrationNo: 'GJ01AB1001', name: 'Heavy Truck Alpha', model: 'Tata Prima 4928.S', type: 'TRUCK' as const, status: 'AVAILABLE' as const, maxCapacity: 30, odometer: 45000, fuelLevel: 85, healthScore: 92 },
    { registrationNo: 'GJ01AB1002', name: 'Heavy Truck Beta', model: 'Tata Prima 4928.S', type: 'TRUCK' as const, status: 'ON_TRIP' as const, maxCapacity: 30, odometer: 62000, fuelLevel: 60, healthScore: 78 },
    { registrationNo: 'GJ01AB1003', name: 'Medium Truck Gamma', model: 'Ashok Leyland 2518', type: 'TRUCK' as const, status: 'AVAILABLE' as const, maxCapacity: 25, odometer: 38000, fuelLevel: 95, healthScore: 96 },
    { registrationNo: 'GJ01AB1004', name: 'Container Truck Delta', model: 'Volvo FH 480', type: 'TRUCK' as const, status: 'IN_SHOP' as const, maxCapacity: 35, odometer: 120000, fuelLevel: 40, healthScore: 55 },
    { registrationNo: 'GJ01AB1005', name: 'Long Haul Truck Epsilon', model: 'Scania R410', type: 'TRUCK' as const, status: 'AVAILABLE' as const, maxCapacity: 40, odometer: 88000, fuelLevel: 72, healthScore: 83 },
    { registrationNo: 'GJ01AB2001', name: 'Port Trailer Zeta', model: 'Tata LPT 4923', type: 'TRAILER' as const, status: 'AVAILABLE' as const, maxCapacity: 45, odometer: 55000, fuelLevel: 90, healthScore: 89 },
    { registrationNo: 'GJ01AB2002', name: 'Flatbed Trailer Eta', model: 'Tata LPT 4923', type: 'TRAILER' as const, status: 'ON_TRIP' as const, maxCapacity: 45, odometer: 73000, fuelLevel: 55, healthScore: 74 },
    { registrationNo: 'GJ01AB2003', name: 'Container Trailer Theta', model: 'Mahindra Blazo X 28', type: 'TRAILER' as const, status: 'AVAILABLE' as const, maxCapacity: 28, odometer: 29000, fuelLevel: 88, healthScore: 94 },
    { registrationNo: 'GJ01AB3001', name: 'Forklift Iota', model: 'Toyota 8FBM25', type: 'FORKLIFT' as const, status: 'AVAILABLE' as const, maxCapacity: 2.5, odometer: 12000, fuelLevel: 100, healthScore: 97 },
    { registrationNo: 'GJ01AB3002', name: 'Forklift Kappa', model: 'Kion Linde H30', type: 'FORKLIFT' as const, status: 'AVAILABLE' as const, maxCapacity: 3, odometer: 8500, fuelLevel: 95, healthScore: 99 },
    { registrationNo: 'GJ01AB3003', name: 'Heavy Forklift Lambda', model: 'Hyster H7.0FT', type: 'FORKLIFT' as const, status: 'IN_SHOP' as const, maxCapacity: 7, odometer: 25000, fuelLevel: 30, healthScore: 42 },
    { registrationNo: 'GJ01AB4001', name: 'Reach Stacker Mu', model: 'Liebherr LRS 545', type: 'REACH_STACKER' as const, status: 'AVAILABLE' as const, maxCapacity: 45, odometer: 33000, fuelLevel: 78, healthScore: 87 },
    { registrationNo: 'GJ01AB4002', name: 'Reach Stacker Nu', model: 'Kalmar DRG450', type: 'REACH_STACKER' as const, status: 'AVAILABLE' as const, maxCapacity: 45, odometer: 41000, fuelLevel: 65, healthScore: 82 },
    { registrationNo: 'GJ01AB5001', name: 'Crane Truck Xi', model: 'Tata Prima 4923.S CNG', type: 'CRANE_TRUCK' as const, status: 'AVAILABLE' as const, maxCapacity: 20, odometer: 19000, fuelLevel: 92, healthScore: 91 },
    { registrationNo: 'GJ01AB1006', name: 'Truck Omicron', model: 'BharatBenz 4428', type: 'TRUCK' as const, status: 'AVAILABLE' as const, maxCapacity: 32, odometer: 51000, fuelLevel: 80, healthScore: 86 },
    { registrationNo: 'GJ01AB1007', name: 'Truck Pi', model: 'Eicher Pro 6016', type: 'TRUCK' as const, status: 'RETIRED' as const, maxCapacity: 16, odometer: 215000, fuelLevel: 0, healthScore: 15 },
    { registrationNo: 'GJ01AB2004', name: 'Trailer Rho', model: 'Tata Signa 4825.TK', type: 'TRAILER' as const, status: 'AVAILABLE' as const, maxCapacity: 25, odometer: 44000, fuelLevel: 77, healthScore: 85 },
    { registrationNo: 'GJ01AB3004', name: 'Forklift Sigma', model: 'Crown SC 5200', type: 'FORKLIFT' as const, status: 'AVAILABLE' as const, maxCapacity: 2, odometer: 5000, fuelLevel: 100, healthScore: 100 },
    { registrationNo: 'GJ01AB4003', name: 'Reach Stacker Tau', model: 'Manitowoc Grove RT760E', type: 'REACH_STACKER' as const, status: 'AVAILABLE' as const, maxCapacity: 40, odometer: 22000, fuelLevel: 85, healthScore: 93 },
    { registrationNo: 'GJ01AB5002', name: 'Crane Truck Upsilon', model: 'Tata Prima 5530.S', type: 'CRANE_TRUCK' as const, status: 'AVAILABLE' as const, maxCapacity: 22, odometer: 17000, fuelLevel: 90, healthScore: 95 },
  ];

  const vehicles = await Promise.all(
    vehicleData.map(v =>
      prisma.vehicle.upsert({
        where: { registrationNo: v.registrationNo },
        update: {},
        create: v,
      })
    )
  );
  console.log(`✅ Created ${vehicles.length} vehicles`);

  // ─── Drivers ─────────────────────────────────────────────────────────────
  const driverData = [
    { name: 'Rajesh Kumar', licenseNo: 'GJ01-2019-001234', licenseCategory: 'HMV', licenseExpiry: new Date('2027-06-15'), phone: '9876543210', safetyScore: 96, experienceYears: 8, status: 'AVAILABLE' as const },
    { name: 'Suresh Patel', licenseNo: 'GJ01-2020-005678', licenseCategory: 'HMV', licenseExpiry: new Date('2028-03-20'), phone: '9876543211', safetyScore: 88, experienceYears: 6, status: 'ON_TRIP' as const },
    { name: 'Mahesh Singh', licenseNo: 'GJ01-2018-009012', licenseCategory: 'HMV', licenseExpiry: new Date('2026-09-10'), phone: '9876543212', safetyScore: 91, experienceYears: 10, status: 'AVAILABLE' as const },
    { name: 'Ramesh Yadav', licenseNo: 'GJ01-2021-003456', licenseCategory: 'LMV', licenseExpiry: new Date('2029-01-25'), phone: '9876543213', safetyScore: 82, experienceYears: 4, status: 'AVAILABLE' as const },
    { name: 'Dinesh Sharma', licenseNo: 'GJ01-2017-007890', licenseCategory: 'HMV', licenseExpiry: new Date('2025-12-31'), phone: '9876543214', safetyScore: 74, experienceYears: 12, status: 'OFF_DUTY' as const },
    { name: 'Kamlesh Verma', licenseNo: 'GJ01-2022-001122', licenseCategory: 'HMV', licenseExpiry: new Date('2030-08-15'), phone: '9876543215', safetyScore: 95, experienceYears: 3, status: 'AVAILABLE' as const },
    { name: 'Naresh Joshi', licenseNo: 'GJ01-2019-003344', licenseCategory: 'HMV', licenseExpiry: new Date('2027-11-05'), phone: '9876543216', safetyScore: 78, experienceYears: 7, status: 'AVAILABLE' as const },
    { name: 'Lokesh Tiwari', licenseNo: 'GJ01-2020-005566', licenseCategory: 'LMV', licenseExpiry: new Date('2028-04-18'), phone: '9876543217', safetyScore: 85, experienceYears: 5, status: 'SUSPENDED' as const },
    { name: 'Ganesh Mishra', licenseNo: 'GJ01-2018-007788', licenseCategory: 'HMV', licenseExpiry: new Date('2026-07-22'), phone: '9876543218', safetyScore: 90, experienceYears: 9, status: 'AVAILABLE' as const },
    { name: 'Ramakant Dubey', licenseNo: 'GJ01-2021-009900', licenseCategory: 'HMV', licenseExpiry: new Date('2029-02-14'), phone: '9876543219', safetyScore: 87, experienceYears: 4, status: 'ON_TRIP' as const },
    { name: 'Vikas Chauhan', licenseNo: 'GJ01-2016-001234', licenseCategory: 'HMV', licenseExpiry: new Date('2024-10-10'), phone: '9876543220', safetyScore: 65, experienceYears: 14, status: 'OFF_DUTY' as const },
    { name: 'Sanjay Rawat', licenseNo: 'GJ01-2022-005678', licenseCategory: 'HMV', licenseExpiry: new Date('2030-06-30'), phone: '9876543221', safetyScore: 98, experienceYears: 2, status: 'AVAILABLE' as const },
    { name: 'Anil Pandey', licenseNo: 'GJ01-2019-009012', licenseCategory: 'HMV', licenseExpiry: new Date('2027-09-08'), phone: '9876543222', safetyScore: 83, experienceYears: 7, status: 'AVAILABLE' as const },
    { name: 'Mohan Gupta', licenseNo: 'GJ01-2020-003456', licenseCategory: 'LMV', licenseExpiry: new Date('2028-12-15'), phone: '9876543223', safetyScore: 79, experienceYears: 5, status: 'AVAILABLE' as const },
    { name: 'Deepak Thakur', licenseNo: 'GJ01-2021-007890', licenseCategory: 'HMV', licenseExpiry: new Date('2029-03-22'), phone: '9876543224', safetyScore: 94, experienceYears: 3, status: 'AVAILABLE' as const },
  ];

  const drivers = await Promise.all(
    driverData.map(d =>
      prisma.driver.upsert({
        where: { licenseNo: d.licenseNo },
        update: {},
        create: d,
      })
    )
  );
  console.log(`✅ Created ${drivers.length} drivers`);

  // ─── Containers ──────────────────────────────────────────────────────────
  const containerData = [
    { containerCode: 'VADHV001', weight: 18500, priority: 'HIGH' as const, status: 'WAITING' as const, sourceDockId: docks[1].id, destWarehouseId: warehouses[0].id, shipId: ships[0].id },
    { containerCode: 'VADHV002', weight: 22000, priority: 'CRITICAL' as const, status: 'LOADING' as const, sourceDockId: docks[5].id, destWarehouseId: warehouses[1].id, shipId: ships[2].id },
    { containerCode: 'VADHV003', weight: 15000, priority: 'MEDIUM' as const, status: 'IN_TRANSIT' as const, sourceDockId: docks[0].id, destWarehouseId: warehouses[0].id },
    { containerCode: 'VADHV004', weight: 28000, priority: 'HIGH' as const, status: 'WAITING' as const, sourceDockId: docks[1].id, destWarehouseId: warehouses[2].id, shipId: ships[0].id },
    { containerCode: 'VADHV005', weight: 12500, priority: 'LOW' as const, status: 'DELIVERED' as const, destWarehouseId: warehouses[1].id },
    { containerCode: 'VADHV006', weight: 19800, priority: 'MEDIUM' as const, status: 'ALLOCATED' as const, sourceDockId: docks[5].id, destWarehouseId: warehouses[0].id, shipId: ships[2].id },
    { containerCode: 'VADHV007', weight: 25000, priority: 'CRITICAL' as const, status: 'WAITING' as const, sourceDockId: docks[5].id, destWarehouseId: warehouses[2].id, shipId: ships[2].id },
    { containerCode: 'VADHV008', weight: 17500, priority: 'MEDIUM' as const, status: 'WAITING' as const, sourceDockId: docks[1].id, destWarehouseId: warehouses[1].id, shipId: ships[0].id },
    { containerCode: 'VADHV009', weight: 30000, priority: 'HIGH' as const, status: 'LOADING' as const, sourceDockId: docks[5].id, destWarehouseId: warehouses[0].id, shipId: ships[2].id },
    { containerCode: 'VADHV010', weight: 11000, priority: 'LOW' as const, status: 'CANCELLED' as const },
  ];

  const containers = await Promise.all(
    containerData.map(c =>
      prisma.container.upsert({
        where: { containerCode: c.containerCode },
        update: {},
        create: c,
      })
    )
  );
  console.log(`✅ Created ${containers.length} containers`);

  // ─── Rail Tracks ─────────────────────────────────────────────────────────
  await Promise.all([
    prisma.railTrack.upsert({ where: { trackNumber: 'RT-01' }, update: {}, create: { trackNumber: 'RT-01', status: 'AVAILABLE', capacity: 20, destination: 'Ahmedabad Junction' } }),
    prisma.railTrack.upsert({ where: { trackNumber: 'RT-02' }, update: {}, create: { trackNumber: 'RT-02', status: 'OCCUPIED', capacity: 30, destination: 'Surat Railway Station', departureTime: new Date('2026-07-13T06:00:00Z'), containerIds: JSON.stringify([containers[2].id, containers[4].id]) } }),
    prisma.railTrack.upsert({ where: { trackNumber: 'RT-03' }, update: {}, create: { trackNumber: 'RT-03', status: 'MAINTENANCE', capacity: 25, destination: 'Mumbai CSMT' } }),
  ]);
  console.log('✅ Created 3 rail tracks');

  // ─── Trips ───────────────────────────────────────────────────────────────
  const tripData = [
    {
      tripNumber: 'TRIP-2026-001',
      containerId: containers[0].id,
      vehicleId: vehicles[0].id,
      driverId: drivers[0].id,
      source: 'DOCK-02',
      destination: 'Warehouse Alpha',
      cargoWeight: 18500,
      plannedDistance: 5.2,
      estimatedTime: 30,
      status: 'COMPLETED' as const,
      priority: 'HIGH' as const,
      dispatchedAt: new Date('2026-07-10T10:00:00Z'),
      completedAt: new Date('2026-07-10T12:30:00Z'),
    },
    {
      tripNumber: 'TRIP-2026-002',
      containerId: containers[1].id,
      vehicleId: vehicles[1].id,
      driverId: drivers[1].id,
      source: 'DOCK-06',
      destination: 'Warehouse Beta',
      cargoWeight: 22000,
      plannedDistance: 7.8,
      estimatedTime: 45,
      status: 'IN_TRANSIT' as const,
      priority: 'CRITICAL' as const,
      dispatchedAt: new Date('2026-07-12T09:00:00Z'),
    },
    {
      tripNumber: 'TRIP-2026-003',
      vehicleId: vehicles[5].id,
      driverId: drivers[2].id,
      source: 'DOCK-01',
      destination: 'Warehouse Alpha',
      cargoWeight: 15000,
      plannedDistance: 4.1,
      estimatedTime: 25,
      status: 'DRAFT' as const,
      priority: 'MEDIUM' as const,
    },
    {
      tripNumber: 'TRIP-2026-004',
      containerId: containers[3].id,
      vehicleId: vehicles[6].id,
      driverId: drivers[9].id,
      source: 'DOCK-02',
      destination: 'Warehouse Gamma',
      cargoWeight: 28000,
      plannedDistance: 6.5,
      estimatedTime: 40,
      status: 'DISPATCHED' as const,
      priority: 'HIGH' as const,
      dispatchedAt: new Date('2026-07-12T08:00:00Z'),
    },
    {
      tripNumber: 'TRIP-2026-005',
      vehicleId: vehicles[2].id,
      driverId: drivers[5].id,
      source: 'DOCK-05',
      destination: 'Warehouse Beta',
      cargoWeight: 19800,
      plannedDistance: 5.9,
      estimatedTime: 35,
      status: 'CANCELLED' as const,
      priority: 'MEDIUM' as const,
      cancelledAt: new Date('2026-07-11T14:00:00Z'),
      notes: 'Vehicle breakdown',
    },
  ];

  const trips = await Promise.all(
    tripData.map(t =>
      prisma.trip.upsert({
        where: { tripNumber: t.tripNumber },
        update: {},
        create: t,
      })
    )
  );
  console.log(`✅ Created ${trips.length} trips`);

  // ─── Fuel Logs ───────────────────────────────────────────────────────────
  const fuelLogData = [
    { vehicleId: vehicles[0].id, driverId: drivers[0].id, tripId: trips[0].id, quantityLitres: 45, costPerLitre: 96.5, totalCost: 4342.5, distanceCovered: 112 },
    { vehicleId: vehicles[1].id, driverId: drivers[1].id, tripId: trips[1].id, quantityLitres: 60, costPerLitre: 96.5, totalCost: 5790, distanceCovered: 145 },
    { vehicleId: vehicles[2].id, quantityLitres: 35, costPerLitre: 96.5, totalCost: 3377.5 },
    { vehicleId: vehicles[5].id, quantityLitres: 50, costPerLitre: 96.5, totalCost: 4825 },
    { vehicleId: vehicles[0].id, driverId: drivers[0].id, quantityLitres: 40, costPerLitre: 97, totalCost: 3880, distanceCovered: 98 },
    { vehicleId: vehicles[11].id, quantityLitres: 70, costPerLitre: 96.5, totalCost: 6755 },
    { vehicleId: vehicles[12].id, driverId: drivers[3].id, quantityLitres: 65, costPerLitre: 97, totalCost: 6305, distanceCovered: 160 },
    { vehicleId: vehicles[4].id, driverId: drivers[2].id, quantityLitres: 55, costPerLitre: 96.5, totalCost: 5307.5, distanceCovered: 135 },
    { vehicleId: vehicles[13].id, quantityLitres: 30, costPerLitre: 97, totalCost: 2910 },
    { vehicleId: vehicles[2].id, driverId: drivers[2].id, quantityLitres: 48, costPerLitre: 96.5, totalCost: 4632, distanceCovered: 118 },
  ];

  await Promise.all(fuelLogData.map(f => prisma.fuelLog.create({ data: f })));
  console.log(`✅ Created ${fuelLogData.length} fuel logs`);

  // ─── Maintenance Logs ────────────────────────────────────────────────────
  await Promise.all([
    prisma.maintenanceLogs.create({
      data: {
        vehicleId: vehicles[3].id,
        type: 'ENGINE_SERVICE',
        description: 'Full engine overhaul required, oil leakage detected',
        technicianName: 'Ramesh Mechanic',
        cost: 45000,
        status: 'IN_PROGRESS',
        scheduledAt: new Date('2026-07-10'),
      },
    }),
    prisma.maintenanceLogs.create({
      data: {
        vehicleId: vehicles[10].id,
        type: 'TYRE_REPLACEMENT',
        description: 'All 8 tyres need replacement due to wear',
        technicianName: 'Suresh Technician',
        cost: 32000,
        status: 'OPEN',
        scheduledAt: new Date('2026-07-14'),
      },
    }),
    prisma.maintenanceLogs.create({
      data: {
        vehicleId: vehicles[0].id,
        type: 'OIL_CHANGE',
        description: 'Routine oil change and filter replacement',
        technicianName: 'Mahesh Mechanic',
        cost: 2500,
        status: 'COMPLETED',
        scheduledAt: new Date('2026-07-05'),
        completedAt: new Date('2026-07-05'),
      },
    }),
    prisma.maintenanceLogs.create({
      data: {
        equipmentId: equipment[3].id,
        type: 'REPAIR',
        description: 'Hydraulic system failure, needs complete repair',
        technicianName: 'Dinesh Engineer',
        cost: 15000,
        status: 'IN_PROGRESS',
        scheduledAt: new Date('2026-07-11'),
      },
    }),
    prisma.maintenanceLogs.create({
      data: {
        vehicleId: vehicles[2].id,
        type: 'INSPECTION',
        description: 'Quarterly safety inspection completed',
        technicianName: 'Kamlesh Inspector',
        cost: 1000,
        status: 'COMPLETED',
        scheduledAt: new Date('2026-07-01'),
        completedAt: new Date('2026-07-01'),
      },
    }),
  ]);
  console.log('✅ Created 5 maintenance logs');

  // ─── Notifications ───────────────────────────────────────────────────────
  const notifData = [
    { userId: users[0].id, type: 'ALERT', title: 'Critical Ship Arrival', message: 'MV Gangotri has arrived at DOCK-06 with CRITICAL priority cargo', read: false },
    { userId: users[1].id, type: 'INFO', title: 'Trip Dispatched', message: 'Trip TRIP-2026-004 has been dispatched to Warehouse Gamma', read: false },
    { userId: users[0].id, type: 'WARNING', title: 'Vehicle Maintenance Required', message: 'Vehicle GJ01AB1004 requires immediate engine service', read: false },
    { userId: users[2].id, type: 'INFO', title: 'Driver Available', message: 'Rajesh Kumar is now available for new trips', read: true },
    { userId: users[0].id, type: 'ALERT', title: 'Fuel Level Low', message: 'Vehicle GJ01AB1004 fuel level is critically low at 40%', read: false },
    { userId: users[3].id, type: 'TASK', title: 'Maintenance Due', message: 'Forklift EQ-FK-002 is due for scheduled maintenance', read: false },
    { userId: users[1].id, type: 'INFO', title: 'Container Delivered', message: 'Container VADHV005 has been successfully delivered', read: true },
    { userId: users[0].id, type: 'WARNING', title: 'Dock Maintenance', message: 'DOCK-04 is currently under maintenance, redirecting ships', read: false },
    { userId: users[2].id, type: 'INFO', title: 'New Ship Registered', message: 'MV Sagar Nidhi (IMO9345678) has been registered for arrival', read: false },
    { type: 'SYSTEM', title: 'System Update', message: 'Port management system updated to version 2.0.1', read: false },
  ];

  await Promise.all(notifData.map(n => prisma.notification.create({ data: n })));
  console.log('✅ Created 10 notifications');

  // ─── Expenses ────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.expense.create({ data: { vehicleId: vehicles[0].id, tripId: trips[0].id, type: 'FUEL', amount: 4342.5, description: 'Fuel for trip 001' } }),
    prisma.expense.create({ data: { vehicleId: vehicles[1].id, tripId: trips[1].id, type: 'TOLL', amount: 450, description: 'Highway toll charges' } }),
    prisma.expense.create({ data: { vehicleId: vehicles[3].id, type: 'REPAIR', amount: 45000, description: 'Engine overhaul' } }),
    prisma.expense.create({ data: { vehicleId: vehicles[0].id, type: 'MAINTENANCE', amount: 2500, description: 'Oil change and filter' } }),
    prisma.expense.create({ data: { vehicleId: vehicles[10].id, type: 'MAINTENANCE', amount: 32000, description: 'Tyre replacement' } }),
  ]);
  console.log('✅ Created 5 expenses');

  // ─── Settings ────────────────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: 'settings' },
    update: {},
    create: {
      id: 'settings',
      orgName: 'Vadhvan GOES Port',
      theme: 'light',
      language: 'en',
      notificationPrefs: JSON.stringify({
        emailAlerts: true,
        smsAlerts: false,
        criticalOnly: false,
        maintenanceReminders: true,
      }),
    },
  });
  console.log('✅ Created settings');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
