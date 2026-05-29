FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias del sistema incluyendo postgresql-client para verificar DB
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar requerimientos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el codigo del backend (incluye start.sh, DataEnt/, src/, etc.)
COPY . .

# Dar permisos de ejecucion al script de arranque
RUN chmod +x /app/start.sh

# Exponer el puerto de la API FastAPI
EXPOSE 8000

# Usar el script de arranque que inicializa la DB con los CSVs y luego inicia el servidor
CMD ["/app/start.sh"]
