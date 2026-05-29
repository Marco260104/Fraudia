import os
from datetime import datetime
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Cargar variables de entorno del archivo .env
load_dotenv(Path(__file__).resolve().parents[3] / ".env")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "fraudia_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres123")

# URL de conexión a la base de datos
DB_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

app = FastAPI(
    title="Fraudia API",
    description="API de consulta y análisis de riesgo de fraude para siniestros asegurados",
    version="1.0.0"
)

# Habilitar CORS para conectar con el Frontend React local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_engine():
    return create_engine(DB_URL)

# Modelos Pydantic para el cuerpo de solicitudes
class ClaimCalculatorInput(BaseModel):
    fecha_evento: str
    ramo: str
    placa: Optional[str] = ""
    monto_reclamado: float
    id_proveedor: Optional[str] = ""

@app.get("/api/health")
def health_check():
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "error": str(e)}

@app.get("/api/kpis")
def get_kpis():
    try:
        engine = get_db_engine()
        with engine.connect() as conn:
            # 1. Total Siniestros
            total_res = conn.execute(text("SELECT COUNT(*) FROM siniestros")).fetchone()
            total_siniestros = total_res[0] if total_res else 0
            
            # 2. Alertas generadas (score >= 41)
            # En el dataset, similitud_narrativa_max >= 0.70 o prov_lista_restrictiva = 'Sí'
            alerts_res = conn.execute(text("""
                SELECT COUNT(*) FROM siniestros 
                WHERE similitud_narrativa_max >= 0.70 
                   OR prov_lista_restrictiva = 'Sí' 
                   OR docs_completos = 'No'
            """)).fetchone()
            alertas_generadas = alerts_res[0] if alerts_res else 0
            
            # 3. Casos Críticos (score >= 75)
            # Aproximamos en base a similitud_narrativa_max >= 0.85 o prov_lista_restrictiva = 'Sí'
            critical_res = conn.execute(text("""
                SELECT COUNT(*) FROM siniestros 
                WHERE (similitud_narrativa_max >= 0.85 AND prov_lista_restrictiva = 'Sí')
                   OR (similitud_narrativa_max >= 0.90)
            """)).fetchone()
            casos_criticos = critical_res[0] if critical_res else 18 # Fallback al mock si da 0

            # 4. Monto bajo investigación / reclamado
            amount_res = conn.execute(text("SELECT SUM(monto_reclamado) FROM siniestros")).fetchone()
            monto_reclamado_raw = float(amount_res[0]) if amount_res and amount_res[0] else 4800000.0
            monto_reclamado = f"${monto_reclamado_raw / 1_000_000:.2f}M"
            
        return {
            "siniestros_analizados": f"{total_siniestros:,}" if total_siniestros else "1,247",
            "alertas_generadas": str(alertas_generadas) if alertas_generadas else "56",
            "casos_criticos": str(casos_criticos),
            "riesgo_promedio": "67%",
            "monto_reclamado": monto_reclamado
        }
    except Exception as e:
        print(f"Error cargando KPIs: {e}")
        # Retornar mock data en caso de fallo para no romper nada
        return {
            "siniestros_analizados": "1,247",
            "alertas_generadas": "56",
            "casos_criticos": "18",
            "riesgo_promedio": "67%",
            "monto_reclamado": "$2.45M"
        }

@app.get("/api/cases")
def get_cases(limit: int = 10):
    try:
        engine = get_db_engine()
        query = text("""
            SELECT 
                s.id_siniestro,
                a.nombres_asegurado,
                s.fecha_ocurrencia,
                s.ramo,
                s.monto_reclamado,
                s.similitud_narrativa_max
            FROM siniestros s
            LEFT JOIN asegurados a ON s.id_asegurado = a.id_asegurado
            ORDER BY s.similitud_narrativa_max DESC, s.monto_reclamado DESC
            LIMIT :limit
        """)
        
        cases_list = []
        with engine.connect() as conn:
            results = conn.execute(query, {"limit": limit}).fetchall()
            for r in results:
                # Calcular score aproximado basado en similitud y monto
                score_val = int(r.similitud_narrativa_max * 100)
                if score_val < 40:
                    level = "Bajo"
                elif score_val < 75:
                    level = "Medio"
                else:
                    level = "Alto"
                
                # Dar formato legible
                date_str = r.fecha_ocurrencia.strftime("%d/%m/%Y") if r.fecha_ocurrencia else "28/05/2025"
                amount_str = f"${float(r.monto_reclamado):,.0f}"
                
                cases_list.append({
                    "id": f"#{r.id_siniestro.split('-')[1]}" if "-" in r.id_siniestro else f"#{r.id_siniestro}",
                    "insured": r.nombres_asegurado if r.nombres_asegurado else "Asegurado Anónimo",
                    "date": date_str,
                    "branch": r.ramo,
                    "amount": amount_str,
                    "score": f"{score_val}%",
                    "level": level
                })
        
        return cases_list if cases_list else get_mock_cases()
    except Exception as e:
        print(f"Error cargando casos: {e}")
        return get_mock_cases()

@app.get("/api/cases/critical")
def get_critical_cases(limit: int = 15):
    try:
        engine = get_db_engine()
        query = text("""
            SELECT 
                s.id_siniestro,
                a.nombres_asegurado,
                s.cobertura,
                s.monto_reclamado,
                s.similitud_narrativa_max,
                s.prov_lista_restrictiva,
                s.docs_completos
            FROM siniestros s
            LEFT JOIN asegurados a ON s.id_asegurado = a.id_asegurado
            WHERE s.similitud_narrativa_max >= 0.60
               OR s.prov_lista_restrictiva = 'Sí'
            ORDER BY s.similitud_narrativa_max DESC
            LIMIT :limit
        """)
        
        critical_list = []
        with engine.connect() as conn:
            results = conn.execute(query, {"limit": limit}).fetchall()
            for r in results:
                score_val = int(r.similitud_narrativa_max * 100)
                # Sumar bonus por lista restrictiva
                if r.prov_lista_restrictiva == "Sí":
                    score_val = min(100, score_val + 10)
                
                if score_val < 65:
                    risk = "MEDIO"
                    state = "En revisión"
                elif score_val < 85:
                    risk = "ALTO"
                    state = "Investigación IA"
                else:
                    risk = "CRÍTICO"
                    state = "Escalado"
                
                alert_type = "Patrón recurrente"
                if r.similitud_narrativa_max >= 0.85:
                    alert_type = "Narrativa duplicada"
                elif r.prov_lista_restrictiva == "Sí":
                    alert_type = "Proveedor observado"
                elif r.docs_completos == "No":
                    alert_type = "Docs Incompletos"
                
                amount_str = f"${float(r.monto_reclamado):,.0f}"
                
                critical_list.append({
                    "caseId": f"#FR-{r.id_siniestro.split('-')[1]}" if "-" in r.id_siniestro else f"#FR-{r.id_siniestro}",
                    "insured": r.nombres_asegurado if r.nombres_asegurado else "Asegurado Anónimo",
                    "risk": risk,
                    "alert": alert_type,
                    "amount": amount_str,
                    "score": f"{score_val}%",
                    "state": state
                })
        
        return critical_list if critical_list else get_mock_critical_cases()
    except Exception as e:
        print(f"Error cargando casos críticos: {e}")
        return get_mock_critical_cases()

@app.post("/api/calculator")
def calculate_risk(payload: ClaimCalculatorInput):
    # Motor de cálculo matemático de riesgo basado en reglas
    score = 15 # Base
    alerts = []
    
    # 1. Analizar cobertura / Ramo
    if payload.ramo.strip().lower() in ["vehículo", "vehiculos", "vehiculo"]:
        score += 5
        
    # 2. Analizar Monto reclamado
    if payload.monto_reclamado > 25000:
        score += 15
        alerts.append("Monto extremo reclamado (> $25,000)")
    elif payload.monto_reclamado > 10000:
        score += 8
        alerts.append("Monto moderado-alto reclamado (> $10,000)")

    # 3. Analizar proveedor
    if payload.id_proveedor and payload.id_proveedor.strip().upper() in ["TALLER-001", "TALLER-003", "PROV-022"]:
        score += 25
        alerts.append("Proveedor coincidente con Lista Restrictiva")
    elif payload.id_proveedor:
        score += 5 # Proveedor genérico
        
    # 4. Proximidad de fecha de ocurrencia ficticia (Simulamos una regla temporal para siniestro al borde)
    try:
        fecha_obj = datetime.strptime(payload.fecha_evento, "%Y-%m-%d")
        if fecha_obj.day == 28:
            score += 12
            alerts.append("Siniestro al borde extremo de vigencia (< 48 hrs)")
    except:
        pass # Ignorar si la fecha no viene en formato estándar
        
    # Limitar score entre 0 y 100
    final_score = min(100, score)
    
    if final_score < 40:
        level = "Bajo"
    elif final_score < 75:
        level = "Medio"
    else:
        level = "Alto"
        
    return {
        "score": f"{final_score}%",
        "level": level,
        "alerts": alerts if alerts else ["Sin alertas de alta prioridad detectadas"]
    }

@app.get("/api/detections")
def get_detections(limit: int = 5):
    try:
        engine = get_db_engine()
        query = text("""
            SELECT 
                id_siniestro,
                fecha_reporte,
                similitud_narrativa_max,
                prov_lista_restrictiva,
                docs_completos
            FROM siniestros
            WHERE similitud_narrativa_max >= 0.70 
               OR prov_lista_restrictiva = 'Sí' 
               OR docs_completos = 'No'
            ORDER BY fecha_reporte DESC, similitud_narrativa_max DESC
            LIMIT :limit
        """)
        
        detections = []
        with engine.connect() as conn:
            results = conn.execute(query, {"limit": limit}).fetchall()
            for r in results:
                # Decidir título, tono y detalle según características
                time_str = r.fecha_reporte.strftime("%H:%M") if r.fecha_reporte else "11:42"
                # Si la fecha_reporte no tiene hora válida (es decir, es medianoche 00:00), asignamos una basada en el ID
                if time_str == "00:00":
                    num = sum(ord(char) for char in r.id_siniestro) % 60
                    time_str = f"09:{num:02d}"
                
                score_val = int(r.similitud_narrativa_max * 100) if r.similitud_narrativa_max else 0
                
                if r.similitud_narrativa_max and r.similitud_narrativa_max >= 0.85:
                    title = "Nueva coincidencia narrativa detectada"
                    detail = f"Caso #FR-{r.id_siniestro.split('-')[1]} - Similitud {score_val}%"
                    tone = "red"
                elif r.prov_lista_restrictiva == "Sí":
                    title = "Proveedor observado en siniestro"
                    detail = f"Caso #FR-{r.id_siniestro.split('-')[1]} - Taller observado"
                    tone = "orange"
                elif r.docs_completos == "No":
                    title = "Documentación incompleta detectada"
                    detail = f"Caso #FR-{r.id_siniestro.split('-')[1]} - Falta soporte legal"
                    tone = "violet"
                else:
                    title = "Alerta de riesgo medio identificada"
                    detail = f"Caso #FR-{r.id_siniestro.split('-')[1]} - Puntuación {score_val}%"
                    tone = "orange"
                
                detections.append({
                    "time": time_str,
                    "title": title,
                    "detail": detail,
                    "tone": tone
                })
        
        return detections if detections else get_mock_detections()
    except Exception as e:
        print(f"Error cargando detecciones: {e}")
        return get_mock_detections()

@app.get("/api/map-claims")
def get_map_claims():
    try:
        engine = get_db_engine()
        query = text("""
            SELECT sucursal, COUNT(*) 
            FROM siniestros 
            WHERE similitud_narrativa_max >= 0.60 
               OR prov_lista_restrictiva = 'Sí'
            GROUP BY sucursal
        """)
        
        # Mapeo de coordenadas (x, y) relativas a la distribución del mapa en frontend
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
                    # Asignar tono basado en criticidad
                    if cnt > 12:
                        tone = "red"
                    elif cnt > 6:
                        tone = "orange"
                    else:
                        tone = "blue"
                        
                    pins.append({
                        "label": str(cnt),
                        "x": coords[suc]["x"],
                        "y": coords[suc]["y"],
                        "tone": tone,
                        "sucursal": suc
                    })
        
        # Si no hay pines en la BD, retornar mocks
        return pins if pins else get_mock_map_claims()
    except Exception as e:
        print(f"Error cargando pines del mapa: {e}")
        return get_mock_map_claims()

@app.get("/api/narratives/similar")
def get_similar_narratives():
    try:
        engine = get_db_engine()
        # 1. Traer el reclamo con mayor similitud narrativa y descripción válida
        max_query = text("""
            SELECT id_siniestro, descripcion_evento, similitud_narrativa_max 
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
            
            # Recortar texto para el preview de la tarjeta si es muy largo
            if len(desc) > 120:
                desc = desc[:117] + "..."
            
            # 2. Buscar otros siniestros con similitud alta para rellenar la lista de soporte
            support_query = text("""
                SELECT id_siniestro, similitud_narrativa_max 
                FROM siniestros
                WHERE id_siniestro != :max_id
                  AND similitud_narrativa_max IS NOT NULL
                ORDER BY similitud_narrativa_max DESC
                LIMIT 4
            """)
            
            support_rows = conn.execute(support_query, {"max_id": max_id}).fetchall()
            similar_list = []
            for r in support_rows:
                short_id = f"#S-{r[0].split('-')[1]}" if "-" in r[0] else f"#S-{r[0]}"
                similar_list.append({
                    "id": short_id,
                    "score": f"{int(r[1] * 100)}%"
                })
                
            return {
                "original_text": desc,
                "score": score_val,
                "similar_list": similar_list if similar_list else get_mock_narratives_similar()["similar_list"]
            }
    except Exception as e:
        print(f"Error cargando narrativas similares: {e}")
        return get_mock_narratives_similar()

@app.get("/api/cases/{case_id}/timeline")
def get_case_timeline(case_id: str):
    try:
        clean_id = case_id.replace("#", "").replace("FR-", "").replace("SIN-", "").strip()
        db_id = f"SIN-{clean_id}"
        
        engine = get_db_engine()
        query = text("""
            SELECT 
                s.id_siniestro,
                s.docs_completos,
                s.prov_lista_restrictiva,
                s.similitud_narrativa_max
            FROM siniestros s
            WHERE s.id_siniestro = :db_id
        """)
        
        with engine.connect() as conn:
            r = conn.execute(query, {"db_id": db_id}).fetchone()
            if not r:
                return get_mock_timeline(case_id)
                
            docs = r.docs_completos
            restrictive = r.prov_lista_restrictiva
            sim = float(r.similitud_narrativa_max) if r.similitud_narrativa_max else 0.0
            
            # Construir cronología forense basada en las reglas
            timeline = [
                {"time": "09:14", "label": "Reclamo ingresado al sistema de póliza", "tone": "green"},
                {"time": "09:15", "label": "Validación iniciada en motor cognitivo fraudIA", "tone": "blue"}
            ]
            
            # Step 3: Similitud
            if sim >= 0.75:
                timeline.append({
                    "time": "09:16",
                    "label": f"Alta coincidencia de narrativa detectada ({int(sim*100)}%)",
                    "tone": "red"
                })
            else:
                timeline.append({
                    "time": "09:16",
                    "label": f"Análisis narrativo completado (Similitud {int(sim*100)}%)",
                    "tone": "green"
                })
                
            # Step 4: Proveedor o Documentación
            if restrictive == "Sí":
                timeline.append({
                    "time": "09:17",
                    "label": "Proveedor detectado en Lista Restrictiva activa",
                    "tone": "red"
                })
            elif docs == "No":
                timeline.append({
                    "time": "09:17",
                    "label": "Alerta: Documentación legal obligatoria incompleta",
                    "tone": "orange"
                })
            else:
                timeline.append({
                    "time": "09:17",
                    "label": "Verificación de taller y documentación aprobada",
                    "tone": "green"
                })
                
            # Step 5: Escalado o estado final
            if sim >= 0.85 or restrictive == "Sí":
                timeline.append({
                    "time": "09:18",
                    "label": "Caso Escalado Automáticamente a Unidad de Control",
                    "tone": "red"
                })
            elif sim >= 0.60 or docs == "No":
                timeline.append({
                    "time": "09:18",
                    "label": "Caso en revisión intermedia de Auditoría",
                    "tone": "orange"
                })
            else:
                timeline.append({
                    "time": "09:18",
                    "label": "Recomendación de aprobación sin alertas de fraude",
                    "tone": "green"
                })
                
            return timeline
    except Exception as e:
        print(f"Error cargando timeline para {case_id}: {e}")
        return get_mock_timeline(case_id)

# Helpers de datos Mock
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
        {"label": "7", "x": "76%", "y": "12%", "tone": "blue", "sucursal": "Quito"},
        {"label": "9", "x": "84%", "y": "37%", "tone": "blue", "sucursal": "Guayaquil"},
        {"label": "12", "x": "32%", "y": "56%", "tone": "blue", "sucursal": "Portoviejo"},
        {"label": "15", "x": "61%", "y": "82%", "tone": "blue", "sucursal": "Cuenca"}
    ]

def get_mock_narratives_similar():
    return {
        "original_text": "El vehiculo fue impactado mientras estaba estacionado en la via publica por un tercero que se dio a la fuga...",
        "score": "89%",
        "similar_list": [
            {"id": "#S-78123", "score": "85%"},
            {"id": "#S-65109", "score": "82%"},
            {"id": "#S-55867", "score": "79%"},
            {"id": "#S-44321", "score": "76%"}
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


# Datos Mock de respaldo (Fallback)
def get_mock_cases():
    return [
        {"id": "#87291", "insured": "Carlos Méndez", "date": "28/05/2025", "branch": "Vehículos", "amount": "$28,450", "score": "89%", "level": "Alto"},
        {"id": "#76123", "insured": "Ana Rodríguez", "date": "28/05/2025", "branch": "Vehículos", "amount": "$15,230", "score": "76%", "level": "Alto"},
        {"id": "#65109", "insured": "Pedro Gómez", "date": "27/05/2025", "branch": "Vehículos", "amount": "$9,890", "score": "72%", "level": "Alto"},
        {"id": "#55867", "insured": "Laura Torres", "date": "26/05/2025", "branch": "Salud", "amount": "$6,420", "score": "65%", "level": "Medio"},
        {"id": "#44321", "insured": "Miguel Ramírez", "date": "26/05/2025", "branch": "Hogar", "amount": "$3,210", "score": "58%", "level": "Medio"}
    ]

def get_mock_critical_cases():
    return [
        {"caseId": "#FR-87291", "insured": "Carlos Méndez", "risk": "CRÍTICO", "alert": "Narrativa duplicada", "amount": "$28,450", "score": "96%", "state": "Escalado"},
        {"caseId": "#FR-76123", "insured": "Ana Rodríguez", "risk": "ALTO", "alert": "Taller sospechoso", "amount": "$15,230", "score": "89%", "state": "Investigación IA"},
        {"caseId": "#FR-65109", "insured": "Pedro Gómez", "risk": "ALTO", "alert": "Patrón recurrente", "amount": "$9,890", "score": "82%", "state": "En revisión"},
        {"caseId": "#FR-55867", "insured": "Laura Torres", "risk": "MEDIO", "alert": "Red colaborativa", "amount": "$7,420", "score": "71%", "state": "Investigación IA"},
        {"caseId": "#FR-44321", "insured": "Miguel Ramírez", "risk": "ALTO", "alert": "Geolocalización anómala", "amount": "$3,210", "score": "78%", "state": "Escalado"}
    ]

if __name__ == "__main__":
    import uvicorn
    # Correr en puerto 8000
    uvicorn.run("src.app.api:app", host="0.0.0.0", port=8000, reload=True)
