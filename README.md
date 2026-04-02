# water_management
Water management system in agriculture using DBMS
A web-based Database Management System (DBMS) project that helps farmers use water efficiently by tracking fields, crops, irrigation schedules, and water usage.

---

## 📌 Project Overview

Water scarcity is a major issue in agriculture. This system helps:
- Track farmers, their fields, and crops
- Manage and schedule irrigation
- Monitor water used vs water required
- Automatically detect overuse or shortage of water

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Connector | mysql2 (npm package) |

---

## 🗄️ Database Design

The system uses **6 related tables:**

- **farmers** — Stores farmer details (name, phone, village)
- **fields** — Stores field details linked to each farmer
- **crops** — Stores crop details linked to each field
- **irrigation_schedule** — Stores irrigation plans for each field
- **water_usage** — Logs actual water used vs required for each crop
- **rainwater_events** ⭐ — Logs rainwater collection events (NEW)

### Relationships
```
farmers → fields → crops
fields → irrigation_schedule
fields + crops → water_usage
fields → rainwater_events ⭐
```

---

## ✨ Features

- ✅ Add and view farmers, fields, and crops
- ✅ Schedule irrigation with method and duration
- ✅ Log daily water usage per crop
- ✅ Dashboard with live statistics
- ✅ Automatic alerts for water **Overuse** 🔴 and **Shortage** 🟡
- ✅ Color-coded status badges (Normal / Overuse / Shortage)
- ✅ **🌧️ Rainwater Harvesting Module** (NEW)
  - Log rainwater events with auto-calculation of collected liters
  - Track rainfall speed and duration
  - Calculate reserve statistics and days of supply
  - View rainwater collection trends and reserve projections
  - Dashboard integration with rainwater collection charts
- ✅ **📱 Messaging System** (NEW)
  - Send field alerts (Flood, Calamity, Drought, Emergency)
  - Email/SMS notifications via nodemailer
  - Message alert history log

---

## 🚀 How to Run This Project

### Prerequisites
- [Node.js](https://nodejs.org) installed
- [MySQL](https://www.mysql.com) installed and running
- VS Code (or any code editor)

### Steps

**1. Clone this repository**
```bash
git clone https://github.com/yourusername/water-management-system.git
cd water-management-system
```

**2. Install dependencies**
```bash
npm install
npm install nodemailer
```

**3. Set up the database**
- Open MySQL Workbench
- Run the SQL script provided in `database.sql`
- This will create the `water_mgmt` database and all tables
- ⭐ For rainwater harvesting: Run `rainwater_setup.sql` to create the rainwater_events table
  ```bash
  mysql -u root -p water_mgmt < rainwater_setup.sql
  ```

**4. Configure MySQL password**
- Open `server.js`
- Find this line and add your MySQL password:
```javascript
password: 'your_mysql_password',
```

**5. Start the server**
```bash
node server.js
```

**6. Open in browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
water-management-system/
├── server.js          ← Backend (Node.js + Express)
├── package.json       ← Project dependencies
├── .gitignore         ← Ignores node_modules
├── README.md          ← You are here!
└── public/
    └── index.html     ← Frontend (HTML + CSS + JS)
```

---

## 🌧️ Rainwater Harvesting Module

### Features
- **Log Rainwater Events** — Track rainfall speed (ml/min), duration (min), and auto-calculate collected liters
  - Formula: `collected_liters = (rain_speed_ml_per_min × duration_min) / 1000`
- **Reserve Statistics** — View:
  - Total collected rainwater (L)
  - Reserve percentage (out of 100L tank capacity)
  - Days of reserve supply based on average daily usage
  - Average rainfall intensity
  - Average daily water usage
- **Charts & Analytics**
  - Rainwater collection trend over time
  - Reserve projection for next 10 days
  - Dashboard integration showing total collected rainwater

### API Endpoints
```
GET  /api/rainwater              — Get all rainwater events
POST /api/rainwater              — Add new rainwater event
PUT  /api/rainwater/:id          — Update rainwater event
DELETE /api/rainwater/:id        — Delete rainwater event
GET  /api/rainwater/calculate/:field_id — Calculate reserve stats
```

### Calculations Logic
```javascript
collected = (rain_speed_ml_per_min * duration_min) / 1000;
percent_filled = Math.min(100, (total_collected / 100000) * 100);
avg_daily_usage = SUM(water_used_liters) / COUNT(distinct_days);
reserve_days = total_collected / avg_daily_usage;
```

---

## 📱 Messaging System

### Features
- **Send Field Alerts** — Choose alert type:
  - ⚠️ Flood Warning
  - 🌪️ Calamity Alert
  - 🏜️ Drought Alert
  - 🚨 Emergency
- **Notifications** — Via nodemailer (email/SMS gateway)
- **Message History** — View log of all alerts sent with timestamp and status

### API Endpoint
```
POST /api/message/:field_id — Send alert to farmer
```

### Email Configuration (Optional)
To enable email notifications, set environment variables:
```bash
export EMAIL_USER=your-email@gmail.com
export EMAIL_PASS=your-app-password
```

Or edit in `server.js`:
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});
```

---

## 📊 Dashboard Preview

The dashboard shows:
- Total farmers, fields, and crops registered
- Number of active water alerts
- **Total rainwater collected** ⭐
- **Number of rain events** ⭐
- Live alerts for overuse and shortage with field and crop details
- Rainwater collection chart

---

## 🧠 Key DBMS Concepts Used

- Primary Keys & Foreign Keys
- One-to-Many Relationships
- JOIN queries across multiple tables
- CASE statements for alert logic
- CRUD Operations (Create, Read, Update, Delete)
- Referential Integrity

---

## 👨‍💻 Developed By

**Prajwal Sachin Kolambekar**
DBMS Mini Project — DYP Pune
2026-27
