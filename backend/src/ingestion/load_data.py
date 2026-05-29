import os
import sys
from pathlib import Path
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Configurar codificación utf-8 para la consola de Windows
sys.stdout.reconfigure(encoding='utf-8')

# Cargar variables de entorno del archivo .env
load_dotenv(Path(__file__).resolve().parents[3] / ".env")

# Configurar variables de conexión (con valores por defecto si no existen)
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "fraudia_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres123")

# Rutas de datos
BACKEND_DIR = Path(__file__).resolve().parents[2]
DATAENT_DIR = BACKEND_DIR / "DataEnt"

# Intentar usar el Excel en descargas del usuario si existe, o usar los CSV locales como respaldo
EXCEL_PATH = Path(r"C:\Users\marco\Downloads\Data set documentos evento -20260527T221913Z-3-001\Data set documentos evento\Evento Datasets_Sinteticos_Fraude_500_v2.xlsx")

def clean_numeric(series: pd.Series) -> pd.Series:
    cleaned = (
        series.astype(str)
        .str.replace("$", "", regex=False)
        .str.replace(",", "", regex=False)
        .str.replace("—", "", regex=False)
        .str.replace("N/A", "", regex=False)
        .str.strip()
    )
    return pd.to_numeric(cleaned, errors="coerce")

def load_data():
    # 1. Crear conexión de base de datos
    db_url = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    print(f"Conectando a la base de datos: postgresql://{DB_USER}:****@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    
    try:
        engine = create_engine(db_url)
        # Probar conexión
        with engine.connect() as conn:
            print("¡Conexión establecida con éxito!")
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        print("Asegúrate de que el contenedor de Docker esté levantado con 'docker-compose up -d'.")
        return

    # 2. Decidir fuente de datos (Excel en Downloads o CSV en la carpeta del repositorio)
    use_excel = EXCEL_PATH.exists()
    if use_excel:
        print(f"Leyendo datos desde el archivo Excel original: {EXCEL_PATH}")
        xl = pd.ExcelFile(EXCEL_PATH)
        df_siniestros = xl.parse("1_Siniestros")
        df_polizas = xl.parse("2_Polizas")
        df_asegurados = xl.parse("3_Asegurados")
        df_proveedores = xl.parse("4_Proveedores")
        df_documentos = xl.parse("5_Documentos")
    else:
        print(f"El Excel no existe en {EXCEL_PATH}. Leyendo los archivos CSV locales desde {DATAENT_DIR}")
        df_siniestros = pd.read_csv(DATAENT_DIR / "Siniestros.csv", encoding="utf-8-sig")
        df_polizas = pd.read_csv(DATAENT_DIR / "Polizas.csv", encoding="utf-8-sig")
        df_asegurados = pd.read_csv(DATAENT_DIR / "Asegurados-.csv", encoding="utf-8-sig")
        df_proveedores = pd.read_csv(DATAENT_DIR / "Proveedores.csv", encoding="utf-8-sig")
        df_documentos = pd.read_csv(DATAENT_DIR / "Documentos.csv", encoding="utf-8-sig")

    print("\n--- Procesando y normalizando Asegurados ---")
    df_asegurados_db = pd.DataFrame()
    df_asegurados_db["id_asegurado"] = df_asegurados["ID Asegurado"].astype(str).str.strip()
    df_asegurados_db["nombres_asegurado"] = df_asegurados["Nombres Asegurado"].astype(str).str.strip()
    df_asegurados_db["segmento"] = df_asegurados["Segmento"].astype(str).str.strip()
    df_asegurados_db["ciudad"] = df_asegurados["Ciudad"].astype(str).str.strip()
    df_asegurados_db["antiguedad_asegurado"] = clean_numeric(df_asegurados["Antigüedad (años)"]).fillna(0).astype(int)
    df_asegurados_db["n_polizas_activas"] = clean_numeric(df_asegurados["N° Pólizas Activas"]).fillna(0).astype(int)
    df_asegurados_db["reclamos_ult_12m"] = clean_numeric(df_asegurados["N° Reclamos Últimos 12 Meses"]).fillna(0).astype(int)
    df_asegurados_db["reclamos_historico_total"] = clean_numeric(df_asegurados["N° Reclamos Histórico Total"]).fillna(0).astype(int)
    df_asegurados_db["reclamos_rc_sin_tercero"] = clean_numeric(df_asegurados["Reclamos RC sin Tercero"]).fillna(0).astype(int)
    df_asegurados_db["perfil_riesgo_historico"] = df_asegurados["Perfil Riesgo Histórico"].astype(str).str.strip()
    # Eliminar duplicados si los hubiera
    df_asegurados_db = df_asegurados_db.drop_duplicates(subset=["id_asegurado"])

    print("\n--- Procesando y normalizando Pólizas ---")
    df_polizas_db = pd.DataFrame()
    df_polizas_db["id_poliza"] = df_polizas["ID Póliza"].astype(str).str.strip()
    df_polizas_db["id_asegurado"] = df_polizas["ID Asegurado"].astype(str).str.strip()
    df_polizas_db["ramo_poliza"] = df_polizas["Ramo"].astype(str).str.strip()
    df_polizas_db["fecha_inicio"] = pd.to_datetime(df_polizas["Fecha Inicio"], errors="coerce").dt.date
    df_polizas_db["fecha_fin"] = pd.to_datetime(df_polizas["Fecha Fin"], errors="coerce").dt.date
    df_polizas_db["suma_asegurada"] = clean_numeric(df_polizas["Suma Asegurada ($)"]).fillna(0)
    df_polizas_db["prima_anual"] = clean_numeric(df_polizas["Prima Anual ($)"]).fillna(0)
    df_polizas_db["canal_venta"] = df_polizas["Canal Venta"].astype(str).str.strip()
    df_polizas_db["estado_poliza"] = df_polizas["Estado Póliza"].astype(str).str.strip()
    df_polizas_db = df_polizas_db.drop_duplicates(subset=["id_poliza"])

    print("\n--- Procesando y normalizando Proveedores ---")
    df_proveedores_db = pd.DataFrame()
    df_proveedores_db["id_proveedor"] = df_proveedores["ID Proveedor"].astype(str).str.strip()
    df_proveedores_db["nombre_proveedor"] = df_proveedores["Nombre Proveedor"].astype(str).str.strip()
    df_proveedores_db["tipo_proveedor"] = df_proveedores["Tipo"].astype(str).str.strip()
    df_proveedores_db["ciudad_proveedor"] = df_proveedores["Ciudad"].astype(str).str.strip()
    df_proveedores_db["siniestros_asociados"] = clean_numeric(df_proveedores["N° Siniestros Asociados"]).fillna(0).astype(int)
    df_proveedores_db["lista_restrictiva"] = df_proveedores["En Lista Restrictiva"].astype(str).str.strip()
    df_proveedores_db["motivo_restriccion"] = df_proveedores["Motivo Restricción"].astype(str).str.strip().fillna("No")
    
    # Manejar "Promedio Monto ($)" u otras columnas alternativas si aplican
    monto_col = "Promedio Monto ($)" if "Promedio Monto ($)" in df_proveedores.columns else df_proveedores.columns[-1]
    df_proveedores_db["promedio_monto"] = clean_numeric(df_proveedores[monto_col]).fillna(0)
    df_proveedores_db = df_proveedores_db.drop_duplicates(subset=["id_proveedor"])

    print("\n--- Procesando y normalizando Siniestros ---")
    df_siniestros_db = pd.DataFrame()
    df_siniestros_db["id_siniestro"] = df_siniestros["ID Siniestro"].astype(str).str.strip()
    df_siniestros_db["id_poliza"] = df_siniestros["ID Póliza"].astype(str).str.strip()
    df_siniestros_db["id_asegurado"] = df_siniestros["ID Asegurado"].astype(str).str.strip()
    df_siniestros_db["ramo"] = df_siniestros["Ramo"].astype(str).str.strip()
    
    # Placa
    placa_col = "Placa Vehículo Asegurado" if "Placa Vehículo Asegurado" in df_siniestros.columns else "Placa"
    df_siniestros_db["placa_vehiculo_asegurado"] = df_siniestros[placa_col].fillna("N/A").astype(str).str.strip()
    
    df_siniestros_db["cobertura"] = df_siniestros["Cobertura"].astype(str).str.strip()
    df_siniestros_db["fecha_occurrencia"] = pd.to_datetime(df_siniestros["Fecha Ocurrencia"], errors="coerce").dt.date
    df_siniestros_db["fecha_reporte"] = pd.to_datetime(df_siniestros["Fecha Reporte"], errors="coerce").dt.date
    
    dias_rep_col = "Días Ocurr→Reporte" if "Días Ocurr→Reporte" in df_siniestros.columns else "Días Ocurr_Reporte"
    df_siniestros_db["dias_ocurrencia_reporte"] = clean_numeric(df_siniestros[dias_rep_col]).fillna(0).astype(int)
    
    df_siniestros_db["monto_reclamado"] = clean_numeric(df_siniestros["Monto Reclamado ($)"]).fillna(0)
    df_siniestros_db["monto_estimado"] = clean_numeric(df_siniestros["Monto Estimado ($)"]).fillna(0)
    df_siniestros_db["monto_pagado"] = clean_numeric(df_siniestros["Monto Pagado ($)"]).fillna(0)
    df_siniestros_db["estado"] = df_siniestros["Estado"].astype(str).str.strip()
    df_siniestros_db["sucursal"] = df_siniestros["Sucursal"].astype(str).str.strip()
    df_siniestros_db["id_proveedor"] = df_siniestros["ID Proveedor"].astype(str).str.strip()
    # Poner nulo si el proveedor no está definido en proveedores
    valid_providers = set(df_proveedores_db["id_proveedor"])
    df_siniestros_db["id_proveedor"] = df_siniestros_db["id_proveedor"].apply(lambda x: x if x in valid_providers else None)
    
    desc_col = "Descripción del Evento" if "Descripción del Evento" in df_siniestros.columns else "Descripción"
    df_siniestros_db["descripcion_evento"] = df_siniestros[desc_col].fillna("").astype(str).str.strip()
    
    df_siniestros_db["docs_completos"] = df_siniestros["Docs Completos"].astype(str).str.strip()
    df_siniestros_db["prov_lista_restrictiva"] = df_siniestros["Prov. Lista Restrictiva"].astype(str).str.strip()
    df_siniestros_db["dias_desde_inicio_poliza"] = clean_numeric(df_siniestros["Días desde Inicio Póliza"]).fillna(0).astype(int)
    df_siniestros_db["dias_hasta_fin_poliza"] = clean_numeric(df_siniestros["Días hasta Fin Póliza"]).fillna(0).astype(int)
    df_siniestros_db["reclamos_previos_asegurado"] = clean_numeric(df_siniestros["N° Reclamos Previos Asegurado"]).fillna(0).astype(int)
    df_siniestros_db["suma_asegurada"] = clean_numeric(df_siniestros["Suma Asegurada ($)"]).fillna(0)
    df_siniestros_db["similitud_narrativa_max"] = clean_numeric(df_siniestros["Similitud Narrativa Máx."]).fillna(0)
    df_siniestros_db["numero_parte_policial"] = df_siniestros["Número Parte Policial"].fillna("").astype(str).str.strip()
    
    # Asegurar orden correcto de las columnas en bd
    df_siniestros_db = df_siniestros_db.rename(columns={"fecha_occurrencia": "fecha_ocurrencia"})
    df_siniestros_db = df_siniestros_db.drop_duplicates(subset=["id_siniestro"])

    print("\n--- Procesando y normalizando Documentos ---")
    # Filtrar filas vacías o nulas de raíz
    df_documentos_clean = df_documentos.dropna(subset=["ID Documento", "ID Siniestro"]).copy()
    
    df_documentos_db = pd.DataFrame()
    df_documentos_db["id_documento"] = df_documentos_clean["ID Documento"].astype(str).str.strip()
    df_documentos_db["id_siniestro"] = df_documentos_clean["ID Siniestro"].astype(str).str.strip()
    df_documentos_db["tipo_documento"] = df_documentos_clean["Tipo Documento"].astype(str).str.strip()
    df_documentos_db["nombre_archivo_pdf"] = df_documentos_clean["Nombre Archivo PDF"].fillna("").astype(str).str.strip()
    
    # Filtrar cualquier fila inválida 'nan'
    df_documentos_db = df_documentos_db[
        (df_documentos_db["id_documento"] != "nan") & 
        (df_documentos_db["id_siniestro"] != "nan")
    ]
    df_documentos_db = df_documentos_db.drop_duplicates(subset=["id_documento"])

    # 3. Cargar a la base de datos en orden lógico
    print("\n--- Iniciando carga en la base de datos PostgreSQL ---")
    
    # Limpiar tablas existentes ejecutando el archivo SQL
    schema_path = BACKEND_DIR / "database_schema.sql"
    if schema_path.exists():
        print(f"Ejecutando script de esquema SQL: {schema_path}")
        with open(schema_path, "r", encoding="utf-8") as sf:
            sql_commands = sf.read()
        with engine.begin() as conn:
            conn.execute(text(sql_commands))
        print("¡Estructura de tablas reiniciada exitosamente!")
    
    # Cargar asegurados
    print(f"Cargando {len(df_asegurados_db)} registros en tabla 'asegurados'...")
    df_asegurados_db.to_sql("asegurados", engine, if_exists="append", index=False)
    
    # Cargar polizas
    print(f"Cargando {len(df_polizas_db)} registros en tabla 'polizas'...")
    df_polizas_db.to_sql("polizas", engine, if_exists="append", index=False)
    
    # Cargar proveedores
    print(f"Cargando {len(df_proveedores_db)} registros en tabla 'proveedores'...")
    df_proveedores_db.to_sql("proveedores", engine, if_exists="append", index=False)
    
    # Cargar siniestros
    print(f"Cargando {len(df_siniestros_db)} registros en tabla 'siniestros'...")
    df_siniestros_db.to_sql("siniestros", engine, if_exists="append", index=False)
    
    # Cargar documentos
    print(f"Cargando {len(df_documentos_db)} registros en tabla 'documentos'...")
    df_documentos_db.to_sql("documentos", engine, if_exists="append", index=False)
    
    print("\n🎉 ¡Ingesta de datos finalizada con éxito! 🎉")

if __name__ == "__main__":
    load_data()
