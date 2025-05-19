# Dockerfile for Node.js/Express Backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create a directory for user files if it doesn't exist
RUN mkdir -p user_files

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["node", "src/index.js"]
