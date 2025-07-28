# Use official Node.js LTS Alpine image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy all source code
COPY . .

# Build TypeScript project
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 4000

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/healthz || exit 1

# Start the application
CMD ["node", "dist/server.js"]
