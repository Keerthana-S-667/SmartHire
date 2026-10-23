# SmartHire — Smart Job Portal with Resume Matching
### Enterprise MERN Stack Recruitment SaaS Platform

[![MongoDB](https://img.shields.io/badge/Database-MongoDB%208.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js%204.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React.js](https://img.shields.io/badge/Frontend-React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%2022-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

SmartHire is an enterprise recruitment platform designed and built strictly following the **MERN** architectural stack (**M**ongoDB, **E**xpress.js, **R**eact.js, **N**ode.js) with **Tailwind CSS**. It covers the complete talent acquisition lifecycle: multi-role access control (Job Seeker, Employer, Administrator), job creation and lifecycle management, multi-facet public job search and filtering, candidate profile authoring with interactive skill tags, secure resume document management, job application workflows with duplicate prevention, recruiter pipeline reviews with status progression, and real-time administrator platform governance.

---

## 1. MERN Stack Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               SMARTHIRE MERN STACK                                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [M] MONGODB           Document Database (Default Port 27017)                          │
│                        - 5 Mongoose Schemas (User, Job, Company, Application, Profile) │
│                        - One-click containerization with docker-compose.yml            │
│                        - Visual inspection via Mongo-Express Web GUI (Port 8081)       │
│                                                                                        │
│  [E] EXPRESS.JS        Backend RESTful API (Port 5000)                                 │
│                        - JWT Authentication via HTTP-only secure cookies               │
│                        - Role-Based Access Control (RBAC) middleware                   │
│                        - Modular route architecture & centralized error handling       │
│                                                                                        │
│  [R] REACT.JS          Frontend UI Application (Port 5173)                             │
│                        - React 19 + Vite 8 Single Page Application                     │
│                        - Tailwind CSS 3.4 'Infographic & Strategic Light' Design       │
│                        - 3 Role Dashboards (Job Seeker, Employer, Administrator)       │
│                                                                                        │
│  [N] NODE.JS           Server Runtime Engine                                           │
│                        - High-concurrency event-driven architecture                    │
│                        - Environment configuration with dotenv                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Primary Role in SmartHire |
|---|---|---|
| **[M] Database** | **MongoDB & Mongoose 8.x** | Document database with schema validation, indexes, and Bcrypt password hashing |
| **[E] Backend API** | **Node.js & Express.js 4.x** | RESTful routing, JWT cookie sessions, RBAC authorization, and file upload pipelines |
| **[R] Frontend UI** | **React.js 19 & Vite 8** | Reactive SPA with role-guarded routes, dynamic forms, and real-time dashboards |
| **[N] Runtime** | **Node.js 18+ / 22.x** | Cross-platform JavaScript runtime powering the server and build tooling |
| **Styling** | **Tailwind CSS 3.4** | Utility-first styling with curated high-contrast strategic light palette tokens |
| **Containers** | **Docker & Docker Compose** | Instant one-command provisioning of MongoDB server and Mongo Express GUI |

---

## 2. MongoDB Database Setup & One-Click Launch

SmartHire supports three seamless ways to run MongoDB:

### Option A: One-Click Docker Compose (Recommended)
Launch a pre-configured MongoDB server along with the Mongo Express Web GUI:
```bash
docker compose up -d
```
* **MongoDB Server:** Listening at `mongodb://127.0.0.1:27017/smarthire`
* **Mongo Express GUI:** Open `http://localhost:8081` in your browser to view and edit collections visually.

### Option B: Local MongoDB Community Server
If you have MongoDB Community Server installed locally on your system:
```powershell
# Windows PowerShell
net start MongoDB
# Or run mongod directly:
mongod --dbpath "C:\data\db"
```

### Option C: Cloud MongoDB Atlas
To use a managed cloud cluster, configure your connection string in `server/.env`:
```ini
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smarthire?retryWrites=true&w=majority
```

---

## 3. Design System: "Infographic and Strategic Light"

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

## 4. Complete Directory Structure

```
SmartHire/
├── docker-compose.yml              # One-click Docker launch for MongoDB & Mongo Express GUI
├── package.json                    # Workspace root scripts (dev:server, dev:client, start:all)
├── start-all.ps1                   # PowerShell full-stack launch automation
├── start-all.bat                   # Windows batch full-stack launcher
├── .gitignore                      # Git exclusion rules for node_modules, .env, and uploads
├── README.md                       # Comprehensive setup, MERN architecture, and API guide
├── client/                         # Frontend React 19 + Vite 8 + Tailwind CSS Application
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
│       │   ├── Navbar.jsx          # Responsive header with branding and auth controls
│       │   ├── Footer.jsx          # Platform overview and tech stack badges
│       │   ├── ProtectedRoute.jsx  # Client-side RBAC guard enforcing session & allowed roles
│       │   └── DashboardLayout.jsx # Reusable shell for Job Seeker, Employer, and Admin portals
│       ├── context/
│       │   └── AuthContext.jsx     # Global authentication provider and session lifecycle
│       ├── pages/
│       │   ├── LandingPage.jsx     # Public landing page with features and role CTAs
│       │   ├── LoginPage.jsx       # Email & password login with quick demo buttons
│       │   ├── RegisterPage.jsx    # Public registration with role selection (Admin excluded)
│       │   ├── JobsPage.jsx        # Public search directory with multi-facet filters
│       │   ├── JobDetailsPage.jsx  # Detailed job view and application workflow
│       │   ├── JobSeekerDashboard.jsx   # Candidate metrics, profile score, and applications
│       │   ├── JobSeekerProfilePage.jsx # Skills inventory, education, and resume upload
│       │   ├── JobSeekerApplicationsPage.jsx # Application status progression and withdrawal
│       │   ├── EmployerDashboard.jsx    # Hiring pipeline metrics and recent applicants
│       │   ├── EmployerProfilePage.jsx  # Company profile and organization settings
│       │   ├── EmployerJobsPage.jsx     # Job listings management and status toggles
│       │   ├── EmployerJobFormPage.jsx  # Create and edit job postings
│       │   ├── EmployerApplicantsPage.jsx # Candidate review, status transitions, and resumes
│       │   ├── AdminDashboard.jsx       # Platform metrics, user moderation, and system health
│       │   ├── UnauthorizedPage.jsx     # 403 Forbidden handler explaining role restrictions
│       │   └── NotFoundPage.jsx         # 404 handler with return home navigation
│       └── services/
│           └── api.js              # Centralized Fetch wrapper with credentials: 'include'
└── server/                         # Backend Express.js REST API + MongoDB Mongoose
    ├── .env.example                # Example backend environment variables
    ├── .env                        # Local backend environment config (PORT, URI, JWT)
    ├── package.json                # Backend dependencies (express, mongoose, bcrypt, jwt, multer)
    ├── server.js                   # Express application entry point & listener
    ├── test-auth-suite.js          # Automated HTTP test suite for security and RBAC validation
    ├── test-portal-suite.js        # Automated integration suite for job portal workflows
    ├── config/
    │   └── db.js                   # Mongoose connection with diagnostic error logging
    ├── controllers/
    │   ├── authController.js       # Register, login, getMe, logout logic with HTTP-only cookies
    │   ├── adminController.js      # Platform metrics, user moderation, and application audit
    │   ├── jobController.js        # Job search, multi-facet filtering, and CRUD operations
    │   ├── companyController.js    # Employer company profile management
    │   ├── profileController.js    # Job seeker profile, skill chips, and resume upload/download
    │   └── applicationController.js # Job applications, duplicate prevention, and status pipeline
    ├── middleware/
    │   ├── authMiddleware.js       # authenticateUser (JWT cookie) & authorizeRoles (RBAC)
    │   ├── uploadMiddleware.js     # Multer storage configuration for PDF/DOCX resumes
    │   └── errorHandler.js       # Centralized error handler (Mongoose 11000, validation, JWT)
    ├── models/
    │   ├── User.js                 # Mongoose User model with role enums and Bcrypt hashing
    │   ├── Job.js                  # Mongoose Job model with compensation, skills, and status
    │   ├── Company.js              # Mongoose Company model for employer organization profiles
    │   ├── Application.js          # Mongoose Application model with status history audit
    │   └── JobSeekerProfile.js     # Mongoose Candidate profile model with skills & resume
    ├── routes/
    │   ├── authRoutes.js           # /api/auth endpoints (register, login, me, logout)
    │   ├── adminRoutes.js          # /api/admin endpoints (stats, users, moderation)
    │   ├── jobRoutes.js            # /api/jobs endpoints (search, details, employer jobs)
    │   ├── companyRoutes.js        # /api/companies endpoints
    │   ├── profileRoutes.js        # /api/profiles endpoints (profile, resume upload/download)
    │   └── applicationRoutes.js    # /api/applications endpoints (apply, status, resume download)
    └── scripts/
        ├── createAdmin.js          # Secure CLI script to provision administrator account
        └── seedJobs.js             # Initial job opportunities seeding utility
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
