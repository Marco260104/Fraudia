import pandas as pd
from src.scoring.scoring_strategies import (
    ScoringStrategy,
    HybridScoringStrategy,
)


class RiskScorer:
    def __init__(self, strategy: ScoringStrategy = None):
        self._strategy = strategy or HybridScoringStrategy()

    def set_strategy(self, strategy: ScoringStrategy):
        self._strategy = strategy

    def get_strategy(self) -> ScoringStrategy:
        return self._strategy

    def calculate(self, df: pd.DataFrame) -> pd.DataFrame:
        return self._strategy.calculate(df)

    def get_risk_level(self, score: float) -> str:
        return self._strategy.get_risk_level(score)

    def get_summary(self, df: pd.DataFrame) -> dict:
        if "nivel_riesgo" not in df.columns:
            df = self.calculate(df)

        return {
            "total_casos": len(df),
            "bajo": int((df["nivel_riesgo"] == "Bajo").sum()),
            "medio": int((df["nivel_riesgo"] == "Medio").sum()),
            "alto": int((df["nivel_riesgo"] == "Alto").sum()),
            "score_promedio": float(df["score_final"].mean()),
            "score_maximo": int(df["score_final"].max()),
            "score_minimo": int(df["score_final"].min()),
            "top_10": df.nlargest(10, "score_final")[
                ["id_siniestro", "score_final", "nivel_riesgo"]
            ].to_dict("records"),
        }
