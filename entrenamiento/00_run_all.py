"""Ejecuta todos los scripts de generación en orden."""

import subprocess
import sys
import time
import os

SCRIPTS_DIR = os.path.dirname(__file__)

SCRIPTS = [
    "01_generate_proveedores.py",
    "02_generate_asegurados.py",
    "03_generate_polizas.py",
    "04_generate_siniestros.py",
    "05_generate_documentos.py",
]


def run_script(nombre: str) -> bool:
    ruta = os.path.join(SCRIPTS_DIR, nombre)
    print(f"\nEjecutando: {nombre}")

    t0 = time.time()
    resultado = subprocess.run(
        [sys.executable, ruta],
        capture_output=False,
        text=True
    )
    elapsed = time.time() - t0

    if resultado.returncode == 0:
        print(f"   Tiempo: {elapsed:.1f}s")
        return True
    else:
        print(f"\nERROR en {nombre} (código {resultado.returncode})")
        return False


def main():
    print("fraudIA - Generador de Dataset Sintetico")
    print("Dataset: 10,000 siniestros (92% legitimos / 8% fraude)")
    print("Tablas: proveedores, asegurados, polizas, siniestros, documentos")

    inicio_total = time.time()
    exitos = 0

    for script in SCRIPTS:
        ok = run_script(script)
        if ok:
            exitos += 1
        else:
            print(f"\nAbortando: {script} fallo. Corrige el error antes de continuar.")
            sys.exit(1)

    elapsed_total = time.time() - inicio_total

    print(f"\n{exitos}/{len(SCRIPTS)} scripts ejecutados correctamente")
    print(f"Tiempo total: {elapsed_total:.1f}s")
    print(f"Archivos en: data/synthetic/")


if __name__ == "__main__":
    main()
