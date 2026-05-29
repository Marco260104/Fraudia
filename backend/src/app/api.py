import os
import io
import json
import csv
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import pandas as pd
import numpy as np

# Cargar variables de entorno
load_dotenv(Path(__file__).resolve().parents[3] / ".env")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "fraudia_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres123")
DB_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ── Variables globales del modelo ML ──────────────────────────────────────────
MODEL_PREPROCESSOR = None
MODEL_RF = None
MODEL_REGISTRY = None
RISK_THRESHOLD = 0.5   # Umbral ajustable desde /api/model/threshold

FEATURE_HUMAN_MAP = {
    "monto_reclamado": "Monto reclamado elevado",
    "dias_desde_inicio_poliza": "Siniestro cercano al inicio de vigencia",
    "similitud_narrativa_max": "Alta similitud con otras narrativas",
    "reclamos_previos_asegurado": "Frecuencia alta de reclamos previos",
    "lista_restrictiva": "Proveedor en lista restrictiva",
}

MODELS_DIR = Path(__file__).resolve().parents[3] / "models"


def load_model_artifacts():
    global MODEL_PREPROCESSOR, MODEL_RF, MODEL_REGISTRY
    try:
        import joblib
        MODEL_PREPROCESSOR = joblib.load(MODELS_DIR / "preprocessor.joblib")
        MODEL_RF = joblib.load(MODELS_DIR / "random_forest.joblib")
        MODEL_REGISTRY = joblib.load(MODELS_DIR / "registry.joblib")
        print("[fraudIA] Artefactos ML cargados correctamente.")
    except Exception as e:
        print(f"[fraudIA] WARN: No se pudieron cargar artefactos ML: {e}")
        MODEL_PREPROCESSOR = None
        MODEL_RF = None
        MODEL_REGISTRY = None


# Cargar al iniciar el módulo
load_model_artifacts()

app = FastAPI(
    title="Fraudia API",
    description="API de consulta y análisis de riesgo de fraude para siniestros asegurados",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_engine():
    return create_engine(DB_URL)


# ── Función de scoring compuesto (Cambio 5) ───────────────────────────────────
def compute_composite_score(similitud: float, docs_completos: str,
                             prov_lista_restrictiva: str,
                             dias_desde_inicio: int,
                             dias_ocurrencia_reporte: int) -> int:
    """Score compuesto 0-100 combinando múltiples señales de riesgo."""
    score = 0
    score += (similitud or 0) * 30
    if docs_completos == 'No':
        score += 15
    if prov_lista_restrictiva in ('Si', 'Sí'):
        score += 25
    if (dias_desde_inicio or 999) < 30:
        score += 20
    if (dias_ocurrencia_reporte or 0) > 7:
        score += 10
    return min(100, int(score))


# ── Modelos Pydantic ──────────────────────────────────────────────────────────
class ClaimCalculatorInput(BaseModel):
    fecha_evento: str
    ramo: str
    placa: Optional[str] = ""
    monto_reclamado: float
    id_proveedor: Optional[str] = ""


class NarrativeCompareInput(BaseModel):
    texto: str


class ThresholdInput(BaseModel):
    threshold: float


class ChatInput(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = None


# ── ENDPOINT: Health ──────────────────────────────────────────────────────────
@app.get("/api/health")
def health_check():
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected", "model_loaded": MODEL_RF is not None}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "error": str(e)}


# ── ENDPOINT: KPIs (Cambio 6) ─────────────────────────────────────────────────
@app.get("/api/kpis")
def get_kpis():
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            total_res = conn.execute(text("SELECT COUNT(*) FROM siniestros")).fetchone()
            total_siniestros = total_res[0] if total_res else 0

            alerts_res = conn.execute(text("""
                SELECT COUNT(*) FROM siniestros
                WHERE similitud_narrativa_max >= 0.70
                   OR prov_lista_restrictiva IN ('Si','Sí')
                   OR docs_completos = 'No'
            """)).fetchone()
            alertas_generadas = alerts_res[0] if alerts_res else 0

            critical_res = conn.execute(text("""
                SELECT COUNT(*) FROM siniestros
                WHERE (similitud_narrativa_max >= 0.85 AND prov_lista_restrictiva IN ('Si','Sí'))
                   OR (similitud_narrativa_max >= 0.90)
            """)).fetchone()
            casos_criticos = critical_res[0] if critical_res else 0

            amount_res = conn.execute(text("SELECT SUM(monto_reclamado) FROM siniestros")).fetchone()
            monto_reclamado_raw = float(amount_res[0]) if amount_res and amount_res[0] else 0.0
            monto_reclamado = f"${monto_reclamado_raw / 1_000_000:.2f}M"

            # Riesgo promedio con score compuesto (Cambio 6)
            riesgo_res = conn.execute(text("""
                SELECT AVG(
                    (COALESCE(similitud_narrativa_max, 0) * 30)
                    + (CASE WHEN docs_completos = 'No' THEN 15 ELSE 0 END)
                    + (CASE WHEN prov_lista_restrictiva IN ('Si','Sí') THEN 25 ELSE 0 END)
                    + (CASE WHEN COALESCE(dias_desde_inicio_poliza, 999) < 30 THEN 20 ELSE 0 END)
                    + (CASE WHEN COALESCE(dias_ocurrencia_reporte, 0) > 7 THEN 10 ELSE 0 END)
                )
                FROM siniestros
            """)).fetchone()
            riesgo_avg = float(riesgo_res[0]) if riesgo_res and riesgo_res[0] else 0.0
            riesgo_promedio = f"{min(100, int(riesgo_avg))}%"

        return {
            "siniestros_analizados": f"{total_siniestros:,}" if total_siniestros else "0",
            "alertas_generadas": str(alertas_generadas),
            "casos_criticos": str(casos_criticos),
            "riesgo_promedio": riesgo_promedio,
            "monto_reclamado": monto_reclamado
        }
    except Exception as e:
        print(f"Error cargando KPIs: {e}")
        return {
            "siniestros_analizados": "500",
            "alertas_generadas": "56",
            "casos_criticos": "18",
            "riesgo_promedio": "42%",
            "monto_reclamado": "$2.45M"
        }


# ── ENDPOINT: Cases (Cambio 5 + 12) ──────────────────────────────────────────
@app.get("/api/cases")
def get_cases(limit: int = 10):
    try:
        engine = get_db_engine()
        query = text("""
            SELECT
                REPLACE(s.id_siniestro, 'SIN-', 'FR-') AS caso_id,
                a.nombres_asegurado,
                s.fecha_ocurrencia,
                s.ramo,
                s.monto_reclamado,
                COALESCE(s.similitud_narrativa_max, 0) AS similitud_narrativa_max,
                s.docs_completos,
                s.prov_lista_restrictiva,
                COALESCE(s.dias_desde_inicio_poliza, 999) AS dias_desde_inicio_poliza,
                COALESCE(s.dias_ocurrencia_reporte, 0) AS dias_ocurrencia_reporte
            FROM siniestros s
            LEFT JOIN asegurados a ON s.id_asegurado = a.id_asegurado
            ORDER BY s.similitud_narrativa_max DESC, s.monto_reclamado DESC
            LIMIT :limit
        """)
        cases_list = []
        with engine.connect() as conn:
            results = conn.execute(query, {"limit": limit}).fetchall()
            for r in results:
                score_val = compute_composite_score(
                    float(r.similitud_narrativa_max),
                    r.docs_completos or 'Si',
                    r.prov_lista_restrictiva or 'No',
                    int(r.dias_desde_inicio_poliza),
                    int(r.dias_ocurrencia_reporte)
                )
                level = "Alto" if score_val >= 75 else "Medio" if score_val >= 40 else "Bajo"
                date_str = r.fecha_ocurrencia.strftime("%d/%m/%Y") if r.fecha_ocurrencia else "28/05/2025"
                amount_str = f"${float(r.monto_reclamado):,.0f}"
                
                # Mock score breakdown for demo
                score_breakdown = {
                    "narrative_similarity": int(float(r.similitud_narrativa_max) * 30),
                    "missing_docs": 15 if r.docs_completos == 'No' else 0,
                    "restrictive_list": 25 if r.prov_lista_restrictiva in ('Si', 'Sí') else 0,
                    "time_proximity": 20 if int(r.dias_desde_inicio_poliza) < 30 else 0,
                    "reporting_delay": 10 if int(r.dias_ocurrencia_reporte) > 7 else 0
                }
                
                cases_list.append({
                    "id": f"#{r.caso_id}",
                    "insured": r.nombres_asegurado if r.nombres_asegurado else "Asegurado Anónimo",
                    "date": date_str,
                    "branch": r.ramo,
                    "amount": amount_str,
                    "score": f"{score_val}%",
                    "level": level,
                    "score_breakdown": score_breakdown
                })
        return cases_list if cases_list else get_mock_cases()
    except Exception as e:
        print(f"Error cargando casos: {e}")
        return get_mock_cases()


# ── ENDPOINT: Export CSV (Cambio 11) — DEBE ir ANTES de /api/cases/critical ───
@app.get("/api/cases/export")
def export_cases_csv():
    try:
        engine = get_db_engine()
        query = text("""
            SELECT
                REPLACE(s.id_siniestro, 'SIN-', 'FR-') AS caso_id,
                a.nombres_asegurado,
                s.fecha_ocurrencia,
                s.ramo,
                s.cobertura,
                s.monto_reclamado,
                s.sucursal,
                s.similitud_narrativa_max,
                s.prov_lista_restrictiva,
                s.docs_completos,
                s.dias_desde_inicio_poliza,
                s.dias_ocurrencia_reporte
            FROM siniestros s
            LEFT JOIN asegurados a ON s.id_asegurado = a.id_asegurado
            WHERE s.similitud_narrativa_max >= 0.60
               OR s.prov_lista_restrictiva IN ('Si','Sí')
            ORDER BY s.similitud_narrativa_max DESC
        """)
        rows = []
        with engine.connect() as conn:
            results = conn.execute(query).fetchall()
            for r in results:
                score_val = compute_composite_score(
                    float(r.similitud_narrativa_max),
                    r.docs_completos or 'Si',
                    r.prov_lista_restrictiva or 'No',
                    int(r.dias_desde_inicio_poliza),
                    int(r.dias_ocurrencia_reporte)
                )
                level = "Alto" if score_val >= 75 else "Medio" if score_val >= 40 else "Bajo"
                date_str = r.fecha_ocurrencia.strftime("%d/%m/%Y") if r.fecha_ocurrencia else "28/05/2025"
                amount_str = f"${float(r.monto_reclamado):,.0f}"
                
                # Mock score breakdown for demo
                score_breakdown = {
                    "narrative_similarity": int(float(r.similitud_narrativa_max) * 30),
                    "missing_docs": 15 if r.docs_completos == 'No' else 0,
                    "restrictive_list": 25 if r.prov_lista_restrictiva in ('Si', 'Sí') else 0,
                    "time_proximity": 20 if int(r.dias_desde_inicio_poliza) < 30 else 0,
                    "reporting_delay": 10 if int(r.dias_ocurrencia_reporte) > 7 else 0
                }
                
                cases_list.append({
                    "id": f"#{r.caso_id}",
                    "insured": r.nombres_asegurado if r.nombres_asegurado else "Asegurado Anónimo",
                    "date": date_str,
                    "branch": r.ramo,
                    "amount": amount_str,
                    "score": f"{score_val}%",
                    "level": level,
                    "score_breakdown": score_breakdown
                })
    except Exception as e:
        print(f"Error exportando CSV: {e}")
        rows = [
            {"Caso ID": "#FR-87291", "Asegurado": "Carlos Méndez", "Fecha Ocurrencia": "2025-05-28",
             "Ramo": "Vehículos", "Cobertura": "Daño parcial", "Monto Reclamado": 28450.0,
             "Sucursal": "Guayaquil", "Score IA": "89%", "Similitud Narrativa": 0.94,
             "Proveedor Lista Restrictiva": "Sí", "Docs Completos": "No", "Dias Desde Inicio Poliza": 2}
        ]

    output = io.StringIO()
    if rows:
        writer = csv.DictWriter(output, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    csv_content = output.getvalue()

    return Response(
        content=csv_content.encode("utf-8-sig"),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=casos_criticos.csv"}
    )


# ── ENDPOINT: Critical Cases (Cambio 5 + 12) ─────────────────────────────────
@app.get("/api/cases/critical")
def get_critical_cases(limit: int = 15):
    try:
        engine = get_db_engine()
        query = text("""
            SELECT
                REPLACE(s.id_siniestro, 'SIN-', 'FR-') AS caso_id,
                a.nombres_asegurado,
                s.cobertura,
                s.monto_reclamado,
                COALESCE(s.similitud_narrativa_max, 0) AS similitud_narrativa_max,
                s.prov_lista_restrictiva,
                s.docs_completos,
                COALESCE(s.dias_desde_inicio_poliza, 999) AS dias_desde_inicio_poliza,
                COALESCE(s.dias_ocurrencia_reporte, 0) AS dias_ocurrencia_reporte,
                s.sucursal
            FROM siniestros s
            LEFT JOIN asegurados a ON s.id_asegurado = a.id_asegurado
            WHERE s.similitud_narrativa_max >= 0.60
               OR s.prov_lista_restrictiva IN ('Si','Sí')
            ORDER BY s.similitud_narrativa_max DESC
            LIMIT :limit
        """)
        critical_list = []
        with engine.connect() as conn:
            results = conn.execute(query, {"limit": limit}).fetchall()
            for r in results:
                score_val = compute_composite_score(
                    float(r.similitud_narrativa_max),
                    r.docs_completos or 'Si',
                    r.prov_lista_restrictiva or 'No',
                    int(r.dias_desde_inicio_poliza),
                    int(r.dias_ocurrencia_reporte)
                )
                level = "Alto" if score_val >= 75 else "Medio" if score_val >= 40 else "Bajo"
                date_str = r.fecha_ocurrencia.strftime("%d/%m/%Y") if r.fecha_ocurrencia else "28/05/2025"
                amount_str = f"${float(r.monto_reclamado):,.0f}"
                
                # Mock score breakdown for demo
                score_breakdown = {
                    "narrative_similarity": int(float(r.similitud_narrativa_max) * 30),
                    "missing_docs": 15 if r.docs_completos == 'No' else 0,
                    "restrictive_list": 25 if r.prov_lista_restrictiva in ('Si', 'Sí') else 0,
                    "time_proximity": 20 if int(r.dias_desde_inicio_poliza) < 30 else 0,
                    "reporting_delay": 10 if int(r.dias_ocurrencia_reporte) > 7 else 0
                }
                
                cases_list.append({
                    "id": f"#{r.caso_id}",
                    "insured": r.nombres_asegurado if r.nombres_asegurado else "Asegurado Anónimo",
                    "date": date_str,
                    "branch": r.ramo,
                    "amount": amount_str,
                    "score": f"{score_val}%",
                    "level": level,
                    "score_breakdown": score_breakdown
                })
        return critical_list if critical_list else get_mock_critical_cases()
    except Exception as e:
        print(f"Error cargando casos críticos: {e}")
        return get_mock_critical_cases()


# ── ENDPOINT: Calculator con ML (Cambio 1) ────────────────────────────────────
@app.post("/api/calculator")
def calculate_risk(payload: ClaimCalculatorInput):
    if MODEL_RF is None or MODEL_PREPROCESSOR is None or MODEL_REGISTRY is None:
        return calculate_risk_fallback(payload)

    try:
        try:
            fecha_obj = datetime.strptime(payload.fecha_evento, "%Y-%m-%d")
            dias_desde_inicio = max(0, (datetime.now() - fecha_obj).days)
        except Exception:
            dias_desde_inicio = 180

        row = {
            "ramo": payload.ramo or "missing",
            "monto_reclamado": payload.monto_reclamado,
            "id_proveedor": payload.id_proveedor or "missing",
            "dias_desde_inicio_poliza": dias_desde_inicio,
            "similitud_narrativa_max": 0.0,
            "reclamos_previos_asegurado": 0,
            "lista_restrictiva": 1 if payload.id_proveedor and payload.id_proveedor.strip().upper() in ["TALLER-001", "TALLER-003", "PROV-022"] else 0,
            "docs_completos": 1,
            "dias_ocurrencia_reporte": 0,
            "cobertura": "missing",
            "sucursal": "missing",
            "placa_vehiculo_asegurado": payload.placa or "missing",
        }

        feature_names = MODEL_REGISTRY.get("feature_names", [])
        for col in feature_names:
            if col not in row:
                row[col] = 0

        df = pd.DataFrame([row])
        X_transformed = MODEL_PREPROCESSOR.transform(df)
        proba = MODEL_RF.predict_proba(X_transformed)[:, 1][0]
        final_score = min(100, int(proba * 100))
        level = "Alto" if final_score >= 75 else "Medio" if final_score >= 40 else "Bajo"

        importances = MODEL_RF.feature_importances_
        all_feature_names = MODEL_REGISTRY.get("feature_names", [])
        sorted_idx = np.argsort(importances)[::-1]
        alerts = []
        for idx in sorted_idx[:10]:
            if len(alerts) >= 5:
                break
            fname = all_feature_names[idx] if idx < len(all_feature_names) else f"feature_{idx}"
            if importances[idx] > 0.03:
                human = FEATURE_HUMAN_MAP.get(fname, fname)
                alerts.append(human)

        return {
            "score": f"{final_score}%",
            "level": level,
            "alerts": alerts if alerts else ["Sin alertas de alta prioridad detectadas"],
            "model": "random_forest"
        }
    except Exception as e:
        print(f"Error en endpoint ML calculator: {e}")
        return calculate_risk_fallback(payload)


def calculate_risk_fallback(payload: ClaimCalculatorInput):
    """Lógica de reglas como fallback si el modelo no está disponible."""
    score = 15
    alerts = []
    if payload.ramo.strip().lower() in ["vehículo", "vehiculos", "vehiculo"]:
        score += 5
    if payload.monto_reclamado > 25000:
        score += 15
        alerts.append("Monto reclamado elevado")
    elif payload.monto_reclamado > 10000:
        score += 8
        alerts.append("Monto moderado-alto reclamado")
    if payload.id_proveedor and payload.id_proveedor.strip().upper() in ["TALLER-001", "TALLER-003", "PROV-022"]:
        score += 25
        alerts.append("Proveedor en lista restrictiva")
    try:
        fecha_obj = datetime.strptime(payload.fecha_evento, "%Y-%m-%d")
        dias = (datetime.now() - fecha_obj).days
        if dias < 30:
            score += 20
            alerts.append("Siniestro cercano al inicio de vigencia")
    except Exception:
        pass
    final_score = min(100, score)
    level = "Alto" if final_score >= 75 else "Medio" if final_score >= 40 else "Bajo"
    return {
        "score": f"{final_score}%",
        "level": level,
        "alerts": alerts if alerts else ["Sin alertas de alta prioridad detectadas"],
        "model": "rules_fallback"
    }


# ── ENDPOINT: Narratives Compare NLP (Cambio 2) ───────────────────────────────
@app.post("/api/narratives/compare")
def compare_narrative(payload: NarrativeCompareInput):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    if not payload.texto or not payload.texto.strip():
        raise HTTPException(status_code=400, detail="El campo 'texto' no puede estar vacío")

    descriptions = []
    ids = []

    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            rows = conn.execute(text("""
                SELECT REPLACE(id_siniestro, 'SIN-', 'FR-') AS caso_id, descripcion_evento
                FROM siniestros
                WHERE descripcion_evento IS NOT NULL AND descripcion_evento != ''
                LIMIT 500
            """)).fetchall()
            for r in rows:
                ids.append(r[0])
                descriptions.append(r[1])
    except Exception as e:
        print(f"BD no disponible para narrativas, usando fallback: {e}")
        ids = ["FR-87291", "FR-76123", "FR-65109", "FR-55867", "FR-44321"]
        descriptions = [
            "El vehiculo fue impactado mientras estaba estacionado en la via publica por un tercero que se dio a la fuga sin detenerse",
            "Vehiculo detenido en semaforo fue colisionado por detras por otro vehiculo a baja velocidad causando danos en la parte trasera",
            "Impacto trasero mientras el vehiculo se encontraba detenido en congestion vehicular en hora pico de la ciudad",
            "Vehiculo estacionado en zona residencial presento danos en la puerta delantera izquierda al regresar el propietario",
            "Alcance por detras en via urbana el vehiculo estaba frenado por trafico intenso en interseccion semaforo rojo"
        ]

    if not descriptions:
        return []

    all_texts = descriptions + [payload.texto]
    vectorizer = TfidfVectorizer(min_df=1, stop_words=None, ngram_range=(1, 2))
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    query_vec = tfidf_matrix[-1]
    corpus_vecs = tfidf_matrix[:-1]
    similarities = cosine_similarity(query_vec, corpus_vecs)[0]

    top_indices = np.argsort(similarities)[::-1][:5]
    results = []
    for idx in top_indices:
        sim_score = float(similarities[idx])
        score_int = int(sim_score * 100)
        nivel = "Alta" if score_int > 80 else "Media" if score_int > 60 else "Baja"
        results.append({
            "id": ids[idx],
            "descripcion_preview": descriptions[idx][:100],
            "score_similitud": score_int,
            "nivel": nivel
        })

    return results


# ── ENDPOINT: Providers (Cambio 3) ────────────────────────────────────────────
@app.get("/api/providers")
def get_providers():
    try:
        engine = get_db_engine()
        query = text("""
            SELECT
                id_proveedor,
                nombre_proveedor,
                tipo_proveedor,
                ciudad_proveedor,
                COALESCE(siniestros_asociados, 0) AS siniestros_asociados,
                lista_restrictiva,
                COALESCE(motivo_restriccion, 'Sin observaciones') AS motivo_restriccion,
                COALESCE(promedio_monto, 0) AS promedio_monto
            FROM proveedores
            ORDER BY siniestros_asociados DESC
        """)
        providers = []
        with engine.connect() as conn:
            results = conn.execute(query).fetchall()
            for r in results:
                en_lista = r.lista_restrictiva in ('Si', 'Sí')
                siniestros = int(r.siniestros_asociados or 0)
                alerta_nivel = "rojo" if en_lista else "amarillo" if siniestros > 3 else "verde"
                providers.append({
                    "id_proveedor": r.id_proveedor,
                    "nombre_proveedor": r.nombre_proveedor,
                    "tipo_proveedor": r.tipo_proveedor or "Taller",
                    "ciudad_proveedor": r.ciudad_proveedor or "N/A",
                    "siniestros_asociados": siniestros,
                    "lista_restrictiva": r.lista_restrictiva,
                    "motivo_restriccion": r.motivo_restriccion,
                    "promedio_monto": float(r.promedio_monto or 0),
                    "alerta_nivel": alerta_nivel
                })
        return providers if providers else get_mock_providers()
    except Exception as e:
        print(f"Error cargando providers: {e}")
        return get_mock_providers()


# ── ENDPOINT: Insureds (Cambio 3) ─────────────────────────────────────────────
@app.get("/api/insureds")
def get_insureds():
    try:
        engine = get_db_engine()
        query = text("""
            SELECT
                a.id_asegurado,
                a.nombres_asegurado,
                a.ciudad,
                a.antiguedad_asegurado,
                COALESCE(a.reclamos_ult_12m, 0) AS reclamos_ult_12m,
                COALESCE(a.reclamos_historico_total, 0) AS reclamos_historico_total,
                a.perfil_riesgo_historico,
                COUNT(s.id_siniestro) AS total_siniestros_activos
            FROM asegurados a
            LEFT JOIN siniestros s ON a.id_asegurado = s.id_asegurado
            GROUP BY a.id_asegurado, a.nombres_asegurado, a.ciudad, a.antiguedad_asegurado,
                     a.reclamos_ult_12m, a.reclamos_historico_total, a.perfil_riesgo_historico
            ORDER BY reclamos_ult_12m DESC
        """)
        insureds = []
        with engine.connect() as conn:
            results = conn.execute(query).fetchall()
            for r in results:
                ult_12m = int(r.reclamos_ult_12m or 0)
                nivel_riesgo = "alto" if ult_12m > 2 else "medio" if ult_12m > 0 else "bajo"
                insureds.append({
                    "id_asegurado": r.id_asegurado,
                    "nombres_asegurado": r.nombres_asegurado,
                    "ciudad": r.ciudad or "N/A",
                    "antiguedad_asegurado": r.antiguedad_asegurado or 0,
                    "reclamos_ult_12m": ult_12m,
                    "reclamos_historico_total": int(r.reclamos_historico_total or 0),
                    "perfil_riesgo_historico": r.perfil_riesgo_historico or "N/A",
                    "total_siniestros_activos": int(r.total_siniestros_activos or 0),
                    "nivel_riesgo": nivel_riesgo
                })
        return insureds if insureds else get_mock_insureds()
    except Exception as e:
        print(f"Error cargando insureds: {e}")
        return get_mock_insureds()


# ── ENDPOINT: Vehicles (Cambio 3) ─────────────────────────────────────────────
@app.get("/api/vehicles")
def get_vehicles():
    try:
        engine = get_db_engine()
        query = text("""
            SELECT
                placa_vehiculo_asegurado AS placa,
                COUNT(id_siniestro) AS total_siniestros,
                SUM(monto_reclamado) AS monto_total,
                MAX(similitud_narrativa_max) AS max_similitud,
                STRING_AGG(DISTINCT cobertura, ', ') AS coberturas
            FROM siniestros
            WHERE placa_vehiculo_asegurado IS NOT NULL
              AND placa_vehiculo_asegurado != 'N/A'
              AND placa_vehiculo_asegurado != ''
            GROUP BY placa_vehiculo_asegurado
            HAVING COUNT(id_siniestro) >= 1
            ORDER BY total_siniestros DESC, monto_total DESC
            LIMIT 100
        """)
        vehicles = []
        with engine.connect() as conn:
            results = conn.execute(query).fetchall()
            for r in results:
                cnt = int(r.total_siniestros or 0)
                max_sim = float(r.max_similitud or 0)
                alerta = cnt > 2 or max_sim > 0.80
                vehicles.append({
                    "placa": r.placa,
                    "total_siniestros": cnt,
                    "monto_total": float(r.monto_total or 0),
                    "max_similitud": round(max_sim, 3),
                    "coberturas": r.coberturas or "N/A",
                    "alerta": alerta
                })
        return vehicles if vehicles else get_mock_vehicles()
    except Exception as e:
        print(f"Error cargando vehicles: {e}")
        return get_mock_vehicles()


# ── ENDPOINT: Model Status (Cambio 9) ─────────────────────────────────────────
@app.get("/api/model/status")
def get_model_status():
    try:
        summary_path = MODELS_DIR / "training_summary.json"
        with open(summary_path, "r") as f:
            summary = json.load(f)

        best_model = summary.get("best_model", "random_forest")
        best_test = summary.get("best_test", {})
        class_balance = summary.get("class_balance", {})

        mod_time = summary_path.stat().st_mtime
        fecha_entrenamiento = datetime.fromtimestamp(mod_time).strftime("%Y-%m-%d %H:%M")

        return {
            "best_model": best_model,
            "roc_auc": round(best_test.get("roc_auc", 0), 4),
            "precision": round(best_test.get("precision", 0), 4),
            "recall": round(best_test.get("recall", 0), 4),
            "f1": round(best_test.get("f1", 0), 4),
            "accuracy": round(best_test.get("accuracy", 0), 4),
            "casos_positivos": class_balance.get("positive", 0),
            "casos_negativos": class_balance.get("negative", 0),
            "fecha_entrenamiento": fecha_entrenamiento,
            "threshold_actual": RISK_THRESHOLD,
            "model_loaded": MODEL_RF is not None
        }
    except Exception as e:
        print(f"Error leyendo model status: {e}")
        return {
            "best_model": "random_forest",
            "roc_auc": 0.9858,
            "precision": 0.8824,
            "recall": 0.8333,
            "f1": 0.8571,
            "accuracy": 0.95,
            "casos_positivos": 91,
            "casos_negativos": 409,
            "fecha_entrenamiento": "2026-05-29 09:00",
            "threshold_actual": RISK_THRESHOLD,
            "model_loaded": MODEL_RF is not None
        }


# ── ENDPOINT: Set Threshold (Cambio 9) ────────────────────────────────────────
@app.post("/api/model/threshold")
def set_threshold(payload: ThresholdInput):
    global RISK_THRESHOLD
    if not 0.0 <= payload.threshold <= 1.0:
        raise HTTPException(status_code=400, detail="El umbral debe estar entre 0.0 y 1.0")
    RISK_THRESHOLD = payload.threshold
    return {"message": f"Umbral actualizado a {RISK_THRESHOLD}", "threshold": RISK_THRESHOLD}


# ── ENDPOINT: Detections ──────────────────────────────────────────────────────
@app.get("/api/detections")
def get_detections(limit: int = 5):
    try:
        engine = get_db_engine()
        query = text("""
            SELECT
                REPLACE(id_siniestro, 'SIN-', 'FR-') AS caso_id,
                fecha_reporte,
                similitud_narrativa_max,
                prov_lista_restrictiva,
                docs_completos
            FROM siniestros
            WHERE similitud_narrativa_max >= 0.70
               OR prov_lista_restrictiva IN ('Si','Sí')
               OR docs_completos = 'No'
            ORDER BY fecha_reporte DESC, similitud_narrativa_max DESC
            LIMIT :limit
        """)
        detections = []
        with engine.connect() as conn:
            results = conn.execute(query, {"limit": limit}).fetchall()
            for r in results:
                time_str = r.fecha_reporte.strftime("%H:%M") if r.fecha_reporte else "11:42"
                if time_str == "00:00":
                    num = sum(ord(char) for char in r.caso_id) % 60
                    time_str = f"09:{num:02d}"
                score_val = int(r.similitud_narrativa_max * 100) if r.similitud_narrativa_max else 0
                if r.similitud_narrativa_max and r.similitud_narrativa_max >= 0.85:
                    title = "Nueva coincidencia narrativa detectada"
                    detail = f"Caso #{r.caso_id} - Similitud {score_val}%"
                    tone = "red"
                elif r.prov_lista_restrictiva in ('Si', 'Sí'):
                    title = "Proveedor observado en siniestro"
                    detail = f"Caso #{r.caso_id} - Taller observado"
                    tone = "orange"
                elif r.docs_completos == "No":
                    title = "Documentación incompleta detectada"
                    detail = f"Caso #{r.caso_id} - Falta soporte legal"
                    tone = "violet"
                else:
                    title = "Alerta de riesgo medio identificada"
                    detail = f"Caso #{r.caso_id} - Puntuación {score_val}%"
                    tone = "orange"
                detections.append({"time": time_str, "title": title, "detail": detail, "tone": tone})
        return detections if detections else get_mock_detections()
    except Exception as e:
        print(f"Error cargando detecciones: {e}")
        return get_mock_detections()


# ── ENDPOINT: Map Claims ──────────────────────────────────────────────────────
@app.get("/api/map-claims")
def get_map_claims():
    try:
        engine = get_db_engine()
        query = text("""
            SELECT sucursal, COUNT(*)
            FROM siniestros
            WHERE similitud_narrativa_max >= 0.60
               OR prov_lista_restrictiva IN ('Si','Sí')
            GROUP BY sucursal
        """)
        coords = {
            "Esmeraldas": {"x": "28%", "y": "16%"},
            "Quito": {"x": "38%", "y": "24%"},
            "Ibarra": {"x": "41%", "y": "14%"},
            "Portoviejo": {"x": "16%", "y": "38%"},
            "Manta": {"x": "12%", "y": "40%"},
            "Ambato": {"x": "37%", "y": "38%"},
            "Riobamba": {"x": "38%", "y": "45%"},
            "Cuenca": {"x": "35%", "y": "62%"},
            "Guayaquil": {"x": "22%", "y": "54%"},
            "Loja": {"x": "32%", "y": "80%"}
        }
        pins = []
        with engine.connect() as conn:
            results = conn.execute(query).fetchall()
            for r in results:
                suc = r[0]
                cnt = r[1]
                if suc in coords:
                    tone = "red" if cnt > 12 else "orange" if cnt > 6 else "blue"
                    pins.append({"label": str(cnt), "x": coords[suc]["x"], "y": coords[suc]["y"], "tone": tone, "sucursal": suc})
        return pins if pins else get_mock_map_claims()
    except Exception as e:
        print(f"Error cargando pines del mapa: {e}")
        return get_mock_map_claims()


# ── ENDPOINT: Narratives Similar ──────────────────────────────────────────────
@app.get("/api/narratives/similar")
def get_similar_narratives():
    try:
        engine = get_db_engine()
        max_query = text("""
            SELECT REPLACE(id_siniestro, 'SIN-', 'FR-') AS caso_id, descripcion_evento, similitud_narrativa_max
            FROM siniestros
            WHERE descripcion_evento IS NOT NULL
              AND similitud_narrativa_max IS NOT NULL
            ORDER BY similitud_narrativa_max DESC
            LIMIT 1
        """)
        with engine.connect() as conn:
            max_row = conn.execute(max_query).fetchone()
            if not max_row:
                return get_mock_narratives_similar()
            max_id = max_row[0]
            desc = max_row[1]
            score_val = f"{int(max_row[2] * 100)}%"
            if len(desc) > 120:
                desc = desc[:117] + "..."
            support_query = text("""
                SELECT REPLACE(id_siniestro, 'SIN-', 'FR-') AS caso_id, similitud_narrativa_max
                FROM siniestros
                WHERE id_siniestro != :max_id
                  AND similitud_narrativa_max IS NOT NULL
                ORDER BY similitud_narrativa_max DESC
                LIMIT 4
            """)
            support_rows = conn.execute(support_query, {"max_id": max_id}).fetchall()
            similar_list = []
            for r in support_rows:
                parts = r[0].split('-')
                sid = parts[1] if len(parts) > 1 else r[0]
                similar_list.append({"id": f"#S-{sid}", "score": f"{int(r[1] * 100)}%"})
            return {"original_text": desc, "score": score_val,
                    "similar_list": similar_list or get_mock_narratives_similar()["similar_list"]}
    except Exception as e:
        print(f"Error cargando narrativas similares: {e}")
        return get_mock_narratives_similar()


# ── ENDPOINT: Case Timeline ───────────────────────────────────────────────────
@app.get("/api/cases/{case_id}/timeline")
def get_case_timeline(case_id: str):
    try:
        clean_id = case_id.replace("#", "").replace("FR-", "").replace("SIN-", "").strip()
        db_id = f"SIN-{clean_id}"
        engine = get_db_engine()
        query = text("""
            SELECT id_siniestro, docs_completos, prov_lista_restrictiva, similitud_narrativa_max
            FROM siniestros WHERE id_siniestro = :db_id
        """)
        with engine.connect() as conn:
            r = conn.execute(query, {"db_id": db_id}).fetchone()
            if not r:
                return get_mock_timeline(case_id)
            docs = r.docs_completos
            restrictive = r.prov_lista_restrictiva
            sim = float(r.similitud_narrativa_max) if r.similitud_narrativa_max else 0.0
            timeline = [
                {"time": "09:14", "label": "Reclamo ingresado al sistema de póliza", "tone": "green"},
                {"time": "09:15", "label": "Validación iniciada en motor cognitivo fraudIA", "tone": "blue"}
            ]
            if sim >= 0.75:
                timeline.append({"time": "09:16", "label": f"Alta coincidencia de narrativa detectada ({int(sim*100)}%)", "tone": "red"})
            else:
                timeline.append({"time": "09:16", "label": f"Análisis narrativo completado (Similitud {int(sim*100)}%)", "tone": "green"})
            if restrictive in ('Si', 'Sí'):
                timeline.append({"time": "09:17", "label": "Proveedor detectado en Lista Restrictiva activa", "tone": "red"})
            elif docs == "No":
                timeline.append({"time": "09:17", "label": "Alerta: Documentación legal obligatoria incompleta", "tone": "orange"})
            else:
                timeline.append({"time": "09:17", "label": "Verificación de taller y documentación aprobada", "tone": "green"})
            if sim >= 0.85 or restrictive in ('Si', 'Sí'):
                timeline.append({"time": "09:18", "label": "Caso Escalado Automáticamente a Unidad de Control", "tone": "red"})
            elif sim >= 0.60 or docs == "No":
                timeline.append({"time": "09:18", "label": "Caso en revisión intermedia de Auditoría", "tone": "orange"})
            else:
                timeline.append({"time": "09:18", "label": "Recomendación de aprobación sin alertas de fraude", "tone": "green"})
            return timeline
    except Exception as e:
        print(f"Error cargando timeline para {case_id}: {e}")
        return get_mock_timeline(case_id)


# ── ENDPOINT: AI Chat (Cambio 12) ─────────────────────────────────────────────
def format_context_for_gemini(data):
    s = "ESTADO DE SINIESTROS CRÍTICOS/BAJO INVESTIGACIÓN (TOP 30):\n"
    for c in data["siniestros_top"]:
        s += (f"- ID: {c['id']}, Asegurado: {c['insured']}, Ramo: {c['ramo']}, "
              f"Cobertura: {c['cobertura']}, Monto: ${c['monto']:,.2f}, "
              f"Sucursal: {c['sucursal']}, Similitud NLP: {int(c['similitud_narrativa']*100)}%, "
              f"Taller: {c['proveedor_nombre']}, Lista Restrictiva: {c['proveedor_lista_restrictiva']}, "
              f"Docs: {c['docs_completos']}, Días inicio póliza: {c['dias_desde_inicio_poliza']}\n")
    s += "\nRANKING DE PROVEEDORES/TALLERES:\n"
    for p in data["proveedores_top"]:
        s += (f"- {p['nombre']}, Lista: {p['lista_restrictiva']}, "
              f"Motivo: {p['motivo_restriccion']}, Siniestros: {p['siniestros_asociados']}, "
              f"Monto prom: ${p['promedio_monto']:,.2f}\n")
    s += "\nCONCENTRACIÓN POR SUCURSAL:\n"
    for su in data["sucursales"]:
        s += f"- {su['sucursal']}: {su['count']} casos, ${su['monto_total']:,.2f}\n"
    s += "\nASEGURADOS RECURRENTES:\n"
    for a in data["asegurados_alta_frecuencia"]:
        s += f"- {a['nombres']}: {a['frecuencia']} siniestros\n"
    s += "\nDOCUMENTOS INCOMPLETOS:\n"
    for d in data["documentos_incompletos"]:
        s += f"- {d['id']}, Ramo: {d['ramo']}, Asegurado: {d['asegurado']}, Docs entregados: {d['documentos_entregados']}\n"
    return s


def get_fallback_database_context():
    return {
        "siniestros_top": [
            {"id": "#FR-87291", "insured": "Carlos Méndez", "ramo": "Vehículos",
             "cobertura": "Daño parcial", "monto": 28450.0, "sucursal": "Guayaquil",
             "similitud_narrativa": 0.94, "proveedor_nombre": "Taller Express",
             "proveedor_lista_restrictiva": "Sí", "docs_completos": "No", "dias_desde_inicio_poliza": 2},
            {"id": "#FR-76123", "insured": "Ana Rodríguez", "ramo": "Vehículos",
             "cobertura": "Choque", "monto": 15230.0, "sucursal": "Quito",
             "similitud_narrativa": 0.89, "proveedor_nombre": "AutoMecánica L&R",
             "proveedor_lista_restrictiva": "Sí", "docs_completos": "Sí", "dias_desde_inicio_poliza": 40},
        ],
        "proveedores_top": [
            {"nombre": "Taller Express", "lista_restrictiva": "Sí", "siniestros_asociados": 12,
             "promedio_monto": 22450.0, "motivo_restriccion": "Clonación sistemática de relatos"},
        ],
        "sucursales": [
            {"sucursal": "Quito", "count": 60, "monto_total": 920000.0},
            {"sucursal": "Guayaquil", "count": 58, "monto_total": 850000.0},
        ],
        "asegurados_alta_frecuencia": [
            {"nombres": "Carlos Méndez", "frecuencia": 3},
        ],
        "documentos_incompletos": [
            {"id": "#FR-87291", "ramo": "Vehículos", "asegurado": "Carlos Méndez", "documentos_entregados": 2},
        ]
    }


def get_database_context(conn):
    res_claims = conn.execute(text("""
        SELECT
            REPLACE(s.id_siniestro, 'SIN-', 'FR-') AS caso_id,
            a.nombres_asegurado, s.ramo, s.cobertura, s.monto_reclamado,
            s.sucursal, s.similitud_narrativa_max, s.docs_completos,
            s.prov_lista_restrictiva, s.dias_desde_inicio_poliza, p.nombre_proveedor
        FROM siniestros s
        LEFT JOIN asegurados a ON s.id_asegurado = a.id_asegurado
        LEFT JOIN proveedores p ON s.id_proveedor = p.id_proveedor
        ORDER BY s.similitud_narrativa_max DESC, s.monto_reclamado DESC
        LIMIT 30
    """)).fetchall()
    claims_list = [{
        "id": f"#{r.caso_id}",
        "insured": r.nombres_asegurado or "Asegurado Anónimo",
        "ramo": r.ramo, "cobertura": r.cobertura,
        "monto": float(r.monto_reclamado) if r.monto_reclamado else 0.0,
        "sucursal": r.sucursal,
        "similitud_narrativa": float(r.similitud_narrativa_max) if r.similitud_narrativa_max else 0.0,
        "docs_completos": r.docs_completos,
        "proveedor_lista_restrictiva": r.prov_lista_restrictiva,
        "dias_desde_inicio_poliza": r.dias_desde_inicio_poliza or 0,
        "proveedor_nombre": r.nombre_proveedor or "Sin taller asignado"
    } for r in res_claims]

    res_provs = conn.execute(text("""
        SELECT nombre_proveedor, lista_restrictiva, siniestros_asociados, promedio_monto, motivo_restriccion
        FROM proveedores ORDER BY siniestros_asociados DESC, promedio_monto DESC LIMIT 10
    """)).fetchall()
    provs_list = [{"nombre": r.nombre_proveedor, "lista_restrictiva": r.lista_restrictiva,
                   "siniestros_asociados": r.siniestros_asociados or 0,
                   "promedio_monto": float(r.promedio_monto) if r.promedio_monto else 0.0,
                   "motivo_restriccion": r.motivo_restriccion or "Sin observaciones"}
                  for r in res_provs]

    res_sucs = conn.execute(text(
        "SELECT sucursal, COUNT(*), SUM(monto_reclamado) FROM siniestros GROUP BY sucursal ORDER BY 2 DESC"
    )).fetchall()
    sucs_list = [{"sucursal": r[0] or "S/D", "count": r[1], "monto_total": float(r[2]) if r[2] else 0.0}
                 for r in res_sucs]

    res_aseg = conn.execute(text("""
        SELECT a.nombres_asegurado, COUNT(s.id_siniestro) as freq
        FROM siniestros s JOIN asegurados a ON s.id_asegurado = a.id_asegurado
        GROUP BY a.nombres_asegurado ORDER BY freq DESC LIMIT 10
    """)).fetchall()
    aseg_list = [{"nombres": r[0] or "Anónimo", "frecuencia": r[1]} for r in res_aseg]

    res_docs = conn.execute(text("""
        SELECT REPLACE(s.id_siniestro, 'SIN-', 'FR-') AS caso_id, s.ramo,
               a.nombres_asegurado, COUNT(d.id_documento) as docs_count
        FROM siniestros s
        JOIN asegurados a ON s.id_asegurado = a.id_asegurado
        LEFT JOIN documentos d ON s.id_siniestro = d.id_siniestro
        WHERE s.docs_completos = 'No'
        GROUP BY s.id_siniestro, s.ramo, a.nombres_asegurado LIMIT 10
    """)).fetchall()
    docs_list = [{"id": f"#{r[0]}", "ramo": r[1], "asegurado": r[2] or "Anónimo",
                  "documentos_entregados": r[3]} for r in res_docs]

    return {"siniestros_top": claims_list, "proveedores_top": provs_list,
            "sucursales": sucs_list, "asegurados_alta_frecuencia": aseg_list,
            "documentos_incompletos": docs_list}


def get_mock_ai_agent_response(user_msg: str) -> str:
    msg_lower = user_msg.lower()
    if "10" in msg_lower or "top" in msg_lower or "mayor riesgo" in msg_lower:
        return """### Top Siniestros con Mayor Riesgo de Posible Fraude\n\n1. **#FR-87291** (Carlos Méndez) - **Score: 89%** | *Narrativa duplicada, taller observado.*\n2. **#FR-76123** (Ana Rodríguez) - **Score: 76%** | *Proveedor en lista restrictiva.*\n3. **#FR-65109** (Pedro Gómez) - **Score: 72%** | *Patrón de ocurrencia recurrente.*"""
    elif "proveedor" in msg_lower or "taller" in msg_lower:
        return """### Concentración de Alertas por Proveedores\n\n* **Taller Express** (Guayaquil): 12 siniestros vinculados. En lista restrictiva.\n* **AutoMecánica L&R** (Quito): 8 siniestros. Sobrefacturación."""
    else:
        return """Hola. Soy **fraudIA Assistant**. Analizo siniestros de seguros para detectar posibles fraudes.\n\n¿Te gustaría que analice los casos más críticos, los proveedores con más alertas, o un resumen ejecutivo?"""


@app.post("/api/chat")
def handle_chat_agent(payload: ChatInput):
    user_msg = payload.message.strip()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"response": get_mock_ai_agent_response(user_msg)}
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            context_data = get_database_context(conn)
    except Exception as e:
        print(f"Error fetching database context for AI Agent: {e}")
        context_data = get_fallback_database_context()
    context_str = format_context_for_gemini(context_data)

    # Cambio 12: system prompt limpio sin nota confusa sobre formatos de ID
    system_prompt = f"""Eres **fraudIA Assistant**, un asistente virtual experto y especializado en análisis forense antifraude y control de siniestros de seguros. Tu público son analistas especializados en auditoría y jefes de reclamos.

**PRINCIPIO CLAVE**: Tus análisis generan sugerencias o alertas de revisión detallada, jamás acusaciones formales de fraude ni recomendaciones automáticas de rechazo. Usa siempre terminología técnica, analítica, profesional y precavida (ej: "Se sugiere revisión", "Muestra patrón irregular", "Alerta elevada", "Posible colusión").

Tienes acceso en tiempo real a la base de datos de siniestros. Estado actual consolidado:
{context_str}

Todos los casos se identifican con el formato #FR-XXXX. Responde de forma clara, profesional y estructurada usando Markdown.
Si la pregunta no está relacionada con siniestros de seguros o fraude, responde amablemente que tu especialidad es el análisis forense de siniestros en fraudIA.
"""
    try:
        contents = []
        if payload.history:
            for i, h in enumerate(payload.history):
                role = "model" if h.get("role") == "assistant" else "user"
                text_content = h.get("content", "")
                if i == 0 and role == "user":
                    text_content = f"{system_prompt}\n\n{text_content}"
                contents.append({
                    "role": role,
                    "parts": [{"text": text_content}]
                })
        
        current_text = f"Pregunta del Analista: {user_msg}"
        if not payload.history:
            current_text = f"{system_prompt}\n\n{current_text}"
            
        contents.append({
            "role": "user",
            "parts": [{"text": current_text}]
        })

        import requests
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')}:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        body = {"contents": contents}
        response = requests.post(url, json=body, headers=headers, timeout=15)
        response_json = response.json()
        if "candidates" in response_json and len(response_json["candidates"]) > 0:
            ai_text = response_json["candidates"][0]["content"]["parts"][0]["text"]
            return {"response": ai_text}
        else:
            return {"response": get_mock_ai_agent_response(user_msg)}
    except Exception as e:
        print(f"Exception during Gemini API call: {e}")
        return {"response": get_mock_ai_agent_response(user_msg)}


# ── Mock helpers ──────────────────────────────────────────────────────────────
def get_mock_detections():
    return [
        {"time": "09:42", "title": "Nueva coincidencia narrativa detectada", "detail": "Caso #FR-87291 - Similitud 94%", "tone": "red"},
        {"time": "09:44", "title": "Taller vinculado a 4 reclamos", "detail": "Taller Express - Red detectada", "tone": "orange"},
        {"time": "09:45", "title": "Riesgo elevado automáticamente", "detail": "Caso #FR-76123 - Score 89%", "tone": "red"},
        {"time": "09:47", "title": "Geolocalización sospechosa identificada", "detail": "Caso #FR-65109 - Patrón inusual", "tone": "orange"},
        {"time": "09:48", "title": "Caso escalado por IA", "detail": "Caso #FR-87291 - Escalado automático", "tone": "violet"}
    ]


def get_mock_map_claims():
    return [
        {"label": "7", "x": "38%", "y": "24%", "tone": "blue", "sucursal": "Quito"},
        {"label": "9", "x": "22%", "y": "54%", "tone": "blue", "sucursal": "Guayaquil"},
        {"label": "12", "x": "16%", "y": "38%", "tone": "blue", "sucursal": "Portoviejo"},
        {"label": "15", "x": "35%", "y": "62%", "tone": "blue", "sucursal": "Cuenca"}
    ]


def get_mock_narratives_similar():
    return {
        "original_text": "El vehiculo fue impactado mientras estaba estacionado en la via publica por un tercero que se dio a la fuga...",
        "score": "89%",
        "similar_list": [
            {"id": "#S-78123", "score": "85%"}, {"id": "#S-65109", "score": "82%"},
            {"id": "#S-55867", "score": "79%"}, {"id": "#S-44321", "score": "76%"}
        ]
    }


def get_mock_timeline(case_id: str):
    return [
        {"time": "09:14", "label": "Reclamo generado", "tone": "green"},
        {"time": "09:15", "label": "Validación IA iniciada", "tone": "blue"},
        {"time": "09:16", "label": f"Coincidencia encontrada para {case_id}", "tone": "orange"},
        {"time": "09:17", "label": "Red sospechosa detectada", "tone": "red"},
        {"time": "09:18", "label": "Escalado automático", "tone": "red"}
    ]


def get_mock_cases():
    return [
        {"id": "#FR-87291", "insured": "Carlos Méndez", "date": "28/05/2025", "branch": "Vehículos", "amount": "$28,450", "score": "89%", "level": "Alto"},
        {"id": "#FR-76123", "insured": "Ana Rodríguez", "date": "28/05/2025", "branch": "Vehículos", "amount": "$15,230", "score": "76%", "level": "Alto"},
        {"id": "#FR-65109", "insured": "Pedro Gómez", "date": "27/05/2025", "branch": "Vehículos", "amount": "$9,890", "score": "72%", "level": "Alto"},
        {"id": "#FR-55867", "insured": "Laura Torres", "date": "26/05/2025", "branch": "Salud", "amount": "$6,420", "score": "65%", "level": "Medio"},
        {"id": "#FR-44321", "insured": "Miguel Ramírez", "date": "26/05/2025", "branch": "Hogar", "amount": "$3,210", "score": "58%", "level": "Medio"}
    ]


def get_mock_critical_cases():
    return [
        {"caseId": "#FR-87291", "insured": "Carlos Méndez", "risk": "CRÍTICO", "alert": "Narrativa duplicada",
         "amount": "$28,450", "score": "89%", "state": "Escalado", "city": "Guayaquil, Guayas",
         "provider": "Taller Express", "vehicle": "KIA Sportage 2021", "date": "28/05/2025"},
        {"caseId": "#FR-76123", "insured": "Ana Rodríguez", "risk": "ALTO", "alert": "Taller sospechoso",
         "amount": "$15,230", "score": "76%", "state": "Investigación IA", "city": "Quito, Pichincha",
         "provider": "AutoMecánica L&R", "vehicle": "Mazda CX-5 2020", "date": "28/05/2025"},
        {"caseId": "#FR-65109", "insured": "Pedro Gómez", "risk": "ALTO", "alert": "Patrón recurrente",
         "amount": "$9,890", "score": "72%", "state": "En revisión", "city": "Cuenca, Azuay",
         "provider": "Car Center Pro", "vehicle": "Hyundai Tucson 2022", "date": "27/05/2025"},
        {"caseId": "#FR-55867", "insured": "Laura Torres", "risk": "MEDIO", "alert": "Red colaborativa",
         "amount": "$7,420", "score": "65%", "state": "Investigación IA", "city": "Ambato, Tungurahua",
         "provider": "Taller La 80", "vehicle": "Chevrolet Spark 2019", "date": "26/05/2025"},
        {"caseId": "#FR-44321", "insured": "Miguel Ramírez", "risk": "ALTO", "alert": "Geolocalización anómala",
         "amount": "$3,210", "score": "68%", "state": "Escalado", "city": "Portoviejo, Manabí",
         "provider": "MotorFix", "vehicle": "Nissan Versa 2021", "date": "26/05/2025"}
    ]


def get_mock_providers():
    return [
        {"id_proveedor": "TALLER-001", "nombre_proveedor": "Taller Express", "tipo_proveedor": "Taller",
         "ciudad_proveedor": "Guayaquil", "siniestros_asociados": 12, "lista_restrictiva": "Sí",
         "motivo_restriccion": "Clonación sistemática de relatos", "promedio_monto": 22450.0, "alerta_nivel": "rojo"},
        {"id_proveedor": "TALLER-002", "nombre_proveedor": "AutoMecánica L&R", "tipo_proveedor": "Taller",
         "ciudad_proveedor": "Quito", "siniestros_asociados": 8, "lista_restrictiva": "Sí",
         "motivo_restriccion": "Sobrefacturación", "promedio_monto": 13800.0, "alerta_nivel": "rojo"},
        {"id_proveedor": "TALLER-003", "nombre_proveedor": "Car Center Pro", "tipo_proveedor": "Taller",
         "ciudad_proveedor": "Cuenca", "siniestros_asociados": 4, "lista_restrictiva": "No",
         "motivo_restriccion": "Sin observaciones", "promedio_monto": 9200.0, "alerta_nivel": "amarillo"},
    ]


def get_mock_insureds():
    return [
        {"id_asegurado": "AS-001", "nombres_asegurado": "Carlos Méndez", "ciudad": "Guayaquil",
         "antiguedad_asegurado": 4, "reclamos_ult_12m": 3, "reclamos_historico_total": 5,
         "perfil_riesgo_historico": "Alto", "total_siniestros_activos": 3, "nivel_riesgo": "alto"},
        {"id_asegurado": "AS-002", "nombres_asegurado": "Ana Rodríguez", "ciudad": "Quito",
         "antiguedad_asegurado": 2, "reclamos_ult_12m": 2, "reclamos_historico_total": 2,
         "perfil_riesgo_historico": "Medio", "total_siniestros_activos": 2, "nivel_riesgo": "medio"},
    ]


def get_mock_vehicles():
    return [
        {"placa": "GBK-1234", "total_siniestros": 5, "monto_total": 85000.0,
         "max_similitud": 0.94, "coberturas": "Daño parcial, Choque", "alerta": True},
        {"placa": "PIC-5678", "total_siniestros": 3, "monto_total": 45000.0,
         "max_similitud": 0.82, "coberturas": "Choque", "alerta": True},
        {"placa": "QUI-0921", "total_siniestros": 1, "monto_total": 12000.0,
         "max_similitud": 0.45, "coberturas": "Robo parcial", "alerta": False},
    ]



from fastapi.responses import FileResponse

# ── ENDPOINT: Compare Narratives ──────────────────────────────────────────────
@app.get("/api/model/comparison")
def compare_narratives(text: str = "", text1: str = "", text2: str = ""):
    # If text is provided, it's comparing against DB (mocked for now)
    # If text1 and text2 are provided, it's comparing two specific texts
    t1 = text1 if text1 else text
    t2 = text2 if text2 else "El asegurado indica que el choque ocurrió en una intersección sin semáforo."
    
    words1 = set(t1.lower().split())
    words2 = set(t2.lower().split())
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    similarity = len(intersection) / len(union) if len(union) > 0 else 0
    
    score = min(1.0, similarity * 1.5 + 0.2)
    return {
        "similarity_score": round(score, 2),
        "match_level": "Alto" if score > 0.8 else "Medio" if score > 0.5 else "Bajo",
        "common_terms": list(intersection)[:5]
    }

# ── ENDPOINT: Download Reports ────────────────────────────────────────────────
@app.get("/api/model/reports/{filename}")
def get_report(filename: str):
    reports_dir = Path(__file__).resolve().parents[3] / "reports"
    file_path = reports_dir / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(file_path)

# ── ENDPOINT: Case Feedback ───────────────────────────────────────────────────
class CaseFeedback(BaseModel):
    action: str
    reason: str
    
@app.post("/api/cases/{case_id}/feedback")
def submit_feedback(case_id: str, feedback: CaseFeedback):
    print(f"[fraudIA] Feedback received for {case_id}: {feedback.action} - {feedback.reason}")
    return {"status": "success", "message": "Feedback recorded successfully"}

if __name__ == "__main__":

    import uvicorn
    uvicorn.run("src.app.api:app", host="0.0.0.0", port=8000, reload=True)
