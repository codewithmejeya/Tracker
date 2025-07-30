# Tracker Database Documentation

## Overview

The Tracker Management System currently uses an **in-memory database** for demonstration purposes. This document explains the current data structure, relationships, and migration path to a production database.

## Current Implementation

### Storage Architecture

```
Memory Storage (JavaScript Objects/Arrays)
├── Users Array (server/routes/auth.ts)
├── Branches Array (server/routes/branches.ts)
├── Expenses Array (server/routes/expenses.ts)
└── Dashboard Stats (computed dynamically)
```

### Data Persistence

⚠️ **Important Limitations:**

- Data resets on server restart
- No data persistence between sessions
- Single-user/single-instance only
- No concurrent access protection
- No backup or recovery mechanisms

## Data Models

### User Entity

**Location:** `server/routes/auth.ts`

```typescript
interface User {
  id: string; // Primary Key: "user_001", "user_002", etc.
  fullName: string; // Display name
  email: string; // Unique email address
  username: string; // Unique login identifier
  password: string; // Plain text (should be hashed)
  employeeId: string; // Unique employee identifier
  department: string; // Department name
  role: "employee" | "manager" | "admin";
  createdAt: string; // ISO timestamp
  isActive: boolean; // Account status
}
```

**Sample Data:**

```javascript
const users = [
  {
    id: "user_001",
    fullName: "Barath Kumar",
    email: "barath@tracker.com",
    username: "barath",
    password: "123456",
    employeeId: "EMP001",
    department: "Admin",
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
    isActive: true,
  },
];
```

**Operations:**

- `find()` - User lookup by username/email
- `push()` - New user registration
- Auto-increment ID generation

### Branch Entity

**Location:** `server/routes/branches.ts`

```typescript
interface Branch {
  id: string; // Primary Key: "BR001", "BR002", etc.
  branchName: string; // Branch display name
  location: string; // Geographic location
  contactPerson: string; // Primary contact name
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last modification timestamp
}
```

**Sample Data:**

```javascript
const branches = [
  {
    id: "BR001",
    branchName: "Main Branch",
    location: "Chennai, Tamil Nadu",
    contactPerson: "Rajesh Kumar",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];
```

**Operations:**

- `find()` - Branch lookup by ID
- `push()` - Create new branch
- `splice()` - Delete branch
- Array index modification for updates

### Expense Entity

**Location:** `server/routes/expenses.ts`

```typescript
interface Expense {
  id: string; // Primary Key: "EXP001", "EXP002", etc.
  employeeName: string; // Foreign Key reference (User.fullName)
  employeeId: string; // Foreign Key reference (User.employeeId)
  department: string; // Department classification
  category: string; // Expense category
  amount: number; // Expense amount (decimal)
  description: string; // Detailed description
  receiptUrl?: string; // Optional receipt file path
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedDate: string; // Submission timestamp
  approvedDate?: string; // Optional approval timestamp
  approverName?: string; // Optional approver name
  rejectionReason?: string; // Optional rejection reason
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last modification timestamp
}
```

**Sample Data:**

```javascript
const expenses = [
  {
    id: "EXP001",
    employeeName: "Rajesh Kumar",
    employeeId: "EMP001",
    department: "Sales",
    category: "Travel & Transportation",
    amount: 2500,
    description: "Flight tickets for client meeting",
    status: "submitted",
    submittedDate: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];
```

**Operations:**

- `filter()` - Query by status, user, date range
- `find()` - Expense lookup by ID
- `push()` - Create new expense
- Array index modification for updates/approvals

## Data Relationships

### Logical Relationships

```mermaid
erDiagram
    User ||--o{ Expense : submits
    User ||--o{ Expense : approves
    User }o--|| Department : belongs_to
    Branch }o--|| User : managed_by

    User {
        string id PK
        string fullName
        string email UK
        string username UK
        string employeeId UK
        string department
        string role
        boolean isActive
    }

    Expense {
        string id PK
        string employeeName FK
        string employeeId FK
        string category
        number amount
        string status
        string approverName FK
    }

    Branch {
        string id PK
        string branchName
        string location
        string contactPerson
    }
```

### Current Relationship Implementation

Since we're using in-memory arrays, relationships are maintained through:

1. **String References**: Using `employeeId` and `employeeName` to link expenses to users
2. **No Foreign Key Constraints**: No automatic validation of references
3. **Manual Consistency**: Application code ensures data consistency

## Data Flow

### User Registration Flow

```
1. Client sends POST /api/auth/signup
2. Server validates input with Zod schema
3. Check for existing username/email/employeeId
4. Generate new user ID (user_XXX)
5. Push to users array
6. Return success response
```

### Expense Approval Flow

```
1. Client sends POST /api/expenses/:id/approve
2. Server finds expense in expenses array
3. Update expense status to 'approved'
4. Set approverName from JWT token
5. Set approvedDate to current timestamp
6. Update updatedAt timestamp
7. Return updated expense
```

### Data Querying

```
1. Client requests data (GET /api/expenses)
2. Server filters array based on user context
3. Apply additional filters (status, category, etc.)
4. Sort results by timestamp
5. Return filtered/sorted array
```

## Performance Characteristics

### Current Performance

| Operation         | Time Complexity | Memory Usage |
| ----------------- | --------------- | ------------ |
| Find User by ID   | O(n)            | Low          |
| List All Expenses | O(n)            | Medium       |
| Filter Expenses   | O(n)            | Medium       |
| Create Record     | O(1)            | Low          |
| Update Record     | O(n)            | Low          |
| Delete Record     | O(n)            | Low          |

### Scalability Limits

- **Memory**: Limited by Node.js heap size (~1.7GB)
- **Concurrent Users**: Single-threaded, no concurrency protection
- **Data Size**: Practical limit ~10,000 records before performance degradation
- **Queries**: Linear search for all operations

## Migration to Production Database

### Recommended Database Options

#### 1. PostgreSQL (Recommended)

**Pros:**

- ACID compliance
- Complex queries and joins
- JSON support for flexible schemas
- Excellent performance
- Strong ecosystem

**Schema Example:**

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('employee', 'manager', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Branches table
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    receipt_url TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_expenses_employee_id ON expenses(employee_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_employee_id ON users(employee_id);
```

#### 2. MongoDB

**Pros:**

- Document-based storage
- Flexible schema
- Easy horizontal scaling
- JSON-native

**Schema Example:**

```javascript
// Users collection
{
  _id: ObjectId("..."),
  fullName: "Barath Kumar",
  email: "barath@tracker.com",
  username: "barath",
  passwordHash: "$2b$10$...",
  employeeId: "EMP001",
  department: "Admin",
  role: "admin",
  isActive: true,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}

// Expenses collection
{
  _id: ObjectId("..."),
  employeeId: ObjectId("..."), // Reference to user
  approverId: ObjectId("..."), // Reference to approver
  category: "Travel & Transportation",
  amount: 2500.00,
  description: "Flight tickets for client meeting",
  receiptUrl: "/uploads/receipt_123.pdf",
  status: "approved",
  submittedAt: ISODate("..."),
  approvedAt: ISODate("..."),
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Migration Steps

#### Phase 1: Database Setup

1. **Choose Database Provider**

   - Local: PostgreSQL/MySQL installation
   - Cloud: AWS RDS, Google Cloud SQL, PlanetScale

2. **Install Dependencies**

   ```bash
   npm install pg @types/pg
   # or
   npm install mongodb
   # or
   npm install mysql2
   ```

3. **Environment Configuration**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tracker
   # or
   MONGODB_URI=mongodb://localhost:27017/tracker
   ```

#### Phase 2: Data Layer Implementation

1. **Create Database Connection**

   ```typescript
   // db/connection.ts
   import { Pool } from "pg";

   export const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20,
     idleTimeoutMillis: 30000,
   });
   ```

2. **Create Repository Classes**
   ```typescript
   // repositories/UserRepository.ts
   export class UserRepository {
     async findByUsername(username: string): Promise<User | null> {
       const result = await pool.query(
         "SELECT * FROM users WHERE username = $1 AND is_active = true",
         [username],
       );
       return result.rows[0] || null;
     }

     async create(userData: CreateUserRequest): Promise<User> {
       const result = await pool.query(
         "INSERT INTO users (full_name, email, username, password_hash, employee_id, department, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
         [
           userData.fullName,
           userData.email,
           userData.username,
           userData.passwordHash,
           userData.employeeId,
           userData.department,
           userData.role,
         ],
       );
       return result.rows[0];
     }
   }
   ```

#### Phase 3: Migration Script

```typescript
// scripts/migrate-data.ts
import { users, branches, expenses } from "../current-data";
import {
  UserRepository,
  BranchRepository,
  ExpenseRepository,
} from "../repositories";

async function migrateData() {
  const userRepo = new UserRepository();
  const branchRepo = new BranchRepository();
  const expenseRepo = new ExpenseRepository();

  // Migrate users
  for (const user of users) {
    await userRepo.create({
      ...user,
      passwordHash: await bcrypt.hash(user.password, 10),
    });
  }

  // Migrate branches
  for (const branch of branches) {
    await branchRepo.create(branch);
  }

  // Migrate expenses
  for (const expense of expenses) {
    await expenseRepo.create(expense);
  }
}
```

#### Phase 4: Replace Array Operations

```typescript
// Before (in-memory)
const user = users.find((u) => u.username === username);

// After (database)
const user = await userRepository.findByUsername(username);
```

### Data Seeding

Create seed scripts for development/testing:

```typescript
// seeds/development.ts
export const seedData = {
  users: [
    {
      fullName: "Admin User",
      email: "admin@tracker.com",
      username: "admin",
      password: "admin123",
      employeeId: "EMP001",
      department: "Administration",
      role: "admin",
    },
  ],
  branches: [
    {
      branchName: "Headquarters",
      location: "Chennai, Tamil Nadu",
      contactPerson: "Manager Name",
    },
  ],
};
```

## Backup and Recovery

### Current State (In-Memory)

- **No backup capability**
- **No recovery options**
- **Data loss on server restart**

### Production Recommendations

#### Automated Backups

```bash
# PostgreSQL backup
pg_dump tracker_db > backup_$(date +%Y%m%d_%H%M%S).sql

# MongoDB backup
mongodump --db tracker --out ./backups/$(date +%Y%m%d_%H%M%S)
```

#### Recovery Procedures

1. **Point-in-time Recovery**: Database-specific tools
2. **Replica Sets**: For high availability
3. **Disaster Recovery**: Cross-region backups

## Monitoring and Analytics

### Database Metrics to Monitor

- **Connection Pool Usage**
- **Query Performance**
- **Storage Growth**
- **Index Effectiveness**
- **Replication Lag** (if applicable)

### Query Optimization

- **Add Indexes**: Based on common query patterns
- **Query Analysis**: Use EXPLAIN for PostgreSQL
- **Connection Pooling**: Optimize connection management

## Security Considerations

### Current Security (In-Memory)

- Plain text passwords (insecure)
- No encryption at rest
- No access logging
- No audit trail

### Production Security

1. **Password Hashing**: Use bcrypt or Argon2
2. **Encryption at Rest**: Database-level encryption
3. **Encryption in Transit**: SSL/TLS connections
4. **Access Logging**: Track all database operations
5. **Audit Trails**: Log all data modifications
6. **Backup Encryption**: Secure backup storage

### Implementation Example

```typescript
import bcrypt from "bcrypt";

// Hash password before storage
const passwordHash = await bcrypt.hash(password, 12);

// Verify password during login
const isValid = await bcrypt.compare(password, user.passwordHash);
```

This documentation provides a complete overview of the current database implementation and a clear migration path to a production-ready database system.
