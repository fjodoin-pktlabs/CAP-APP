# Use the official Node.js image as the base for the build stage
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Use a smaller Node.js image for the production stage
FROM node:20-alpine as runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Install only production dependencies
RUN npm install --production --legacy-peer-deps

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "run", "start"]

