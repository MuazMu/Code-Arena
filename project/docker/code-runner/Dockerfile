FROM node:18-alpine

# Install required build tools and languages
RUN apk add --no-cache \
    python3 \
    openjdk11 \
    gcc \
    g++ \
    make

# Create non-root user
RUN addgroup -S coderunner && adduser -S coderunner -G coderunner

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using npm install instead of npm ci
RUN npm install

# Copy source files
COPY . .

# Switch to non-root user
USER coderunner

# Start the code runner service
CMD ["npm", "start"]