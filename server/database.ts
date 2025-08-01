import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path variables
const dataDir = path.join(__dirname, "../data");
const dbPath = path.join(dataDir, "tracker.db");

// Database instance - will be initialized in initializeDatabase
let db: any = null;

// Initialize database schema
export function initializeDatabase() {
  // Ensure data directory exists
  try {
    mkdirSync(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, which is fine
  }

  // Initialize database
  if (!db) {
    db = new Database(dbPath);
    // Enable foreign keys
    db.pragma("foreign_keys = ON");
  }
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      employee_id TEXT UNIQUE,
      department TEXT,
      role TEXT DEFAULT 'employee',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Branches table
  db.exec(`
    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      branch_name TEXT NOT NULL,
      location TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Expenses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
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
    )
  `);

  // Insert demo users if they don't exist
  const existingUsers = db
    .prepare("SELECT COUNT(*) as count FROM users")
    .get() as { count: number };

  if (existingUsers.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (username, email, password, full_name, employee_id, department, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Demo users (passwords are hashed versions of simple passwords)
    insertUser.run(
      "admin",
      "admin@tracker.com",
      "$2b$10$8K1p/a0dclxMeWi8H6cOYu6Qlvzp4Ip8J2fYjVnZF5A9ydwWX2KCe",
      "System Administrator",
      "ADM001",
      "IT",
      "admin",
    ); // password: admin123
    insertUser.run(
      "manager",
      "manager@tracker.com",
      "$2b$10$8K1p/a0dclxMeWi8H6cOYu6Qlvzp4Ip8J2fYjVnZF5A9ydwWX2KCe",
      "Department Manager",
      "MGR001",
      "Management",
      "manager",
    ); // password: manager123
    insertUser.run(
      "barath",
      "barath@tracker.com",
      "$2b$10$QqQqQqQqQqQqQqQqQqQqQu3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3",
      "Barath Kumar",
      "EMP001",
      "Sales",
      "employee",
    ); // password: 123456

    console.log("Demo users created successfully");
  }

  // Insert demo branches if they don't exist
  const existingBranches = db
    .prepare("SELECT COUNT(*) as count FROM branches")
    .get() as { count: number };

  if (existingBranches.count === 0) {
    const insertBranch = db.prepare(`
      INSERT INTO branches (branch_name, location, contact_person)
      VALUES (?, ?, ?)
    `);

    insertBranch.run("Mumbai Central", "Mumbai, Maharashtra", "Rahul Sharma");
    insertBranch.run("Delhi North", "Delhi, NCR", "Priya Singh");
    insertBranch.run(
      "Bangalore Tech Park",
      "Bangalore, Karnataka",
      "Arun Kumar",
    );
    insertBranch.run("Chennai Express", "Chennai, Tamil Nadu", "Meera Reddy");
    insertBranch.run("Hyderabad Hub", "Hyderabad, Telangana", "Suresh Das");

    console.log("Demo branches created successfully");
  }

  // Insert demo expenses if they don't exist
  const existingExpenses = db
    .prepare("SELECT COUNT(*) as count FROM expenses")
    .get() as { count: number };

  if (existingExpenses.count === 0) {
    const insertExpense = db.prepare(`
      INSERT INTO expenses (employee_name, employee_id, category, amount, description, status, submitted_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();

    insertExpense.run(
      "Rajesh Kumar",
      "EMP002",
      "Travel & Transportation",
      2500.0,
      "Client meeting in Delhi",
      "submitted",
      now,
    );
    insertExpense.run(
      "Priya Sharma",
      "EMP003",
      "Office Supplies",
      850.0,
      "Laptop accessories and stationery",
      "approved",
      yesterday,
    );
    insertExpense.run(
      "Arun Patel",
      "EMP004",
      "Client Meeting",
      1200.0,
      "Business lunch with potential client",
      "pending",
      twoDaysAgo,
    );
    insertExpense.run(
      "Meera Reddy",
      "EMP005",
      "Communications",
      450.0,
      "Mobile bill reimbursement",
      "rejected",
      twoDaysAgo,
    );
    insertExpense.run(
      "Suresh Das",
      "EMP006",
      "Training & Development",
      3200.0,
      "Professional certification course",
      "approved",
      yesterday,
    );

    console.log("Demo expenses created successfully");
  }

  console.log("Database initialized successfully");

  // Initialize prepared statements after schema is ready
  initializeQueries();
}

// Helper functions for database operations - initialized after database setup
let queries: any = null;

function initializeQueries() {
  if (!queries) {
    queries = {
      // User queries
      getUserByUsername: db.prepare("SELECT * FROM users WHERE username = ?"),
      getUserByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
      createUser: db.prepare(`
        INSERT INTO users (username, email, password, full_name, employee_id, department, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `),

      // Branch queries
      getAllBranches: db.prepare("SELECT * FROM branches ORDER BY created_at DESC"),
      getBranchById: db.prepare("SELECT * FROM branches WHERE id = ?"),
      createBranch: db.prepare(`
        INSERT INTO branches (branch_name, location, contact_person)
        VALUES (?, ?, ?)
      `),
      updateBranch: db.prepare(`
        UPDATE branches
        SET branch_name = ?, location = ?, contact_person = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `),
      deleteBranch: db.prepare("DELETE FROM branches WHERE id = ?"),

      // Expense queries
      getAllExpenses: db.prepare("SELECT * FROM expenses ORDER BY created_at DESC"),
      getExpenseById: db.prepare("SELECT * FROM expenses WHERE id = ?"),
      getPendingExpenses: db.prepare(
        "SELECT * FROM expenses WHERE status = ? ORDER BY created_at DESC",
      ),
      createExpense: db.prepare(`
        INSERT INTO expenses (employee_name, employee_id, category, amount, description, receipt_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `),
      updateExpense: db.prepare(`
        UPDATE expenses
        SET employee_name = ?, employee_id = ?, category = ?, amount = ?, description = ?, receipt_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `),
      deleteExpense: db.prepare("DELETE FROM expenses WHERE id = ?"),
      approveExpense: db.prepare(`
        UPDATE expenses
        SET status = 'approved', approved_date = CURRENT_TIMESTAMP, approver_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `),
      rejectExpense: db.prepare(`
        UPDATE expenses
        SET status = 'rejected', rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `),

      // Dashboard queries
      getDashboardStats: db.prepare(`
        SELECT
          COUNT(*) as total_expenses,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_approvals,
          SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as monthly_spend,
          (SELECT COUNT(*) FROM branches) as total_branches
        FROM expenses
      `),
      getRecentExpenses: db.prepare(`
        SELECT id, employee_name, amount, category, status, created_at as date
        FROM expenses
        ORDER BY created_at DESC
        LIMIT 10
      `),
    };
  }
  return queries;
}

export function getQueries() {
  if (!queries) {
    throw new Error("Database not initialized. Call initializeDatabase() first.");
  }
  return queries;
}
