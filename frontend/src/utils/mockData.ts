import { Vehicle, Driver, Trip, Container, Ship, Dock, Equipment, MaintenanceLog } from '../types';

export const mockKPIs = {
  vehicles: { total: 36, available: 14, onTrip: 18, inShop: 4, retired: 0, fleetUtilization: 72 },
  drivers: { total: 42, onDuty: 35, available: 16, offDuty: 7, suspended: 0 },
  trips: { total: 148, active: 18, pending: 8, completed: 112, cancelled: 10 },
  containers: { total: 245, waiting: 45, inTransit: 82, delivered: 118 },
  maintenance: { open: 4, due: 6, totalCostThisMonth: 12500 },
  fuel: { costToday: 3200, consumptionToday: 1850 },
  docks: { total: 8, available: 3, occupied: 5 },
};

export const mockCharts = {
  fleetUtilization: [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 72 },
    { name: 'Wed', value: 80 },
    { name: 'Thu', value: 78 },
    { name: 'Fri', value: 85 },
    { name: 'Sat', value: 50 },
    { name: 'Sun', value: 45 },
  ],
  vehicleStatus: [
    { name: 'Available', value: 14, color: '#27AE60' },
    { name: 'On Trip', value: 18, color: '#2D5BFF' },
    { name: 'In Shop', value: 4, color: '#F5A623' },
  ],
  fuelConsumption: [
    { name: 'Mon', value: 320 },
    { name: 'Tue', value: 410 },
    { name: 'Wed', value: 450 },
    { name: 'Thu', value: 380 },
    { name: 'Fri', value: 520 },
    { name: 'Sat', value: 200 },
    { name: 'Sun', value: 150 },
  ],
  tripsPerDay: [
    { name: 'Mon', value: 15 },
    { name: 'Tue', value: 18 },
    { name: 'Wed', value: 22 },
    { name: 'Thu', value: 20 },
    { name: 'Fri', value: 25 },
    { name: 'Sat', value: 10 },
    { name: 'Sun', value: 8 },
  ],
  maintenanceCost: [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1800 },
    { name: 'Mar', value: 900 },
    { name: 'Apr', value: 2400 },
    { name: 'May', value: 1500 },
    { name: 'Jun', value: 3100 },
  ],
};

export const mockVehicles: Vehicle[] = [
  { id: '1', registrationNo: 'MH-04-GP-1024', name: 'Volvo FMX 460', model: '2024', type: 'TRUCK', status: 'AVAILABLE', maxCapacity: 40, odometer: 12450, fuelLevel: 85, healthScore: 92, createdAt: '', updatedAt: '' },
  { id: '2', registrationNo: 'MH-04-GP-5847', name: 'Scania R500', model: '2023', type: 'TRUCK', status: 'ON_TRIP', maxCapacity: 45, odometer: 42100, fuelLevel: 42, healthScore: 88, createdAt: '', updatedAt: '' },
  { id: '3', registrationNo: 'MH-04-GP-9654', name: 'MAN TGS 33.400', model: '2023', type: 'TRUCK', status: 'IN_SHOP', maxCapacity: 35, odometer: 58200, fuelLevel: 15, healthScore: 55, createdAt: '', updatedAt: '' },
  { id: '4', registrationNo: 'CR-01', name: 'Liebherr LHM 550', model: '2022', type: 'CRANE_TRUCK', status: 'AVAILABLE', maxCapacity: 120, odometer: 1500, fuelLevel: 90, healthScore: 95, createdAt: '', updatedAt: '' },
  { id: '5', registrationNo: 'RS-02', name: 'Konecranes SMV 4531', model: '2023', type: 'REACH_STACKER', status: 'ON_TRIP', maxCapacity: 45, odometer: 3200, fuelLevel: 65, healthScore: 82, createdAt: '', updatedAt: '' },
];

export const mockDrivers: Driver[] = [
  { id: '1', name: 'Pradip Patil', licenseNo: 'DL-MH04-2015034', licenseCategory: 'Heavy Commercial', licenseExpiry: '2030-05-15T00:00:00.000Z', phone: '+91 98765 43210', safetyScore: 95, experienceYears: 12, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Sanjay Shinde', licenseNo: 'DL-MH04-2018045', licenseCategory: 'Heavy Commercial', licenseExpiry: '2028-11-20T00:00:00.000Z', phone: '+91 98765 43211', safetyScore: 88, experienceYears: 8, status: 'ON_TRIP', createdAt: '', updatedAt: '' },
  { id: '3', name: 'Amit Mishra', licenseNo: 'DL-MH04-2020087', licenseCategory: 'Heavy Commercial', licenseExpiry: '2026-06-10T00:00:00.000Z', phone: '+91 98765 43212', safetyScore: 78, experienceYears: 5, status: 'AVAILABLE', createdAt: '', updatedAt: '' },
  { id: '4', name: 'Vijay Kadam', licenseNo: 'DL-MH04-2012012', licenseCategory: 'Special Equipment', licenseExpiry: '2026-08-01T00:00:00.000Z', phone: '+91 98765 43213', safetyScore: 92, experienceYears: 14, status: 'SUSPENDED', createdAt: '', updatedAt: '' },
];

export const mockTrips: Trip[] = [
  { id: '1', tripNumber: 'TRIP-00001', source: 'Berth 1', destination: 'Warehouse A', cargoWeight: 28, status: 'IN_TRANSIT', priority: 'HIGH', vehicleId: '2', driverId: '2', createdAt: '2026-07-12T08:00:00Z', updatedAt: '' },
  { id: '2', tripNumber: 'TRIP-00002', source: 'Berth 3', destination: 'Rail Yard S2', cargoWeight: 34, status: 'COMPLETED', priority: 'CRITICAL', vehicleId: '1', driverId: '1', createdAt: '2026-07-12T05:30:00Z', updatedAt: '', completedAt: '2026-07-12T06:45:00Z' },
  { id: '3', tripNumber: 'TRIP-00003', source: 'Berth 2', destination: 'Customs Yard', cargoWeight: 15, status: 'DRAFT', priority: 'MEDIUM', vehicleId: '4', driverId: '3', createdAt: '2026-07-12T09:15:00Z', updatedAt: '' },
];

export const mockContainers: Container[] = [
  { id: '1', containerCode: 'MSCU1048596', weight: 24.5, priority: 'HIGH', status: 'IN_TRANSIT', sourceDockId: '1', destWarehouseId: '1', shipId: '1', createdAt: '', updatedAt: '' },
  { id: '2', containerCode: 'MAEU9847291', weight: 32.1, priority: 'CRITICAL', status: 'ALLOCATED', sourceDockId: '2', destWarehouseId: '2', shipId: '2', createdAt: '', updatedAt: '' },
  { id: '3', containerCode: 'CMAU8472910', weight: 18.0, priority: 'LOW', status: 'WAITING', sourceDockId: '1', createdAt: '', updatedAt: '' },
];

export const mockShips: Ship[] = [
  { id: '1', imoNumber: 'IMO9847392', name: 'Vadhvan Express', arrivalTime: '2026-07-12T04:00:00Z', dockId: '1', containerCount: 1250, priority: 'CRITICAL', cargoType: 'Container', shipLength: 366, shipWidth: 48, draft: 15.2, status: 'DOCKED', createdAt: '', updatedAt: '' },
  { id: '2', imoNumber: 'IMO9658291', name: 'Maharashtra Star', arrivalTime: '2026-07-12T14:30:00Z', containerCount: 850, priority: 'HIGH', cargoType: 'Container', shipLength: 299, shipWidth: 40, draft: 13.8, status: 'WAITING', createdAt: '', updatedAt: '' },
];

export const mockDocks: Dock[] = [
  { id: '1', dockNumber: 'Dock 1', status: 'OCCUPIED', assignedShipId: '1', containerCount: 1250, createdAt: '', updatedAt: '' },
  { id: '2', dockNumber: 'Dock 2', status: 'AVAILABLE', containerCount: 0, createdAt: '', updatedAt: '' },
  { id: '3', dockNumber: 'Dock 3', status: 'MAINTENANCE', containerCount: 0, createdAt: '', updatedAt: '' },
];

export const mockEquipment: Equipment[] = [
  { id: '1', name: 'Quay Crane 01', equipmentNumber: 'QC-01', type: 'CRANE', status: 'BUSY', healthScore: 89, createdAt: '', updatedAt: '' },
  { id: '2', name: 'Forklift 14', equipmentNumber: 'FL-14', type: 'FORKLIFT', status: 'AVAILABLE', healthScore: 95, createdAt: '', updatedAt: '' },
  { id: '3', name: 'Reach Stacker 03', equipmentNumber: 'RS-03', type: 'REACH_STACKER', status: 'MAINTENANCE', healthScore: 42, createdAt: '', updatedAt: '' },
];

export const mockMaintenance: MaintenanceLog[] = [
  { id: '1', vehicleId: '3', type: 'ENGINE_SERVICE', description: 'Engine oil and filter change with belt replacement', cost: 1200, status: 'OPEN', scheduledAt: '2026-07-12T10:00:00Z', createdAt: '', updatedAt: '' },
  { id: '2', equipmentId: '3', type: 'REPAIR', description: 'Hydraulic cylinder leak repair', cost: 4500, status: 'IN_PROGRESS', scheduledAt: '2026-07-11T08:00:00Z', createdAt: '', updatedAt: '' },
];
