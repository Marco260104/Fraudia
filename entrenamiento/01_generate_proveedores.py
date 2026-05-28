"""Genera la tabla de proveedores sinteticos. Salida: data/synthetic/proveedores.csv (~200 registros)"""

import pandas as pd
import numpy as np
from faker import Faker
import random
import os

# Configuración
SEED = 42
N_PROVEEDORES = 200
N_RESTRICTIVOS = 20
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "synthetic", "proveedores.csv")

random.seed(SEED)
np.random.seed(SEED)
fake = Faker("es_MX")
Faker.seed(SEED)

# Catálogos
CIUDADES = [
    "Quito", "Guayaquil", "Cuenca", "Manta", "Ambato",
    "Loja", "Ibarra", "Riobamba", "Santo Domingo", "Machala"
]

TIPOS_PROVEEDOR = {
    "Taller mecánico":     0.35,
    "Clínica":             0.20,
    "Hospital":            0.10,
    "Perito independiente":0.15,
    "Farmacia":            0.05,
    "Grúa / asistencia":   0.08,
    "Abogado / gestor":    0.07,
}

NOMBRES_TALLER = [
    "Taller AutoFix", "Mecánica Express", "Colisiones del Norte",
    "AutoCenter Premium", "Mecánica Veloz", "Reparaciones Rápidas",
    "Taller San Andrés", "AutoPro Service", "Mecánica Total",
    "Centro Automotriz Andino"
]

NOMBRES_CLINICA = [
    "Clínica Santa María", "Hospital Los Andes", "MedCenter",
    "Clínica del Valle", "Centro Médico Integral", "Clínica Moderna",
    "Hospital San Francisco", "MedExpress", "Clínica Pichincha",
    "Centro de Salud Andina"
]

NOMBRES_PERITO = [
    "Pericias Técnicas SA", "Evaluaciones Profesionales", "PeritajeEcuador",
    "Inspecciones Andinas", "TécnicosPericiales Cia.", "Expertos en Daños"
]

NOMBRES_GENERICO = [
    "Servicios Profesionales", "Asistencia Vial Nacional", "Gestoría Legal Express",
    "Farmacia Central", "Grúas del Pacífico", "Asistencia 24h"
]

def nombre_proveedor(tipo: str, idx: int) -> str:
    if "Taller" in tipo or "mecánico" in tipo.lower():
        base = random.choice(NOMBRES_TALLER)
    elif "Clínica" in tipo or "Hospital" in tipo:
        base = random.choice(NOMBRES_CLINICA)
    elif "Perito" in tipo:
        base = random.choice(NOMBRES_PERITO)
    else:
        base = random.choice(NOMBRES_GENERICO)
    return f"{base} #{idx:03d}"


# Generación
def generar_proveedor(idx: int, en_lista_restrictiva: bool) -> dict:
    tipo = random.choices(
        list(TIPOS_PROVEEDOR.keys()),
        weights=list(TIPOS_PROVEEDOR.values())
    )[0]

    ciudad = random.choice(CIUDADES)
    antiguedad = round(random.uniform(0.5, 20.0), 1)

    # Proveedores restrictivos: mas reclamos, montos mas altos, mas casos observados
    if en_lista_restrictiva:
        reclamos_asociados    = random.randint(25, 120)
        monto_promedio        = round(random.uniform(3_500, 15_000), 2)
        porcentaje_observados = round(random.uniform(35.0, 80.0), 1)
    else:
        reclamos_asociados    = random.randint(1, 40)
        monto_promedio        = round(random.uniform(300, 6_000), 2)
        porcentaje_observados = round(random.uniform(0.0, 15.0), 1)

    return {
        "id_proveedor":             f"PROV-{idx:04d}",
        "nombre":                   nombre_proveedor(tipo, idx),
        "tipo":                     tipo,
        "ciudad":                   ciudad,
        "reclamos_asociados":       reclamos_asociados,
        "monto_promedio_reclamado": monto_promedio,
        "porcentaje_casos_observados": porcentaje_observados,
        "antiguedad_anios":         antiguedad,
        "en_lista_restrictiva":     int(en_lista_restrictiva),
        "activo":                   1,
    }


def main():
    registros = []

    # Primeros N_RESTRICTIVOS son restrictivos, el resto legitimos
    for i in range(1, N_RESTRICTIVOS + 1):
        registros.append(generar_proveedor(i, en_lista_restrictiva=True))

    for i in range(N_RESTRICTIVOS + 1, N_PROVEEDORES + 1):
        registros.append(generar_proveedor(i, en_lista_restrictiva=False))

    # Mezclar para que los restrictivos no queden al inicio del archivo
    random.shuffle(registros)

    df = pd.DataFrame(registros)

    # Ruido realista en columnas numericas
    np.random.seed(SEED)
    df["reclamos_asociados"] = (df["reclamos_asociados"] + np.random.normal(0, 2, len(df))).clip(0).astype(int)
    df["monto_promedio_reclamado"] = (df["monto_promedio_reclamado"] * np.random.normal(1, 0.05, len(df))).clip(100)
    df["porcentaje_casos_observados"] = (df["porcentaje_casos_observados"] + np.random.normal(0, 2, len(df))).clip(0, 100)
    df["antiguedad_anios"] = (df["antiguedad_anios"] + np.random.normal(0, 0.5, len(df))).clip(0.1)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")

    print(f"proveedores.csv generado: {len(df)} registros")
    print(f"   En lista restrictiva: {df['en_lista_restrictiva'].sum()}")
    print(f"   Legitimos: {(df['en_lista_restrictiva'] == 0).sum()}")
    print(f"   Tipos: {df['tipo'].value_counts().to_dict()}")


if __name__ == "__main__":
    main()
