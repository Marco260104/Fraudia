import pandas as pd
import numpy as np
from faker import Faker
from datetime import date, timedelta
import random
import os

SEED = 42
N_POLIZAS = 8_000
HOY = date(2025, 6, 1)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
ASEGURADOS_PATH = os.path.join(BASE_DIR, "data", "synthetic", "asegurados.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "synthetic", "polizas.csv")

random.seed(SEED)
np.random.seed(SEED)
fake = Faker("es_MX")
Faker.seed(SEED)

CIUDADES = [
    "Quito", "Guayaquil", "Cuenca", "Manta", "Ambato",
    "Loja", "Ibarra", "Riobamba", "Santo Domingo", "Machala"
]

RAMOS = {
    "Vehículos": 0.50,
    "Salud": 0.20,
    "Vida": 0.15,
    "Hogar": 0.10,
    "Generales": 0.05,
}

CANALES_VENTA = {
    "Agente": 0.45,
    "Corredor": 0.25,
    "Digital": 0.20,
    "Bancaseguros": 0.10,
}

PARAMETROS_RAMO = {
    "Vehículos": {"prima": (300, 2_500), "suma": (5_000, 80_000), "deducible": (200, 1_500)},
    "Salud": {"prima": (600, 4_000), "suma": (10_000, 100_000), "deducible": (100, 800)},
    "Vida": {"prima": (400, 3_000), "suma": (20_000, 200_000), "deducible": (0, 0)},
    "Hogar": {"prima": (200, 1_500), "suma": (15_000, 120_000), "deducible": (300, 2_000)},
    "Generales": {"prima": (500, 5_000), "suma": (10_000, 500_000), "deducible": (500, 5_000)},
}

DURACION_MESES = {6: 0.10, 12: 0.75, 24: 0.15}


def fecha_aleatoria_inicio() -> date:
    dias_atras = random.randint(30, 5 * 365)
    return HOY - timedelta(days=dias_atras)


def generar_poliza(idx: int, id_asegurado: str, ciudad_asegurado: str) -> dict:
    ramo = random.choices(list(RAMOS.keys()), weights=list(RAMOS.values()))[0]
    canal = random.choices(list(CANALES_VENTA.keys()), weights=list(CANALES_VENTA.values()))[0]
    duracion = random.choices(list(DURACION_MESES.keys()), weights=list(DURACION_MESES.values()))[0]
    fecha_inicio = fecha_aleatoria_inicio()
    fecha_fin = fecha_inicio + timedelta(days=duracion * 30)
    estado_poliza = "Vigente" if fecha_fin >= HOY else "Vencida"
    params = PARAMETROS_RAMO[ramo]
    prima = round(random.uniform(*params["prima"]), 2)
    suma_asegurada = round(random.uniform(*params["suma"]), 2)
    deducible = 0.0 if params["deducible"][1] == 0 else round(random.uniform(*params["deducible"]), 2)
    ciudad = ciudad_asegurado if random.random() > 0.10 else random.choice(CIUDADES)

    return {
        "id_poliza": f"POL-{idx:06d}",
        "id_asegurado": id_asegurado,
        "ramo": ramo,
        "fecha_inicio": fecha_inicio.isoformat(),
        "fecha_fin": fecha_fin.isoformat(),
        "prima": prima,
        "suma_asegurada": suma_asegurada,
        "deducible": deducible,
        "canal_venta": canal,
        "ciudad": ciudad,
        "estado_poliza": estado_poliza,
        "duracion_meses": duracion,
    }


def generate():
    asegurados = pd.read_csv(ASEGURADOS_PATH)
    ids_asegurados = asegurados["id_asegurado"].tolist()
    ciudades_map = dict(zip(asegurados["id_asegurado"], asegurados["ciudad"]))
    pesos = asegurados["n_polizas"].values.astype(float)
    pesos = pesos / pesos.sum()
    asegurados_elegidos = np.random.choice(ids_asegurados, size=N_POLIZAS, replace=True, p=pesos)

    registros = []
    for idx, id_as in enumerate(asegurados_elegidos, start=1):
        ciudad_as = ciudades_map.get(id_as, "Quito")
        registros.append(generar_poliza(idx, id_as, ciudad_as))

    df = pd.DataFrame(registros)
    np.random.seed(SEED)
    df["prima"] = (df["prima"] * np.random.normal(1, 0.05, len(df))).clip(50)
    df["suma_asegurada"] = (df["suma_asegurada"] * np.random.normal(1, 0.03, len(df))).clip(1000)
    df["deducible"] = (df["deducible"] + np.random.normal(0, 50, len(df))).clip(0)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")
    print(f"polizas.csv generado: {len(df)} registros")
    return df


if __name__ == "__main__":
    generate()
