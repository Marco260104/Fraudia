import sys
import os
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, BASE_DIR)

STEPS = [
    ("Generar proveedores", "src.ingestion.generate_proveedores", "generate"),
    ("Generar asegurados", "src.ingestion.generate_asegurados", "generate"),
    ("Generar polizas", "src.ingestion.generate_polizas", "generate"),
    ("Generar siniestros", "src.ingestion.generate_siniestros", "generate"),
    ("Generar documentos", "src.ingestion.generate_documentos", "generate"),
    ("Preprocesar datos", "src.features.preprocess", "main"),
    ("Entrenar modelos", "src.models.train_compare", "train_and_compare"),
]


def run_step(description: str, module_path: str, function_name: str) -> bool:
    print(f"\n{'='*60}")
    print(f"  {description}")
    print(f"{'='*60}")
    t0 = time.time()
    try:
        import importlib
        module = importlib.import_module(module_path)
        func = getattr(module, function_name)
        func()
        elapsed = time.time() - t0
        print(f"  Completado en {elapsed:.1f}s")
        return True
    except Exception as e:
        elapsed = time.time() - t0
        print(f"  ERROR despues de {elapsed:.1f}s: {e}")
        return False


def main():
    print("fraudIA - Pipeline Completo")
    print("Dataset: 12,500 siniestros (8% fraude)")
    print("Tablas: proveedores, asegurados, polizas, siniestros, documentos")
    print("Modelos: RandomForest, XGBoost, LightGBM")

    inicio_total = time.time()
    exitos = 0

    for description, module_path, function_name in STEPS:
        ok = run_step(description, module_path, function_name)
        if ok:
            exitos += 1
        else:
            print(f"\nPipeline abortado en: {description}")
            print("Corrige el error antes de continuar.")
            sys.exit(1)

    elapsed_total = time.time() - inicio_total
    print(f"\n{exitos}/{len(STEPS)} pasos ejecutados correctamente")
    print(f"Tiempo total: {elapsed_total:.1f}s")


if __name__ == "__main__":
    main()
