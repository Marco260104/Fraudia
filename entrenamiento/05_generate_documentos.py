"""Genera la tabla de documentos asociados a cada siniestro. Salida: data/synthetic/documentos.csv"""

import pandas as pd
import numpy as np
from faker import Faker
from datetime import date, timedelta
import random
import os

# Configuración
SEED = 42
HOY  = date(2025, 6, 1)

SINIESTROS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "synthetic", "siniestros.csv")
OUTPUT_PATH     = os.path.join(os.path.dirname(__file__), "..", "data", "synthetic", "documentos.csv")

random.seed(SEED)
np.random.seed(SEED)
fake = Faker("es_MX")
Faker.seed(SEED)

# Documentos requeridos por ramo
DOCS_POR_RAMO = {
    "Vehículos": [
        "Parte policial",
        "Fotografías del daño",
        "Proforma de reparación",
        "Copia matrícula",
        "Cédula del asegurado",
    ],
    "Salud": [
        "Historia clínica",
        "Facturas médicas",
        "Informe médico",
        "Recetas prescritas",
        "Cédula del asegurado",
    ],
    "Vida": [
        "Certificado de defunción",
        "Informe médico causa muerte",
        "Cédula beneficiario",
        "Póliza original",
    ],
    "Hogar": [
        "Fotografías del daño",
        "Informe de perito",
        "Facturas de bienes afectados",
        "Parte policial",
        "Cédula del asegurado",
    ],
    "Generales": [
        "Informe técnico",
        "Fotografías del daño",
        "Facturas",
        "Parte policial",
        "Cédula del asegurado",
    ],
}

INCONSISTENCIAS = [
    "Fecha de emisión no coincide con fecha del siniestro",
    "Firma del médico no verificada",
    "Número de placa no coincide con póliza",
    "Monto en factura difiere del reclamado",
    "Documento con posibles alteraciones en la fecha",
    "Sello de institución ilegible o ausente",
    "Proforma de taller en lista de observación",
    "Número de serie del vehículo no legible",
    "Contradicción entre parte policial y narrativa del asegurado",
    "Documento emitido con fecha posterior al siniestro",
]


def generar_documentos_siniestro(
    id_siniestro: str,
    ramo: str,
    fecha_ocurrencia: date,
    es_fraude: bool,
    doc_idx_start: int
) -> list:
    """Genera los documentos para un siniestro especifico."""
    tipos_requeridos = DOCS_POR_RAMO.get(ramo, DOCS_POR_RAMO["Generales"])
    documentos = []

    for i, tipo_doc in enumerate(tipos_requeridos):
        doc_id = f"DOC-{doc_idx_start + i:07d}"

        # Probabilidades de entrega
        if es_fraude:
            prob_entregado = 0.62
        else:
            prob_entregado = 0.94

        entregado = int(random.random() < prob_entregado)

        # Legibilidad
        if entregado:
            if es_fraude:
                legible = int(random.random() < 0.72)
            else:
                legible = int(random.random() < 0.95)
        else:
            legible = 0

        # Inconsistencias
        if entregado and legible:
            if es_fraude:
                inconsistencia = int(random.random() < 0.35)
            else:
                inconsistencia = int(random.random() < 0.03)
        else:
            inconsistencia = 0

        observacion = random.choice(INCONSISTENCIAS) if inconsistencia else ""

        # Fecha de emisión del documento
        if es_fraude and inconsistencia and random.random() < 0.40:
            dias_offset = random.randint(1, 15)
            fecha_emision = (fecha_ocurrencia + timedelta(days=dias_offset)).isoformat()
        else:
            dias_antes = random.randint(0, 5)
            fecha_emision = (fecha_ocurrencia - timedelta(days=dias_antes)).isoformat() \
                            if dias_antes > 0 else fecha_ocurrencia.isoformat()

        documentos.append({
            "id_documento":              doc_id,
            "id_siniestro":              id_siniestro,
            "tipo_documento":            tipo_doc,
            "entregado":                 entregado,
            "legible":                   legible,
            "fecha_emision":             fecha_emision,
            "inconsistencia_detectada":  inconsistencia,
            "observacion":               observacion,
        })

    return documentos


def main():
    print("Cargando siniestros...")
    siniestros = pd.read_csv(SINIESTROS_PATH)
    print(f"   {len(siniestros):,} siniestros cargados")

    todos_docs = []
    doc_idx    = 1

    for _, row in siniestros.iterrows():
        fecha_oc  = date.fromisoformat(row["fecha_ocurrencia"])
        es_fraude = bool(row["etiqueta_fraude"])

        docs = generar_documentos_siniestro(
            id_siniestro   = row["id_siniestro"],
            ramo           = row["ramo"],
            fecha_ocurrencia = fecha_oc,
            es_fraude      = es_fraude,
            doc_idx_start  = doc_idx
        )
        todos_docs.extend(docs)
        doc_idx += len(docs)

    df = pd.DataFrame(todos_docs)

    # Ruido en estado de documentos
    np.random.seed(SEED)
    flip_mask = np.random.random(len(df)) < 0.03
    df.loc[flip_mask, "entregado"] = 1 - df.loc[flip_mask, "entregado"]
    flip_mask2 = np.random.random(len(df)) < 0.03
    df.loc[flip_mask2, "legible"] = 1 - df.loc[flip_mask2, "legible"]
    flip_mask3 = np.random.random(len(df)) < 0.02
    df.loc[flip_mask3, "inconsistencia_detectada"] = 1 - df.loc[flip_mask3, "inconsistencia_detectada"]

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")

    merged = df.merge(
        siniestros[["id_siniestro", "etiqueta_fraude"]],
        on="id_siniestro"
    )
    fraudes   = merged[merged["etiqueta_fraude"] == 1]
    legitimos = merged[merged["etiqueta_fraude"] == 0]

    print(f"\ndocumentos.csv generado: {len(df):,} registros")
    print(f"   Promedio docs por siniestro: {len(df)/len(siniestros):.1f}")

    print(f"\nComparativa fraude vs legitimo:")
    print(f"   Entregados - Fraude: {fraudes['entregado'].mean()*100:.1f}% | Legitimo: {legitimos['entregado'].mean()*100:.1f}%")
    print(f"   Legibles - Fraude: {fraudes['legible'].mean()*100:.1f}% | Legitimo: {legitimos['legible'].mean()*100:.1f}%")
    print(f"   Inconsistentes - Fraude: {fraudes['inconsistencia_detectada'].mean()*100:.1f}% | Legitimo: {legitimos['inconsistencia_detectada'].mean()*100:.1f}%")


if __name__ == "__main__":
    main()
