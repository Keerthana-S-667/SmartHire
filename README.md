# SmartHire — Smart Job Portal with Resume Matching
### Full-Stack Job Portal & Recruitment SaaS Platform

SmartHire is a full-stack recruitment SaaS platform built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js) with **Tailwind CSS**. It provides an end-to-end recruitment lifecycle: role-based access control (Job Seeker, Employer, Administrator), job authoring and lifecycle management, advanced public search with multi-facet filtering, candidate profile management with skills inventory, secure resume upload and storage, job application workflows with duplicate prevention, candidate pipeline review with status transitions, and real-time platform administration metrics.

---

## 1. Project Overview & Architectural Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Database** | **MongoDB & Mongoose 8.x** | Document database with schema validation, indexes, and password hashing |
| **Backend API** | **Node.js & Express.js 4.x** | RESTful routing, JWT issuance, HTTP-only cookie management, and RBAC middleware |
| **Frontend UI** | **React.js 19 & Vite 8** | Single Page Application (SPA) with declarative components and reactive state |
| **Styling** | **Tailwind CSS 3.4** | Utility-first responsive design based on the "Infographic and Strategic Light" palette |
| **Navigation** | **React Router 7** | Client-side routing, protected routes, and role redirection |
| **Icons** | **Lucide React** | Clean SVG icon set for recruitment workflows and dashboards |

---

## 2. Design System: "Infographic and Strategic Light"

SmartHire uses a curated blue and light neutral palette to create a high-trust, premium recruitment SaaS feel:

* **Primary Blue Palette:**
  * `Blue 100` (`#E6F7FF`): Light surface highlights, subtle information boxes, hover fills
  * `Blue 200` (`#D6F1FF`): Secondary accent highlights and border tints
  * `Blue 300` (`#B0E1FF`): Decorative illustrations and supporting highlights
  * `Blue 400` (`#75BEFF`): Secondary iconography and subtle accents
  * `Blue 500` (`#2E90FA`): Primary call-to-action buttons, active indicators, and links
  * `Blue 600` (`#0E61BA`): Section headings, titles, and interactive emphasis
  * `Blue 700` (`#003E81`): Strong emphasis, dark navigation elements, and badges
  * `Blue 800` (`#002854`): Dark container surfaces and deep contrast borders
* **Neutrals:**
  * `Background`: `#F5F9FD` (Clean light-blue tinted canvas)
  * `Card Surface`: `#FFFFFF` (Crisp white elevation cards)
  * `Primary Text`: `#17324D` (High contrast accessible slate navy)
  * `Secondary Text`: `#64748B` (Subtle muted body text)
  * `Borders`: `#DCE7F2` (Soft border dividers)
* **Status Colors:**
  * `Success`: `#10B981` (Background: `#ECFDF5`, Border: `#A7F3D0`)
  * `Warning`: `#F59E0B` (Background: `#FFFBEB`, Border: `#FDE68A`)
  * `Error`: `#EF4444` (Background: `#FEF2F2`, Border: `#FECACA`)

---

## 3. Directory Structure

```
SmartHire/
├── .gitignore                      # Git ignore patterns for node_modules, .env, build outputs
├── README.md                       # Comprehensive setup, architecture, and testing guide
├── client/                         # Frontend React + Vite + Tailwind CSS Application
│   ├── .env.example                # Example client environment variables
│   ├── .env                        # Local client environment config (VITE_API_URL)
│   ├── index.html                  # HTML entry point with SEO metadata and Google Fonts
│   ├── package.json                # Frontend dependencies and build scripts
│   ├── postcss.config.js           # PostCSS Tailwind CSS processor config
│   ├── tailwind.config.js          # Tailwind theme configuration with SmartHire color tokens
│   ├── vite.config.js              # Vite bundler configuration
│   └── src/
│       ├── main.jsx                # React root mount entry point
│       ├── App.jsx                 # Application routes and AuthProvider provider
│       ├── index.css               # Tailwind directives and reusable component classes
│       ├── components/
│       │   ├── Navbar.jsx          # Responsive header with branding, anchor scroll, and auth controls
│       │   ├── Footer.jsx          # Platform overview, tech stack badges, and footer links
│       │   ├── ProtectedRoute.jsx  # Client-side RBAC guard enforcing session & allowed roles
│       │   └── DashboardLayout.jsx # Reusable shell for Job Seeker, Employer, and Admin portals
│       ├── context/
│       │   └── AuthContext.jsx     # Global authentication provider and session lifecycle
│       ├── pages/
│       │   ├── LandingPage.jsx     # Responsive public landing page with roadmap placeholders
│       │   ├── LoginPage.jsx       # Email & password login with demo helper buttons
│       │   ├── RegisterPage.jsx    # Public registration with role selection (Admin excluded)
│       │   ├── JobSeekerDashboard.jsx # Personalized applicant dashboard with Stage 2 placeholders
│       │   ├── EmployerDashboard.jsx  # Employer portal with active job placeholders
│       │   ├── AdminDashboard.jsx     # System overview, registered users table & platform health
│       │   ├── UnauthorizedPage.jsx   # 403 Forbidden handler explaining role restrictions
│       │   └── NotFoundPage.jsx       # 404 handler with return home navigation
│       └── services/
│           └── api.js              # Fetch client wrapper with credentials: 'include' for cookies
└── server/                         # Backend Express.js REST API + MongoDB Mongoose
    ├── .env.example                # Example backend environment variables
    ├── .env                        # Local backend environment config (PORT, URI, JWT)
    ├── package.json                # Backend dependencies (express, mongoose, bcrypt, jwt, cookie)
    ├── server.js                   # Express application entry point & listener
    ├── test-auth-suite.js          # Automated HTTP test suite for security and RBAC validation
    ├── config/
    │   └── db.js                   # Mongoose connection with diagnostic error logging
    ├── controllers/
    │   ├── authController.js       # Register, login, getMe, logout logic with HTTP-only cookies
    │   └── adminController.js      # Platform metrics and registered user audit query
    ├── middleware/
    │   ├── authMiddleware.js       # authenticateUser (JWT cookie) & authorizeRoles (RBAC)
    │   └── errorHandler.js       # Centralized error handler (Mongoose 11000, validation, JWT)
    ├── models/
    │   └── User.js                 # Mongoose schema, role enums, bcrypt hash helper, toJSON
    ├── routes/
    │   ├── authRoutes.js           # /api/auth endpoints (register, login, me, logout)
    │   └── adminRoutes.js          # /api/admin endpoints (stats, users) protected by RBAC
    └── scripts/
        └── createAdmin.js          # Secure CLI script to provision administrator account
```

---

## 4. Prerequisites

Before running the application, make sure you have:
1. **Node.js**: v18.0.0 or higher (Tested with v22.14.0).
2. **npm**: v9.0.0 or higher (Installed automatically with Node.js).
3. **MongoDB**:
   * **Option A (Local)**: [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`.
   * **Option B (Cloud / Atlas)**: A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/smarthire`).

---

## 5. Installation & Setup Instructions

Follow these step-by-step instructions to set up the project locally.

### Step 5.1: Clone and Open Repository
```bash
git clone https://github.com/Keerthana-S-667/SmartHire.git
cd SmartHire
```

### Step 5.2: Configure the Backend Server

1. Open a terminal in the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from `.env.example`:
   * **On Windows (PowerShell):**
     ```powershell
     Copy-Item .env.example .env
     ```
   * **On Linux / macOS:**
     ```bash
     cp .env.example .env
     ```
4. Verify or adjust the settings in `server/.env`:
   ```ini
   PORT=5000
   NODE_ENV=development
   # Local MongoDB default:
   MONGODB_URI=mongodb://127.0.0.1:27017/smarthire
   # Or MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/smarthire?retryWrites=true&w=majority
   JWT_SECRET=smarthire_super_secret_jwt_key_2026_academic_demo
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173

   ADMIN_NAME=System Administrator
   ADMIN_EMAIL=admin@smarthire.local
   ADMIN_PASSWORD=Admin@12345
   ```

### Step 5.3: Configure the Frontend Client

1. Open a separate terminal in the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from `.env.example`:
   * **On Windows (PowerShell):**
     ```powershell
     Copy-Item .env.example .env
     ```
   * **On Linux / macOS:**
     ```bash
     cp .env.example .env
     ```
4. Confirm `client/.env` contains:
   ```ini
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 6. Running the Application

### Starting MongoDB
* If using local MongoDB on Windows:
  ```powershell
  # Check if MongoDB service is started:
  net start MongoDB
  # Or run mongod directly:
  mongod --dbpath "C:\data\db"
  ```
* If MongoDB is not yet running, the backend server will start in degraded mode and display helpful diagnostic connection messages while remaining responsive at `http://localhost:5000/api/health`.

### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```
* Backend starts at `http://localhost:5000`
* Health check: `http://localhost:5000/api/health`

### Terminal 2: Start Frontend Client
```bash
cd client
npm run dev
```
* Vite will start the frontend development server at `http://localhost:5173`
* Open `http://localhost:5173` in your browser.

### Terminal 3 (Optional): Seed the Initial Administrator
Once MongoDB is connected, execute the secure admin seed script:
```bash
cd server
npm run seed:admin
```
* This script reads credentials securely from `server/.env` (`ADMIN_EMAIL` and `ADMIN_PASSWORD`) and creates the admin without exposing any public registration endpoint.

---

## 7. Authentication & Security Highlights

### 1. HTTP-Only Cookie JWT Authentication
* Session tokens are stored in an **HTTP-only cookie** (`token`) set by Express upon login or registration.
* Client-side JavaScript cannot access the cookie, providing robust protection against Cross-Site Scripting (XSS) attacks.
* The frontend uses `credentials: 'include'` on all fetch requests so the browser automatically sends the cookie.
* Logout clears the cookie using `res.clearCookie('token')`.

### 2. Role-Based Access Control (RBAC)
* Every user has an immutable role in MongoDB: `job_seeker`, `employer`, or `admin`.
* The server verifies the role using `authorizeRoles(...allowedRoles)` middleware on protected routes.
* Even if someone tampers with client-side code, backend requests are rejected with `403 Forbidden`.
* Frontend `ProtectedRoute` components prevent unauthorized viewing and redirect to `/unauthorized` or `/login`.

### 3. Password Hashing
* Plain-text passwords are never saved. Passwords are salted and hashed using **bcryptjs** (salt rounds = 10).
* The Mongoose User schema strips `passwordHash` and `__v` inside `toJSON()` so hashes are never returned in API payloads.

### 4. Admin Security Rule
* Public registration (`POST /api/auth/register`) explicitly rejects `role: 'admin'` with `403 Forbidden`.
* Admins can only be created through server CLI scripts (`npm run seed:admin`) with server access.

---

## 8. API Endpoints Reference

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Platform and MongoDB connection health check |
| `POST` | `/api/auth/register` | Register new account (`job_seeker` or `employer`) |
| `POST` | `/api/auth/login` | Authenticate credentials and receive HTTP-only cookie |
| `POST` | `/api/auth/logout` | Clear HTTP-only session cookie |

### Protected Endpoints (Requires Valid JWT Cookie)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/auth/me` | Any authenticated user | Returns active profile (omits password) |
| `GET` | `/api/admin/stats` | `admin` | Aggregated user metrics and system health |
| `GET` | `/api/admin/users` | `admin` | Audit directory of registered accounts |

---

## 9. Verification & Automated Tests

A dedicated test suite is included in `server/test-auth-suite.js` to verify all security, validation, and role restrictions:

```bash
cd server
node test-auth-suite.js
```

### Test Coverage:
1. `GET /api/health` returns stage status and database state.
2. `GET /api/auth/me` rejects unauthenticated requests with `401 Unauthorized`.
3. `GET /api/admin/stats` rejects unauthenticated access with `401 Unauthorized`.
4. `GET /api/admin/users` rejects unauthenticated access with `401 Unauthorized`.
5. `POST /api/auth/register` rejects public attempts to create `admin` role with `403 Forbidden`.
6. `POST /api/auth/register` rejects missing required fields with `400 Bad Request`.
7. `POST /api/auth/register` rejects mismatched passwords with `400 Bad Request`.
8. `POST /api/auth/register` enforces minimum 6-character passwords with `400 Bad Request`.
9. `POST /api/auth/login` rejects empty credentials with `400 Bad Request`.
10. `POST /api/auth/logout` clears session cookie with `200 OK`.

### Production Build Validation
The frontend build is validated with Vite and Tailwind CSS:
```bash
cd client
npm run build
```
Build output completes in ~3-4 seconds, creating an optimized `dist/` bundle with compiled Tailwind styles.

---

## 10. Student Review / Viva Discussion Points

If you need to explain this project during a project review or academic viva, here are the key concepts implemented:

1. **Why use HTTP-only cookies instead of localStorage for JWT?**
   * *Answer:* `localStorage` is accessible to any JavaScript running on the page, making tokens vulnerable to Cross-Site Scripting (XSS). An HTTP-only cookie is handled exclusively by the browser's network stack and cannot be read by JavaScript.
2. **How does Role-Based Access Control work?**
   * *Answer:* When a user logs in, the backend signs a JWT containing the user ID and database role. On protected routes, the `authMiddleware.js` verifies the token, queries the active user, and tests if `req.user.role` matches the route's allowed roles before running the controller.
3. **What is the difference between client-side route protection and server-side authorization?**
   * *Answer:* Client-side protection in `ProtectedRoute.jsx` enhances user experience by avoiding broken UI states and redirecting appropriately. Server-side middleware (`authenticateUser` and `authorizeRoles`) provides actual security by enforcing access control on all data operations regardless of what client sends the request.
4. **How are Stage 2 features prepared?**
   * *Answer:* Stage 1 defines the User model, database schemas, role dashboards, and layout contracts. Placeholders for resume parsing, AI scoring, and job applications are cleanly compartmentalized without any mock data or dead buttons, ready for clean extension in Stage 2.
