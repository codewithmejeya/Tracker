# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for tsx)
RUN npm install

# Copy source code
COPY . .

# Create data directory for SQLite
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the server with tsx for TypeScript support
CMD ["npx", "tsx", "server/production.ts"]
