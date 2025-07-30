# DigiTrac Management System

A comprehensive full-stack business management application featuring expense management, branch administration, and user authentication with modern UI/UX design.

![DigiTrac Banner](https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=DigiTrac+Management+System)

## 🚀 Features

### 🔐 Authentication System
- **Attractive Login Page** with gradient backgrounds and animations
- **User Registration** with comprehensive validation
- **JWT-based Authentication** with role-based access control
- **Demo Credentials**: Username: `barath` | Password: `123456`

### 📊 Dashboard & Analytics
- **Executive Dashboard** with real-time statistics
- **Key Performance Indicators** (KPIs) display
- **Recent Activity Feed** 
- **Quick Action Buttons** for common tasks
- **System Health Monitoring**

### 💰 Expense Management
- **Complete CRUD Operations** for expense submissions
- **Multi-category Support** (Travel, Office Supplies, Training, etc.)
- **Receipt Upload** capability
- **Status Tracking** (Draft, Submitted, Approved, Rejected)
- **Advanced Search & Filtering**
- **Excel Import/Export** functionality

### ✅ Expense Approval Workflow
- **Approval Queue** with priority-based sorting
- **Bulk Approval/Rejection** capabilities
- **Detailed Review Interface** with comments
- **Urgency Indicators** (High, Medium, Low)
- **Performance Metrics** tracking
- **Approval History** logging

### 🏢 Branch Management
- **Branch CRUD Operations** with validation
- **Multi-field Search** capability
- **Data Export/Import** via Excel
- **Pagination** (10 items per page)
- **Real-time Updates**

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
- **JWT** for authentication
- **Zod** for validation
- **CORS** enabled
- **Hot reload** in development

### Database
- **In-Memory Storage** (for demo purposes)
- Easily replaceable with PostgreSQL, MongoDB, etc.
- **Structured Data Models** for scalability

## 📁 Project Structure

```
digitrac-management/
├── client/                     # React frontend
│   ├── components/            
│   │   ├── ui/                # Reusable UI components (Radix UI)
│   │   └── Layout.tsx         # Shared layout with navigation
│   ├── pages/                 # Route components
│   │   ├── Login.tsx          # Enhanced login page
│   │   ├── Signup.tsx         # User registration page
│   │   ├── MainDashboard.tsx  # Executive dashboard
│   │   ├── Dashboard.tsx      # Branch management (legacy)
│   │   ├── ExpenseManagement.tsx
│   │   ├── ExpenseApproval.tsx
│   │   └── NotFound.tsx
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   │   ├── utils.ts           # General utilities
│   │   └── excel-utils.ts     # Excel import/export
│   ├── App.tsx               # Main app with routing
│   └── global.css            # Global styles & theme
├── server/                    # Express backend
│   ├── routes/               # API route handlers
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── branches.ts       # Branch management API
│   │   ├── expenses.ts       # Expense management API
│   │   └── dashboard.ts      # Dashboard statistics API
│   └── index.ts              # Server configuration
├── shared/                   # Shared types & interfaces
│   └── types.ts              # TypeScript definitions
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Modern web browser**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digitrac-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:8080
   ```

### Demo Login
- **Username**: `barath`
- **Password**: `123456`

## 🗄️ Database Architecture

### Current Implementation (In-Memory)

The application currently uses **in-memory storage** for demonstration purposes. Data is stored in JavaScript arrays and objects within the server runtime.

#### User Data Model
```typescript
interface User {
  id: string;           // Unique identifier (e.g., "user_001")
  fullName: string;     // Full display name
  email: string;        // Email address (unique)
  username: string;     // Login username (unique)
  password: string;     // Password (should be hashed in production)
  employeeId: string;   // Employee ID (unique)
  department: string;   // Department name
  role: 'employee' | 'manager' | 'admin';
  createdAt: string;    // ISO timestamp
  isActive: boolean;    // Account status
}
```

#### Branch Data Model
```typescript
interface Branch {
  id: string;           // Auto-generated ID (e.g., "BR001")
  branchName: string;   // Branch display name
  location: string;     // Geographic location
  contactPerson: string; // Primary contact
  createdAt: string;    // Creation timestamp
  updatedAt: string;    // Last modification timestamp
}
```

#### Expense Data Model
```typescript
interface Expense {
  id: string;           // Auto-generated ID (e.g., "EXP001")
  employeeName: string; // Submitter name
  employeeId: string;   // Submitter employee ID
  department: string;   // Employee department
  category: string;     // Expense category
  amount: number;       // Expense amount
  description: string;  // Detailed description
  receiptUrl?: string;  // Receipt file path (optional)
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedDate: string; // Submission timestamp
  approvedDate?: string; // Approval timestamp (optional)
  approverName?: string; // Approver name (optional)
  rejectionReason?: string; // Rejection reason (optional)
  createdAt: string;    // Creation timestamp
  updatedAt: string;    // Last modification timestamp
}
```

### Data Storage Locations

#### Frontend State Management
- **React State**: Component-level state for UI interactions
- **Local Storage**: JWT tokens and user preferences
- **No Global State Library**: Direct API calls from components

#### Backend Data Storage
- **Users Array**: In `server/routes/auth.ts`
- **Branches Array**: In `server/routes/branches.ts`
- **Expenses Array**: In `server/routes/expenses.ts`

### Data Persistence

⚠️ **Important**: Current implementation uses **in-memory storage**, which means:
- Data resets when server restarts
- No permanent data persistence
- Suitable for development/demo only

### Production Database Migration

For production deployment, replace in-memory arrays with a proper database:

#### Recommended Databases
1. **PostgreSQL** (Recommended)
   - Excellent for relational data
   - ACID compliance
   - Advanced querying capabilities

2. **MongoDB**
   - Document-based storage
   - Flexible schema
   - Good for rapid development

3. **MySQL/MariaDB**
   - Mature and stable
   - Wide hosting support
   - Excellent performance

#### Migration Steps
1. **Choose Database Provider**
   - Local: PostgreSQL/MySQL
   - Cloud: AWS RDS, Google Cloud SQL, PlanetScale

2. **Install Database Driver**
   ```bash
   npm install pg @types/pg  # For PostgreSQL
   # or
   npm install mysql2        # For MySQL
   # or
   npm install mongodb       # For MongoDB
   ```

3. **Replace Array Operations**
   - Convert array `.find()` to SQL `SELECT`
   - Convert array `.push()` to SQL `INSERT`
   - Convert array `.filter()` to SQL `WHERE`
   - Add proper database connection pooling

4. **Add Migrations**
   - Create database schema files
   - Implement schema versioning
   - Add seed data scripts

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent-expenses` - Recent expense activity

### Branch Management
- `GET /api/branches` - List all branches
- `GET /api/branches/:id` - Get specific branch
- `POST /api/branches` - Create new branch
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch

### Expense Management
- `GET /api/expenses` - List all expenses
- `GET /api/expenses/pending-approval` - Get pending approvals
- `GET /api/expenses/:id` - Get specific expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/:id/approve` - Approve expense
- `POST /api/expenses/:id/reject` - Reject expense

## 🎨 UI/UX Features

### Design System
- **Modern Gradient Backgrounds** with blur effects
- **Responsive Design** for all screen sizes
- **Smooth Animations** and transitions
- **Interactive Elements** with hover effects
- **Consistent Color Scheme** (DigiTrac Blue theme)

### Accessibility
- **Keyboard Navigation** support
- **Screen Reader** compatible
- **High Contrast** color ratios
- **Focus Indicators** for interactive elements

### Performance
- **Code Splitting** with React Router
- **Lazy Loading** for components
- **Optimized Images** and assets
- **Efficient Re-renders** with React hooks

## 🧪 Testing

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

### Test Structure
- **Unit Tests**: Component testing with Vitest
- **Integration Tests**: API endpoint testing
- **Type Checking**: TypeScript validation

## 🚀 Deployment

### Build for Production
```bash
npm run build           # Build client and server
npm start              # Start production server
```

### Deployment Options

#### 1. Traditional Hosting
- **Netlify** (Recommended for frontend)
- **Vercel** (Full-stack deployment)
- **Digital Ocean** (VPS hosting)

#### 2. Cloud Platforms
- **AWS** (EC2, Lambda, RDS)
- **Google Cloud** (Compute Engine, Cloud SQL)
- **Microsoft Azure** (App Service)

#### 3. Container Deployment
```bash
# Create Docker image
docker build -t digitrac-app .

# Run container
docker run -p 8080:8080 digitrac-app
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** with expiration
- **Role-based Access Control** (Employee, Manager, Admin)
- **Protected Routes** on frontend and backend
- **Password Validation** requirements

### Data Security
- **Input Validation** using Zod schemas
- **XSS Protection** with React's built-in sanitization
- **CORS Configuration** for API security
- **Environment Variables** for sensitive data

### Production Security Checklist
- [ ] Implement password hashing (bcrypt)
- [ ] Add rate limiting for API endpoints
- [ ] Enable HTTPS/TLS encryption
- [ ] Configure CSP headers
- [ ] Implement API key authentication
- [ ] Add request/response logging
- [ ] Set up monitoring and alerts

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow TypeScript and React best practices
2. **Components**: Use functional components with hooks
3. **Styling**: Utilize TailwindCSS utility classes
4. **Testing**: Write tests for new features
5. **Documentation**: Update README for significant changes

### Git Workflow
```bash
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request
```

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ User authentication with JWT
- ✅ Expense management and approval workflow
- ✅ Branch management system
- ✅ Executive dashboard with analytics
- ✅ Excel import/export functionality
- ✅ Responsive UI with modern design
- ✅ TypeScript throughout the application

### Planned Features (v1.1.0)
- 🔄 Real database integration
- 🔄 Advanced reporting and analytics
- 🔄 Email notifications for approvals
- 🔄 Mobile app companion
- 🔄 Advanced user roles and permissions

## 📞 Support

### Documentation
- **API Documentation**: Available in code comments
- **Component Library**: Radix UI documentation
- **Styling Guide**: TailwindCSS documentation

### Issues & Bugs
- Create GitHub issues for bug reports
- Include steps to reproduce
- Provide browser and environment details

### Feature Requests
- Submit feature requests via GitHub issues
- Describe the use case and expected behavior
- Include mockups or wireframes if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

For more information or support, please contact the development team.
