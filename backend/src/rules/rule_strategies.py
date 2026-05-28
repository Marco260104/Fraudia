from abc import ABC, abstractmethod
import pandas as pd
import numpy as np


class RuleStrategy(ABC):
    @abstractmethod
    def evaluate(self, row: pd.Series) -> dict:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass


class BorderProximityRule(RuleStrategy):
    name = "Proximidad a bordes de vigencia"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []
        dias_inicio = row.get("dias_inicio_poliza", 999)
        dias_fin = row.get("dias_fin_poliza", 999)

        if dias_inicio <= 10:
            score += 8
            details.append(f"Siniestro a {dias_inicio}d del inicio de póliza")
        elif dias_inicio <= 30:
            score += 4
            details.append(f"Siniestro a {dias_inicio}d del inicio de póliza")

        if dias_fin <= 10:
            score += 8
            details.append(f"Siniestro a {dias_fin}d del fin de póliza")
        elif dias_fin <= 30:
            score += 4
            details.append(f"Siniestro a {dias_fin}d del fin de póliza")

        return {"score": score, "details": details, "rule": self.name}


class LateReportingRule(RuleStrategy):
    name = "Reporte tardío"

    def evaluate(self, row: pd.Series) -> dict:
        dias = row.get("dias_ocurrencia_reporte", 0)
        score = 0
        details = []

        if dias > 7:
            score += 5
            details.append(f"Reporte tardío: {dias}d después del evento")
        elif dias > 3:
            score += 3
            details.append(f"Reporte {dias}d después del evento")

        return {"score": score, "details": details, "rule": self.name}


class ClaimFrequencyRule(RuleStrategy):
    name = "Alta frecuencia de reclamos"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []
        hist = row.get("historial_siniestros_asegurado", 0)

        if hist >= 3:
            score += 8
            details.append(f"Asegurado con {hist} siniestros previos")
        elif hist >= 2:
            score += 4
            details.append(f"Asegurado con {hist} siniestros previos")

        return {"score": score, "details": details, "rule": self.name}


class RestrictedProviderRule(RuleStrategy):
    name = "Proveedor en lista restrictiva"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []

        if row.get("proveedor_en_lista_restrictiva", 0) == 1:
            score += 10
            details.append("Proveedor en lista restrictiva")

        return {"score": score, "details": details, "rule": self.name}


class DocumentAnomalyRule(RuleStrategy):
    name = "Anomalías documentales"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []

        docs_completos = row.get("docs_completos_bin", 1)
        pct_inconsistentes = row.get("pct_inconsistentes", 0)
        pct_legibles = row.get("pct_legibles", 1)

        if docs_completos == 0:
            score += 4
            details.append("Documentos incompletos")
        if pct_inconsistentes > 0.3:
            score += 6
            details.append(f"{pct_inconsistentes:.0%} documentos con inconsistencias")
        if pct_legibles < 0.5:
            score += 4
            details.append(f"Solo {pct_legibles:.0%} documentos legibles")

        return {"score": score, "details": details, "rule": self.name}


class AmountAnomalyRule(RuleStrategy):
    name = "Monto atípico"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []
        ratio = row.get("ratio_monto", 1.0)

        if ratio > 2.0:
            score += 6
            details.append(f"Monto reclamado {ratio:.1f}x el estimado")
        elif ratio > 1.5:
            score += 3
            details.append(f"Monto reclamado {ratio:.1f}x el estimado")

        return {"score": score, "details": details, "rule": self.name}


class NarrativeSimilarityRule(RuleStrategy):
    name = "Similitud de narrativa"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []
        sim = row.get("similitud_narrativa_max", 0)

        if sim > 0.85:
            score += 8
            details.append(f"Narrativa {sim:.0%} similar a otro reclamo")
        elif sim > 0.70:
            score += 4
            details.append(f"Narrativa {sim:.0%} similar a otro reclamo")

        return {"score": score, "details": details, "rule": self.name}


class PtxrbCoverageRule(RuleStrategy):
    name = "Cobertura Pérdida Total por Robo (PTxRB)"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []

        if row.get("cobertura_es_ptxrb", 0) == 1:
            score += 8
            details.append("Cobertura PTxRB - requiere verificación de campo")

        return {"score": score, "details": details, "rule": self.name}


class MoraAseguradoRule(RuleStrategy):
    name = "Asegurado en mora"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []

        if row.get("mora_actual_asegurado", 0) == 1:
            score += 3
            details.append("Asegurado en mora al momento del siniestro")

        return {"score": score, "details": details, "rule": self.name}


class LowClientScoreRule(RuleStrategy):
    name = "Score de cliente bajo"

    def evaluate(self, row: pd.Series) -> dict:
        score = 0
        details = []
        score_cliente = row.get("score_cliente_asegurado", 100)

        if score_cliente < 30:
            score += 5
            details.append(f"Score de cliente crítico: {score_cliente:.0f}")
        elif score_cliente < 50:
            score += 3
            details.append(f"Score de cliente bajo: {score_cliente:.0f}")

        return {"score": score, "details": details, "rule": self.name}
