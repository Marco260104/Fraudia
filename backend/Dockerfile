FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias necesarias para compilar ciertas librerías si hiciera falta
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar requerimientos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Exponer el puerto de la API FastAPI
EXPOSE 8000

# Comando para ejecutar el servidor con hot-reload
CMD ["python", "-m", "src.app.api"]
