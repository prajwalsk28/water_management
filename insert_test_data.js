const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Prajwal@2846',
    database: 'water_mgmt'
});

db.connect((err) => {
    if (err) { 
        console.error('❌ DB Connection Error:', err); 
        process.exit(1);
    }
    console.log('✅ Connected to MySQL!');
    
    // Create table if it doesn't exist
    const createTableSQL = `CREATE TABLE IF NOT EXISTS rainwater_events (
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
    )`;
    
    db.query(createTableSQL, (err) => {
        if (err) {
            console.error('❌ Error creating table:', err);
            db.end();
            process.exit(1);
        }
        console.log('✅ rainwater_events table ready!');
        insertData();
    });
    
    function insertData() {
    const testData = [
        [1, '2024-06-01', 45.5, 120, 5460, 'Light to moderate rain - morning shower'],
        [1, '2024-06-05', 60.0, 90, 5400, 'Heavy downpour - 2 hour event'],
        [2, '2024-06-03', 35.2, 150, 5280, 'Drizzle with moderate duration'],
        [2, '2024-06-08', 55.3, 110, 6083, 'Good rainfall event - afternoon'],
        [3, '2024-06-02', 40.0, 200, 8000, 'Extended moderate rain - all day'],
        [1, '2024-06-10', 50.0, 140, 7000, 'Post-monsoon rainfall'],
        [2, '2024-06-12', 65.5, 95, 6223, 'Strong rain - short duration'],
        [3, '2024-06-15', 42.3, 180, 7614, 'Sustained rainfall - evening'],
        [1, '2024-06-18', 38.0, 160, 6080, 'Gentle rain - night shower'],
        [2, '2024-06-20', 70.0, 85, 5950, 'Heavy rain - brief burst'],
        [3, '2024-06-22', 48.5, 125, 6063, 'Consistent rainfall - morning'],
        [1, '2024-06-25', 55.0, 110, 6050, 'Good collection - afternoon event']
    ];
    
    console.log('\n🌧️ Inserting test rainwater data...\n');
    
    let inserted = 0;
    testData.forEach((data, index) => {
        db.query(
            'INSERT INTO rainwater_events (field_id, date_event, rain_speed_ml_per_min, duration_min, collected_liters, notes) VALUES (?, ?, ?, ?, ?, ?)',
            data,
            (err, result) => {
                if (err) {
                    console.error(`❌ Error inserting row ${index + 1}:`, err.message);
                } else {
                    inserted++;
                    console.log(`✅ Inserted event ${index + 1}/12: Field ${data[0]}, ${data[1]} - ${data[5]}`);
                }
                
                // Close connection after all inserts
                if (index === testData.length - 1) {
                    setTimeout(() => {
                        db.query('SELECT COUNT(*) as total FROM rainwater_events', (err, results) => {
                            if (!err) {
                                console.log(`\n📊 Total events in database: ${results[0].total}`);
                                console.log(`\n✨ Test data insertion complete!`);
                                console.log('🚀 Restart server: node server.js');
                                console.log('🌐 Open: http://localhost:3000');
                                console.log('📱 Go to 🌧️ Rain Harvesting tab to see data\n');
                            }
                            db.end();
                            process.exit(0);
                        });
                    }, 500);
                }
            }
        );
    });
    }
});
