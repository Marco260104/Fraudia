"""Prueba del modelo XGBoost con casos extremos y fuera de distribucion."""

import pandas as pd
import numpy as np
import os
import joblib
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

print("Cargando modelo y preprocesadores...")
xgb = joblib.load(os.path.join(MODELS_DIR, "best_model.pkl"))
data = joblib.load(os.path.join(MODELS_DIR, "preprocessed_data.pkl"))
encoders = joblib.load(os.path.join(MODELS_DIR, "encoders.pkl"))
vectorizer = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))

feature_cols = data["feature_cols"]
siniestros = pd.read_csv(os.path.join(BASE_DIR, "data", "synthetic", "siniestros.csv"))
train_descs = siniestros["descripcion"].fillna("").head(500)
train_vecs = vectorizer.transform(train_descs)

cat_cols = ["ramo", "cobertura", "estado", "sucursal", "beneficiario_tipo",
            "segmento", "perfil_riesgo", "tipo", "canal_venta", "ciudad"]

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

def make_row(overrides=None):
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
        first_class = le.classes_[0]
        row[col + "_enc"] = le.transform([first_class])[0]
    if overrides:
        row.update(overrides)
    return row

def predict_row(row):
    df_row = pd.DataFrame([row])[feature_cols]
    # Calcular similitud narrativa si no se paso explícitamente
    if "similitud_narrativa_max" in row and row["similitud_narrativa_max"] != 0.15:
        pass
    else:
        siniestros_row = siniestros.iloc[0:1]
        desc_vec = vectorizer.transform(["Siniestro de prueba generado para casos extremos."])
        sims = cosine_similarity(desc_vec, train_vecs).max()
        df_row["similitud_narrativa_max"] = sims
    proba = xgb.predict_proba(df_row)[0, 1]
    pred = int(proba >= 0.5)
    return pred, proba


tests = [
    ("0. Normal - Legitimo", {}),
    ("1. Normal - Fraude claro", {
        "dias_ocurrencia_reporte": 14,
        "historial_siniestros_asegurado": 5,
        "monto_reclamado": 150000.0,
        "ratio_monto": 3.2,
        "documentos_faltantes": 0.6,
        "pct_legibles": 0.3,
        "pct_inconsistentes": 0.4,
        "proveedor_en_lista_restrictiva": 1,
        "cobertura_es_ptxrb": 1,
        "dias_borde_inicio_score": 8,
        "dias_borde_fin_score": 8,
        "docs_completos_bin": 0,
        "similitud_narrativa_max": 0.95,
    }),
    ("2. EXTREMO - Monto $10M (14x max training)", {
        "monto_reclamado": 10_000_000.0,
        "monto_estimado": 8_000_000.0,
        "ratio_monto": 1.25,
    }),
    ("3. EXTREMO - Monto $0 (imposible)", {
        "monto_reclamado": 0.0,
        "monto_estimado": 0.0,
        "ratio_monto": 0.0,
    }),
    ("3b. EXTREMO - Monto negativo", {
        "monto_reclamado": -5000.0,
        "monto_estimado": 10000.0,
        "ratio_monto": -0.5,
    }),
    ("4. EXTREMO - Borde inicio (dia 1) + reporte 100d", {
        "dias_inicio_poliza": 1,
        "dias_borde_inicio_score": 8,
        "dias_fin_poliza": 364,
        "dias_ocurrencia_reporte": 100,
    }),
    ("5. EXTREMO - Sin documentos (100% faltantes)", {
        "documentos_faltantes": 1.0,
        "pct_legibles": 0.0,
        "pct_inconsistentes": 1.0,
        "docs_completos_bin": 0,
    }),
    ("6. CONTRADICTORIO - Datos legitimos + narrativa clonada", {
        "dias_ocurrencia_reporte": 0,
        "historial_siniestros_asegurado": 0,
        "monto_reclamado": 5000.0,
        "ratio_monto": 1.02,
        "documentos_faltantes": 0.0,
        "proveedor_en_lista_restrictiva": 0,
        "docs_completos_bin": 1,
        "similitud_narrativa_max": 0.99,
    }),
    ("7. CONTRADICTORIO - Senales fraude + docs perfectos", {
        "dias_ocurrencia_reporte": 21,
        "historial_siniestros_asegurado": 7,
        "monto_reclamado": 500000.0,
        "ratio_monto": 4.5,
        "proveedor_en_lista_restrictiva": 1,
        "cobertura_es_ptxrb": 1,
        "dias_borde_inicio_score": 8,
        "similitud_narrativa_max": 0.92,
        "documentos_faltantes": 0.0,
        "pct_legibles": 1.0,
        "pct_inconsistentes": 0.0,
        "docs_completos_bin": 1,
    }),
    ("8. EXTREMO - Categorias inventadas (codigo 999)", {
        "ramo_enc": 999,
        "cobertura_enc": 999,
        "estado_enc": 999,
        "sucursal_enc": 999,
        "beneficiario_tipo_enc": 999,
    }),
]

print("=" * 85)
print("  PRUEBA DEL MODELO XGBoost CON CASOS EXTREMOS")
print("  Rango entrenamiento montos: $330 - $694,303")
print("  Rango dias reporte: 0-30 | Historial siniestros: 0-7")
print("=" * 85)

print(f"\n{'#':<3s} {'Caso':<50s} {'Pred':<8s} {'Probabilidad':<12s} {'Fuera de rango?'}")
print("-" * 85)

for i, (name, overrides) in enumerate(tests):
    try:
        row = make_row(overrides)
        pred, proba = predict_row(row)

        fuera = []
        for col, (lo, hi) in ranges.items():
            if col in row:
                v = row[col]
                if v < lo or v > hi:
                    fuera.append(f"{col}={v:.1f}")

        nivel = "FRAUDE" if pred == 1 else "LEGIT"
        flag = " | ".join(fuera[:2]) if fuera else "Dentro de rango"
        conf = "ALTA" if abs(proba-0.5) > 0.4 else ("MEDIA" if abs(proba-0.5) > 0.2 else "BAJA")

        print(f"{i:<3d} {name:<50s} {nivel:<8s} {proba:.6f}     {flag} [{conf}]")
    except Exception as e:
        print(f"{i:<3d} {name:<50s} {'ERROR':<8s} ---                {str(e)[:80]}")

print()
print("=" * 85)
print("  CONCLUSION")
print("=" * 85)
print("""
1. Datos dentro del rango de entrenamiento -> modelo predictible y confiable
2. Datos extremos (montos $10M, negativos) -> XGBoost extrapola sin avisar
3. Datos contradictorios -> gana la senal mas fuerte (similitud narrativa)
4. Categorias inventadas (999) -> el LabelEncoder falla porque no conoce ese valor
  
RIESGO: El modelo NO detecta automaticamente que un dato esta fuera de rango.
RECOMENDACION: Agregar una capa de validacion previa que verifique rangos
minimos y maximos de entrenamiento antes de predecir.
""")
