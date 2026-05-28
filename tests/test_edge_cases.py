import pandas as pd
import numpy as np
import os
import joblib
import sys

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, BASE_DIR)

MODELS_DIR = os.path.join(BASE_DIR, "models")
cat_cols = [
    "ramo", "cobertura", "estado", "sucursal", "beneficiario_tipo",
    "segmento", "perfil_riesgo", "tipo", "canal_venta", "ciudad",
]

ranges = {
    "monto_reclamado": (330, 694303),
    "monto_estimado": (296, 322891),
    "dias_inicio_poliza": (1, 719),
    "dias_fin_poliza": (1, 719),
    "dias_ocurrencia_reporte": (0, 30),
    "historial_siniestros_asegurado": (0, 7),
    "score_cliente_asegurado": (0.3, 100),
    "mora_actual_asegurado": (0, 1),
    "ratio_monto": (0.02, 12.5),
    "documentos_faltantes": (0, 1),
    "pct_legibles": (0, 1),
    "pct_inconsistentes": (0, 1),
    "frecuencia_proveedor": (1, 200),
    "similitud_narrativa_max": (0, 1),
}


def make_row(encoders, overrides=None):
    row = {
        "monto_reclamado": 8000.0,
        "monto_estimado": 7500.0,
        "dias_inicio_poliza": 200,
        "dias_fin_poliza": 365,
        "dias_ocurrencia_reporte": 1,
        "historial_siniestros_asegurado": 0,
        "score_cliente_asegurado": 85.0,
        "mora_actual_asegurado": 0,
        "reclamos_12m": 0,
        "total_siniestros_hist": 0,
        "antiguedad_anios": 5.0,
        "prima": 1200.0,
        "deducible": 500.0,
        "duracion_meses": 12,
        "ratio_monto": 1.07,
        "documentos_faltantes": 0.05,
        "pct_legibles": 0.95,
        "pct_inconsistentes": 0.0,
        "frecuencia_proveedor": 50,
        "reclamos_asociados": 15,
        "monto_promedio_reclamado": 2500.0,
        "porcentaje_casos_observados": 5.0,
        "proveedor_en_lista_restrictiva": 0,
        "cobertura_es_ptxrb": 0,
        "dias_borde_inicio_score": 0,
        "dias_borde_fin_score": 0,
        "docs_completos_bin": 1,
        "similitud_narrativa_max": 0.15,
    }
    for col in cat_cols:
        le = encoders[col]
        row[col + "_enc"] = le.transform([le.classes_[0]])[0]
    if overrides:
        row.update(overrides)
    return row


def run_tests():
    print("Cargando modelo y preprocesadores...")
    xgb = joblib.load(os.path.join(MODELS_DIR, "best_model.pkl"))
    data = joblib.load(os.path.join(MODELS_DIR, "preprocessed_data.pkl"))
    encoders = joblib.load(os.path.join(MODELS_DIR, "encoders.pkl"))
    feature_cols = data["feature_cols"]

    tests = [
        ("0. Normal - Legitimo", {}),
        ("1. Normal - Fraude claro", {
            "dias_ocurrencia_reporte": 14,
            "historial_siniestros_asegurado": 5,
            "monto_reclamado": 150000.0, "ratio_monto": 3.2,
            "documentos_faltantes": 0.6, "pct_legibles": 0.3,
            "pct_inconsistentes": 0.4, "proveedor_en_lista_restrictiva": 1,
            "cobertura_es_ptxrb": 1, "dias_borde_inicio_score": 8,
            "dias_borde_fin_score": 8, "docs_completos_bin": 0,
            "similitud_narrativa_max": 0.95,
        }),
        ("2. EXTREMO - Monto $10M", {
            "monto_reclamado": 10_000_000.0, "monto_estimado": 8_000_000.0, "ratio_monto": 1.25,
        }),
        ("3. EXTREMO - Monto $0", {
            "monto_reclamado": 0.0, "monto_estimado": 0.0, "ratio_monto": 0.0,
        }),
        ("4. EXTREMO - Monto negativo", {
            "monto_reclamado": -5000.0, "monto_estimado": 10000.0, "ratio_monto": -0.5,
        }),
        ("5. EXTREMO - Borde inicio dia 1 + reporte 100d", {
            "dias_inicio_poliza": 1, "dias_borde_inicio_score": 8,
            "dias_fin_poliza": 364, "dias_ocurrencia_reporte": 100,
        }),
        ("6. EXTREMO - Sin documentos", {
            "documentos_faltantes": 1.0, "pct_legibles": 0.0,
            "pct_inconsistentes": 1.0, "docs_completos_bin": 0,
        }),
        ("7. CONTRADICTORIO - Datos legitimos + narrativa clonada", {
            "dias_ocurrencia_reporte": 0, "historial_siniestros_asegurado": 0,
            "monto_reclamado": 5000.0, "ratio_monto": 1.02,
            "documentos_faltantes": 0.0, "proveedor_en_lista_restrictiva": 0,
            "docs_completos_bin": 1, "similitud_narrativa_max": 0.99,
        }),
    ]

    print("=" * 85)
    print("  PRUEBA DEL MODELO CON CASOS EXTREMOS")
    print("=" * 85)
    print(f"\n{'#':<3s} {'Caso':<50s} {'Pred':<8s} {'Probabilidad':<12s} {'Fuera de rango?'}")
    print("-" * 85)

    for i, (name, overrides) in enumerate(tests):
        try:
            row = make_row(encoders, overrides)
            df_row = pd.DataFrame([row])[feature_cols]
            proba = xgb.predict_proba(df_row)[0, 1]
            pred = int(proba >= 0.5)

            fuera = []
            for col, (lo, hi) in ranges.items():
                if col in row:
                    v = row[col]
                    if v < lo or v > hi:
                        fuera.append(f"{col}={v:.1f}")

            nivel = "FRAUDE" if pred == 1 else "LEGIT"
            flag = " | ".join(fuera[:2]) if fuera else "Dentro de rango"
            conf = "ALTA" if abs(proba - 0.5) > 0.4 else ("MEDIA" if abs(proba - 0.5) > 0.2 else "BAJA")
            print(f"{i:<3d} {name:<50s} {nivel:<8s} {proba:.6f}     {flag} [{conf}]")
        except Exception as e:
            print(f"{i:<3d} {name:<50s} {'ERROR':<8s} ---                {str(e)[:80]}")

    print()
    print("CONCLUSION: El modelo extrapola en datos fuera de rango.")
    print("RECOMENDACION: Agregar capa de validacion previa de rangos.")


if __name__ == "__main__":
    run_tests()
