-- -----------------------------------------------------------------------------
-- Vadhvan Port - Mock Demo Data Seed Script (MySQL)
-- Run this AFTER importing schema.sql to populate initial database states.
-- -----------------------------------------------------------------------------

-- Disable foreign key checks to make seeding order-independent
SET FOREIGN_KEY_CHECKS = 0;

-- Clean existing data
TRUNCATE TABLE `audit_logs`;
TRUNCATE TABLE `activity_logs`;
TRUNCATE TABLE `notifications`;
TRUNCATE TABLE `expenses`;
TRUNCATE TABLE `fuel_logs`;
TRUNCATE TABLE `maintenance_logs`;
TRUNCATE TABLE `trips`;
TRUNCATE TABLE `container_requests`;
TRUNCATE TABLE `containers`;
TRUNCATE TABLE `rail_tracks`;
TRUNCATE TABLE `docks`;
TRUNCATE TABLE `ships`;
TRUNCATE TABLE `warehouses`;
TRUNCATE TABLE `drivers`;
TRUNCATE TABLE `vehicles`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `equipment`;
TRUNCATE TABLE `settings`;

-- 1. Seed Users (with pre-hashed passwords)
-- password for om@gmail.com: 'om123'
-- password for admin@vadhvanport.com: 'Admin@123'
-- password for ops@vadhvanport.com: 'Ops@123'
-- password for fleet@vadhvanport.com: 'Fleet@123'
-- password for maintenance@vadhvanport.com: 'Maint@123'
-- password for driver1@vadhvanport.com: 'Driver@123'
INSERT INTO `users` (`id`, `email`, `passwordHash`, `name`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('usr-001', 'om@gmail.com', '$2a$12$mqj2S.oMVqfSkikJ0LDSTudV0ZI3AVInuCUlebtoJaZkdDh3zUmbi', 'Om Patil', 'ADMIN', 'ACTIVE', NOW(), NOW()),
('usr-002', 'admin@vadhvanport.com', '$2a$12$J9AAJCbA.2HJkXq1tySKDeAz5IaLd7K2nVISYn6xhB82gzRNO.nwm', 'Admin User', 'ADMIN', 'ACTIVE', NOW(), NOW()),
('usr-003', 'ops@vadhvanport.com', '$2a$12$0.rXfuX7F/X2dep0/NiU/OnvmuD0kPfjU6yagvgAyzN5UB67Nbwc6', 'Operations Manager', 'OPERATIONS_MANAGER', 'ACTIVE', NOW(), NOW()),
('usr-004', 'fleet@vadhvanport.com', '$2a$12$YseBfrw1pwWvzExQ9kdW5ew1GizUvjoQdtXFnQguuAhUrqvVuDpaq', 'Fleet Manager', 'FLEET_MANAGER', 'ACTIVE', NOW(), NOW()),
('usr-005', 'maintenance@vadhvanport.com', '$2a$12$zFZ0e34ClZBk6G3jjjhLYuBU.ZUaxooGik6VzBSKo/46G2u6/.lHq', 'Maintenance Supervisor', 'MAINTENANCE_SUPERVISOR', 'ACTIVE', NOW(), NOW()),
('usr-006', 'driver1@vadhvanport.com', '$2a$12$NiE5A78GIjXS6BuyfJsWx.p2z7pSSmGqGqkp415DwxEhEquuh/5cu', 'Rajesh Kumar', 'DRIVER', 'ACTIVE', NOW(), NOW());

-- 2. Seed Warehouses
INSERT INTO `warehouses` (`id`, `name`, `capacity`, `availableSpace`, `occupiedSpace`, `locationLat`, `locationLng`, `createdAt`, `updatedAt`) VALUES
('wh-001', 'Warehouse Alpha', 50000.0, 35000.0, 15000.0, 21.1702, 72.8311, NOW(), NOW()),
('wh-002', 'Warehouse Beta', 80000.0, 60000.0, 20000.0, 21.1750, 72.8340, NOW(), NOW()),
('wh-003', 'Warehouse Gamma', 30000.0, 10000.0, 20000.0, 21.1680, 72.8290, NOW(), NOW());

-- 3. Seed Docks
INSERT INTO `docks` (`id`, `dockNumber`, `status`, `assignedShipId`, `assignedCraneId`, `containerCount`, `estimatedCompletion`, `warehouseId`, `createdAt`, `updatedAt`) VALUES
('dock-001', 'DOCK-01', 'AVAILABLE', NULL, NULL, 0, NULL, 'wh-001', NOW(), NOW()),
('dock-002', 'DOCK-02', 'OCCUPIED', NULL, NULL, 45, NULL, 'wh-001', NOW(), NOW()),
('dock-003', 'DOCK-03', 'AVAILABLE', NULL, NULL, 0, NULL, 'wh-002', NOW(), NOW()),
('dock-004', 'DOCK-04', 'MAINTENANCE', NULL, NULL, 0, NULL, 'wh-002', NOW(), NOW()),
('dock-005', 'DOCK-05', 'AVAILABLE', NULL, NULL, 12, NULL, 'wh-003', NOW(), NOW()),
('dock-006', 'DOCK-06', 'OCCUPIED', NULL, NULL, 78, NULL, 'wh-003', NOW(), NOW());

-- 4. Seed Ships
INSERT INTO `ships` (`id`, `imoNumber`, `name`, `arrivalTime`, `expectedDeparture`, `dockId`, `containerCount`, `priority`, `cargoType`, `shipLength`, `shipWidth`, `draft`, `status`, `createdAt`, `updatedAt`) VALUES
('ship-001', 'IMO9234567', 'MV Bharati Samudra', '2026-07-10 08:00:00', '2026-07-14 18:00:00', 'dock-002', 450, 'HIGH', 'General Cargo', 200.0, 32.0, 11.5, 'DOCKED', NOW(), NOW()),
('ship-002', 'IMO9345678', 'MV Sagar Nidhi', '2026-07-12 14:00:00', '2026-07-16 10:00:00', NULL, 320, 'MEDIUM', 'Bulk Cargo', 180.0, 28.0, 9.5, 'WAITING', NOW(), NOW()),
('ship-003', 'IMO9456789', 'MV Jal Vahini', '2026-07-13 22:30:00', NULL, NULL, 620, 'CRITICAL', 'Containers', 250.0, 40.0, 13.0, 'WAITING', NOW(), NOW());

-- Update Dock ship reference
UPDATE `docks` SET `assignedShipId` = 'ship-001' WHERE `id` = 'dock-002';

-- 5. Seed Containers
INSERT INTO `containers` (`id`, `containerCode`, `weight`, `priority`, `status`, `sourceDockId`, `destWarehouseId`, `shipId`, `craneId`, `createdAt`, `updatedAt`) VALUES
('cont-001', 'VPCU1002934', 24.5, 'MEDIUM', 'ALLOCATED', 'dock-002', 'wh-001', 'ship-001', NULL, NOW(), NOW()),
('cont-002', 'VPCU9982736', 18.2, 'LOW', 'WAITING', 'dock-002', 'wh-001', 'ship-001', NULL, NOW(), NOW()),
('cont-003', 'VPCU4453912', 31.0, 'HIGH', 'IN_TRANSIT', 'dock-005', 'wh-003', 'ship-001', NULL, NOW(), NOW()),
('cont-004', 'VPCU8826471', 22.8, 'CRITICAL', 'DELIVERED', 'dock-006', 'wh-002', 'ship-001', NULL, NOW(), NOW()),
('cont-005', 'VPCU3321908', 28.5, 'MEDIUM', 'WAITING', 'dock-006', 'wh-002', NULL, NULL, NOW(), NOW());

-- 6. Seed Drivers
INSERT INTO `drivers` (`id`, `name`, `photoUrl`, `licenseNo`, `licenseCategory`, `licenseExpiry`, `phone`, `emergencyContact`, `safetyScore`, `experienceYears`, `status`, `vehicleId`, `userId`, `createdAt`, `updatedAt`) VALUES
('dr-001', 'Rajesh Kumar', NULL, 'DL-MH042026001', 'Heavy Transport', '2029-05-15 00:00:00', '+919876543210', '+919876543211', 94, 8, 'AVAILABLE', NULL, 'usr-006', NOW(), NOW()),
('dr-002', 'Amit Singh', NULL, 'DL-MH042026002', 'Heavy Transport', '2028-11-20 00:00:00', '+919876543220', NULL, 88, 5, 'AVAILABLE', NULL, NULL, NOW(), NOW()),
('dr-003', 'Vikram Rathore', NULL, 'DL-MH042026003', 'Heavy Transport', '2030-01-10 00:00:00', '+919876543230', NULL, 96, 12, 'ON_TRIP', NULL, NULL, NOW(), NOW()),
('dr-004', 'Suresh Patel', NULL, 'DL-GJ012026004', 'Heavy Transport', '2025-12-05 00:00:00', '+919876543240', NULL, 72, 3, 'OFF_DUTY', NULL, NULL, NOW(), NOW());

-- 7. Seed Vehicles
INSERT INTO `vehicles` (`id`, `registrationNo`, `name`, `model`, `type`, `status`, `maxCapacity`, `odometer`, `fuelLevel`, `healthScore`, `locationLat`, `locationLng`, `driverId`, `createdAt`, `updatedAt`) VALUES
('veh-001', 'MH-04-GP-1024', 'Terminal Truck 01', 'Tata Prima 4025.S', 'TRUCK', 'AVAILABLE', 40.0, 12450.5, 85.0, 92, 21.1702, 72.8311, 'dr-001', NOW(), NOW()),
('veh-002', 'MH-04-GP-2048', 'Terminal Truck 02', 'Tata Prima 4025.S', 'TRUCK', 'AVAILABLE', 40.0, 8900.2, 50.0, 98, 21.1750, 72.8340, 'dr-002', NOW(), NOW()),
('veh-003', 'MH-04-GP-3072', 'Heavy Hauler 03', 'BharatBenz 4028T', 'TRAILER', 'ON_TRIP', 55.0, 24500.8, 32.0, 84, 21.1680, 72.8290, 'dr-003', NOW(), NOW()),
('veh-004', 'MH-43-AK-4452', 'Container Loader 04', 'Volvo FM400', 'CRANE_TRUCK', 'IN_SHOP', 50.0, 31200.0, 10.0, 64, NULL, NULL, NULL, NOW(), NOW());

-- Associate vehicle drivers
UPDATE `drivers` SET `vehicleId` = 'veh-001' WHERE `id` = 'dr-001';
UPDATE `drivers` SET `vehicleId` = 'veh-002' WHERE `id` = 'dr-002';
UPDATE `drivers` SET `vehicleId` = 'veh-003' WHERE `id` = 'dr-003';

UPDATE `vehicles` SET `driverId` = 'dr-001' WHERE `id` = 'veh-001';
UPDATE `vehicles` SET `driverId` = 'dr-002' WHERE `id` = 'veh-002';
UPDATE `vehicles` SET `driverId` = 'dr-003' WHERE `id` = 'veh-003';

-- 8. Seed Equipment
INSERT INTO `equipment` (`id`, `name`, `equipmentNumber`, `type`, `status`, `healthScore`, `maintenanceDue`, `assignedDockId`, `operatorId`, `createdAt`, `updatedAt`) VALUES
('eq-001', 'Berth Crane Alpha', 'CRN-B01', 'CRANE', 'AVAILABLE', 89, '2026-08-15 00:00:00', 'dock-002', NULL, NOW(), NOW()),
('eq-002', 'Berth Crane Beta', 'CRN-B02', 'CRANE', 'BUSY', 94, '2026-09-01 00:00:00', 'dock-006', NULL, NOW(), NOW()),
('eq-003', 'Yard Reach Stacker 01', 'RST-Y01', 'REACH_STACKER', 'AVAILABLE', 78, '2026-07-25 00:00:00', NULL, NULL, NOW(), NOW()),
('eq-004', 'Forklift Heavy 01', 'FLT-H01', 'FORKLIFT', 'MAINTENANCE', 55, '2026-07-11 00:00:00', NULL, NULL, NOW(), NOW());

-- 9. Seed Rail Tracks
INSERT INTO `rail_tracks` (`id`, `trackNumber`, `status`, `capacity`, `destination`, `departureTime`, `containerIds`, `createdAt`, `updatedAt`) VALUES
('track-001', 'RT-01', 'AVAILABLE', 20, 'Ahmedabad Junction', NULL, '[]', NOW(), NOW()),
('track-002', 'RT-02', 'OCCUPIED', 30, 'Surat Railway Station', '2026-07-13 06:00:00', '[\"cont-003\", \"cont-005\"]', NOW(), NOW()),
('track-003', 'RT-03', 'MAINTENANCE', 25, 'Mumbai CSMT', NULL, '[]', NOW(), NOW());

-- 10. Seed Trips
INSERT INTO `trips` (`id`, `tripNumber`, `containerId`, `vehicleId`, `driverId`, `source`, `destination`, `cargoWeight`, `plannedDistance`, `estimatedTime`, `status`, `priority`, `notes`, `dispatchedAt`, `completedAt`, `cancelledAt`, `createdAt`, `updatedAt`) VALUES
('trip-001', 'TRIP-2026-001', 'cont-001', 'veh-001', 'dr-001', 'DOCK-02', 'Warehouse Alpha', 24.5, 4.2, 15, 'APPROVED', 'MEDIUM', 'Direct transit from ship MV Bharati Samudra to WH-A', NULL, NULL, NULL, NOW(), NOW()),
('trip-002', 'TRIP-2026-002', 'cont-003', 'veh-003', 'dr-003', 'DOCK-05', 'Warehouse Gamma', 31.0, 3.8, 12, 'IN_TRANSIT', 'HIGH', NULL, '2026-07-12 11:30:00', NULL, NULL, NOW(), NOW()),
('trip-003', 'TRIP-2026-003', 'cont-004', 'veh-002', 'dr-002', 'DOCK-06', 'Warehouse Beta', 22.8, 5.0, 18, 'COMPLETED', 'CRITICAL', 'Emergency priority clearance', '2026-07-12 09:15:00', '2026-07-12 09:40:00', NULL, NOW(), NOW());

-- 11. Seed Settings
INSERT INTO `settings` (`id`, `orgName`, `theme`, `language`, `notificationPrefs`, `updatedAt`) VALUES
('settings', 'Vadhvan Port Authority', 'light', 'en', '{\"email\": true, \"sms\": false, \"browser\": true}', NOW());

-- Enable foreign key checks back
SET FOREIGN_KEY_CHECKS = 1;
