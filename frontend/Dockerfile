# syntax=docker/dockerfile:1

# Stage 1: Building the React application
FROM node:16 as build

WORKDIR /app
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the source code of the app (the rest of the files)
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine

# Copy the build from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom nginx.conf if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside once the container has launched
EXPOSE 3001

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
