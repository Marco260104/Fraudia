from __future__ import annotations

from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
DATAENT_DIR = BACKEND_DIR / "DataEnt"
DATA_DIR = BACKEND_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
MODELS_DIR = BACKEND_DIR / "models"
REPORTS_DIR = BACKEND_DIR / "reports"
ARTIFACTS_DIR = BACKEND_DIR / "artifacts"

for directory in (DATA_DIR, RAW_DIR, PROCESSED_DIR, MODELS_DIR, REPORTS_DIR, ARTIFACTS_DIR):
    directory.mkdir(parents=True, exist_ok=True)

