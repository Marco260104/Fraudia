FROM node:20-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./

# Force clean install of native optional dependencies (critical for Vite 6+/Rolldown on Linux)
# This fixes the common "Cannot find native binding @rolldown/binding-linux-x64-gnu" error
RUN npm ci --no-audit --no-fund --include=optional && \
    npm cache clean --force

# Copy source code (will be overridden by volume mount in dev)
COPY . .

# Expose Vite port
EXPOSE 5173

# Important: force host 0.0.0.0 so it's reachable from outside the container (Windows/WSL)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
