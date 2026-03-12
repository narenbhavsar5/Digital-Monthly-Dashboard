# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Set environment variable at build time (Vite bakes this into the build)
ARG VITE_GRAPHQL_URL
ENV VITE_GRAPHQL_URL=${VITE_GRAPHQL_URL}

RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx config to serve custom SPA config
RUN rm /etc/nginx/conf.d/default.conf

# Create custom nginx configuration to handle React Router / Vite routing
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Copy production build folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
