# Dockerfile for React Frontend
# Stage 1: Build the React application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
# Set environment variable for backend API URL
ENV VITE_API_URL=http://localhost:5000
RUN npm run build

# Stage 2: Serve the built application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built app from the build stage
COPY --from=build /app/dist /app

# Expose port 3000
EXPOSE 3000

# Start the application with serve
# Use --single flag for SPA routing and --debug for detailed logs
CMD ["serve", "-s", ".", "-l", "3000", "--single", "--debug"]
