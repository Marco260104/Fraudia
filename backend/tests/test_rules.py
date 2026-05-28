import sys
import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, BASE_DIR)

from src.rules.fraud_rules import FraudRuleEngine
from src.rules.rule_strategies import (
    BorderProximityRule,
    LateReportingRule,
    ClaimFrequencyRule,
    RestrictedProviderRule,
    NarrativeSimilarityRule,
)


def make_row(overrides=None):
    row = {
        "id_siniestro": "SIN-000001",
        "dias_inicio_poliza": 200,
        "dias_fin_poliza": 365,
        "dias_ocurrencia_reporte": 1,
        "historial_siniestros_asegurado": 0,
        "proveedor_en_lista_restrictiva": 0,
        "docs_completos_bin": 1,
        "pct_inconsistentes": 0.0,
        "pct_legibles": 1.0,
        "ratio_monto": 1.0,
        "similitud_narrativa_max": 0.1,
        "cobertura_es_ptxrb": 0,
        "mora_actual_asegurado": 0,
        "score_cliente_asegurado": 85,
        "monto_reclamado": 5000,
    }
    if overrides:
        row.update(overrides)
    return pd.Series(row)


def test_border_proximity_rule():
    rule = BorderProximityRule()
    result = rule.evaluate(make_row({"dias_inicio_poliza": 5, "dias_fin_poliza": 3}))
    assert result["score"] == 16, f"Expected 16, got {result['score']}"
    assert len(result["details"]) == 2


def test_border_proximity_no_risk():
    rule = BorderProximityRule()
    result = rule.evaluate(make_row({"dias_inicio_poliza": 100, "dias_fin_poliza": 200}))
    assert result["score"] == 0
    assert len(result["details"]) == 0


def test_late_reporting_high():
    rule = LateReportingRule()
    result = rule.evaluate(make_row({"dias_ocurrencia_reporte": 10}))
    assert result["score"] == 5


def test_late_reporting_low():
    rule = LateReportingRule()
    result = rule.evaluate(make_row({"dias_ocurrencia_reporte": 1}))
    assert result["score"] == 0


def test_claim_frequency():
    rule = ClaimFrequencyRule()
    result = rule.evaluate(make_row({"historial_siniestros_asegurado": 4}))
    assert result["score"] == 8


def test_restricted_provider():
    rule = RestrictedProviderRule()
    result = rule.evaluate(make_row({"proveedor_en_lista_restrictiva": 1}))
    assert result["score"] == 10


def test_narrative_similarity():
    rule = NarrativeSimilarityRule()
    result = rule.evaluate(make_row({"similitud_narrativa_max": 0.9}))
    assert result["score"] == 8


def test_engine_default_strategies():
    engine = FraudRuleEngine()
    assert len(engine.get_actives_rules()) == 10


def test_engine_add_remove_strategy():
    engine = FraudRuleEngine()
    n_before = len(engine.get_actives_rules())
    engine.remove_strategy("Proximidad a bordes de vigencia")
    assert len(engine.get_actives_rules()) == n_before - 1
    engine.add_strategy(BorderProximityRule())
    assert len(engine.get_actives_rules()) == n_before


def test_engine_evaluate_single():
    engine = FraudRuleEngine()
    row = make_row({
        "dias_inicio_poliza": 5, "dias_fin_poliza": 3,
        "dias_ocurrencia_reporte": 10,
        "historial_siniestros_asegurado": 4,
        "proveedor_en_lista_restrictiva": 1,
    })
    result = engine.evaluate_single(row)
    assert result["total_score"] > 0
    assert len(result["alerts"]) >= 4


def test_engine_evaluate_dataframe():
    engine = FraudRuleEngine()
    df = pd.DataFrame([
        make_row({"id_siniestro": "SIN-001"}).to_dict(),
        make_row({"id_siniestro": "SIN-002", "dias_inicio_poliza": 3,
                   "proveedor_en_lista_restrictiva": 1}).to_dict(),
    ])
    result = engine.evaluate(df)
    assert "risk_score_rules" in result.columns
    assert "alerts" in result.columns
    assert result.loc[0, "risk_score_rules"] == 0
    assert result.loc[1, "risk_score_rules"] > 0


if __name__ == "__main__":
    test_border_proximity_rule()
    test_border_proximity_no_risk()
    test_late_reporting_high()
    test_late_reporting_low()
    test_claim_frequency()
    test_restricted_provider()
    test_narrative_similarity()
    test_engine_default_strategies()
    test_engine_add_remove_strategy()
    test_engine_evaluate_single()
    test_engine_evaluate_dataframe()
    print("Todos los tests de reglas pasaron exitosamente.")
