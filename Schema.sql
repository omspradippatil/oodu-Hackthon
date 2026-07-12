-- ============================
-- PROJECT TABLE
-- ============================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    estimated_cost NUMERIC(15,2),
    description TEXT
);

-- ============================
-- PORT FACILITIES
-- ============================

CREATE TABLE port_facility (
    facility_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    facility_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    status VARCHAR(30),

    CONSTRAINT fk_project_facility
        FOREIGN KEY(project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
);

-- ============================
-- BUILDINGS
-- ============================

CREATE TABLE building (
    building_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    building_name VARCHAR(100) NOT NULL,
    purpose VARCHAR(150),
    status VARCHAR(30),

    CONSTRAINT fk_project_building
        FOREIGN KEY(project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
);

-- ============================
-- CARGO TYPES
-- ============================

CREATE TABLE cargo_type (
    cargo_id SERIAL PRIMARY KEY,
    cargo_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- ============================
-- BERTH
-- ============================

CREATE TABLE berth (
    berth_id SERIAL PRIMARY KEY,
    cargo_id INT NOT NULL,
    berth_name VARCHAR(100) NOT NULL,
    capacity NUMERIC(10,2),
    status VARCHAR(30),

    CONSTRAINT fk_cargo
        FOREIGN KEY(cargo_id)
        REFERENCES cargo_type(cargo_id)
        ON DELETE CASCADE
);

-- ============================
-- STORAGE FACILITY
-- ============================

CREATE TABLE storage_facility (
    storage_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    storage_type VARCHAR(100),
    capacity NUMERIC(10,2),

    CONSTRAINT fk_project_storage
        FOREIGN KEY(project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
);

-- ============================
-- TRANSPORT CONNECTIVITY
-- ============================

CREATE TABLE transport_connectivity (
    transport_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    transport_type VARCHAR(50),
    connectivity_status VARCHAR(30),

    CONSTRAINT fk_project_transport
        FOREIGN KEY(project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
);

-- ============================
-- MATERIAL HANDLING SYSTEM
-- ============================

CREATE TABLE material_handling_system (
    system_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    equipment_name VARCHAR(100),
    quantity INT,

    CONSTRAINT fk_project_material
        FOREIGN KEY(project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE
);