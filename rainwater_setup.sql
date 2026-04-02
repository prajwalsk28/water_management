-- =====================================================
-- Rainwater Harvesting Module - Database Setup
-- =====================================================
-- Run this script to set up the rainwater_events table
-- Execute: mysql -u root -p water_mgmt < rainwater_setup.sql

-- Create rainwater_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS rainwater_events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    field_id INT NOT NULL,
    date_event DATE NOT NULL,
    rain_speed_ml_per_min FLOAT NOT NULL,
    duration_min INT NOT NULL,
    collected_liters FLOAT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE,
    INDEX idx_field_date (field_id, date_event),
    INDEX idx_date (date_event)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data (Optional - remove if not needed)
-- INSERT INTO rainwater_events (field_id, date_event, rain_speed_ml_per_min, duration_min, collected_liters, notes)
-- VALUES 
-- (1, '2024-06-15', 45.5, 120, 5460, 'Light to moderate rain'),
-- (2, '2024-06-16', 60.0, 90, 5400, 'Heavy downpour'),
-- (1, '2024-06-20', 30.2, 150, 4530, 'Drizzle with moderate duration');

-- Verify table creation
SELECT 'Rainwater Events Table Ready!' as Status;
DESCRIBE rainwater_events;
