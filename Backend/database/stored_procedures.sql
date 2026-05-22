-- Stored procedures (PostgreSQL functions) for Police Database System

-- ===================== PEOPLE =====================

CREATE OR REPLACE FUNCTION sp_create_person(
    p_nrc_number VARCHAR(50),
    p_full_name VARCHAR(150),
    p_alias_name VARCHAR(100),
    p_date_of_birth DATE,
    p_gender gender_type,
    p_father_name VARCHAR(150),
    p_phone_number VARCHAR(20),
    p_current_address TEXT,
    p_photo_url VARCHAR(255)
) RETURNS INT AS $$
DECLARE v_id INT;
BEGIN
    INSERT INTO people (nrc_number, full_name, alias_name, date_of_birth, gender,
                        father_name, phone_number, current_address, photo_url)
    VALUES (p_nrc_number, p_full_name, p_alias_name, p_date_of_birth, p_gender,
            p_father_name, p_phone_number, p_current_address, p_photo_url)
    RETURNING person_id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_person(p_person_id INT)
RETURNS SETOF people AS $$
BEGIN
    RETURN QUERY SELECT * FROM people WHERE person_id = p_person_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_search_people(p_keyword VARCHAR(150))
RETURNS SETOF people AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM people
    WHERE full_name ILIKE '%' || p_keyword || '%'
       OR alias_name ILIKE '%' || p_keyword || '%'
       OR nrc_number ILIKE '%' || p_keyword || '%'
       OR COALESCE(father_name, '') ILIKE '%' || p_keyword || '%'
    ORDER BY full_name;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_update_person(
    p_person_id INT,
    p_nrc_number VARCHAR(50),
    p_full_name VARCHAR(150),
    p_alias_name VARCHAR(100),
    p_date_of_birth DATE,
    p_gender gender_type,
    p_father_name VARCHAR(150),
    p_phone_number VARCHAR(20),
    p_current_address TEXT,
    p_photo_url VARCHAR(255)
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE people SET
        nrc_number = p_nrc_number,
        full_name = p_full_name,
        alias_name = p_alias_name,
        date_of_birth = p_date_of_birth,
        gender = p_gender,
        father_name = p_father_name,
        phone_number = p_phone_number,
        current_address = p_current_address,
        photo_url = p_photo_url
    WHERE person_id = p_person_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_delete_person(p_person_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM people WHERE person_id = p_person_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ===================== INCIDENTS =====================

CREATE OR REPLACE FUNCTION sp_create_incident(
    p_case_number VARCHAR(50),
    p_title VARCHAR(150),
    p_description TEXT,
    p_incident_date TIMESTAMP,
    p_location TEXT,
    p_status incident_status DEFAULT 'Open'
) RETURNS INT AS $$
DECLARE v_id INT;
BEGIN
    INSERT INTO incidents (case_number, title, description, incident_date, location, status)
    VALUES (p_case_number, p_title, p_description, p_incident_date, p_location, p_status)
    RETURNING incident_id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_incident(p_incident_id INT)
RETURNS SETOF incidents AS $$
BEGIN
    RETURN QUERY SELECT * FROM incidents WHERE incident_id = p_incident_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_list_incidents(
    p_status incident_status DEFAULT NULL,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
) RETURNS SETOF incidents AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM incidents
    WHERE (p_status IS NULL OR status = p_status)
    ORDER BY incident_date DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_update_incident(
    p_incident_id INT,
    p_case_number VARCHAR(50),
    p_title VARCHAR(150),
    p_description TEXT,
    p_incident_date TIMESTAMP,
    p_location TEXT,
    p_status incident_status
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE incidents SET
        case_number = p_case_number,
        title = p_title,
        description = p_description,
        incident_date = p_incident_date,
        location = p_location,
        status = p_status
    WHERE incident_id = p_incident_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_delete_incident(p_incident_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM incidents WHERE incident_id = p_incident_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ===================== CRIMINAL RECORDS =====================

CREATE OR REPLACE FUNCTION sp_create_criminal_record(
    p_person_id INT,
    p_incident_id INT,
    p_role criminal_role,
    p_arrest_date DATE DEFAULT NULL,
    p_punishment TEXT DEFAULT NULL
) RETURNS INT AS $$
DECLARE v_id INT;
BEGIN
    INSERT INTO criminal_records (person_id, incident_id, role, arrest_date, punishment)
    VALUES (p_person_id, p_incident_id, p_role, p_arrest_date, p_punishment)
    RETURNING record_id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_criminal_record(p_record_id INT)
RETURNS TABLE (
    record_id INT,
    person_id INT,
    incident_id INT,
    role criminal_role,
    arrest_date DATE,
    punishment TEXT,
    person_name VARCHAR(150),
    nrc_number VARCHAR(50),
    case_number VARCHAR(50),
    incident_title VARCHAR(150)
) AS $$
BEGIN
    RETURN QUERY
    SELECT cr.record_id, cr.person_id, cr.incident_id, cr.role, cr.arrest_date, cr.punishment,
           p.full_name, p.nrc_number, i.case_number, i.title
    FROM criminal_records cr
    JOIN people p ON p.person_id = cr.person_id
    JOIN incidents i ON i.incident_id = cr.incident_id
    WHERE cr.record_id = p_record_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_list_criminal_records_by_incident(p_incident_id INT)
RETURNS TABLE (
    record_id INT,
    person_id INT,
    incident_id INT,
    role criminal_role,
    arrest_date DATE,
    punishment TEXT,
    person_name VARCHAR(150),
    nrc_number VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT cr.record_id, cr.person_id, cr.incident_id, cr.role, cr.arrest_date, cr.punishment,
           p.full_name, p.nrc_number
    FROM criminal_records cr
    JOIN people p ON p.person_id = cr.person_id
    WHERE cr.incident_id = p_incident_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_list_criminal_records_by_person(p_person_id INT)
RETURNS TABLE (
    record_id INT,
    person_id INT,
    incident_id INT,
    role criminal_role,
    arrest_date DATE,
    punishment TEXT,
    case_number VARCHAR(50),
    incident_title VARCHAR(150)
) AS $$
BEGIN
    RETURN QUERY
    SELECT cr.record_id, cr.person_id, cr.incident_id, cr.role, cr.arrest_date, cr.punishment,
           i.case_number, i.title
    FROM criminal_records cr
    JOIN incidents i ON i.incident_id = cr.incident_id
    WHERE cr.person_id = p_person_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_delete_criminal_record(p_record_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM criminal_records WHERE record_id = p_record_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ===================== VEHICLES =====================

CREATE OR REPLACE FUNCTION sp_create_vehicle(
    p_owner_id INT,
    p_license_plate VARCHAR(20),
    p_brand VARCHAR(50),
    p_model VARCHAR(50),
    p_color VARCHAR(30)
) RETURNS INT AS $$
DECLARE v_id INT;
BEGIN
    INSERT INTO vehicles (owner_id, license_plate, brand, model, color)
    VALUES (p_owner_id, p_license_plate, p_brand, p_model, p_color)
    RETURNING vehicle_id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_vehicle(p_vehicle_id INT)
RETURNS TABLE (
    vehicle_id INT,
    owner_id INT,
    license_plate VARCHAR(20),
    brand VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    owner_name VARCHAR(150)
) AS $$
BEGIN
    RETURN QUERY
    SELECT v.vehicle_id, v.owner_id, v.license_plate, v.brand, v.model, v.color, p.full_name
    FROM vehicles v
    LEFT JOIN people p ON p.person_id = v.owner_id
    WHERE v.vehicle_id = p_vehicle_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_search_vehicles_by_plate(p_plate VARCHAR(20))
RETURNS TABLE (
    vehicle_id INT,
    owner_id INT,
    license_plate VARCHAR(20),
    brand VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    owner_name VARCHAR(150)
) AS $$
BEGIN
    RETURN QUERY
    SELECT v.vehicle_id, v.owner_id, v.license_plate, v.brand, v.model, v.color, p.full_name
    FROM vehicles v
    LEFT JOIN people p ON p.person_id = v.owner_id
    WHERE v.license_plate ILIKE '%' || p_plate || '%';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_update_vehicle(
    p_vehicle_id INT,
    p_owner_id INT,
    p_license_plate VARCHAR(20),
    p_brand VARCHAR(50),
    p_model VARCHAR(50),
    p_color VARCHAR(30)
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE vehicles SET
        owner_id = p_owner_id,
        license_plate = p_license_plate,
        brand = p_brand,
        model = p_model,
        color = p_color
    WHERE vehicle_id = p_vehicle_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_delete_vehicle(p_vehicle_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM vehicles WHERE vehicle_id = p_vehicle_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ===================== USERS =====================

CREATE OR REPLACE FUNCTION sp_create_user(
    p_badge_number VARCHAR(50),
    p_username VARCHAR(50),
    p_password_hash VARCHAR(255),
    p_rank VARCHAR(50),
    p_role user_role DEFAULT 'Officer'
) RETURNS INT AS $$
DECLARE v_id INT;
BEGIN
    INSERT INTO users (badge_number, username, password_hash, rank, role)
    VALUES (p_badge_number, p_username, p_password_hash, p_rank, p_role)
    RETURNING user_id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_user_by_username(p_username VARCHAR(50))
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT * FROM users WHERE username = p_username;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_user_by_id(p_user_id INT)
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT user_id, badge_number, username, password_hash, rank, role
                 FROM users WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
