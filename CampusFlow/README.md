# 🎓 CampusFlow

CampusFlow is a comprehensive student and faculty management web application designed to streamline academic workflows, scheduling, tasks, and communication within an educational institution. 

With distinct portals for Students and Faculty members, CampusFlow brings everything you need into a single, centralized platform—combining beautiful, responsive UI with a secure and robust backend.

## ✨ Features

### 👨‍🎓 Student Portal
- **Personalized Dashboard:** Overview of current tasks, upcoming schedules, and recent notices.
- **Task Management:** Add, update, view, and delete personal academic tasks.
- **Schedule tracking:** Calendar-based schedule tracking for classes and events.
- **Timetable:** Interactive academic timetable viewer.
- **Notices & Announcements:** Stay updated with the latest faculty announcements.
- **Profile Management:** Manage account details and preferences.

### 👨‍🏫 Faculty Portal
- **Faculty Dashboard:** Snapshot of classes, active students, and recent notices.
- **Student Management:** View and manage student directories and profiles.
- **Notice Board Admin:** Create, edit, publish, and delete global or class-specific notices.
- **Event Scheduling:** Schedule institution-wide or class-wise academic events.
- **Timetable Management:** Organize and manage class timetables.

### 🔐 Security & Auth
- **Role-Based Access Control (RBAC):** Distinct route protections and authentication flows for Students and Faculty.
- **Secure Authentication:** JWT-based secure login and signup processes.
- **Password Recovery:** Secure password reset functionality via email.

## 📦 Libraries & Technologies Used

### Frontend (React/Vite)

**Installation Command:**
```bash
npm install @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/react @fullcalendar/timegrid @tailwindcss/vite axios jspdf jspdf-autotable lucide-react react react-dom react-router-dom
npm install -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals postcss tailwindcss vite
```

* **`react`** & **`react-dom`** (v19.2) - Core UI library.
* **`react-router-dom`** (v7.13) - Handling application routing and route protection.
* **`vite`** & **`@vitejs/plugin-react`** - Blazing fast frontend build tool.
* **`tailwindcss`** & **`@tailwindcss/vite`** (v4.2) - Utility-first styling framework.
* **`axios`** - Promise-based HTTP client for API requests.
* **`@fullcalendar/react`** (with `daygrid`, `timegrid`, `interaction`) - Interactive scheduling and calendar views.
* **`jspdf`** & **`jspdf-autotable`** - Client-side PDF generation for reports or tables.
* **`lucide-react`** - Clean and modern SVG icon pack.

### Backend (Node.js/Express)

**Installation Command:**
```bash
npm install bcrypt cors crypto dotenv express jsonwebtoken mongoose nodemailer pg
npm install -D nodemon
```

* **`express`** - Fast, unopinionated, minimalist web framework for Node.js.
* **`mongoose`** - Elegant MongoDB object modeling for Node.js.
* **`pg`** - Non-blocking PostgreSQL client for Node.js.
* **`jsonwebtoken`** - Implementation of JSON Web Tokens for authentication and session management.
* **`bcrypt`** - Library for securely hashing passwords.
* **`nodemailer`** - Easy-to-use module for sending emails (e.g., password recovery).
* **`cors`** - Middleware for enabling Cross-Origin Resource Sharing.
* **`dotenv`** - Loads environment variables from a `.env` file.
* **`crypto`** - Native Node.js module used for cryptographic functionalities.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine.
You will also need a running instance of MongoDB / PostgreSQL depending on your database configuration.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CampusFlow.git
cd CampusFlow
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backed
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backed` directory and add your environment variables (e.g., `PORT`, `MONGO_URI` / `DB_URI`, `JWT_SECRET`, email credentials).
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd fronted
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. Visit the App
Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite) to view the application!

## 📂 Project Structure

```
CampusFlow/
├── backed/                 # Express backend application
│   ├── server.js           # Server entry point
│   ├── package.json        
│   └── ...                 # Controllers, Models, Routes, Middleware
│
└── fronted/                # React Vite frontend application
    ├── src/
    │   ├── components/     # Reusable UI components (Sidebar, Layouts, etc.)
    │   ├── pages/          # Full page views (Student and Faculty portals)
    │   ├── App.jsx         # Main application routing and auth guards
    │   └── main.jsx        # React DOM entry point
    └── package.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/your-username/CampusFlow/issues) if you want to contribute.

## 📝 License

This project is [ISC](https://opensource.org/licenses/ISC) licensed.
