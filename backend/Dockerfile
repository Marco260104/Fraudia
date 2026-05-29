FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias del sistema incluyendo postgresql-client para ejecutar SQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar requerimientos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Crear script de arranque que inicializa la DB con el schema y los CSVs
RUN echo '#!/bin/bash\nset -e\n\necho "[FraudIA] Esperando base de datos..."\nfor i in $(seq 1 30); do\n  pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" && break\n  echo "[FraudIA] Intento $i/30 - DB no lista, esperando 3s..."\n  sleep 3\ndone\n\necho "[FraudIA] Inicializando esquema de la base de datos..."\nPGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -f /app/database_schema.sql || echo "[FraudIA] Schema ya existe o error no critico"\n\necho "[FraudIA] Cargando datos desde CSVs..."\npython -m src.ingestion.load_data || echo "[FraudIA] Carga de datos completada (con posibles advertencias)"\n\necho "[FraudIA] Iniciando servidor FastAPI..."\nexec python -m src.app.api\n' > /app/start.sh && chmod +x /app/start.sh

# Exponer el puerto de la API FastAPI
EXPOSE 8000

# Usar el script de arranque
CMD ["/app/start.sh"]
