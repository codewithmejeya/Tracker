import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login, verifyToken } from "./routes/auth";
import {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
} from "./routes/branches";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Public routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", login);

  // Protected branch management routes
  app.get("/api/branches", verifyToken, getAllBranches);
  app.get("/api/branches/:id", verifyToken, getBranchById);
  app.post("/api/branches", verifyToken, createBranch);
  app.put("/api/branches/:id", verifyToken, updateBranch);
  app.delete("/api/branches/:id", verifyToken, deleteBranch);

  return app;
}
