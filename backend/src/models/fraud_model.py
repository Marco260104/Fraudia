from typing import List, Optional
import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score, average_precision_score

from src.models.model_strategies import ModelStrategy, XGBoostStrategy


class FraudModel:
    def __init__(self, strategy: ModelStrategy = None):
        self._strategy = strategy or XGBoostStrategy()
        self._feature_cols = None

    def set_strategy(self, strategy: ModelStrategy):
        self._strategy = strategy

    def get_strategy(self) -> ModelStrategy:
        return self._strategy

    def train(self, X_train, y_train, X_val=None, y_val=None):
        self._feature_cols = (
            list(X_train.columns) if hasattr(X_train, "columns") else None
        )
        self._strategy.train(X_train, y_train, X_val, y_val)

    def predict(self, X) -> np.ndarray:
        return self._strategy.predict(X)

    def predict_proba(self, X) -> np.ndarray:
        return self._strategy.predict_proba(X)

    def predict_score(self, X, normalize: bool = True) -> np.ndarray:
        probas = self.predict_proba(X)
        if normalize:
            return (probas * 100).astype(int)
        return probas

    def evaluate(self, X_val, y_val) -> dict:
        y_proba = self.predict_proba(X_val)
        y_pred = self.predict(X_val)
        return {
            "auc_roc": roc_auc_score(y_val, y_proba),
            "avg_pr": average_precision_score(y_val, y_proba),
            "predictions": y_pred,
            "probabilities": y_proba,
        }

    def save(self, path: str):
        self._strategy.save(path)

    def load(self, path: str):
        self._strategy.load(path)

    def save_best(self, models_dir: str):
        self._strategy.save(f"{models_dir}/best_model.pkl")

    def feature_importance(self) -> Optional[np.ndarray]:
        if hasattr(self._strategy, "feature_importances_"):
            return self._strategy.feature_importances_
        return None

    def get_params(self) -> dict:
        return {"model": self._strategy.name, "feature_cols": self._feature_cols}
