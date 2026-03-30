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

The system uses **5 related tables:**

- **farmers** — Stores farmer details (name, phone, village)
- **fields** — Stores field details linked to each farmer
- **crops** — Stores crop details linked to each field
- **irrigation_schedule** — Stores irrigation plans for each field
- **water_usage** — Logs actual water used vs required for each crop

### Relationships
```
farmers → fields → crops
fields → irrigation_schedule
fields + crops → water_usage
```

---

## ✨ Features

- ✅ Add and view farmers, fields, and crops
- ✅ Schedule irrigation with method and duration
- ✅ Log daily water usage per crop
- ✅ Dashboard with live statistics
- ✅ Automatic alerts for water **Overuse** 🔴 and **Shortage** 🟡
- ✅ Color-coded status badges (Normal / Overuse / Shortage)

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
```

**3. Set up the database**
- Open MySQL Workbench
- Run the SQL script provided in `database.sql`
- This will create the `water_mgmt` database and all tables

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

## 📊 Dashboard Preview

The dashboard shows:
- Total farmers, fields, and crops registered
- Number of active water alerts
- Live alerts for overuse and shortage with field and crop details

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
