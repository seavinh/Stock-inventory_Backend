# Use the official Node.js 20 Alpine LTS image for a smaller footprint
FROM node:20-alpine

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker build cache
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the API port configured in .env (default is 3000)
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
