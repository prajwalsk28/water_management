const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Prajwal@2846',
    database: 'water_mgmt'
});

db.connect((err) => {
    if (err) { console.error('❌ Error:', err); process.exit(1); }
    
    db.query('SELECT * FROM rainwater_events ORDER BY date_event DESC', (err, results) => {
        if (err) {
            console.error('❌ Error:', err);
        } else {
            console.log(`\n✅ Found ${results.length} rainwater events in database:\n`);
            results.forEach((r, i) => {
                console.log(`${i+1}. Field ${r.field_id} - ${r.date_event} - ${r.collected_liters}L (${r.rain_speed_ml_per_min} ml/min × ${r.duration_min} min)`);
            });
            console.log('\n✨ Data exists! Restart the server to see it in the UI.\n');
        }
        db.end();
        process.exit(0);
    });
});
