/**
 * Production server entry point for Railway deployment
 */
import { createServer } from './index.js';

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 Tracker Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/ping`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/login`);
  console.log(`📈 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
