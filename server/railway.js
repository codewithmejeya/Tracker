/**
 * Simple JavaScript entry point for Railway deployment
 * This avoids TypeScript compilation issues during deployment
 */

// Import required modules
import { createServer } from './index.js';

const PORT = process.env.PORT || 3000;

// Create and start the server
const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 Tracker Backend Server running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/ping`);
  console.log(`🔐 Auth Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`📈 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
