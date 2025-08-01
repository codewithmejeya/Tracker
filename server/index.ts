import "dotenv/config";
import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database.js";
import { handleDemo } from "./routes/demo";
import { login, signup, verifyToken } from "./routes/auth";
import {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "./routes/branches";
import {
  getAllExpenses,
  getPendingExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
} from "./routes/expenses";
import { getDashboardStats, getRecentExpenses } from "./routes/dashboard";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database lazily on first request
  let databaseInitialized = false;
  app.use((req, res, next) => {
    if (!databaseInitialized) {
      try {
        initializeDatabase();
        console.log("Database initialized successfully");
        databaseInitialized = true;
      } catch (error) {
        console.error("Failed to initialize database:", error);
        return res.status(500).json({ message: "Database initialization failed" });
      }
    }
    next();
  });

  // Public routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/signup", signup);

  // Protected branch management routes
  app.get("/api/branches", verifyToken, getAllBranches);
  app.get("/api/branches/:id", verifyToken, getBranchById);
  app.post("/api/branches", verifyToken, createBranch);
  app.put("/api/branches/:id", verifyToken, updateBranch);
  app.delete("/api/branches/:id", verifyToken, deleteBranch);

  // Protected expense management routes
  app.get("/api/expenses", verifyToken, getAllExpenses);
  app.get("/api/expenses/pending-approval", verifyToken, getPendingExpenses);
  app.get("/api/expenses/:id", verifyToken, getExpenseById);
  app.post("/api/expenses", verifyToken, createExpense);
  app.put("/api/expenses/:id", verifyToken, updateExpense);
  app.delete("/api/expenses/:id", verifyToken, deleteExpense);
  app.post("/api/expenses/:id/approve", verifyToken, approveExpense);
  app.post("/api/expenses/:id/reject", verifyToken, rejectExpense);

  // Protected dashboard routes
  app.get("/api/dashboard/stats", verifyToken, getDashboardStats);
  app.get("/api/dashboard/recent-expenses", verifyToken, getRecentExpenses);

  return app;
}
