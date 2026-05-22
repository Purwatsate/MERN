-- Police Database System - Myanmar Context
-- PostgreSQL schema (no ORM)

CREATE DATABASE police_db;
\c police_db;

-- ENUM types
CREATE TYPE gender_type AS ENUM ('M', 'F', 'Other');
CREATE TYPE incident_status AS ENUM ('Open', 'Under Investigation', 'Closed');
CREATE TYPE criminal_role AS ENUM ('Suspect', 'Convict', 'Victim', 'Witness');
CREATE TYPE user_role AS ENUM ('Admin', 'Officer');

-- 1. people
CREATE TABLE people (
    person_id       SERIAL PRIMARY KEY,
    nrc_number      VARCHAR(50) UNIQUE,
    full_name       VARCHAR(150) NOT NULL,
    alias_name      VARCHAR(100),
    date_of_birth   DATE,
    gender          gender_type NOT NULL,
    father_name     VARCHAR(150),
    phone_number    VARCHAR(20),
    current_address TEXT,
    photo_url       VARCHAR(255)
);

CREATE INDEX idx_people_nrc ON people (nrc_number);
CREATE INDEX idx_people_full_name ON people (full_name);

-- 2. incidents
CREATE TABLE incidents (
    incident_id     SERIAL PRIMARY KEY,
    case_number     VARCHAR(50) UNIQUE NOT NULL,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    incident_date   TIMESTAMP NOT NULL,
    location        TEXT NOT NULL,
    status          incident_status NOT NULL DEFAULT 'Open'
);

CREATE INDEX idx_incidents_case_number ON incidents (case_number);
CREATE INDEX idx_incidents_status ON incidents (status);

-- 3. criminal_records
CREATE TABLE criminal_records (
    record_id       SERIAL PRIMARY KEY,
    person_id       INT NOT NULL REFERENCES people(person_id) ON DELETE CASCADE,
    incident_id     INT NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    role            criminal_role NOT NULL,
    arrest_date     DATE,
    punishment      TEXT,
    UNIQUE (person_id, incident_id, role)
);

CREATE INDEX idx_criminal_records_person ON criminal_records (person_id);
CREATE INDEX idx_criminal_records_incident ON criminal_records (incident_id);

-- 4. vehicles
CREATE TABLE vehicles (
    vehicle_id      SERIAL PRIMARY KEY,
    owner_id        INT REFERENCES people(person_id) ON DELETE SET NULL,
    license_plate   VARCHAR(20) UNIQUE,
    brand           VARCHAR(50),
    model           VARCHAR(50),
    color           VARCHAR(30)
);

CREATE INDEX idx_vehicles_owner ON vehicles (owner_id);
CREATE INDEX idx_vehicles_plate ON vehicles (license_plate);

-- 5. users (police officers)
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    badge_number    VARCHAR(50) UNIQUE NOT NULL,
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    rank            VARCHAR(50),
    role            user_role NOT NULL DEFAULT 'Officer'
);
