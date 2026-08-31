# College Online Voting System (MERN Stack)

A secure, responsive, and feature-rich digital voting platform built with **MongoDB, Express.js, React.js, and Node.js (MERN Stack)**. Designed specifically for college campus elections, candidate manifestos, role-based student and admin portals, double-vote prevention, and real-time electoral result tallying.

---

## 🌟 Key Features

### 👨‍🎓 Student Portal
- **Registration & Login**: Secure account creation with roll number, department, academic year, and password encryption via `bcryptjs`.
- **Active Elections Dashboard**: View all ongoing, upcoming, and past elections.
- **Candidate Profiles & Manifestos**: Read candidate position details, agenda, and manifesto promises.
- **Single-Vote Security**: Double-voting prevention enforced at both API level and database level (compound index).
- **Vote Confirmation Receipt**: Instant digital receipt with timestamp after submitting a vote.
- **Concluded Results View**: Access certified results with voter turnout percentages and elected winners.

### 🛡️ Admin Control Center
- **Admin Dashboard**: System statistics card grid (Total Students, Total Candidates, Active Elections, Total Votes Cast, Turnout Percentage).
- **Student Management (CRUD)**: Create, view, update, and delete student voter records with search and filter capabilities.
- **Candidate Management (CRUD)**: Register candidates for specific elections with manifesto details and images.
- **Election Management (CRUD)**: Create new elections, configure start/end timestamps, and manually toggle election states (`upcoming`, `active`, `ended`).
- **Live Audit Log**: Real-time log of recent voting activities.

---

## 📁 Directory & Project Structure

```
college-voting-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Student & Admin Login, Me
│   │   ├── studentController.js  # Full CRUD for Students
│   │   ├── candidateController.js# Full CRUD for Candidates
│   │   ├── electionController.js # Full CRUD for Elections
│   │   └── voteController.js     # Vote Casting, Double-vote checks & Results
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer Token validation
│   │   └── adminMiddleware.js    # Admin role checking
│   ├── models/
│   │   ├── Student.js            # Student Mongoose Schema
│   │   ├── Candidate.js          # Candidate Mongoose Schema
│   │   ├── Election.js           # Election Mongoose Schema
│   │   └── Vote.js               # Vote Schema (with compound index)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── studentRoutes.js      # /api/students routes
│   │   ├── candidateRoutes.js    # /api/candidates routes
│   │   ├── electionRoutes.js     # /api/elections routes
│   │   └── voteRoutes.js         # /api/votes routes
│   ├── .env                      # Environment configuration
│   ├── package.json
│   ├── seed.js                   # Seed script for initial admin & test data
│   └── server.js                 # Main Express server entry
└── frontend/
    ├── src/
    │   ├── components/           # Reusable UI components (Navbar, Sidebar, StatCard, Modals)
    │   ├── context/              # AuthContext & state management
    │   ├── pages/                # Landing, Login, Dashboards, Voting, Results, CRUD pages
    │   ├── services/             # Axios API client modules
    │   ├── App.jsx               # React Router & Role-based routes
    │   ├── index.css             # Bootstrap & custom styling
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js            # Vite bundler & API proxy
```

---

## ⚙️ Installation & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas Connection String.

### 2. Backend Setup
Navigate to the `backend/` directory:
```bash
cd backend
npm install
```

Verify backend `.env` configuration file (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college_voting
JWT_SECRET=college_voting_super_secret_jwt_key_2026_safe
NODE_ENV=development
```

Run database seeder script to populate default admin account and sample test data:
```bash
npm run seed
```

Start backend development server:
```bash
npm run dev
# OR for standard production node:
npm start
```
*Backend API will run on `http://localhost:5000`.*

---

### 3. Frontend Setup
Open a second terminal window and navigate to the `frontend/` directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*Frontend app will be accessible at `http://localhost:3000`.*

---

## 🔑 Sample Login Credentials for Testing

| User Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@college.edu` | `admin123` | Full access to Admin Control Center & CRUD |
| **Student 1** | `aarav@college.edu` | `student123` | Roll No: CS2023-042 (Active Student Voter) |
| **Student 2** | `ananya@college.edu` | `student123` | Roll No: EC2022-015 (Active Student Voter) |

---

## 🗄️ Database Schemas & Validation

1. **Student Schema**:
   - `name` (String, Required)
   - `email` (String, Unique, Required)
   - `password` (String, Encrypted via bcryptjs)
   - `department` (String, Required)
   - `year` (String, Required)
   - `rollNumber` (String, Unique, Required)
   - `role` (Enum: `student` | `admin`, Default: `student`)

2. **Election Schema**:
   - `title` (String, Required)
   - `description` (String, Required)
   - `position` (String, Required)
   - `startDate` (Date, Required)
   - `endDate` (Date, Required)
   - `status` (Enum: `upcoming` | `active` | `ended`)

3. **Candidate Schema**:
   - `name` (String, Required)
   - `department` (String, Required)
   - `year` (String, Required)
   - `position` (String, Required)
   - `manifesto` (String, Required)
   - `image` (String)
   - `electionId` (ObjectId ref -> `Election`)

4. **Vote Schema**:
   - `studentId` (ObjectId ref -> `Student`)
   - `candidateId` (ObjectId ref -> `Candidate`)
   - `electionId` (ObjectId ref -> `Election`)
   - `votedAt` (Date)
   - **Compound Index**: `{ studentId: 1, electionId: 1 }` (Enforces unique vote per student per election).

---

## 🌐 REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Student login & get JWT
- `POST /api/auth/admin-login` - Admin login & get JWT
- `GET /api/auth/me` - Get current logged-in profile

### Students Management (`/api/students`)
- `GET /api/students` - Get all students (Admin)
- `POST /api/students` - Create new student record (Admin)
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student details (Admin)
- `DELETE /api/students/:id` - Remove student record (Admin)

### Candidates Management (`/api/candidates`)
- `GET /api/candidates` - Get candidate list (Optional filter: `?electionId=xxx`)
- `POST /api/candidates` - Create candidate (Admin)
- `GET /api/candidates/:id` - Get candidate profile
- `PUT /api/candidates/:id` - Update candidate details (Admin)
- `DELETE /api/candidates/:id` - Delete candidate (Admin)

### Elections Management (`/api/elections`)
- `GET /api/elections` - Get all elections
- `POST /api/elections` - Create new election (Admin)
- `GET /api/elections/:id` - Get election with candidates
- `PUT /api/elections/:id` - Update election settings/status (Admin)
- `DELETE /api/elections/:id` - Delete election (Admin)

### Voting & Analytics (`/api/votes`)
- `POST /api/votes` - Submit vote (Student)
- `GET /api/votes/check/:electionId` - Check if logged-in student has voted
- `GET /api/votes/results/:electionId` - Get winner and vote counts for an election
- `GET /api/votes/stats` - Get overall admin dashboard metrics (Admin)

---

## 🧪 Testing Steps & Validation Workflow

1. **Database Initialization**:
   - Run `node seed.js` in backend folder to reset database and inject sample records.
2. **Test Admin Access**:
   - Log in via `/admin/login` using `admin@college.edu` / `admin123`.
   - Verify Admin Dashboard metrics cards load.
   - Navigate to **Manage Elections** and create a test election or toggle status to `active`.
   - Navigate to **Manage Candidates** and add a new candidate.
3. **Test Student Voting**:
   - Log out of Admin and log in as student `aarav@college.edu` / `student123` via `/login`.
   - Access Student Dashboard -> Click **Cast Vote Now** on an active election.
   - Select candidate and click **Confirm & Submit Vote**.
   - Observe redirection to **Vote Confirmation Page** with digital receipt.
4. **Test Double-Vote Prevention**:
   - Try navigating back to `/vote/<electionId>` for the same election.
   - Observe message: *"Vote Already Registered - You have already cast your vote in this election."*
5. **Test Results View**:
   - Log back into Admin portal and set election status to `ended`.
   - Access election results page `/results/<electionId>` to view certified winner spotlight and percentage progress bars.

---

## 🚀 Suggestions for Production Deployment

1. **Database**: Use a managed **MongoDB Atlas** cluster. Update `MONGO_URI` in `.env` to your Atlas connection string.
2. **Backend**: Deploy Node.js server to platforms like **Render**, **Railway**, or **AWS Elastic Beanstalk**. Set environment variables `PORT`, `MONGO_URI`, and strong `JWT_SECRET`.
3. **Frontend**: Deploy Vite React app to **Vercel** or **Netlify**. Ensure environment variables match backend API location.
