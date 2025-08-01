# Tracker Management System

A comprehensive full-stack business management application featuring expense management, branch administration, and user authentication with modern UI/UX design and production-ready SQLite database.

![Tracker Banner](https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=Tracker+Management+System)

## 🚀 Features

### 🔐 Authentication System

- **Attractive Login Page** with gradient backgrounds and animations
- **User Registration** with comprehensive validation and bcrypt password hashing
- **JWT-based Authentication** with role-based access control
- **Secure Password Storage** with bcrypt encryption
- **Demo Credentials**: Username: `barath` | Password: `123456`

### ���� Dashboard & Analytics

- **Executive Dashboard** with real-time statistics from SQLite database
- **Key Performance Indicators** (KPIs) display with dynamic calculations
- **Recent Activity Feed** showing latest expense submissions
- **Quick Action Buttons** for common tasks
- **System Health Monitoring** with API status checks

### 💰 Expense Management

- **Complete CRUD Operations** with persistent SQLite storage
- **Multi-category Support** (Travel, Office Supplies, Training, etc.)
- **Receipt Upload** capability with file URL storage
- **Status Tracking** (Draft, Submitted, Approved, Rejected)
- **Advanced Search & Filtering** with database queries
- **Excel Import/Export** functionality with real data persistence

### ✅ Expense Approval Workflow

- **Approval Queue** with priority-based sorting and urgency indicators
- **Bulk Approval/Rejection** capabilities with database transactions
- **Detailed Review Interface** with comments and approval history
- **Urgency Indicators** (High, Medium, Low) calculated from submission dates
- **Performance Metrics** tracking with real-time statistics
- **Approval History** logging with timestamps and approver names

### 🏢 Branch Management

- **Branch CRUD Operations** with SQLite persistence
- **Multi-field Search** capability with database indexing
- **Data Export/Import** via Excel with database synchronization
- **Pagination** (10 items per page) with efficient database queries
- **Real-time Updates** with immediate database writes

---

## 🗄️ Database Architecture (NEW - Production Ready!)

### SQLite Database Implementation

The application now uses **SQLite database** for production-ready data persistence, replacing the previous in-memory storage.

#### Database Schema

**Users Table**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,           -- bcrypt hashed
  full_name TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  department TEXT,
  role TEXT DEFAULT 'employee',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Branches Table**
```sql
CREATE TABLE branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  branch_name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Expenses Table**
```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_name TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  receipt_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_date DATETIME,
  approved_date DATETIME,
  approver_name TEXT,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Database Features

- **Automatic Schema Creation**: Database and tables created on first run
- **Demo Data Population**: Pre-loaded with realistic sample data
- **Foreign Key Constraints**: Data integrity enforcement
- **Indexed Queries**: Optimized for performance
- **ACID Compliance**: Reliable transaction handling
- **Backup-Friendly**: Single file database easy to backup

#### Demo Data Included

**Users:**
- **Admin**: `admin` / `admin123` (Full system access)
- **Manager**: `manager` / `manager123` (Approval permissions)
- **Employee**: `barath` / `123456` (Standard user access)

**Sample Branches:** 5 pre-configured branches across major Indian cities
**Sample Expenses:** Realistic expense entries with various statuses

---

## 🚀 Deployment & Backend Connection

### Problem: Network Errors on Cloudflare Pages

If you're seeing "Network error. Please try again." when trying to login, it's because your frontend is deployed on Cloudflare Pages without a backend server.

### Solution: Deploy Backend Separately + Connect Frontend

## 📋 Step-by-Step Backend Deployment Guide

### Prerequisites

1. **Install Dependencies**
```bash
npm install better-sqlite3 bcryptjs @types/bcryptjs @types/better-sqlite3
```

2. **Test Backend Locally (Optional)**
```bash
# Test standalone backend
npm run dev:backend

# Visit: http://localhost:3000/api/ping
```

---

### Option A: Railway Deployment (Recommended - FREE)

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Get $5 free credit (enough for months of hosting)

#### Step 2: Deploy from GitHub Repository
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your repository: `https://github.com/codewithmejeya/Tracker`
4. Railway auto-detects Node.js project

#### Step 3: Configure Environment Variables
1. Go to your project → **Variables** tab
2. Add these variables:
```
NODE_ENV=production
JWT_SECRET=your-super-secure-random-string-here
PORT=${{RAILWAY_PUBLIC_PORT}}
```

#### Step 4: Configure Build Settings
Railway auto-detects, but verify:
- **Build Command**: `npm run build:server`
- **Start Command**: `npm start`

#### Step 5: Deploy and Get URL
1. Railway will build and deploy automatically
2. Copy your deployment URL (e.g., `https://tracker-backend-production.up.railway.app`)
3. Test the backend: `https://your-url.railway.app/api/ping`

---

### Option B: Render Deployment (Alternative - FREE Tier)

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure settings:
   - **Name**: `tracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build:server`
   - **Start Command**: `npm start`

#### Step 3: Set Environment Variables
```
NODE_ENV=production
JWT_SECRET=your-super-secure-random-string-here
```

#### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for build completion (5-10 minutes)
3. Get your URL: `https://tracker-backend.onrender.com`

---

### Option C: Vercel Deployment (Serverless)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
vercel --prod
```

#### Step 3: Set Environment Variables
In Vercel dashboard:
```
NODE_ENV=production
JWT_SECRET=your-super-secure-random-string-here
```

---

## 🔗 Connect Frontend to Backend

### Step 1: Configure Cloudflare Pages Environment Variables

1. Go to **Cloudflare Pages Dashboard**
2. Select your project: `tracker-doy`
3. Go to **Settings** → **Environment Variables**
4. Add **Production** environment variable:

```
Variable Name: VITE_API_URL
Value: https://your-backend-url.railway.app
```

**Example URLs by Platform:**
- Railway: `https://tracker-backend-production.up.railway.app`
- Render: `https://tracker-backend.onrender.com`
- Vercel: `https://tracker-backend.vercel.app`

### Step 2: Redeploy Frontend

1. In Cloudflare Pages, go to **Deployments**
2. Click **"Create deployment"** or trigger a new build
3. Wait for deployment completion

### Step 3: Test the Connection

1. Visit your site: `https://tracker-doy.pages.dev/`
2. Try logging in with demo credentials:
   - Username: `barath`
   - Password: `123456`
3. You should successfully access the dashboard!

---

## 🧪 Testing Your Deployment

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/api/ping
# Should return: {"message": "ping"}
```

### Login Test
```bash
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "barath", "password": "123456"}'
```

### Dashboard Stats Test
```bash
curl https://your-backend-url.railway.app/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router 6** (SPA mode)
- **TailwindCSS 3** for styling
- **Radix UI** for components
- **Lucide React** for icons
- **Vite** for build tooling
- **Vitest** for testing

### Backend
- **Express.js** with TypeScript
- **SQLite3** with better-sqlite3 driver
- **bcryptjs** for password hashing
- **JWT** for authentication
- **Zod** for input validation
- **CORS** enabled for cross-origin requests

### Database
- **SQLite Database** with persistent storage
- **Automatic schema creation** and data population
- **Production-ready** with proper indexing and constraints
- **File-based storage** for easy backup and migration

---

## 📁 Project Structure

```
tracker-management/
├── client/                     # React frontend
│   ├── components/
│   │   ├── ui/                # Reusable UI components (Radix UI)
│   │   └── Layout.tsx         # Shared layout with navigation
│   ├── pages/                 # Route components
│   │   ├── Login.tsx          # Enhanced login page
│   │   ├── Signup.tsx         # User registration page
│   │   ├── MainDashboard.tsx  # Executive dashboard
│   │   ├── Dashboard.tsx      # Branch management
│   │   ├── ExpenseManagement.tsx
│   │   ├── ExpenseApproval.tsx
│   │   └── NotFound.tsx
│   ├── lib/                   # Utility functions
│   │   ├── api-config.ts      # API URL configuration
│   │   ├── utils.ts           # General utilities
│   │   └── excel-utils.ts     # Excel import/export
│   └── App.tsx               # Main app with routing
├── server/                    # Express backend with SQLite
│   ├── routes/               # API route handlers
│   │   ├── auth.ts           # Authentication with bcrypt
│   │   ├── branches.ts       # Branch management with DB
│   │   ├── expenses.ts       # Expense management with DB
│   │   └── dashboard.ts      # Dashboard statistics from DB
│   ├── database.ts           # SQLite database configuration
│   ├── standalone.ts         # Standalone server for deployment
│   └── index.ts              # Server configuration
├── data/                     # SQLite database files
│   └── tracker.db           # Main database file (auto-created)
├── docs/                     # Documentation
│   ├── DEPLOYMENT.md         # Detailed deployment guide
│   └── API.md               # API documentation
├── DEPLOYMENT_SOLUTION.md    # Complete deployment solution
├── railway.json             # Railway deployment config
├── render.yaml              # Render deployment config
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Modern web browser**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/codewithmejeya/Tracker.git
cd Tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Install database dependencies**
```bash
npm install better-sqlite3 bcryptjs @types/bcryptjs @types/better-sqlite3
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:8080
```

### Demo Login Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | `admin` | `admin123` | Full system access |
| Manager | `manager` | `manager123` | Expense approval rights |
| Employee | `barath` | `123456` | Basic user features |

---

## 🔧 Environment Configuration

### Development (.env)
```env
# Optional - defaults work for local development
VITE_API_URL=http://localhost:8080
JWT_SECRET=your-local-secret
NODE_ENV=development
```

### Production (Platform Environment Variables)
```env
# Required for deployment
NODE_ENV=production
JWT_SECRET=your-super-secure-production-secret
PORT=3000
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 📞 API Endpoints

### Authentication
- `POST /api/auth/login` - User login with bcrypt password verification
- `POST /api/auth/signup` - User registration with password hashing

### Dashboard  
- `GET /api/dashboard/stats` - Real-time statistics from SQLite database
- `GET /api/dashboard/recent-expenses` - Recent activity feed from database

### Branch Management
- `GET /api/branches` - List all branches from database
- `GET /api/branches/:id` - Get specific branch
- `POST /api/branches` - Create new branch with database persistence
- `PUT /api/branches/:id` - Update branch in database
- `DELETE /api/branches/:id` - Delete branch from database

### Expense Management
- `GET /api/expenses` - List all expenses from database
- `GET /api/expenses/pending-approval` - Get pending approvals with urgency calculation
- `GET /api/expenses/:id` - Get specific expense
- `POST /api/expenses` - Create new expense with database persistence
- `PUT /api/expenses/:id` - Update expense in database
- `DELETE /api/expenses/:id` - Delete expense from database
- `POST /api/expenses/:id/approve` - Approve expense with database logging
- `POST /api/expenses/:id/reject` - Reject expense with reason storage

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Network error. Please try again."
**Cause**: Frontend can't reach backend API
**Solution**: 
1. Verify backend is deployed and running
2. Check `VITE_API_URL` environment variable in Cloudflare Pages
3. Test backend health: `https://your-backend-url/api/ping`
4. Redeploy frontend after setting environment variables

#### 2. "Internal Server Error" on Backend
**Cause**: Database initialization failed
**Solution**:
1. Check backend logs in hosting platform
2. Verify SQLite dependencies are installed
3. Ensure write permissions for database file
4. Check JWT_SECRET environment variable is set

#### 3. Login Works but Data Doesn't Load
**Cause**: Database queries failing
**Solution**:
1. Check backend logs for SQL errors
2. Verify database file exists and is accessible
3. Test individual API endpoints
4. Check JWT token is being sent in requests

#### 4. CORS Errors
**Cause**: Cross-origin request blocked
**Solution**:
1. Backend includes CORS middleware for all origins
2. Verify backend is properly deployed
3. Check browser console for specific CORS errors

#### 5. Build Failures on Deployment Platform
**Cause**: Missing dependencies or incorrect build commands
**Solution**:
1. Verify package.json includes all SQLite dependencies
2. Check build commands match platform requirements
3. Ensure Node.js version compatibility (v16+)

### Debug Steps

1. **Test Backend Health**
```bash
curl https://your-backend-url/api/ping
```

2. **Test Database Connection**
```bash
curl https://your-backend-url/api/dashboard/stats
```

3. **Test Authentication**
```bash
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "barath", "password": "123456"}'
```

4. **Check Frontend Environment**
- Open browser dev tools → Application → Environment Variables
- Verify `VITE_API_URL` is set correctly

---

## 🔒 Security Features

### Production Security Implemented

- **Password Hashing**: bcrypt with salt rounds for all user passwords
- **JWT Authentication**: Secure token-based authentication with expiration
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Protection**: Prepared statements with parameterized queries
- **Role-based Access Control**: Different permission levels (Admin, Manager, Employee)
- **Environment Variables**: Sensitive data stored in environment variables
- **CORS Protection**: Configured for cross-origin security

### Additional Security Recommendations

- [ ] Add rate limiting for API endpoints
- [ ] Implement API key authentication for sensitive operations
- [ ] Enable HTTPS/TLS encryption (handled by hosting platforms)
- [ ] Add request/response logging for audit trails
- [ ] Implement database backup strategy
- [ ] Set up monitoring and security alerts

---

## 📊 Monitoring and Maintenance

### Database Maintenance

**Backup Strategy**
```bash
# Backup SQLite database
cp data/tracker.db backups/tracker-$(date +%Y%m%d).db
```

**Database Size Monitoring**
```bash
# Check database size
ls -lh data/tracker.db
```

**Query Performance**
- SQLite auto-optimizes most queries
- Indexes are automatically created for primary keys
- Foreign key constraints ensure data integrity

### Performance Monitoring

**Backend Health Endpoint**
- `/api/ping` - Basic health check
- Returns server status and response time

**Database Statistics**
- `/api/dashboard/stats` - Real-time database statistics
- Includes record counts and calculated metrics

---

## 🤝 Contributing

### Development Guidelines

1. **Database Changes**: Update schema in `server/database.ts`
2. **API Changes**: Follow existing patterns in route files
3. **Frontend Changes**: Use TypeScript and follow React best practices
4. **Testing**: Test both frontend and backend functionality
5. **Documentation**: Update README for significant changes

### Git Workflow

```bash
git checkout -b feature/new-feature
git commit -m "feat: add new feature with database support"
git push origin feature/new-feature
# Create pull request
```

---

## 📝 Changelog

### Version 2.0.0 (Current - Production Ready!)

- ✅ **SQLite Database Integration** - Persistent data storage
- ✅ **bcrypt Password Hashing** - Secure authentication
- ✅ **Production Deployment Configs** - Railway, Render, Vercel ready
- ✅ **Environment-based API Configuration** - Flexible deployment
- ✅ **Comprehensive Error Handling** - Graceful failure modes
- ✅ **Database Auto-initialization** - Zero-configuration setup
- ✅ **Demo Data Population** - Ready-to-use sample data

### Version 1.0.0 (Previous)

- ✅ User authentication with JWT
- ✅ Expense management and approval workflow  
- ✅ Branch management system
- ✅ Executive dashboard with analytics
- ✅ Excel import/export functionality
- ✅ Responsive UI with modern design
- ✅ TypeScript throughout the application

### Planned Features (v2.1.0)

- 🔄 PostgreSQL migration option
- 🔄 Advanced reporting and analytics
- 🔄 Email notifications for approvals
- 🔄 File upload for receipts
- 🔄 Advanced user roles and permissions
- 🔄 API rate limiting and caching

---

## 📞 Support

### Documentation

- **Complete Deployment Guide**: [DEPLOYMENT_SOLUTION.md](DEPLOYMENT_SOLUTION.md)
- **API Documentation**: [docs/API.md](docs/API.md)
- **Database Schema**: [docs/DATABASE.md](docs/DATABASE.md)

### Getting Help

1. **Backend Issues**: Check hosting platform logs
2. **Frontend Issues**: Check browser console
3. **Database Issues**: Verify SQLite file permissions
4. **Deployment Issues**: Follow platform-specific troubleshooting

### Quick Support Links

- **Railway Documentation**: https://docs.railway.app
- **Render Documentation**: https://render.com/docs
- **Cloudflare Pages**: https://developers.cloudflare.com/pages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 Success Checklist

After following this guide, you should have:

- [ ] ✅ Backend deployed on Railway/Render/Vercel
- [ ] ✅ SQLite database automatically created and populated
- [ ] ✅ Environment variable `VITE_API_URL` set in Cloudflare Pages
- [ ] ✅ Frontend redeployed with backend connection
- [ ] ✅ Successful login with demo credentials (`barath` / `123456`)
- [ ] ✅ Dashboard loading real data from database
- [ ] ✅ All CRUD operations working (create, read, update, delete)
- [ ] ✅ Expense approval workflow functional
- [ ] ✅ User registration working with secure password hashing

**Built with ❤️ using React, TypeScript, Express.js, and SQLite for production-ready deployment**

For additional support or questions about deployment, please refer to the comprehensive guides in the `docs/` folder or check the hosting platform documentation.
