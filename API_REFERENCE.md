# 🌧️ Rainwater Harvesting API Reference Card

## Quick API Reference

### Rainwater Events API

#### 📋 GET /api/rainwater
**Description:** Fetch all rainwater events with farmer & field details
```bash
curl http://localhost:3000/api/rainwater
```
**Response:** Array of rainwater events

---

#### ➕ POST /api/rainwater
**Description:** Add new rainwater event (auto-calculates collected liters)
```bash
curl -X POST http://localhost:3000/api/rainwater \
  -H "Content-Type: application/json" \
  -d '{
    "field_id": 1,
    "date_event": "2024-06-20",
    "rain_speed_ml_per_min": 45.5,
    "duration_min": 120,
    "notes": "Light rainfall"
  }'
```
**Response:**
```json
{
  "message": "Rainwater event logged!",
  "id": 1,
  "collected_liters": 5.46
}
```

---

#### ✏️ PUT /api/rainwater/:id
**Description:** Update rainwater event (recalculates collected liters)
```bash
curl -X PUT http://localhost:3000/api/rainwater/1 \
  -H "Content-Type: application/json" \
  -d '{
    "rain_speed_ml_per_min": 50,
    "duration_min": 110,
    "notes": "Updated weather info"
  }'
```
**Response:**
```json
{
  "message": "Rainwater event updated!",
  "collected_liters": 5.5
}
```

---

#### 🗑️ DELETE /api/rainwater/:id
**Description:** Delete rainwater event
```bash
curl -X DELETE http://localhost:3000/api/rainwater/1
```
**Response:**
```json
{
  "message": "Rainwater event deleted!"
}
```

---

### Analytics API

#### 📊 GET /api/rainwater/calculate/:field_id
**Description:** Calculate rainwater reserve statistics
```bash
curl "http://localhost:3000/api/rainwater/calculate/1?date_from=2024-06-01&date_to=2024-06-30"
```

**Query Parameters (Optional):**
- `date_from` — Start date (YYYY-MM-DD) [Default: 30 days ago]
- `date_to` — End date (YYYY-MM-DD) [Default: Today]

**Response:**
```json
{
  "collected": 5460,           // Total collected (L)
  "percent_filled": 5.46,      // % of 100L tank capacity
  "avg_rainfall": 52.3,        // Average rain speed (ml/min)
  "event_count": 3,            // Number of rain events
  "avg_daily_usage": 250,      // Average daily water use (L)
  "reserve_days": 21           // Days of supply remaining
}
```

---

### Messaging API

#### 📱 POST /api/message/:field_id
**Description:** Send field alert (Flood/Calamity/Drought/Emergency)
```bash
curl -X POST http://localhost:3000/api/message/1 \
  -H "Content-Type: application/json" \
  -d '{
    "message_type": "flood",
    "message": "Heavy rainfall expected. Please monitor field boundaries."
  }'
```

**Alert Types:**
- `flood` — ⚠️ Flood Warning
- `calamity` — 🌪️ Calamity Alert
- `drought` — 🏜️ Drought Alert
- `emergency` — 🚨 Emergency

**Response:**
```json
{
  "success": true,
  "message": "Alert sent",
  "logged": "[FLOOD] Field 1: Heavy rainfall... - Ramesh Kumar - 2024-06-20 10:30:00",
  "phone": "9876543***"
}
```

---

### Summary API (Enhanced)

#### 📈 GET /api/summary
**Description:** Get farmer summary WITH rainwater stats
```bash
curl http://localhost:3000/api/summary
```

**Response:**
```json
[
  {
    "farmer_id": 1,
    "farmer_name": "Ramesh Kumar",
    "village": "Nagpur",
    "total_fields": 2,
    "total_crops": 3,
    "total_water_used": 12000,
    "total_water_required": 15000,
    "total_rainwater_collected": 5460,  // NEW: Rainwater total
    "usage_percent": 80,
    "overuse_count": 0,
    "shortage_count": 1
  }
]
```

---

## Data Types & Validation

### Rainwater Event Object
```json
{
  "event_id": 1,                          // INT (Auto-increment)
  "field_id": 1,                          // INT (Required, FK)
  "date_event": "2024-06-20",             // DATE (Required, YYYY-MM-DD)
  "rain_speed_ml_per_min": 45.5,          // FLOAT (Required, > 0)
  "duration_min": 120,                    // INT (Required, > 0)
  "collected_liters": 5.46,               // FLOAT (Auto-calculated)
  "notes": "Light rainfall",              // TEXT (Optional)
  "created_at": "2024-06-20 10:30:00",   // TIMESTAMP (Auto-set)
  "field_name": "North Farm",             // FROM JOIN
  "farmer_name": "Ramesh"                 // FROM JOIN
}
```

---

## Calculation Formulas

### Collected Liters
```
collected_liters = (rain_speed_ml_per_min × duration_min) / 1000
Example: (45.5 × 120) / 1000 = 5.46 L
```

### Reserve Percentage
```
percent_filled = MIN(100, (total_collected / 100000) × 100)
Tank capacity assumed: 100,000 L (100L tank scaled)
Example: (5460 / 100000) × 100 = 5.46%
```

### Average Daily Usage
```
avg_daily_usage = SUM(water_used_liters) / COUNT(DISTINCT date_logged)
Time period: Last 30 days from water_usage logs
```

### Reserve Days
```
reserve_days = FLOOR(total_collected / avg_daily_usage)
If avg_daily_usage = 0: reserve_days = 0
Example: 5460 / 250 = 21.84 → 21 days
```

### Average Rainfall
```
avg_rainfall = AVG(rain_speed_ml_per_min) [for selected date range]
Example: (45 + 60 + 30) / 3 = 45 ml/min
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (missing/invalid data) |
| 404 | Not Found (field/record doesn't exist) |
| 500 | Server Error |

---

## Error Responses

### Example: Invalid Request
```bash
curl -X POST http://localhost:3000/api/rainwater \
  -H "Content-Type: application/json" \
  -d '{"field_id": 1}'  # Missing required fields
```
**Response:**
```json
{
  "error": "Error message from MySQL"
}
```

### Example: Field Not Found
```bash
curl http://localhost:3000/api/message/999
```
**Response:**
```json
{
  "error": "Field not found"
}
```

---

## Environment Variables (Optional for Email)

```bash
export EMAIL_USER=your-email@gmail.com
export EMAIL_PASS=your-app-specific-password
```

---

## Testing Commands

### 1. Create Event
```bash
curl -X POST http://localhost:3000/api/rainwater \
  -H "Content-Type: application/json" \
  -d '{"field_id":1,"date_event":"2024-06-20","rain_speed_ml_per_min":45.5,"duration_min":120,"notes":"Test"}'
```

### 2. Get All Events
```bash
curl http://localhost:3000/api/rainwater
```

### 3. Get Calculations
```bash
curl "http://localhost:3000/api/rainwater/calculate/1"
```

### 4. Send Message
```bash
curl -X POST http://localhost:3000/api/message/1 \
  -H "Content-Type: application/json" \
  -d '{"message_type":"flood","message":"Test flood alert"}'
```

### 5. Update Event
```bash
curl -X PUT http://localhost:3000/api/rainwater/1 \
  -H "Content-Type: application/json" \
  -d '{"rain_speed_ml_per_min":50,"duration_min":130,"notes":"Updated"}'
```

### 6. Delete Event
```bash
curl -X DELETE http://localhost:3000/api/rainwater/1
```

---

## Useful Query Examples

### Get Events for Specific Field
```bash
curl http://localhost:3000/api/rainwater | grep "field_id\"\"1"
```

### Get Events in Date Range (Frontend)
Use the UI filters or modify table query in server.js

### Check Event Count
```sql
SELECT COUNT(*) as event_count FROM rainwater_events;
```

### Total Rainfall for Field
```sql
SELECT SUM(collected_liters) as total_collected 
FROM rainwater_events 
WHERE field_id = 1;
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Field not found` | Ensure field_id exists in fields table |
| `Table doesn't exist` | Run `rainwater_setup.sql` or restart server |
| `500 Error` | Check server console logs for MySQL error |
| `Email not sending` | Set EMAIL_USER & EMAIL_PASS environment variables |

---

## Rate Limiting & Performance

- **No rate limiting** — All endpoints open
- **Indexed queries** — Fast for 10K+ records
- **Max JSON size** — 1MB (Express default)

---

**Last Updated:** 2024-06-20  
**API Version:** 1.0  
**Status:** ✅ Production Ready
