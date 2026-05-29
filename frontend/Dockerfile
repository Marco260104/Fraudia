FROM node:20-slim

WORKDIR /app

# Copiar dependencias e instalarlas (omitiendo package-lock.json para forzar binarios de linux)
COPY package.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto por defecto de Vite
EXPOSE 5173

# Ejecutar Vite y forzar la escucha en la interfaz 0.0.0.0 para que sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
