const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Prajwal@2846',
    database: 'water_mgmt'
});

db.connect((err) => {
    if (err) { console.error('DB Error:', err); return; }
    console.log('✅ Connected to MySQL!');
    // Create rainwater_events table if not exists
    db.query(`CREATE TABLE IF NOT EXISTS rainwater_events (
        event_id INT PRIMARY KEY AUTO_INCREMENT,
        field_id INT NOT NULL,
        date_event DATE NOT NULL,
        rain_speed_ml_per_min FLOAT NOT NULL,
        duration_min INT NOT NULL,
        collected_liters FLOAT DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (field_id) REFERENCES fields(field_id) ON DELETE CASCADE
    )`, (err) => {
        if (err) console.error('Table creation error:', err);
        else console.log('✅ rainwater_events table ready!');
    });
});

// ==================== LOGIN ====================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT u.*, f.name as farmer_name FROM users u JOIN farmers f ON u.farmer_id = f.farmer_id WHERE u.username = ? AND u.password = ?',
        [username, password], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results.length === 0) return res.status(401).json({ message: 'Invalid username or password' });
            res.json({ success: true, user: results[0] });
        });
});

// ==================== FARMERS ====================
app.get('/api/farmers', (req, res) => {
    db.query('SELECT * FROM farmers', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});
app.post('/api/farmers', (req, res) => {
    const { name, phone, village, username, password } = req.body;
    db.query('INSERT INTO farmers (name, phone, village) VALUES (?, ?, ?)',
        [name, phone, village], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            const farmerId = result.insertId;
            if (username && password) {
                db.query('INSERT INTO users (farmer_id, username, password) VALUES (?, ?, ?)',
                    [farmerId, username, password], (err2) => {
                        if (err2) return res.status(500).json({ error: err2 });
                        res.json({ message: 'Farmer and login created!', id: farmerId });
                    });
            } else {
                res.json({ message: 'Farmer added!', id: farmerId });
            }
        });
});
app.put('/api/farmers/:id', (req, res) => {
    const { name, phone, village } = req.body;
    db.query('UPDATE farmers SET name=?, phone=?, village=? WHERE farmer_id=?',
        [name, phone, village, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Farmer updated!' });
        });
});
app.delete('/api/farmers/:id', (req, res) => {
    db.query('DELETE FROM farmers WHERE farmer_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Farmer deleted!' });
    });
});

// ==================== FIELDS ====================
app.get('/api/fields', (req, res) => {
    db.query(`SELECT f.*, fa.name as farmer_name FROM fields f JOIN farmers fa ON f.farmer_id = fa.farmer_id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
});
app.post('/api/fields', (req, res) => {
    const { farmer_id, field_name, area_acres, soil_type, location } = req.body;
    db.query('INSERT INTO fields (farmer_id, field_name, area_acres, soil_type, location) VALUES (?,?,?,?,?)',
        [farmer_id, field_name, area_acres, soil_type, location], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Field added!', id: result.insertId });
        });
});
app.put('/api/fields/:id', (req, res) => {
    const { field_name, area_acres, soil_type, location } = req.body;
    db.query('UPDATE fields SET field_name=?, area_acres=?, soil_type=?, location=? WHERE field_id=?',
        [field_name, area_acres, soil_type, location, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Field updated!' });
        });
});
app.delete('/api/fields/:id', (req, res) => {
    db.query('DELETE FROM fields WHERE field_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Field deleted!' });
    });
});

// ==================== CROPS ====================
app.get('/api/crops', (req, res) => {
    db.query(`SELECT c.*, f.field_name FROM crops c JOIN fields f ON c.field_id = f.field_id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
});
app.post('/api/crops', (req, res) => {
    const { field_id, crop_name, sowing_date, harvest_date, water_requirement_liters } = req.body;
    db.query('INSERT INTO crops (field_id, crop_name, sowing_date, harvest_date, water_requirement_liters) VALUES (?,?,?,?,?)',
        [field_id, crop_name, sowing_date, harvest_date, water_requirement_liters], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Crop added!', id: result.insertId });
        });
});
app.put('/api/crops/:id', (req, res) => {
    const { crop_name, sowing_date, harvest_date, water_requirement_liters } = req.body;
    db.query('UPDATE crops SET crop_name=?, sowing_date=?, harvest_date=?, water_requirement_liters=? WHERE crop_id=?',
        [crop_name, sowing_date, harvest_date, water_requirement_liters, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Crop updated!' });
        });
});
app.delete('/api/crops/:id', (req, res) => {
    db.query('DELETE FROM crops WHERE crop_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Crop deleted!' });
    });
});

// ==================== IRRIGATION ====================
app.get('/api/irrigation', (req, res) => {
    db.query(`SELECT i.*, f.field_name FROM irrigation_schedule i JOIN fields f ON i.field_id = f.field_id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
});
app.post('/api/irrigation', (req, res) => {
    const { field_id, scheduled_date, duration_minutes, method } = req.body;
    db.query('INSERT INTO irrigation_schedule (field_id, scheduled_date, duration_minutes, method) VALUES (?,?,?,?)',
        [field_id, scheduled_date, duration_minutes, method], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Schedule added!', id: result.insertId });
        });
});
app.put('/api/irrigation/:id', (req, res) => {
    const { status } = req.body;
    db.query('UPDATE irrigation_schedule SET status=? WHERE schedule_id=?',
        [status, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Status updated!' });
        });
});
app.delete('/api/irrigation/:id', (req, res) => {
    db.query('DELETE FROM irrigation_schedule WHERE schedule_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Schedule deleted!' });
    });
});

// ==================== WATER USAGE ====================
app.get('/api/water-usage', (req, res) => {
    let query = `SELECT wu.*, f.field_name, c.crop_name, fa.name as farmer_name,
                 CASE WHEN wu.water_used_liters > wu.water_required_liters THEN 'Overuse'
                      WHEN wu.water_used_liters < wu.water_required_liters * 0.8 THEN 'Shortage'
                      ELSE 'Normal' END AS status
                 FROM water_usage wu
                 JOIN fields f ON wu.field_id = f.field_id
                 JOIN crops c ON wu.crop_id = c.crop_id
                 JOIN farmers fa ON f.farmer_id = fa.farmer_id`;
    const conditions = [];
    const params = [];
    if (req.query.from) { conditions.push('wu.date_logged >= ?'); params.push(req.query.from); }
    if (req.query.to)   { conditions.push('wu.date_logged <= ?'); params.push(req.query.to); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY wu.date_logged DESC';
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});
app.post('/api/water-usage', (req, res) => {
    const { field_id, crop_id, date_logged, water_used_liters, water_required_liters } = req.body;
    db.query('INSERT INTO water_usage (field_id, crop_id, date_logged, water_used_liters, water_required_liters) VALUES (?,?,?,?,?)',
        [field_id, crop_id, date_logged, water_used_liters, water_required_liters], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Usage logged!', id: result.insertId });
        });
});
app.delete('/api/water-usage/:id', (req, res) => {
    db.query('DELETE FROM water_usage WHERE usage_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Log deleted!' });
    });
});

// ==================== RAINWATER EVENTS ====================
app.get('/api/rainwater', (req, res) => {
    db.query(`SELECT re.*, f.field_name, fa.name as farmer_name 
              FROM rainwater_events re
              JOIN fields f ON re.field_id = f.field_id
              JOIN farmers fa ON f.farmer_id = fa.farmer_id
              ORDER BY re.date_event DESC`, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/api/rainwater', (req, res) => {
    const { field_id, date_event, rain_speed_ml_per_min, duration_min, notes } = req.body;
    const collected_liters = (rain_speed_ml_per_min * duration_min) / 1000;
    db.query('INSERT INTO rainwater_events (field_id, date_event, rain_speed_ml_per_min, duration_min, collected_liters, notes) VALUES (?,?,?,?,?,?)',
        [field_id, date_event, rain_speed_ml_per_min, duration_min, collected_liters, notes], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Rainwater event logged!', id: result.insertId, collected_liters });
        });
});

app.put('/api/rainwater/:id', (req, res) => {
    const { rain_speed_ml_per_min, duration_min, notes } = req.body;
    const collected_liters = (rain_speed_ml_per_min * duration_min) / 1000;
    db.query('UPDATE rainwater_events SET rain_speed_ml_per_min=?, duration_min=?, collected_liters=?, notes=? WHERE event_id=?',
        [rain_speed_ml_per_min, duration_min, collected_liters, notes, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Rainwater event updated!', collected_liters });
        });
});

app.delete('/api/rainwater/:id', (req, res) => {
    db.query('DELETE FROM rainwater_events WHERE event_id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Rainwater event deleted!' });
    });
});

// ==================== RAINWATER CALCULATIONS ====================
app.get('/api/rainwater/calculate/:field_id', (req, res) => {
    const { field_id } = req.params;
    const { date_from, date_to } = req.query;
    const last30days = new Date();
    last30days.setDate(last30days.getDate() - 30);
    const dateFrom = date_from || last30days.toISOString().split('T')[0];
    const dateTo = date_to || new Date().toISOString().split('T')[0];

    // Get rainwater collection stats
    const rainQuery = `SELECT 
        COALESCE(SUM(collected_liters), 0) as total_collected,
        COALESCE(AVG(rain_speed_ml_per_min), 0) as avg_rainfall,
        COUNT(*) as event_count
        FROM rainwater_events 
        WHERE field_id = ? AND date_event BETWEEN ? AND ?`;

    // Get average daily water usage (last 30 days from crops for this field)
    const usageQuery = `SELECT 
        COALESCE(SUM(wu.water_used_liters) / COUNT(DISTINCT wu.date_logged), 0) as avg_daily_usage
        FROM water_usage wu
        WHERE wu.field_id = ? AND wu.date_logged >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;

    let calculateResult = {};
    db.query(rainQuery, [field_id, dateFrom, dateTo], (err, rainwater) => {
        if (err) return res.status(500).json({ error: err });
        calculateResult.collected = rainwater[0].total_collected;
        calculateResult.avg_rainfall = rainwater[0].avg_rainfall;
        calculateResult.event_count = rainwater[0].event_count;
        
        // Assume 100L tank capacity per calculation
        const tank_capacity = 100000;
        calculateResult.percent_filled = Math.min(100, (calculateResult.collected / tank_capacity) * 100);

        db.query(usageQuery, [field_id], (err, usage) => {
            if (err) return res.status(500).json({ error: err });
            calculateResult.avg_daily_usage = usage[0].avg_daily_usage || 0;
            calculateResult.reserve_days = calculateResult.avg_daily_usage > 0 
                ? Math.floor(calculateResult.collected / calculateResult.avg_daily_usage)
                : 0;
            res.json(calculateResult);
        });
    });
});

// ==================== MESSAGING (SMS/Email Alerts) ====================
// Note: For SMS, configure Twilio credentials; for email, configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

app.post('/api/message/:field_id', (req, res) => {
    const { field_id } = req.params;
    const { message_type, message } = req.body;
    
    // Get farmer phone and email for this field
    db.query(`SELECT f.phone, fa.name as farmer_name, fa.farmer_id 
              FROM fields f 
              JOIN farmers fa ON f.farmer_id = fa.farmer_id 
              WHERE f.field_id = ?`, [field_id], (err, results) => {
        if (err || !results.length) return res.status(400).json({ error: 'Field not found' });
        
        const { phone, farmer_name } = results[0];
        const timestamp = new Date().toLocaleString();
        const logMessage = `[${message_type.toUpperCase()}] Field ${field_id}: ${message} - ${farmer_name} - ${timestamp}`;
        
        // Log message to console (can be extended to database)
        console.log('📱 MESSAGE SENT:', logMessage);
        
        // Optional: Send email alert
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: `${phone}@sms.com`,  // SMS gateway (Twilio-like)
                subject: `🌾 Water Management Alert: ${message_type}`,
                text: `Dear ${farmer_name},\n\n${message}\n\nField ID: ${field_id}\nType: ${message_type}\nTime: ${timestamp}\n\nPlease take necessary action.`
            };
            transporter.sendMail(mailOptions, (error) => {
                if (error) console.error('Email error:', error);
                else console.log('✅ Email sent to farmer');
            });
        }
        
        // Return success response
        res.json({ 
            success: true, 
            message: 'Alert sent', 
            logged: logMessage,
            phone: phone ? `${phone.slice(0, -4)}****` : 'N/A'
        });
    });
});

app.get('/api/summary', (req, res) => {
    db.query(`SELECT fa.farmer_id, fa.name AS farmer_name, fa.village,
              COUNT(DISTINCT f.field_id) AS total_fields,
              COUNT(DISTINCT c.crop_id) AS total_crops,
              COALESCE(SUM(wu.water_used_liters), 0) AS total_water_used,
              COALESCE(SUM(wu.water_required_liters), 0) AS total_water_required,
              COALESCE(ROUND(SUM(wu.water_used_liters) / NULLIF(SUM(wu.water_required_liters),0) * 100, 1), 0) AS usage_percent,
              COALESCE(SUM(re.collected_liters), 0) AS total_rainwater_collected,
              SUM(CASE WHEN wu.water_used_liters > wu.water_required_liters THEN 1 ELSE 0 END) AS overuse_count,
              SUM(CASE WHEN wu.water_used_liters < wu.water_required_liters * 0.8 THEN 1 ELSE 0 END) AS shortage_count
              FROM farmers fa
              LEFT JOIN fields f ON fa.farmer_id = f.farmer_id
              LEFT JOIN crops c ON f.field_id = c.field_id
              LEFT JOIN water_usage wu ON f.field_id = wu.field_id
              LEFT JOIN rainwater_events re ON f.field_id = re.field_id
              GROUP BY fa.farmer_id, fa.name, fa.village`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    });


app.get('/api/chart-data', (req, res) => {
    db.query(`SELECT f.field_name,
              SUM(wu.water_used_liters) as used,
              SUM(wu.water_required_liters) as required
              FROM water_usage wu
              JOIN fields f ON wu.field_id = f.field_id
              GROUP BY f.field_id, f.field_name`, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));