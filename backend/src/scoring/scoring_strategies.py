from abc import ABC, abstractmethod
import pandas as pd
import numpy as np


class ScoringStrategy(ABC):
    @abstractmethod
    def calculate(self, df: pd.DataFrame) -> pd.DataFrame:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    def get_risk_level(self, score: float) -> str:
        pass


class HybridScoringStrategy(ScoringStrategy):
    name = "Híbrido (Reglas + ML)"

    def __init__(
        self,
        rules_weight: float = 0.4,
        ml_weight: float = 0.6,
        threshold_low: int = 40,
        threshold_high: int = 75,
    ):
        self.rules_weight = rules_weight
        self.ml_weight = ml_weight
        self.threshold_low = threshold_low
        self.threshold_high = threshold_high

    def calculate(self, df: pd.DataFrame) -> pd.DataFrame:
        result = df.copy()

        rules_score = result.get("risk_score_rules", pd.Series([0] * len(result)))
        ml_proba = result.get("ml_fraude_probabilidad", pd.Series([0.5] * len(result)))

        rules_normalized = (rules_score / 70.0) * 100
        ml_normalized = ml_proba * 100

        result["score_final"] = (
            rules_normalized * self.rules_weight + ml_normalized * self.ml_weight
        )
        result["score_final"] = result["score_final"].clip(0, 100).astype(int)
        result["nivel_riesgo"] = result["score_final"].apply(self.get_risk_level)
        return result

    def get_risk_level(self, score: float) -> str:
        if score <= self.threshold_low:
            return "Bajo"
        elif score <= self.threshold_high:
            return "Medio"
        else:
            return "Alto"


class RulesOnlyScoringStrategy(ScoringStrategy):
    name = "Solo Reglas de Negocio"

    def __init__(self, threshold_low: int = 40, threshold_high: int = 75):
        self.threshold_low = threshold_low
        self.threshold_high = threshold_high

    def calculate(self, df: pd.DataFrame) -> pd.DataFrame:
        result = df.copy()
        rules_score = result.get("risk_score_rules", pd.Series([0] * len(result)))
        result["score_final"] = ((rules_score / 70.0) * 100).clip(0, 100).astype(int)
        result["nivel_riesgo"] = result["score_final"].apply(self.get_risk_level)
        return result

    def get_risk_level(self, score: float) -> str:
        if score <= self.threshold_low:
            return "Bajo"
        elif score <= self.threshold_high:
            return "Medio"
        else:
            return "Alto"


class MLOnlyScoringStrategy(ScoringStrategy):
    name = "Solo ML"

    def __init__(self, threshold_low: float = 0.3, threshold_high: float = 0.7):
        self.threshold_low = threshold_low
        self.threshold_high = threshold_high

    def calculate(self, df: pd.DataFrame) -> pd.DataFrame:
        result = df.copy()
        ml_proba = result.get("ml_fraude_probabilidad", pd.Series([0.5] * len(result)))
        result["score_final"] = (ml_proba * 100).clip(0, 100).astype(int)
        result["nivel_riesgo"] = result["score_final"].apply(self.get_risk_level)
        return result

    def get_risk_level(self, score: float) -> str:
        if score <= self.threshold_low * 100:
            return "Bajo"
        elif score <= self.threshold_high * 100:
            return "Medio"
        else:
            return "Alto"
