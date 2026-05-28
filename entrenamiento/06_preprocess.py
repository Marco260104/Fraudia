"""Carga, merge, feature engineering y split 70/15/15."""

import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder

SEED = 42
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "synthetic")
OUTPUT_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(OUTPUT_DIR, exist_ok=True)

np.random.seed(SEED)

print("Cargando tablas...")
siniestros = pd.read_csv(os.path.join(DATA_DIR, "siniestros.csv"))
documentos = pd.read_csv(os.path.join(DATA_DIR, "documentos.csv"))
asegurados = pd.read_csv(os.path.join(DATA_DIR, "asegurados.csv"))
proveedores = pd.read_csv(os.path.join(DATA_DIR, "proveedores.csv"))
polizas = pd.read_csv(os.path.join(DATA_DIR, "polizas.csv"))

print(f"  siniestros: {len(siniestros)}")
print(f"  documentos: {len(documentos)}")
print(f"  asegurados: {len(asegurados)}")
print(f"  proveedores: {len(proveedores)}")
print(f"  polizas: {len(polizas)}")

# --- Merge documentos (agregado por siniestro) ---
print("Agregando documentos por siniestro...")
docs_agg = documentos.groupby("id_siniestro").agg(
    total_docs=("id_documento", "count"),
    pct_entregados=("entregado", "mean"),
    pct_legibles=("legible", "mean"),
    pct_inconsistentes=("inconsistencia_detectada", "mean"),
).reset_index()
df = siniestros.merge(docs_agg, on="id_siniestro", how="left")

# --- Merge asegurados ---
keep_aseg = ["id_asegurado", "segmento", "antiguedad_anios", "reclamos_12m",
             "total_siniestros_hist", "perfil_riesgo"]
df = df.merge(asegurados[keep_aseg], on="id_asegurado", how="left")

# --- Merge proveedores ---
keep_prov = ["id_proveedor", "tipo", "reclamos_asociados", "monto_promedio_reclamado",
             "porcentaje_casos_observados"]
df = df.merge(proveedores[keep_prov], on="id_proveedor", how="left")

# --- Merge polizas ---
keep_pol = ["id_poliza", "prima", "deducible", "duracion_meses", "canal_venta", "ciudad"]
df = df.merge(polizas[keep_pol], on="id_poliza", how="left")

print(f"  Dimension despues de merge: {df.shape}")

# --- Feature engineering ---

# 1. ratio_monto (reclamado / estimado)
df["ratio_monto"] = df["monto_reclamado"] / (df["monto_estimado"] + 0.01)

# 2. documentos_faltantes
df["documentos_faltantes"] = 1.0 - df["pct_entregados"]

# 3. cobertura_es_ptxrb
df["cobertura_es_ptxrb"] = df["cobertura"].str.contains("PTxRB|Robo total", na=False).astype(int)

# 4. dias_borde_inicio: score inverso (menos dias = mas riesgo)
df["dias_borde_inicio_score"] = np.where(df["dias_inicio_poliza"] <= 10, 8,
                                          np.where(df["dias_inicio_poliza"] <= 30, 4, 0))

# 5. dias_borde_fin: similar
df["dias_borde_fin_score"] = np.where(df["dias_fin_poliza"] <= 10, 8,
                                       np.where(df["dias_fin_poliza"] <= 30, 4, 0))

# 6. frecuencia_proveedor: cuantas veces aparece cada proveedor en el dataset
prov_freq = siniestros["id_proveedor"].value_counts().to_dict()
df["frecuencia_proveedor"] = df["id_proveedor"].map(prov_freq)

# 7. documentos_completos binario
df["docs_completos_bin"] = (df["documentos_completos"] == "Sí").astype(int)

# --- NLP: similitud narrativa ---
print("Calculando similitud de narrativas...")
vectorizer = TfidfVectorizer(max_features=500, lowercase=True)
tfidf_matrix = vectorizer.fit_transform(df["descripcion"].fillna(""))
sim_matrix = cosine_similarity(tfidf_matrix)
np.fill_diagonal(sim_matrix, 0)
df["similitud_narrativa_max"] = sim_matrix.max(axis=1)

# --- Codificar categoricas ---
cat_cols = ["ramo", "cobertura", "estado", "sucursal", "beneficiario_tipo",
            "segmento", "perfil_riesgo", "tipo", "canal_venta", "ciudad"]

encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col + "_enc"] = le.fit_transform(df[col].astype(str))
    encoders[col] = le

# --- Seleccion final de features ---
feature_cols = [
    # Numericas directas
    "monto_reclamado", "monto_estimado", "dias_inicio_poliza",
    "dias_fin_poliza", "dias_ocurrencia_reporte",
    "historial_siniestros_asegurado", "score_cliente_asegurado",
    "mora_actual_asegurado", "reclamos_12m", "total_siniestros_hist",
    "antiguedad_anios", "prima", "deducible", "duracion_meses",
    # Features derivadas
    "ratio_monto", "documentos_faltantes", "pct_legibles",
    "pct_inconsistentes", "frecuencia_proveedor", "reclamos_asociados",
    "monto_promedio_reclamado", "porcentaje_casos_observados",
    # Scores y binarias
    "proveedor_en_lista_restrictiva", "cobertura_es_ptxrb",
    "dias_borde_inicio_score", "dias_borde_fin_score",
    "docs_completos_bin",
    # NLP
    "similitud_narrativa_max",
]

cat_encoded = [c + "_enc" for c in cat_cols]
feature_cols += cat_encoded

# IDs y target
target = "etiqueta_fraude"
drop_cols = [c for c in df.columns if c not in feature_cols + [target]]

X = df[feature_cols].copy()
y = df[target].copy()

print(f"\nFeatures totales: {X.shape[1]}")
print(f"Distribucion target:\n{y.value_counts().to_dict()}")
print(f"Fraud rate: {y.mean()*100:.1f}%")

# --- Split 70/15/15 estratificado ---
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.15, random_state=SEED, stratify=y
)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.1765, random_state=SEED, stratify=y_temp
)
# 0.1765 of 85% = ~15% of total

print(f"\nSplit sizes:")
print(f"  Train: {len(X_train)} (fraud rate: {y_train.mean()*100:.1f}%)")
print(f"  Val:   {len(X_val)} (fraud rate: {y_val.mean()*100:.1f}%)")
print(f"  Test:  {len(X_test)} (fraud rate: {y_test.mean()*100:.1f}%)")

# --- Guardar ---
output = {
    "X_train": X_train, "X_val": X_val, "X_test": X_test,
    "y_train": y_train, "y_val": y_val, "y_test": y_test,
    "feature_cols": feature_cols,
}
joblib.dump(output, os.path.join(OUTPUT_DIR, "preprocessed_data.pkl"))
joblib.dump(encoders, os.path.join(OUTPUT_DIR, "encoders.pkl"))
joblib.dump(vectorizer, os.path.join(OUTPUT_DIR, "tfidf_vectorizer.pkl"))

print("\nDatos guardados en models/preprocessed_data.pkl")
