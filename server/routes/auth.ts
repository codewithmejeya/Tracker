import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'digitrac-secret-key-2024';

// Hardcoded credentials as specified
const VALID_CREDENTIALS = {
  username: 'barath',
  password: '123456'
};

export const login: RequestHandler = (req, res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check credentials
  if (username !== VALID_CREDENTIALS.username || password !== VALID_CREDENTIALS.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { username, userId: 'user_barath' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      username,
      id: 'user_barath'
    }
  });
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
