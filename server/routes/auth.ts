import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { queries } from "../database.js";

const JWT_SECRET = process.env.JWT_SECRET || "tracker-secret-key-2024";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

// User registration schema
const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  role: z.enum(["employee", "manager", "admin"]).default("employee"),
});

export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Find user by username or email
    let user = queries.getUserByUsername.get(username) as any;
    if (!user) {
      user = queries.getUserByEmail.get(username) as any;
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password - handle both hashed and plain text for backward compatibility
    let isValidPassword = false;
    if (user.password.startsWith('$2b$')) {
      // Hashed password
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (for demo users)
      isValidPassword = password === user.password;
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        department: user.department,
        employeeId: user.employee_id,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup: RequestHandler = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      password,
      employeeId,
      department,
      role = "employee",
    } = signupSchema.parse(req.body);

    // Check if username or email already exists
    const existingUser = queries.getUserByUsername.get(username) || queries.getUserByEmail.get(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    try {
      const result = queries.createUser.run(
        username,
        email,
        hashedPassword,
        fullName,
        employeeId,
        department,
        role
      );

      const newUserId = result.lastInsertRowid as number;

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: newUserId,
          username,
          role,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.status(201).json({
        message: "Account created successfully",
        token,
        user: {
          id: newUserId,
          username,
          email,
          fullName,
          role,
          department,
          employeeId,
        },
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ message: "Username, email, or employee ID already exists" });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to verify JWT tokens
export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
