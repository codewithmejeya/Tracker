# Deployment Guide

## Current Issue and Solutions

The Tracker application consists of two parts:
1. **Frontend** (React SPA) - Can be deployed to Cloudflare Pages, Netlify, Vercel, etc.
2. **Backend** (Express server with API) - Needs a Node.js runtime environment

### Problem
You deployed only the frontend to Cloudflare Pages, but the backend API is missing, causing network errors when trying to login.

## Solution Options

### Option 1: Deploy to Netlify (Recommended)
The application is already configured for Netlify with functions support.

1. Connect your repository to Netlify
2. Set build command: `npm run build:client`
3. Set publish directory: `dist/spa`
4. Deploy

The `netlify.toml` file will automatically handle API routing to Netlify Functions.

### Option 2: Deploy Backend Separately
Deploy the backend to a separate service and configure the frontend to use it.

#### Deploy Backend to Railway/Render/Vercel:
1. Create a new service on Railway, Render, or Vercel
2. Deploy the backend code (server folder)
3. Note the deployed API URL (e.g., `https://tracker-api.railway.app`)

#### Configure Frontend:
1. In your Cloudflare Pages environment variables, add:
   ```
   VITE_API_URL=https://tracker-api.railway.app
   ```
2. Redeploy your Cloudflare Pages site

### Option 3: Full Stack Deployment on Single Platform

#### Vercel:
- Supports both frontend and serverless functions
- Move server code to `api/` folder
- Update API calls to use `/api/` prefix

#### Railway:
- Supports full-stack deployment
- Can host both frontend and backend together

## Environment Variables

For production deployment, you may need to set:

```env
VITE_API_URL=https://your-backend-url.com
JWT_SECRET=your-secure-jwt-secret
PORT=3000
```

## Testing the Fix

After deploying the backend and configuring the environment variables:

1. Visit your deployed frontend
2. Try logging in with demo credentials:
   - Username: `barath`
   - Password: `123456`
3. You should be able to access the dashboard

## Current Demo Credentials

The application includes these demo users:
- Admin: `admin/admin123`
- Manager: `manager/manager123`
- Employee: `barath/123456`

## Notes

- The current backend uses in-memory storage (data resets on restart)
- For production, consider using a persistent database
- Ensure CORS is configured properly for your frontend domain
- Set appropriate JWT secrets and expiration times
