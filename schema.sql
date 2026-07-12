-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'OPERATIONS_MANAGER', 'FLEET_MANAGER', 'MAINTENANCE_SUPERVISOR', 'DRIVER') NOT NULL DEFAULT 'DRIVER',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicles` (
    `id` VARCHAR(191) NOT NULL,
    `registrationNo` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `type` ENUM('TRUCK', 'TRAILER', 'FORKLIFT', 'REACH_STACKER', 'CRANE_TRUCK') NOT NULL,
    `status` ENUM('AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED') NOT NULL DEFAULT 'AVAILABLE',
    `maxCapacity` DOUBLE NOT NULL,
    `odometer` DOUBLE NOT NULL DEFAULT 0,
    `fuelLevel` DOUBLE NOT NULL DEFAULT 100,
    `healthScore` INTEGER NOT NULL DEFAULT 100,
    `locationLat` DOUBLE NULL,
    `locationLng` DOUBLE NULL,
    `driverId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehicles_registrationNo_key`(`registrationNo`),
    UNIQUE INDEX `vehicles_driverId_key`(`driverId`),
    INDEX `vehicles_status_idx`(`status`),
    INDEX `vehicles_type_idx`(`type`),
    INDEX `vehicles_registrationNo_idx`(`registrationNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drivers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `licenseNo` VARCHAR(191) NOT NULL,
    `licenseCategory` VARCHAR(191) NOT NULL,
    `licenseExpiry` DATETIME(3) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `emergencyContact` VARCHAR(191) NULL,
    `safetyScore` INTEGER NOT NULL DEFAULT 100,
    `experienceYears` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED') NOT NULL DEFAULT 'AVAILABLE',
    `vehicleId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `drivers_licenseNo_key`(`licenseNo`),
    UNIQUE INDEX `drivers_vehicleId_key`(`vehicleId`),
    INDEX `drivers_status_idx`(`status`),
    INDEX `drivers_licenseNo_idx`(`licenseNo`),
    INDEX `drivers_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ships` (
    `id` VARCHAR(191) NOT NULL,
    `imoNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `arrivalTime` DATETIME(3) NOT NULL,
    `expectedDeparture` DATETIME(3) NULL,
    `dockId` VARCHAR(191) NULL,
    `containerCount` INTEGER NOT NULL DEFAULT 0,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    `cargoType` VARCHAR(191) NOT NULL,
    `shipLength` DOUBLE NULL,
    `shipWidth` DOUBLE NULL,
    `draft` DOUBLE NULL,
    `status` ENUM('WAITING', 'DOCKED', 'LOADING', 'UNLOADING', 'COMPLETED', 'DEPARTED') NOT NULL DEFAULT 'WAITING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ships_imoNumber_key`(`imoNumber`),
    INDEX `ships_status_idx`(`status`),
    INDEX `ships_imoNumber_idx`(`imoNumber`),
    INDEX `ships_priority_idx`(`priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `docks` (
    `id` VARCHAR(191) NOT NULL,
    `dockNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `assignedShipId` VARCHAR(191) NULL,
    `assignedCraneId` VARCHAR(191) NULL,
    `containerCount` INTEGER NOT NULL DEFAULT 0,
    `estimatedCompletion` DATETIME(3) NULL,
    `warehouseId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `docks_dockNumber_key`(`dockNumber`),
    UNIQUE INDEX `docks_assignedShipId_key`(`assignedShipId`),
    INDEX `docks_status_idx`(`status`),
    INDEX `docks_dockNumber_idx`(`dockNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouses` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `capacity` DOUBLE NOT NULL,
    `availableSpace` DOUBLE NOT NULL,
    `occupiedSpace` DOUBLE NOT NULL DEFAULT 0,
    `locationLat` DOUBLE NULL,
    `locationLng` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `warehouses_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rail_tracks` (
    `id` VARCHAR(191) NOT NULL,
    `trackNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `capacity` INTEGER NOT NULL,
    `destination` VARCHAR(191) NULL,
    `departureTime` DATETIME(3) NULL,
    `containerIds` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rail_tracks_trackNumber_key`(`trackNumber`),
    INDEX `rail_tracks_status_idx`(`status`),
    INDEX `rail_tracks_trackNumber_idx`(`trackNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `containers` (
    `id` VARCHAR(191) NOT NULL,
    `containerCode` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('WAITING', 'ALLOCATED', 'LOADING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED') NOT NULL,
    `sourceDockId` VARCHAR(191) NULL,
    `destWarehouseId` VARCHAR(191) NULL,
    `shipId` VARCHAR(191) NULL,
    `craneId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `containers_containerCode_key`(`containerCode`),
    INDEX `containers_status_idx`(`status`),
    INDEX `containers_priority_idx`(`priority`),
    INDEX `containers_containerCode_idx`(`containerCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `container_requests` (
    `id` VARCHAR(191) NOT NULL,
    `containerId` VARCHAR(191) NOT NULL,
    `requestedBy` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NULL,
    `driverId` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ASSIGNED', 'DISPATCHED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `container_requests_status_idx`(`status`),
    INDEX `container_requests_containerId_idx`(`containerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `equipmentNumber` VARCHAR(191) NOT NULL,
    `type` ENUM('CRANE', 'FORKLIFT', 'REACH_STACKER', 'TRAILER', 'MATERIAL_HANDLER') NOT NULL,
    `status` ENUM('AVAILABLE', 'BUSY', 'MAINTENANCE', 'OFFLINE') NOT NULL DEFAULT 'AVAILABLE',
    `healthScore` INTEGER NOT NULL DEFAULT 100,
    `maintenanceDue` DATETIME(3) NULL,
    `assignedDockId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `equipment_equipmentNumber_key`(`equipmentNumber`),
    INDEX `equipment_status_idx`(`status`),
    INDEX `equipment_type_idx`(`type`),
    INDEX `equipment_equipmentNumber_idx`(`equipmentNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trips` (
    `id` VARCHAR(191) NOT NULL,
    `tripNumber` VARCHAR(191) NOT NULL,
    `containerId` VARCHAR(191) NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `cargoWeight` DOUBLE NOT NULL,
    `plannedDistance` DOUBLE NULL,
    `estimatedTime` INTEGER NULL,
    `status` ENUM('DRAFT', 'APPROVED', 'DISPATCHED', 'LOADING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    `notes` VARCHAR(191) NULL,
    `dispatchedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `trips_tripNumber_key`(`tripNumber`),
    INDEX `trips_status_idx`(`status`),
    INDEX `trips_priority_idx`(`priority`),
    INDEX `trips_vehicleId_idx`(`vehicleId`),
    INDEX `trips_driverId_idx`(`driverId`),
    INDEX `trips_tripNumber_idx`(`tripNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_logs` (
    `id` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NULL,
    `equipmentId` VARCHAR(191) NULL,
    `type` ENUM('OIL_CHANGE', 'INSPECTION', 'TYRE_REPLACEMENT', 'BRAKE_SERVICE', 'ENGINE_SERVICE', 'REPAIR', 'SCHEDULED', 'EMERGENCY') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `technicianName` VARCHAR(191) NULL,
    `cost` DOUBLE NOT NULL DEFAULT 0,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'OPEN',
    `scheduledAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `maintenance_logs_status_idx`(`status`),
    INDEX `maintenance_logs_vehicleId_idx`(`vehicleId`),
    INDEX `maintenance_logs_equipmentId_idx`(`equipmentId`),
    INDEX `maintenance_logs_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fuel_logs` (
    `id` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NULL,
    `tripId` VARCHAR(191) NULL,
    `quantityLitres` DOUBLE NOT NULL,
    `costPerLitre` DOUBLE NOT NULL,
    `totalCost` DOUBLE NOT NULL,
    `mileage` DOUBLE NULL,
    `distanceCovered` DOUBLE NULL,
    `loggedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fuel_logs_vehicleId_idx`(`vehicleId`),
    INDEX `fuel_logs_driverId_idx`(`driverId`),
    INDEX `fuel_logs_loggedAt_idx`(`loggedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenses` (
    `id` VARCHAR(191) NOT NULL,
    `tripId` VARCHAR(191) NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `type` ENUM('MAINTENANCE', 'FUEL', 'TOLL', 'PARKING', 'INSURANCE', 'REPAIR', 'OTHER') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `expenses_vehicleId_idx`(`vehicleId`),
    INDEX `expenses_tripId_idx`(`tripId`),
    INDEX `expenses_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_idx`(`userId`),
    INDEX `notifications_read_idx`(`read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `activity_logs_userId_idx`(`userId`),
    INDEX `activity_logs_module_idx`(`module`),
    INDEX `activity_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `tableName` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `oldValues` JSON NULL,
    `newValues` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_tableName_idx`(`tableName`),
    INDEX `audit_logs_recordId_idx`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gps_logs` (
    `id` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `speed` DOUBLE NOT NULL DEFAULT 0,
    `isOffline` BOOLEAN NOT NULL DEFAULT false,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `gps_logs_vehicleId_idx`(`vehicleId`),
    INDEX `gps_logs_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'settings',
    `orgName` VARCHAR(191) NOT NULL DEFAULT 'Vadhvan Port',
    `theme` VARCHAR(191) NOT NULL DEFAULT 'light',
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `notificationPrefs` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docks` ADD CONSTRAINT `docks_assignedShipId_fkey` FOREIGN KEY (`assignedShipId`) REFERENCES `ships`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `docks` ADD CONSTRAINT `docks_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `containers` ADD CONSTRAINT `containers_sourceDockId_fkey` FOREIGN KEY (`sourceDockId`) REFERENCES `docks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `containers` ADD CONSTRAINT `containers_destWarehouseId_fkey` FOREIGN KEY (`destWarehouseId`) REFERENCES `warehouses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `containers` ADD CONSTRAINT `containers_shipId_fkey` FOREIGN KEY (`shipId`) REFERENCES `ships`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `container_requests` ADD CONSTRAINT `container_requests_containerId_fkey` FOREIGN KEY (`containerId`) REFERENCES `containers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_containerId_fkey` FOREIGN KEY (`containerId`) REFERENCES `containers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_logs` ADD CONSTRAINT `maintenance_logs_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_logs` ADD CONSTRAINT `maintenance_logs_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `equipment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fuel_logs` ADD CONSTRAINT `fuel_logs_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fuel_logs` ADD CONSTRAINT `fuel_logs_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fuel_logs` ADD CONSTRAINT `fuel_logs_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gps_logs` ADD CONSTRAINT `gps_logs_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

