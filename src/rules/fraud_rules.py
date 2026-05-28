from typing import List
import pandas as pd

from src.rules.rule_strategies import (
    RuleStrategy,
    BorderProximityRule,
    LateReportingRule,
    ClaimFrequencyRule,
    RestrictedProviderRule,
    DocumentAnomalyRule,
    AmountAnomalyRule,
    NarrativeSimilarityRule,
    PtxrbCoverageRule,
    MoraAseguradoRule,
    LowClientScoreRule,
)


class FraudRuleEngine:
    def __init__(self, strategies: List[RuleStrategy] = None):
        self._strategies = strategies or self._default_strategies()

    def _default_strategies(self) -> List[RuleStrategy]:
        return [
            BorderProximityRule(),
            LateReportingRule(),
            ClaimFrequencyRule(),
            RestrictedProviderRule(),
            DocumentAnomalyRule(),
            AmountAnomalyRule(),
            NarrativeSimilarityRule(),
            PtxrbCoverageRule(),
            MoraAseguradoRule(),
            LowClientScoreRule(),
        ]

    def add_strategy(self, strategy: RuleStrategy):
        self._strategies.append(strategy)

    def remove_strategy(self, strategy_name: str):
        self._strategies = [s for s in self._strategies if s.name != strategy_name]

    def set_strategies(self, strategies: List[RuleStrategy]):
        self._strategies = strategies

    def evaluate(self, df: pd.DataFrame) -> pd.DataFrame:
        results = []
        for _, row in df.iterrows():
            row_result = {"total_score": 0, "alerts": []}
            for strategy in self._strategies:
                result = strategy.evaluate(row)
                row_result["total_score"] += result["score"]
                if result["score"] > 0:
                    row_result["alerts"].append(result)
            results.append(row_result)

        result_df = df.copy()
        result_df["risk_score_rules"] = [r["total_score"] for r in results]
        result_df["alerts"] = [r["alerts"] for r in results]
        return result_df

    def evaluate_single(self, row: pd.Series) -> dict:
        total_score = 0
        all_alerts = []
        for strategy in self._strategies:
            result = strategy.evaluate(row)
            total_score += result["score"]
            if result["score"] > 0:
                all_alerts.append(result)
        return {"total_score": total_score, "alerts": all_alerts}

    def get_actives_rules(self) -> List[str]:
        return [s.name for s in self._strategies]
