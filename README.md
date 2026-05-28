# fraudIA - Detector de Posibles Fraudes en Siniestros

Prototipo funcional basado en IA para detectar patrones de posible fraude en siniestros de seguros.

## Arquitectura

```
fraudIA/
├── data/                    # Datos sintéticos generados
│   ├── raw/
│   ├── processed/
│   └── synthetic/           # CSVs generados (proveedores, asegurados, pólizas, siniestros, documentos)
├── docs/                    # Documentación técnica
├── models/                  # Modelos entrenados (.pkl)
├── notebooks/               # Jupyter notebooks (exploración, modelo, evaluación)
├── reports/                 # Reportes y gráficos de evaluación
├── presentation/            # Presentación ejecutiva
├── src/                     # Código fuente modular
│   ├── ingestion/           # Carga y generación de datos
│   ├── features/            # Feature engineering y preprocesamiento
│   ├── rules/               # Reglas de negocio (Strategy Pattern)
│   ├── models/              # Modelos de ML (Strategy Pattern)
│   ├── scoring/             # Score de riesgo (Strategy Pattern)
│   ├── explainability/      # Explicabilidad (Strategy Pattern)
│   ├── ai_agent/            # Agente IA conversacional
│   ├── app/                 # Aplicación / Dashboard
│   └── pipeline/            # Orquestación del pipeline completo
├── tests/                   # Tests unitarios
│   ├── test_rules.py
│   └── test_edge_cases.py
├── requirements.txt
├── .env.example
└── README.md
```

## Patrón de Diseño: Strategy

El sistema implementa el patrón **Strategy** en 4 módulos clave:

| Módulo           | Estrategias                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `rules/`         | BorderProximity, LateReporting, ClaimFrequency, RestrictedProvider, etc.    |
| `models/`        | RandomForest, XGBoost, LightGBM                                             |
| `scoring/`       | Híbrido (Reglas + ML), Solo Reglas, Solo ML                                 |
| `explainability/`| Detallada, Breve, Resumen Ejecutivo                                          |

## Instalación

```bash
pip install -r requirements.txt
```

## Ejecución

### 1. Pipeline completo (generar datos + preprocesar + entrenar)

```bash
python -m src.pipeline.run_all
```

### 2. Pasos individuales

```bash
# Generar datos sintéticos
python -m src.ingestion.generate_proveedores
python -m src.ingestion.generate_asegurados
python -m src.ingestion.generate_polizas
python -m src.ingestion.generate_siniestros
python -m src.ingestion.generate_documentos

# Preprocesar
python -m src.features.preprocess

# Entrenar modelos
python -m src.models.train_compare
```

### 3. Tests

```bash
python -m tests.test_rules
python -m tests.test_edge_cases
```

## Dataset

12,500 siniestros sintéticos (92% legítimos / 8% fraude) con:
- 200 proveedores (20 en lista restrictiva)
- 6,000 asegurados
- 8,000 pólizas
- Documentos asociados con niveles variables de calidad

## Score de Riesgo

| Rango  | Nivel  | Acción                                |
|--------|--------|---------------------------------------|
| 0-40   | 🟢 Bajo | Continuar flujo normal               |
| 41-75  | 🟡 Medio| Escalar a Unidad Antifraude          |
| 76-100 | 🔴 Alto | Revisión especializada de campo      |
