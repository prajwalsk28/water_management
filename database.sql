-- ================================================================
-- 💧 AGRICULTURAL WATER MANAGEMENT SYSTEM
-- Complete Database Setup Script
-- Author: Prajwal Sachin Kolambekar
-- College: DYP Pune
-- Year: 2026-27
-- ================================================================
-- HOW TO USE:
-- 1. Open MySQL Workbench
-- 2. Open a new SQL tab
-- 3. Paste this entire file
-- 4. Click ⚡ Execute
-- 5. All tables + sample data will be created automatically
-- ================================================================

-- ----------------------------------------------------------------
-- STEP 1: Create and select the database
-- ----------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS water_mgmt;
USE water_mgmt;

-- ----------------------------------------------------------------
-- STEP 2: Drop existing tables (clean reinstall)
-- Order matters — child tables first due to foreign keys
-- ----------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS water_usage;
DROP TABLE IF EXISTS irrigation_schedule;
DROP TABLE IF EXISTS crops;
DROP TABLE IF EXISTS fields;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS farmers;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------
-- TABLE 1: farmers
-- Stores basic farmer profile information
-- ----------------------------------------------------------------
CREATE TABLE farmers (
    farmer_id   INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(15),
    village     VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- TABLE 2: users
-- Login credentials for each farmer
-- Linked to farmers via farmer_id (FK)
-- ----------------------------------------------------------------
CREATE TABLE users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id   INT NOT NULL,
    username    VARCHAR(50) UNIQUE NOT NULL,
    password    VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------
-- TABLE 3: fields
-- Each field belongs to one farmer (One-to-Many)
-- ----------------------------------------------------------------
CREATE TABLE fields (
    field_id    INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id   INT NOT NULL,
    field_name  VARCHAR(100) NOT NULL,
    area_acres  DECIMAL(6,2),
    soil_type   VARCHAR(50),
    location    VARCHAR(100),
    reservoir_capacity_liters DECIMAL(10,2) DEFAULT 100000,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------
-- TABLE 4: crops
-- Each crop belongs to one field (One-to-Many)
-- ----------------------------------------------------------------
CREATE TABLE crops (
    crop_id                   INT AUTO_INCREMENT PRIMARY KEY,
    field_id                  INT NOT NULL,
    crop_name                 VARCHAR(100) NOT NULL,
    sowing_date               DATE,
    harvest_date              DATE,
    water_requirement_liters  DECIMAL(10,2),
    FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------
-- TABLE 5: irrigation_schedule
-- Irrigation plans for each field
-- ----------------------------------------------------------------
CREATE TABLE irrigation_schedule (
    schedule_id       INT AUTO_INCREMENT PRIMARY KEY,
    field_id          INT NOT NULL,
    scheduled_date    DATE,
    duration_minutes  INT,
    method            VARCHAR(50),
    status            VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------
-- TABLE 6: water_usage
-- Daily water usage logs — linked to both field and crop
-- ----------------------------------------------------------------
CREATE TABLE water_usage (
    usage_id               INT AUTO_INCREMENT PRIMARY KEY,
    field_id               INT NOT NULL,
    crop_id                INT NOT NULL,
    date_logged            DATE,
    water_used_liters      DECIMAL(10,2),
    water_required_liters  DECIMAL(10,2),
    FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id)  REFERENCES crops(crop_id)  ON DELETE CASCADE
);

-- ----------------------------------------------------------------
-- TABLE 7: notifications
-- Stores portal alerts and emergency notifications
-- ----------------------------------------------------------------
CREATE TABLE notifications (
    notification_id    INT AUTO_INCREMENT PRIMARY KEY,
    field_id           INT NOT NULL,
    farmer_id          INT NOT NULL,
    type               VARCHAR(50),
    title              VARCHAR(150),
    message            TEXT,
    severity           VARCHAR(20) DEFAULT 'info',
    is_read            TINYINT(1) DEFAULT 0,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE
);

-- ================================================================
-- SAMPLE DATA
-- ================================================================

-- ----------------------------------------------------------------
-- Sample Farmers
-- ----------------------------------------------------------------
INSERT INTO farmers (name, phone, village) VALUES
('Ramesh Kumar',   '9876543210', 'Nagpur'),
('Suresh Patil',   '9823456781', 'Pune'),
('Anita Deshmukh', '9812345678', 'Nashik'),
('Vijay Jadhav',   '9834567890', 'Aurangabad');

-- ----------------------------------------------------------------
-- Sample Login Accounts
-- farmer_id 1 = Ramesh Kumar (admin account)
-- ----------------------------------------------------------------
INSERT INTO users (farmer_id, username, password) VALUES
(1, 'admin',  'admin123'),
(1, 'ramesh', 'ramesh123'),
(2, 'suresh', 'suresh123'),
(3, 'anita',  'anita123'),
(4, 'vijay',  'vijay123');

-- ----------------------------------------------------------------
-- Sample Fields
-- ----------------------------------------------------------------
INSERT INTO fields (farmer_id, field_name, area_acres, soil_type, location) VALUES
(1, 'North Farm',       3.5, 'Black', 'Nagpur East Block'),
(1, 'South Farm',       2.0, 'Loamy', 'Nagpur West Block'),
(2, 'River Side Field', 4.0, 'Clay',  'Pune Rural Zone'),
(3, 'Hill Top Farm',    1.5, 'Sandy', 'Nashik Highland'),
(4, 'Valley Field',     5.0, 'Silt',  'Aurangabad Valley');

-- ----------------------------------------------------------------
-- Sample Crops
-- ----------------------------------------------------------------
INSERT INTO crops (field_id, crop_name, sowing_date, harvest_date, water_requirement_liters) VALUES
(1, 'Wheat',     '2026-01-01', '2026-04-01', 5000),
(2, 'Rice',      '2026-01-15', '2026-05-01', 8000),
(3, 'Sugarcane', '2026-02-01', '2026-12-01', 12000),
(4, 'Cotton',    '2026-02-15', '2026-08-01', 6000),
(5, 'Soybean',   '2026-03-01', '2026-07-01', 4000);

-- ----------------------------------------------------------------
-- Sample Irrigation Schedules
-- ----------------------------------------------------------------
INSERT INTO irrigation_schedule (field_id, scheduled_date, duration_minutes, method, status) VALUES
(1, '2026-03-25', 45, 'Drip',      'Done'),
(2, '2026-03-26', 60, 'Flood',     'Done'),
(3, '2026-03-27', 30, 'Sprinkler', 'Pending'),
(4, '2026-03-28', 40, 'Drip',      'Pending'),
(5, '2026-03-30', 50, 'Furrow',    'Skipped');

-- ----------------------------------------------------------------
-- Sample Water Usage Logs
-- Mix of Normal, Overuse and Shortage for demo purposes
-- ----------------------------------------------------------------
INSERT INTO water_usage (field_id, crop_id, date_logged, water_used_liters, water_required_liters) VALUES
(1, 1, '2026-03-25', 5200,  5000),   -- Overuse  (used > required)
(2, 2, '2026-03-26', 7500,  8000),   -- Normal   (within 80-100%)
(3, 3, '2026-03-27', 9000,  12000),  -- Shortage (used < 80% of required)
(4, 4, '2026-03-28', 6100,  6000),   -- Overuse
(5, 5, '2026-03-30', 3900,  4000),   -- Normal
(1, 1, '2026-03-29', 4200,  5000),   -- Shortage
(2, 2, '2026-03-29', 8500,  8000),   -- Overuse
(3, 3, '2026-03-28', 10000, 12000),  -- Shortage
(4, 4, '2026-03-27', 5900,  6000),   -- Normal
(5, 5, '2026-03-29', 4100,  4000);   -- Overuse

INSERT INTO notifications (field_id, farmer_id, type, title, message, severity) VALUES
(1, 1, 'rain', 'Rain recorded', 'North Farm collected 12.5L of rainwater.', 'info'),
(2, 2, 'flood', 'Flood warning', 'River Side Field experienced heavy rain; check nearby drains.', 'warning');

-- ================================================================
-- VERIFICATION QUERIES
-- Run these to confirm everything was created correctly
-- ================================================================

-- Check all tables exist
SHOW TABLES;

-- Check row counts in each table
SELECT 'farmers'              AS table_name, COUNT(*) AS total_rows FROM farmers
UNION ALL
SELECT 'users',                              COUNT(*) FROM users
UNION ALL
SELECT 'fields',                             COUNT(*) FROM fields
UNION ALL
SELECT 'crops',                              COUNT(*) FROM crops
UNION ALL
SELECT 'irrigation_schedule',                COUNT(*) FROM irrigation_schedule
UNION ALL
SELECT 'water_usage',                        COUNT(*) FROM water_usage
UNION ALL
SELECT 'notifications',                      COUNT(*) FROM notifications;

-- Show water usage with alert status (key query)
SELECT
    fa.name           AS farmer_name,
    f.field_name,
    c.crop_name,
    wu.date_logged,
    wu.water_used_liters,
    wu.water_required_liters,
    CASE
        WHEN wu.water_used_liters > wu.water_required_liters            THEN '🔴 Overuse'
        WHEN wu.water_used_liters < wu.water_required_liters * 0.8     THEN '🟡 Shortage'
        ELSE                                                                 '🟢 Normal'
    END AS alert_status
FROM water_usage wu
JOIN fields  f  ON wu.field_id  = f.field_id
JOIN crops   c  ON wu.crop_id   = c.crop_id
JOIN farmers fa ON f.farmer_id  = fa.farmer_id
ORDER BY wu.date_logged DESC;

-- Show per-farmer water summary
SELECT
    fa.name                                                                          AS farmer_name,
    COUNT(DISTINCT f.field_id)                                                       AS total_fields,
    COUNT(DISTINCT c.crop_id)                                                        AS total_crops,
    COALESCE(SUM(wu.water_used_liters), 0)                                           AS total_used_liters,
    COALESCE(SUM(wu.water_required_liters), 0)                                       AS total_required_liters,
    COALESCE(ROUND(SUM(wu.water_used_liters) /
             NULLIF(SUM(wu.water_required_liters), 0) * 100, 1), 0)                 AS usage_percent
FROM farmers fa
LEFT JOIN fields      f   ON fa.farmer_id = f.farmer_id
LEFT JOIN crops       c   ON f.field_id   = c.field_id
LEFT JOIN water_usage wu  ON f.field_id   = wu.field_id
GROUP BY fa.farmer_id, fa.name;

-- ================================================================
-- ✅ Setup complete! Your database is ready.
-- Open http://localhost:3000 and login with:
-- Username: admin
-- Password: admin123
-- ================================================================
