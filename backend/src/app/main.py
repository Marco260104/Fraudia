from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    summary_path = Path(__file__).resolve().parents[2] / "models" / "training_summary.json"
    if not summary_path.exists():
        print("No hay un entrenamiento guardado todavía. Ejecuta primero `python -m src.pipeline.run_all`.")
        return
    print(summary_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()

