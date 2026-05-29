# Arquitectura del backend fraudIA

## Objetivo

Reestructurar el backend para que el entrenamiento use exclusivamente `backend/DataEnt/` como fuente de verdad, elimine la dependencia de `backend/data/synthetic/` y produzca un ranking de modelos con evidencia visual.

## Capas

### 1. Ingesta

- Lee los CSV de `backend/DataEnt/`
- Normaliza nombres de columnas
- Convierte fechas, montos y banderas Sí/No
- Agrega documentos por siniestro

### 2. Feature engineering

- Cruza `Siniestros`, `Pólizas`, `Asegurados`, `Proveedores` y `Documentos`
- Calcula variables derivadas de riesgo
- Construye indicadores como:
  - `ratio_reclamo_suma_asegurada`
  - `ratio_reclamo_estimado`
  - `risk_rule_score`
  - `fraude_simulado`

### 3. Modelado

- Entrena 4 clasificadores:
  - Logistic Regression
  - Random Forest
  - Gradient Boosting
  - Extra Trees
- Evalúa cada modelo con:
  - ROC AUC
  - Precision
  - Recall
  - F1
  - Accuracy
- Selecciona el top 3 por ROC AUC de validación

### 4. Selección dinámica

- En inferencia se comparan las probabilidades de los 3 mejores modelos
- Se conserva el mayor score como decisión principal
- Esto permite el comportamiento pedido: si un modelo reporta 0.80 y otro 0.70, se prioriza el 0.80

### 5. Reportes

- `backend/reports/metrics_comparison.png`
- `backend/reports/roc_comparison.png`
- `backend/reports/pr_comparison.png`
- `backend/reports/confusion_matrices.png`
- `backend/reports/confusion_test_best.png`
- `backend/reports/feature_importance.png`
- `backend/reports/risk_rule_distribution.png`
- `backend/reports/model_probability_distribution.png`

## Flujo

```text
DataEnt CSVs
  -> limpieza y normalización
  -> unión de tablas
  -> variables de riesgo
  -> label heurístico
  -> entrenamiento de 4 modelos
  -> ranking top 3
  -> exportación de artefactos y gráficos
```

## Artefactos generados

- `backend/models/preprocessor.joblib`
- `backend/models/*.joblib`
- `backend/models/registry.joblib`
- `backend/models/scored_claims.csv`
- `backend/models/training_summary.json`

