import pandas as pd
from src.explainability.explanation_strategies import (
    ExplanationStrategy,
    DetailedExplanationStrategy,
)


class ScoreExplainer:
    def __init__(self, strategy: ExplanationStrategy = None):
        self._strategy = strategy or DetailedExplanationStrategy()

    def set_strategy(self, strategy: ExplanationStrategy):
        self._strategy = strategy

    def get_strategy(self) -> ExplanationStrategy:
        return self._strategy

    def explain(self, row: pd.Series, alerts: list, score: int, level: str) -> str:
        return self._strategy.explain(row, alerts, score, level)

    def explain_batch(self, df: pd.DataFrame) -> list:
        explanations = []
        for idx in df.index:
            row = df.loc[idx]
            alerts = row.get("alerts", [])
            score = row.get("score_final", row.get("risk_score_rules", 0))
            level = row.get("nivel_riesgo", "No asignado")
            explanations.append(
                {
                    "id_siniestro": row.get("id_siniestro", "N/A"),
                    "explicacion": self.explain(row, alerts, score, level),
                }
            )
        return explanations

    def summary_report(self, df: pd.DataFrame) -> str:
        if "nivel_riesgo" not in df.columns:
            return "Debe calcular el scoring antes de generar el reporte"

        lines = [
            "=" * 60,
            "REPORTE DE DETECCION DE POSIBLE FRAUDE",
            "=" * 60,
            "",
            f"Total siniestros analizados: {len(df)}",
            "",
            "Distribucion por nivel de riesgo:",
        ]

        for level in ["Bajo", "Medio", "Alto"]:
            count = int((df["nivel_riesgo"] == level).sum())
            pct = count / len(df) * 100 if len(df) > 0 else 0
            lines.append(f"  {level}: {count} ({pct:.1f}%)")

        lines.append(
            f"\nScore promedio: {df['score_final'].mean():.1f}/100"
            if "score_final" in df.columns
            else ""
        )

        alto_df = df[df["nivel_riesgo"] == "Alto"]
        if len(alto_df) > 0:
            lines.append(f"\nTop 5 casos de alto riesgo:")
            for i, (_, row) in enumerate(
                alto_df.nlargest(5, "score_final").iterrows(), 1
            ):
                lines.append(
                    f"  {i}. {row.get('id_siniestro', 'N/A')} "
                    f"- Score: {row.get('score_final', 'N/A')}"
                )

        lines.append("=" * 60)
        return "\n".join(lines)
