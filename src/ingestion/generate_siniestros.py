import pandas as pd
import numpy as np
from faker import Faker
from datetime import date, timedelta
import random
import os

SEED = 42
N_TOTAL = 12_500
N_FRAUDE = 1_000
N_LEGITIMOS = N_TOTAL - N_FRAUDE
HOY = date(2025, 6, 1)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
PROVEEDORES_PATH = os.path.join(BASE_DIR, "data", "synthetic", "proveedores.csv")
ASEGURADOS_PATH = os.path.join(BASE_DIR, "data", "synthetic", "asegurados.csv")
POLIZAS_PATH = os.path.join(BASE_DIR, "data", "synthetic", "polizas.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "synthetic", "siniestros.csv")

random.seed(SEED)
np.random.seed(SEED)
fake = Faker("es_MX")
Faker.seed(SEED)

COBERTURAS_POR_RAMO = {
    "Vehículos": ["Choque", "Robo total", "Robo parcial", "Pérdida total por robo (PTxRB)",
                   "Daños materiales", "Responsabilidad civil (RC)", "Cristales"],
    "Salud": ["Hospitalización", "Cirugía", "Consulta externa", "Urgencias",
              "Medicamentos", "Exámenes diagnóstico"],
    "Vida": ["Muerte accidental", "Incapacidad permanente", "Enfermedades graves"],
    "Hogar": ["Incendio", "Robo contenido", "Daños agua", "Terremoto", "Rotura maquinaria"],
    "Generales": ["Responsabilidad civil", "Transporte", "Incendio industrial",
                   "Robo establecimiento", "Daños equipos"],
}

ESTADOS_SINIESTRO = {
    "Reserva": 0.20, "Pago Total": 0.30, "Pago Parcial": 0.15,
    "Anticipo": 0.08, "Negativa": 0.12,
    "Cierre Sin Consecuencia": 0.10, "Liquidado": 0.05,
}

TIPOS_BENEFICIARIO = {
    "Taller mecánico": 0.35, "Clínica": 0.25, "Perito independiente": 0.18,
    "Grúa / asistencia": 0.10, "Abogado / gestor": 0.07, "Farmacia": 0.05,
}

SUCURSALES = ["Quito Norte", "Quito Sur", "Guayaquil", "Cuenca", "Manta",
              "Ambato", "Loja", "Ibarra", "Riobamba", "Santo Domingo"]

NARRATIVAS_LEGITIMAS = [
    "El vehículo fue impactado por detrás mientras se encontraba detenido en el semáforo de la Av. {calle} con {calle2}. El conductor del otro vehículo reconoció su responsabilidad y se tomaron fotos del lugar.",
    "Durante la madrugada del {dia} de {mes} el asegurado reportó que al regresar al estacionamiento encontró el vehículo con los vidrios rotos y el estéreo sustraído. Presentó la denuncia policial correspondiente.",
    "El asegurado sufrió un resbalón en el trabajo que ocasionó fractura de {hueso}. Fue atendido en urgencias del Hospital {hospital} y requirió cirugía.",
    "El vehículo perdió el control en la curva de la vía {via} a causa de la lluvia intensa. Impactó contra el bordillo lateral. No hubo personas heridas.",
    "Se reporta incendio en la cocina del inmueble asegurado a causa de un cortocircuito. El daño afectó principalmente {zona} de la vivienda.",
    "El asegurado fue diagnosticado con {enfermedad} y requirió hospitalización por {dias_hosp} días en la Clínica {clinica}. Se adjuntan informes médicos completos.",
    "Colisión en el estacionamiento del {lugar} mientras se realizaba una maniobra de reversa. Daños en la parte trasera del vehículo y en el vehículo de tercero identificado.",
    "La motocicleta del asegurado fue sustraída del parqueadero de {lugar2} durante las horas de la tarde del {dia} de {mes}. Se presentó denuncia ante la Fiscalía.",
]

NARRATIVAS_FRAUDE = [
    "El vehículo fue golpeado en la parte frontal por un tercero que se dio a la fuga sin identificarse. No hay testigos del hecho.",
    "El asegurado reporta que el vehículo fue impactado mientras estaba estacionado por un conductor desconocido que huyó. No existen cámaras en el sector.",
    "Se reporta robo total del vehículo en la madrugada. No hay testigos, no existen cámaras y el vehículo no fue recuperado.",
    "El vehículo sufrió pérdida total al impactar contra un poste en la vía rápida. El conductor reporta que el tercero que causó el accidente se fugó.",
    "Robo a mano armada del vehículo asegurado. Los delincuentes actuaron en grupo y huyeron. No se pudo identificar a ninguno.",
    "El vehículo fue encontrado incendiado en una vía secundaria. Se desconoce el origen del fuego. No hay testigos.",
    "El asegurado reporta choque con pérdida total. El tercero involucrado no portaba seguro y se dio a la fuga antes de que llegara la autoridad.",
]


def narrativa_legitima() -> str:
    plantilla = random.choice(NARRATIVAS_LEGITIMAS)
    return plantilla.format(
        calle=fake.street_name(), calle2=fake.street_name(),
        dia=random.randint(1, 28), mes=fake.month_name(),
        hueso=random.choice(["tobillo derecho", "muñeca izquierda", "rodilla", "clavícula"]),
        hospital=fake.last_name() + " " + random.choice(["General", "Metropolitano", "del Valle"]),
        via=f"E{random.randint(10, 99)}",
        zona=random.choice(["la cocina y el comedor", "el área de lavandería", "el cuarto principal"]),
        enfermedad=random.choice(["apendicitis aguda", "hernia inguinal", "fractura de cadera",
                                   "infección respiratoria grave", "cálculos renales"]),
        dias_hosp=random.randint(2, 12), clinica=fake.last_name(),
        lugar=random.choice(["Centro Comercial El Recreo", "Supermercado La Favorita",
                              "edificio de oficinas", "hospital universitario"]),
        lugar2=random.choice(["la universidad", "el trabajo", "el centro comercial",
                               "el estadio", "la iglesia"]),
    )


def narrativa_fraude() -> str:
    plantilla = random.choices(NARRATIVAS_FRAUDE, weights=[25, 25, 20, 10, 10, 5, 5])[0]
    return plantilla


def generar_siniestro(idx: int, poliza: dict, asegurado: dict, proveedor: dict, es_fraude: bool) -> dict:
    ramo = poliza["ramo"]
    coberturas = COBERTURAS_POR_RAMO.get(ramo, ["Daño general"])
    if es_fraude and ramo == "Vehículos":
        coberturas_fraude = [c for c in coberturas if any(k in c for k in ["PTxRB", "Robo total", "Pérdida total"])]
        cobertura = random.choice(coberturas_fraude) if coberturas_fraude else random.choice(coberturas)
    else:
        cobertura = random.choice(coberturas)

    fecha_inicio_poliza = date.fromisoformat(poliza["fecha_inicio"])
    fecha_fin_poliza = date.fromisoformat(poliza["fecha_fin"])
    duracion_poliza = (fecha_fin_poliza - fecha_inicio_poliza).days

    if es_fraude:
        tipo_borde = random.random()
        if tipo_borde < 0.25:
            dias_desde_inicio = random.randint(1, 20)
        elif tipo_borde < 0.40:
            dias_desde_inicio = max(1, duracion_poliza - random.randint(1, 20))
        else:
            dias_desde_inicio = random.randint(21, max(22, duracion_poliza - 1))
    else:
        mu = duracion_poliza * 0.5
        sigma = duracion_poliza * 0.25
        dias_desde_inicio = int(np.clip(np.random.normal(mu, sigma), 1, duracion_poliza - 1))

    fecha_ocurrencia = fecha_inicio_poliza + timedelta(days=dias_desde_inicio)

    if es_fraude:
        dias_reporte = random.choices([0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 14, 21, 30],
                                       weights=[5, 10, 10, 10, 8, 8, 8, 8, 8, 8, 7, 5, 5])[0]
    else:
        dias_reporte = random.choices([0, 1, 2, 3, 4, 5, 6, 7, 8, 10],
                                       weights=[25, 30, 20, 10, 5, 3, 3, 2, 1, 1])[0]

    fecha_reporte = fecha_ocurrencia + timedelta(days=dias_reporte)
    suma_asegurada = poliza["suma_asegurada"]

    if es_fraude:
        monto_estimado = round(random.uniform(suma_asegurada * 0.10, suma_asegurada * 0.90), 2)
        ratio_inflacion = round(random.uniform(1.2, 2.5), 2)
        monto_reclamado = round(monto_estimado * ratio_inflacion, 2)
        if random.random() < 0.20:
            monto_reclamado = round(suma_asegurada * random.uniform(0.90, 1.05), 2)
    else:
        monto_estimado = round(random.uniform(suma_asegurada * 0.05, suma_asegurada * 0.70), 2)
        monto_reclamado = round(monto_estimado * random.uniform(0.90, 1.15), 2)

    estado = random.choices(list(ESTADOS_SINIESTRO.keys()), weights=list(ESTADOS_SINIESTRO.values()))[0]
    if estado == "Pago Total":
        monto_pagado = monto_estimado
    elif estado == "Pago Parcial":
        monto_pagado = round(monto_estimado * random.uniform(0.30, 0.80), 2)
    elif estado == "Anticipo":
        monto_pagado = round(monto_estimado * random.uniform(0.10, 0.30), 2)
    else:
        monto_pagado = 0.0

    documentos_completos = random.choices(["Sí", "No"], weights=[45, 55])[0] if es_fraude else random.choices(["Sí", "No"], weights=[90, 10])[0]
    hist = random.choices([0, 1, 2, 3, 4, 5, 6, 7], weights=[5, 10, 15, 25, 20, 12, 8, 5])[0] if es_fraude else random.choices([0, 1, 2, 3, 4], weights=[50, 28, 13, 6, 3])[0]
    descripcion = narrativa_fraude() if es_fraude else narrativa_legitima()
    dias_fin_poliza_var = (fecha_fin_poliza - fecha_ocurrencia).days

    return {
        "id_siniestro": f"SIN-{idx:06d}",
        "id_poliza": poliza["id_poliza"],
        "id_asegurado": poliza["id_asegurado"],
        "id_proveedor": proveedor["id_proveedor"],
        "ramo": ramo,
        "cobertura": cobertura,
        "fecha_ocurrencia": fecha_ocurrencia.isoformat(),
        "fecha_reporte": fecha_reporte.isoformat(),
        "monto_reclamado": monto_reclamado,
        "monto_estimado": monto_estimado,
        "monto_pagado": monto_pagado,
        "suma_asegurada_poliza": suma_asegurada,
        "estado": estado,
        "sucursal": random.choice(SUCURSALES),
        "descripcion": descripcion,
        "documentos_completos": documentos_completos,
        "beneficiario_tipo": proveedor["tipo"],
        "proveedor_en_lista_restrictiva": proveedor["en_lista_restrictiva"],
        "dias_inicio_poliza": dias_desde_inicio,
        "dias_fin_poliza": dias_fin_poliza_var,
        "dias_ocurrencia_reporte": dias_reporte,
        "historial_siniestros_asegurado": hist,
        "score_cliente_asegurado": asegurado["score_cliente"],
        "mora_actual_asegurado": asegurado["mora_actual"],
        "etiqueta_fraude": int(es_fraude),
    }


def generate():
    proveedores = pd.read_csv(PROVEEDORES_PATH)
    asegurados = pd.read_csv(ASEGURADOS_PATH)
    polizas = pd.read_csv(POLIZAS_PATH)
    proveedores_list = proveedores.to_dict("records")
    asegurados_map = dict(zip(asegurados["id_asegurado"], asegurados.to_dict("records")))
    polizas_list = polizas.to_dict("records")
    provs_restrictivos = [p for p in proveedores_list if p["en_lista_restrictiva"] == 1]
    provs_legitimos = [p for p in proveedores_list if p["en_lista_restrictiva"] == 0]

    polizas_elegidas = random.choices(polizas_list, k=N_TOTAL)
    registros = []
    flags_fraude = [True] * N_FRAUDE + [False] * N_LEGITIMOS
    random.shuffle(flags_fraude)

    for idx, (poliza, es_fraude) in enumerate(zip(polizas_elegidas, flags_fraude), start=1):
        id_as = poliza["id_asegurado"]
        asegurado = asegurados_map.get(id_as, asegurados.sample(1).to_dict("records")[0])
        if es_fraude:
            proveedor = random.choice(provs_restrictivos) if (random.random() < 0.40 and provs_restrictivos) else random.choice(provs_legitimos)
        else:
            proveedor = random.choice(provs_restrictivos) if (random.random() < 0.03 and provs_restrictivos) else random.choice(provs_legitimos)
        registros.append(generar_siniestro(idx, poliza, asegurado, proveedor, es_fraude))

    df = pd.DataFrame(registros)
    df = df.sample(frac=1, random_state=SEED).reset_index(drop=True)
    np.random.seed(SEED)
    df["monto_reclamado"] = (df["monto_reclamado"] * np.random.normal(1, 0.08, len(df))).clip(100)
    df["monto_estimado"] = (df["monto_estimado"] * np.random.normal(1, 0.06, len(df))).clip(100)
    df["dias_ocurrencia_reporte"] = (df["dias_ocurrencia_reporte"] + np.random.normal(0, 1.5, len(df))).clip(0).astype(int)
    df["dias_inicio_poliza"] = (df["dias_inicio_poliza"] + np.random.normal(0, 5, len(df))).clip(1).astype(int)
    df["historial_siniestros_asegurado"] = (df["historial_siniestros_asegurado"] + np.random.normal(0, 0.3, len(df))).clip(0).astype(int)

    n_flip = int(len(df) * 0.03)
    flip_idx = np.random.choice(df.index, n_flip, replace=False)
    df.loc[flip_idx, "etiqueta_fraude"] = 1 - df.loc[flip_idx, "etiqueta_fraude"]
    df["etiqueta_fraude"] = df["etiqueta_fraude"].astype(int)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")
    print(f"siniestros.csv generado: {len(df):,} registros")
    return df


if __name__ == "__main__":
    generate()
