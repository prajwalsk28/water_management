const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});; // serves your HTML files

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // your MySQL username
    password: 'Prajwal@2846',         // your MySQL password (put it here)
    database: 'water_mgmt'
});

db.connect((err) => {
    if (err) { console.error('DB Error:', err); return; }
    console.log('✅ Connected to MySQL!');
});

// ==================== FARMERS ====================
app.get('/api/farmers', (req, res) => {
    db.query('SELECT * FROM farmers', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/api/farmers', (req, res) => {
    const { name, phone, village } = req.body;
    db.query('INSERT INTO farmers (name, phone, village) VALUES (?, ?, ?)',
        [name, phone, village], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Farmer added!', id: result.insertId });
        });
});

// ==================== FIELDS ====================
app.get('/api/fields', (req, res) => {
    db.query(`SELECT f.*, fa.name as farmer_name 
              FROM fields f JOIN farmers fa ON f.farmer_id = fa.farmer_id`, 
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

// ==================== WATER USAGE ====================
app.get('/api/water-usage', (req, res) => {
    db.query(`SELECT wu.*, f.field_name, c.crop_name,
              CASE WHEN wu.water_used_liters > wu.water_required_liters THEN 'Overuse'
                   WHEN wu.water_used_liters < wu.water_required_liters * 0.8 THEN 'Shortage'
                   ELSE 'Normal' END AS status
              FROM water_usage wu
              JOIN fields f ON wu.field_id = f.field_id
              JOIN crops c ON wu.crop_id = c.crop_id`,
    (err, results) => {
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

// ==================== IRRIGATION SCHEDULE ====================
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

// START SERVER
app.listen(3000, () => {
    console.log(' Server running at http://localhost:3000');
});