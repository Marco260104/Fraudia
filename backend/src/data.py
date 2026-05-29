from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd

from .config import DATAENT_DIR


def _read_csv(path: Path) -> pd.DataFrame:
    return pd.read_csv(path, encoding="utf-8-sig")


def _normalize_bool(value: Any) -> int:
    text = str(value).strip().lower()
    if text in {"sí", "si", "yes", "1", "true"}:
        return 1
    if text in {"no", "0", "false", "", "nan", "none"}:
        return 0
    return 0


def _to_numeric(series: pd.Series) -> pd.Series:
    cleaned = (
        series.astype(str)
        .str.replace("$", "", regex=False)
        .str.replace(",", "", regex=False)
        .str.replace("—", "", regex=False)
        .str.replace("N/A", "", regex=False)
        .str.strip()
    )
    return pd.to_numeric(cleaned, errors="coerce")


def _rename_asegurados(df: pd.DataFrame) -> pd.DataFrame:
    mapping = {
        "ID Asegurado": "id_asegurado",
        "Nombres Asegurado": "nombres_asegurado",
        "Segmento": "segmento",
        "Ciudad": "ciudad_asegurado",
        "Antigüedad (años)": "antiguedad_asegurado",
        "N° Pólizas Activas": "n_polizas_activas",
        "N° Reclamos Últimos 12 Meses": "reclamos_ult_12m",
        "N° Reclamos Histórico Total": "reclamos_historico_total",
        "Reclamos RC sin Tercero": "reclamos_rc_sin_tercero",
        "Perfil Riesgo Histórico": "perfil_riesgo_historico",
    }
    df = df.rename(columns=mapping).copy()
    numeric_cols = [
        "antiguedad_asegurado",
        "n_polizas_activas",
        "reclamos_ult_12m",
        "reclamos_historico_total",
        "reclamos_rc_sin_tercero",
    ]
    for col in numeric_cols:
        df[col] = _to_numeric(df[col])
    return df


def _rename_polizas(df: pd.DataFrame) -> pd.DataFrame:
    mapping = {
        "ID Póliza": "id_poliza",
        "ID Asegurado": "id_asegurado",
        "Ramo": "ramo_poliza",
        "Fecha Inicio": "fecha_inicio",
        "Fecha Fin": "fecha_fin",
        "Suma Asegurada ($)": "suma_asegurada",
        "Prima Anual ($)": "prima_anual",
        "Canal Venta": "canal_venta",
        "Estado Póliza": "estado_poliza",
    }
    df = df.rename(columns=mapping).copy()
    df["fecha_inicio"] = pd.to_datetime(df["fecha_inicio"], errors="coerce")
    df["fecha_fin"] = pd.to_datetime(df["fecha_fin"], errors="coerce")
    for col in ("suma_asegurada", "prima_anual"):
        df[col] = _to_numeric(df[col])
    return df


def _rename_proveedores(df: pd.DataFrame) -> pd.DataFrame:
    mapping = {
        "ID Proveedor": "id_proveedor",
        "Nombre Proveedor": "nombre_proveedor",
        "Tipo": "tipo_proveedor",
        "Ciudad": "ciudad_proveedor",
        "N° Siniestros Asociados": "siniestros_asociados",
        "En Lista Restrictiva": "lista_restrictiva",
        "Motivo Restricción": "motivo_restriccion",
        "Promedio Monto ($)": "promedio_monto",
        "Columna1": "promedio_monto_alt",
    }
    df = df.rename(columns=mapping).copy()
    if "promedio_monto" not in df.columns:
        df["promedio_monto"] = pd.NA
    df["promedio_monto"] = _to_numeric(df["promedio_monto"])
    if "promedio_monto_alt" in df.columns:
        df["promedio_monto"] = df["promedio_monto"].combine_first(_to_numeric(df["promedio_monto_alt"]))
        df = df.drop(columns=["promedio_monto_alt"])
    df["siniestros_asociados"] = _to_numeric(df["siniestros_asociados"])
    df["lista_restrictiva_flag"] = df["lista_restrictiva"].apply(_normalize_bool)
    return df


def _rename_documentos(df: pd.DataFrame) -> pd.DataFrame:
    mapping = {
        "ID Documento": "id_documento",
        "ID Siniestro": "id_siniestro",
        "Tipo Documento": "tipo_documento",
        "Nombre Archivo PDF": "nombre_archivo_pdf",
    }
    return df.rename(columns=mapping).copy()


def _rename_siniestros(df: pd.DataFrame) -> pd.DataFrame:
    mapping = {
        "ID Siniestro": "id_siniestro",
        "ID Póliza": "id_poliza",
        "ID Asegurado": "id_asegurado",
        "Ramo": "ramo",
        "Placa Vehículo Asegurado": "placa_vehiculo_asegurado",
        "Cobertura": "cobertura",
        "Fecha Ocurrencia": "fecha_ocurrencia",
        "Fecha Reporte": "fecha_reporte",
        "Días Ocurr→Reporte": "dias_ocurrencia_reporte",
        "Monto Reclamado ($)": "monto_reclamado",
        "Monto Estimado ($)": "monto_estimado",
        "Monto Pagado ($)": "monto_pagado",
        "Estado": "estado",
        "Sucursal": "sucursal",
        "ID Proveedor": "id_proveedor",
        "Descripción del Evento": "descripcion_evento",
        "Docs Completos": "docs_completos",
        "Prov. Lista Restrictiva": "prov_lista_restrictiva",
        "Días desde Inicio Póliza": "dias_desde_inicio_poliza",
        "Días hasta Fin Póliza": "dias_hasta_fin_poliza",
        "N° Reclamos Previos Asegurado": "reclamos_previos_asegurado",
        "Suma Asegurada ($)": "suma_asegurada",
        "Similitud Narrativa Máx.": "similitud_narrativa_max",
        "Número Parte Policial": "numero_parte_policial",
    }
    df = df.rename(columns=mapping).copy()
    for col in ("fecha_ocurrencia", "fecha_reporte"):
        df[col] = pd.to_datetime(df[col], errors="coerce")
    numeric_cols = [
        "dias_ocurrencia_reporte",
        "monto_reclamado",
        "monto_estimado",
        "monto_pagado",
        "dias_desde_inicio_poliza",
        "dias_hasta_fin_poliza",
        "reclamos_previos_asegurado",
        "suma_asegurada",
        "similitud_narrativa_max",
    ]
    for col in numeric_cols:
        df[col] = _to_numeric(df[col])
    df["docs_completos_flag"] = df["docs_completos"].apply(_normalize_bool)
    df["prov_lista_restrictiva_flag"] = df["prov_lista_restrictiva"].apply(_normalize_bool)
    df["descripcion_evento"] = df["descripcion_evento"].fillna("")
    df["descripcion_len"] = df["descripcion_evento"].str.len().fillna(0)
    df["descripcion_palabras"] = df["descripcion_evento"].str.split().str.len().fillna(0)
    return df


def load_tables() -> dict[str, pd.DataFrame]:
    tables = {
        "asegurados": _rename_asegurados(_read_csv(DATAENT_DIR / "Asegurados-.csv")),
        "polizas": _rename_polizas(_read_csv(DATAENT_DIR / "Polizas.csv")),
        "proveedores": _rename_proveedores(_read_csv(DATAENT_DIR / "Proveedores.csv")),
        "documentos": _rename_documentos(_read_csv(DATAENT_DIR / "Documentos.csv")),
        "siniestros": _rename_siniestros(_read_csv(DATAENT_DIR / "Siniestros.csv")),
    }
    return tables


def build_claim_dataset() -> pd.DataFrame:
    tables = load_tables()
    siniestros = tables["siniestros"].copy()
    polizas = tables["polizas"].copy()
    asegurados = tables["asegurados"].copy()
    proveedores = tables["proveedores"].copy()
    documentos = tables["documentos"].copy()

    doc_summary = (
        documentos.assign(
            doc_es_denuncia=documentos["tipo_documento"].str.contains("denuncia", case=False, na=False).astype(int),
            doc_es_fotos=documentos["tipo_documento"].str.contains("fotograf", case=False, na=False).astype(int),
            doc_es_peritaje=documentos["tipo_documento"].str.contains("perit", case=False, na=False).astype(int),
        )
        .groupby("id_siniestro", as_index=False)
        .agg(
            total_documentos=("id_documento", "count"),
            documentos_denuncia=("doc_es_denuncia", "sum"),
            documentos_fotos=("doc_es_fotos", "sum"),
            documentos_peritaje=("doc_es_peritaje", "sum"),
        )
    )

    df = (
        siniestros.merge(polizas, on=["id_poliza", "id_asegurado"], how="left", suffixes=("", "_poliza"))
        .merge(asegurados, on="id_asegurado", how="left")
        .merge(proveedores, on="id_proveedor", how="left", suffixes=("", "_proveedor"))
        .merge(doc_summary, on="id_siniestro", how="left")
    )

    df["total_documentos"] = df["total_documentos"].fillna(0)
    df["documentos_denuncia"] = df["documentos_denuncia"].fillna(0)
    df["documentos_fotos"] = df["documentos_fotos"].fillna(0)
    df["documentos_peritaje"] = df["documentos_peritaje"].fillna(0)

    df["ratio_reclamo_suma_asegurada"] = df["monto_reclamado"] / df["suma_asegurada"].replace({0: pd.NA})
    df["ratio_reclamo_estimado"] = df["monto_reclamado"] / df["monto_estimado"].replace({0: pd.NA})
    df["ratio_pagado_reclamado"] = df["monto_pagado"] / df["monto_reclamado"].replace({0: pd.NA})
    df["dias_entre_ocurrencia_reporte"] = df["dias_ocurrencia_reporte"]
    df["es_robo"] = df["cobertura"].astype(str).str.contains("robo", case=False, na=False).astype(int)
    df["es_vehicle"] = df["ramo"].astype(str).str.contains("veh", case=False, na=False).astype(int)

    numeric_fill = [
        "total_documentos",
        "documentos_denuncia",
        "documentos_fotos",
        "documentos_peritaje",
        "ratio_reclamo_suma_asegurada",
        "ratio_reclamo_estimado",
        "ratio_pagado_reclamado",
    ]
    for col in numeric_fill:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["ratio_reclamo_suma_asegurada"] = df["ratio_reclamo_suma_asegurada"].fillna(0)
    df["ratio_reclamo_estimado"] = df["ratio_reclamo_estimado"].fillna(0)
    df["ratio_pagado_reclamado"] = df["ratio_pagado_reclamado"].fillna(0)
    return df


def assign_heuristic_risk(df: pd.DataFrame) -> pd.DataFrame:
    risk_score = pd.Series(0, index=df.index, dtype="float64")

    risk_score += df["dias_desde_inicio_poliza"].fillna(999).le(10).mul(8)
    risk_score += df["dias_desde_inicio_poliza"].fillna(999).between(11, 30).mul(4)
    risk_score += df["dias_entre_ocurrencia_reporte"].fillna(0).gt(7).mul(5)
    risk_score += df["dias_entre_ocurrencia_reporte"].fillna(0).between(4, 7).mul(3)
    risk_score += df["reclamos_previos_asegurado"].fillna(0).ge(3).mul(8)
    risk_score += df["reclamos_previos_asegurado"].fillna(0).eq(2).mul(4)
    risk_score += df["siniestros_asociados"].fillna(0).ge(3).mul(6)
    risk_score += df["siniestros_asociados"].fillna(0).eq(2).mul(3)
    risk_score += df["prov_lista_restrictiva_flag"].fillna(0).mul(10)
    risk_score += (1 - df["docs_completos_flag"].fillna(0)).mul(4)
    risk_score += df["similitud_narrativa_max"].fillna(0).ge(0.85).mul(8)
    risk_score += df["similitud_narrativa_max"].fillna(0).between(0.70, 0.85, inclusive="left").mul(4)
    risk_score += df["ratio_reclamo_suma_asegurada"].fillna(0).ge(0.95).mul(4)
    risk_score += df["ratio_reclamo_estimado"].fillna(0).ge(1.20).mul(3)
    risk_score += (
        df["es_robo"].fillna(0)
        .mul(df["numero_parte_policial"].fillna("").astype(str).str.strip().eq("").astype(int))
        .mul(4)
    )
    risk_score += df["perfil_riesgo_historico"].astype(str).str.contains("alto", case=False, na=False).mul(3)
    risk_score += df["documentos_denuncia"].fillna(0).eq(0).mul(2)

    df = df.copy()
    df["risk_rule_score"] = risk_score.clip(0, 100)
    threshold = df["risk_rule_score"].quantile(0.82)
    df["fraude_simulado"] = (df["risk_rule_score"] >= threshold).astype(int)
    return df
