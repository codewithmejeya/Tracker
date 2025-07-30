import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'tracker-secret-key-2024';

// User registration schema
const SignupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
  role: z.enum(['employee', 'manager', 'admin']).default('employee')
});

// In-memory user database (in production, use a real database)
interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password: string; // In production, hash this
  employeeId: string;
  department: string;
  role: 'employee' | 'manager' | 'admin';
  createdAt: string;
  isActive: boolean;
}

let users: User[] = [
  {
    id: 'user_001',
    fullName: 'Barath Kumar',
    email: 'barath@tracker.com',
    username: 'barath',
    password: '123456', // In production, this should be hashed
    employeeId: 'EMP001',
    department: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

// Generate unique user ID
function generateUserId(): string {
  const lastUser = users.sort((a, b) => a.id.localeCompare(b.id)).pop();
  if (!lastUser) return 'user_001';

  const lastNumber = parseInt(lastUser.id.substring(5));
  return `user_${String(lastNumber + 1).padStart(3, '0')}`;
}

// Hardcoded credentials for demo (keeping original login working)
const DEMO_CREDENTIALS = {
  username: 'barath',
  password: '123456'
};

export const login: RequestHandler = (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find user in database
  const user = users.find(u => u.username === username && u.isActive);

  // Check credentials
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      username: user.username,
      userId: user.id,
      role: user.role,
      employeeId: user.employeeId
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      employeeId: user.employeeId,
      department: user.department,
      role: user.role
    }
  });
};

// Signup endpoint
export const signup: RequestHandler = (req, res) => {
  try {
    const validatedData = SignupSchema.parse(req.body);

    // Check if username or email already exists
    const existingUser = users.find(u =>
      u.username === validatedData.username ||
      u.email === validatedData.email ||
      u.employeeId === validatedData.employeeId
    );

    if (existingUser) {
      if (existingUser.username === validatedData.username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.email === validatedData.email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (existingUser.employeeId === validatedData.employeeId) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }
    }

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      fullName: validatedData.fullName,
      email: validatedData.email,
      username: validatedData.username,
      password: validatedData.password, // In production, hash this
      employeeId: validatedData.employeeId,
      department: validatedData.department,
      role: validatedData.role,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);

    // Return success (don't include password)
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      message: 'Account created successfully',
      user: userResponse
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to verify JWT tokens
export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
