# fraudIA - Detector de Posibles Fraudes en Siniestros

**Prototipo funcional basado en IA para detectar patrones de posible fraude en siniestros de seguros.**

---

## Estructura Clara (Frontend + Backend separados)

El proyecto está dividido para que sea **muy fácil de ejecutar**:

```
Fraudia/
├── backend/          ← Todo el código Python (ML, pipeline, reglas, modelos...)
├── frontend/         ← La aplicación React (Home profesional del sitio)
├── design/           ← Scripts y prompts de generación de assets (solo para diseño)
├── docs/             ← Documentación técnica
└── README.md
```

### Cómo ejecutar (muy simple)

#### 1. Backend (Python)

```bash
cd backend
pip install -r requirements.txt

# Ejecutar pipeline completo
python -m src.pipeline.run_all

# O ejecutar la app (cuando esté implementada)
# python -m src.app.main
```

#### 2. Frontend (React - El Home del sitio)

```bash
cd frontend
npm install
npm run dev
```

Abre **http://localhost:5173**

Este es el sitio profesional que se presenta en el hackIAthon.

---

## ✨ Home Profesional del Sitio (React)

El frontend es un sitio **full-bleed profesional** con:

- Diseño que usa todo el contorno del navegador
- Video `fraudia-hero-sphere-loop.mp4` como animación 3D interactiva a la derecha del Hero
- Logo y marca muy visibles
- Demo en vivo del motor de scoring real
- Alta calidad visual (siguiendo las mejores prácticas de diseño)

**Comando rápido:**
```bash
cd frontend
npm install && npm run dev
```

---

## Backend (Python / ML)

Todo el sistema de detección de fraude vive en `backend/`:

- `src/` → Código modular (ingesta, features, reglas, modelos, scoring, explicabilidad, agente IA)
- `data/`, `models/`, `reports/`, `notebooks/`

Todo lo necesario para entrenar y correr el prototipo está dentro de `backend/`.

Esto hace que el proyecto sea mucho más fácil de entender y ejecutar para el equipo y para los jueces del hackIAthon.

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
├── index.html               # Landing page profesional (abre directamente)
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
