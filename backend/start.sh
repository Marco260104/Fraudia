#!/bin/bash
set -e

echo "[FraudIA] Esperando base de datos..."
for i in $(seq 1 30); do
  pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" && break
  echo "[FraudIA] Intento $i/30 - DB no disponible, esperando 3s..."
  sleep 3
done

echo "[FraudIA] Cargando datos desde CSVs a la base de datos..."
cd /app
python -m src.ingestion.load_data
echo "[FraudIA] Datos cargados correctamente."

echo "[FraudIA] Iniciando servidor FastAPI..."
exec python -m src.app.api
