# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Build args para variables de entorno de Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund --include=optional && \
    npm cache clean --force

COPY . .
RUN npm run build

# Stage 2: Serve con nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Configuracion nginx para React Router (SPA)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
