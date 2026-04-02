-- =====================================================
-- Sample Test Data for Rainwater Harvesting Module
-- =====================================================
-- Run this script to populate rainwater_events table with test data
-- Execute: mysql -u root -p water_mgmt < rainwater_test_data.sql

-- Clear existing data (optional)
-- TRUNCATE TABLE rainwater_events;

-- Insert sample rainwater events
INSERT INTO rainwater_events (field_id, date_event, rain_speed_ml_per_min, duration_min, collected_liters, notes)
VALUES 
(1, '2024-06-01', 45.5, 120, 5460, 'Light to moderate rain - morning shower'),
(1, '2024-06-05', 60.0, 90, 5400, 'Heavy downpour - 2 hour event'),
(2, '2024-06-03', 35.2, 150, 5280, 'Drizzle with moderate duration'),
(2, '2024-06-08', 55.3, 110, 6083, 'Good rainfall event - afternoon'),
(3, '2024-06-02', 40.0, 200, 8000, 'Extended moderate rain - all day'),
(1, '2024-06-10', 50.0, 140, 7000, 'Post-monsoon rainfall'),
(2, '2024-06-12', 65.5, 95, 6223, 'Strong rain - short duration'),
(3, '2024-06-15', 42.3, 180, 7614, 'Sustained rainfall - evening'),
(1, '2024-06-18', 38.0, 160, 6080, 'Gentle rain - night shower'),
(2, '2024-06-20', 70.0, 85, 5950, 'Heavy rain - brief burst'),
(3, '2024-06-22', 48.5, 125, 6063, 'Consistent rainfall - morning'),
(1, '2024-06-25', 55.0, 110, 6050, 'Good collection - afternoon event');

-- Verify data insertion
SELECT COUNT(*) as total_events FROM rainwater_events;
SELECT * FROM rainwater_events ORDER BY date_event DESC;

-- Summary statistics
SELECT 
    field_id,
    COUNT(*) as event_count,
    SUM(collected_liters) as total_collected,
    AVG(collected_liters) as avg_collected,
    AVG(rain_speed_ml_per_min) as avg_speed,
    MAX(collected_liters) as max_collected,
    MIN(collected_liters) as min_collected
FROM rainwater_events
GROUP BY field_id
ORDER BY field_id;
