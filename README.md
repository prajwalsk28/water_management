# 💧 Agricultural Water Management System

> A web-based Database Management System (DBMS) mini project that helps farmers track, manage, and optimise agricultural water usage efficiently.

---

## 📌 Project Overview

Water scarcity is one of the most pressing challenges in modern agriculture. Farmers often lack tools to monitor and manage water usage reliably. This system solves that by providing a centralised, database-backed web application that:

- Tracks farmers, their fields, and active crops
- Manages and schedules irrigation activities
- Logs actual water usage against crop requirements
- Automatically detects **overuse 🔴** and **shortage 🟡** situations
- Provides a real-time dashboard with statistics, charts, and alerts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| DB Connector | mysql2 (npm package) |
| Charts | Chart.js |

---

## ✨ Features

### 🔐 Authentication
- Secure login page with username and password
- Each farmer has their own login account stored in the database
- Session-based access — logout anytime

### 📊 Dashboard
- Live statistics: total farmers, fields, crops, and active alerts
- Bar chart — water used vs required per field
- Doughnut chart — alert distribution (Normal / Overuse / Shortage)
- Real-time water alert panel with field and crop details

### 👨‍🌾 Farmer Management
- Add farmers with name, phone, village
- Create login credentials while adding a farmer
- Edit farmer details
- Delete farmer records
- Search farmers by name or village

### 🌾 Field Management
- Add fields linked to specific farmers
- Record area (acres), soil type, location, and reservoir capacity
- Edit and delete fields
- Search and filter by soil type

### 🔔 Notifications and Alerts
- Auto-generate field alerts for heavy rain, reservoir fill, and manual emergency messages
- Farmer portal notification feed with read/unread status
- Send manual alerts from the portal to farmers

### 🌱 Crop Management
- Register crops with sowing and harvest dates
- Set total water requirement in liters
- Edit and delete crop records
- Search by crop or field name

### 🚿 Irrigation Scheduling
- Schedule irrigation with date, method (Drip / Sprinkler / Flood / Furrow), and duration
- Update irrigation status: Pending → Done / Skipped
- Delete schedules
- Search and filter by status

### 💦 Water Usage Logging
- Log daily water usage per field and crop
- Automatic alert detection using SQL CASE logic
- Date range filter (from date → to date)
- Search by field or crop name
- Delete individual logs

### 📈 Summary Tab
- Per-farmer total water usage summary
- Visual progress bar showing usage percentage
- Overuse and shortage count per farmer
- Bar chart comparing all farmers side by side
- Search farmers in summary table

---

## 🗄️ Database Design

The system uses **7 related tables** in the `water_mgmt` database:

| Table | Description |
|---|---|
| `farmers` | Stores farmer name, phone, and village |
| `fields` | Each field linked to a farmer via `farmer_id` (FK), including reservoir capacity |
| `crops` | Each crop linked to a field via `field_id` (FK) |
| `irrigation_schedule` | Irrigation plans linked to fields |
| `water_usage` | Daily water logs linked to both fields and crops |
| `users` | Login credentials linked to each farmer |
| `notifications` | Persistent alerts and portal notification history |

### Relationships
```
farmers ──< fields ──< crops
fields ──< irrigation_schedule
fields + crops ──< water_usage
farmers ──< users
```

### Key DBMS Concepts Used
- Primary Keys & Foreign Keys
- One-to-Many Relationships
- ON DELETE CASCADE for referential integrity
- JOIN queries across multiple tables
- CASE statements for alert detection logic
- Aggregate functions: COUNT, SUM, ROUND, NULLIF
- GROUP BY for per-farmer summaries
- CRUD Operations (Create, Read, Update, Delete)

---

## 🚀 How to Run This Project

### Prerequisites
- [Node.js](https://nodejs.org) (LTS version)
- [MySQL](https://www.mysql.com) installed and running
- VS Code or any code editor

### Steps

**1. Clone this repository**
```bash
git clone https://github.com/prajwalsk28/water_management.git
cd water_management
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up the database**
- Open MySQL Workbench
- Open the `database.sql` file from this repo
- Run it by clicking ⚡ Execute
- This will create all 6 tables and insert sample data automatically

**4. Add your MySQL password**
- Open `server.js`
- Find this line and replace with your MySQL password:
```javascript
password: 'your_mysql_password',
```

**5. Start the server**
```bash
node server.js
```

You should see:
```
✅ Connected to MySQL!
🚀 Server running at http://localhost:3000
```

**6. Open in browser**
```
http://localhost:3000
```

**7. Login with**
```
Username: admin
Password: admin123
```

---

## 📁 Project Structure

```
water_management/
├── server.js           ← Backend (Node.js + Express) — all API routes
├── package.json        ← Project dependencies
├── database.sql        ← Full database setup + sample data
├── .gitignore          ← Ignores node_modules
├── README.md           ← You are here!
└── public/
    └── index.html      ← Complete frontend (HTML + CSS + JS + Charts)
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/login | Farmer login |
| GET | /api/farmers | Get all farmers |
| POST | /api/farmers | Add farmer + create login |
| PUT | /api/farmers/:id | Update farmer |
| DELETE | /api/farmers/:id | Delete farmer |
| GET | /api/fields | Get all fields with farmer names |
| POST/PUT/DELETE | /api/fields/:id | Field CRUD |
| GET | /api/crops | Get all crops with field names |
| POST/PUT/DELETE | /api/crops/:id | Crop CRUD |
| GET | /api/irrigation | Get all schedules |
| POST/PUT/DELETE | /api/irrigation/:id | Irrigation CRUD |
| GET | /api/water-usage | Get logs with date filter & alert status |
| POST/DELETE | /api/water-usage/:id | Water usage CRUD |
| GET | /api/rainwater | Get rainwater collection events |
| POST | /api/rainwater | Log a new rainwater event and auto-generate alerts |
| GET | /api/rainwater/calculate/:field_id | Calculate reservoir saved water, avg rainfall, and reserve days |
| POST | /api/message/:field_id | Send a field-level alert message to the notification portal |
| GET | /api/notifications | Get portal notifications |
| PUT | /api/notifications/:id/read | Mark a notification as read |
| GET | /api/summary | Per-farmer water usage summary |
| GET | /api/chart-data | Data for dashboard charts |

---

## 🧪 Sample Login Accounts

| Username | Password | Farmer |
|---|---|---|
| admin | admin123 | Ramesh Kumar |
| ramesh | ramesh123 | Ramesh Kumar |
| suresh | suresh123 | Suresh Patil |
| anita | anita123 | Anita Deshmukh |
| vijay | vijay123 | Vijay Jadhav |

---

## 👨‍💻 Developed By

**Prajwal Sachin Kolambekar**
DBMS Mini Project — DYP Pune
2026–27
