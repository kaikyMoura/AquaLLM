# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Install production dependencies
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM base as build

# Install all dependencies (including dev dependencies for the build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the source files into the image
COPY . .

# Run the build script
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
FROM base as final

# Use production node environment by default

# Set working directory
WORKDIR /app

# Copy the production dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the built application from the build stage into the image
COPY --from=build /app/ ./

# Ensure correct permissions
RUN chown -R node:node /app

# Use a non-root user
USER node

COPY .env .env

RUN npx prisma migrate

RUN npx prisma generate

# Expose the port that the application listens on
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start"]
