import pandas as pd
import numpy as np
from faker import Faker
import random
import os

SEED = 42
N_ASEGURADOS = 6_000
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "synthetic", "asegurados.csv")

random.seed(SEED)
np.random.seed(SEED)
fake = Faker("es_MX")
Faker.seed(SEED)

CIUDADES = [
    "Quito", "Guayaquil", "Cuenca", "Manta", "Ambato",
    "Loja", "Ibarra", "Riobamba", "Santo Domingo", "Machala",
    "Esmeraldas", "Tulcán", "Latacunga", "Portoviejo", "Babahoyo"
]

SEGMENTOS = {
    "Particular": 0.55,
    "Empresa pequeña": 0.25,
    "Empresa mediana": 0.15,
    "Empresa grande": 0.05,
}

PERFILES = {
    "bajo": 0.60,
    "medio": 0.30,
    "alto": 0.10,
}


def generar_asegurado(idx: int) -> dict:
    segmento = random.choices(list(SEGMENTOS.keys()), weights=list(SEGMENTOS.values()))[0]
    perfil = random.choices(list(PERFILES.keys()), weights=list(PERFILES.values()))[0]
    ciudad = random.choices(CIUDADES, weights=[25, 22, 10, 6, 5, 4, 4, 4, 5, 4, 2, 2, 3, 2, 2])[0]
    antiguedad_anios = round(random.uniform(0.1, 20.0), 1)

    if perfil == "bajo":
        n_polizas = random.randint(1, 3)
        reclamos_12m = random.choices([0, 1, 2], weights=[70, 25, 5])[0]
        mora_actual = random.choices([0, 1], weights=[92, 8])[0]
        score_cliente = round(random.uniform(70, 100), 1)
        total_siniestros = random.randint(0, 2)
    elif perfil == "medio":
        n_polizas = random.randint(1, 4)
        reclamos_12m = random.choices([0, 1, 2, 3], weights=[40, 35, 18, 7])[0]
        mora_actual = random.choices([0, 1], weights=[75, 25])[0]
        score_cliente = round(random.uniform(40, 69), 1)
        total_siniestros = random.randint(1, 5)
    else:
        n_polizas = random.randint(2, 6)
        reclamos_12m = random.choices([2, 3, 4, 5, 6], weights=[25, 30, 25, 12, 8])[0]
        mora_actual = random.choices([0, 1], weights=[45, 55])[0]
        score_cliente = round(random.uniform(0, 39), 1)
        total_siniestros = random.randint(3, 12)

    return {
        "id_asegurado": f"AS-{idx:05d}",
        "segmento": segmento,
        "ciudad": ciudad,
        "antiguedad_anios": antiguedad_anios,
        "n_polizas": n_polizas,
        "reclamos_12m": reclamos_12m,
        "total_siniestros_hist": total_siniestros,
        "mora_actual": mora_actual,
        "score_cliente": score_cliente,
        "perfil_riesgo": perfil,
    }


def generate():
    registros = [generar_asegurado(i) for i in range(1, N_ASEGURADOS + 1)]
    df = pd.DataFrame(registros)
    np.random.seed(SEED)
    df["score_cliente"] = (df["score_cliente"] + np.random.normal(0, 5, len(df))).clip(0, 100)
    df["reclamos_12m"] = (df["reclamos_12m"] + np.random.normal(0, 0.5, len(df))).clip(0).astype(int)
    df["total_siniestros_hist"] = (df["total_siniestros_hist"] + np.random.normal(0, 0.5, len(df))).clip(0).astype(int)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")
    print(f"asegurados.csv generado: {len(df)} registros")
    return df


if __name__ == "__main__":
    generate()
