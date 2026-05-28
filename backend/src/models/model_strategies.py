from abc import ABC, abstractmethod
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier


class ModelStrategy(ABC):
    @abstractmethod
    def train(self, X_train, y_train, X_val=None, y_val=None):
        pass

    @abstractmethod
    def predict(self, X) -> np.ndarray:
        pass

    @abstractmethod
    def predict_proba(self, X) -> np.ndarray:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    def save(self, path: str):
        pass

    @abstractmethod
    def load(self, path: str):
        pass


class RandomForestStrategy(ModelStrategy):
    name = "RandomForest"

    def __init__(self, **kwargs):
        self.model = RandomForestClassifier(
            n_estimators=kwargs.get("n_estimators", 300),
            max_depth=kwargs.get("max_depth", 15),
            min_samples_leaf=kwargs.get("min_samples_leaf", 5),
            class_weight=kwargs.get("class_weight", "balanced"),
            random_state=kwargs.get("random_state", 42),
            n_jobs=-1,
        )

    def train(self, X_train, y_train, X_val=None, y_val=None):
        self.model.fit(X_train, y_train)

    def predict(self, X) -> np.ndarray:
        return self.model.predict(X)

    def predict_proba(self, X) -> np.ndarray:
        return self.model.predict_proba(X)[:, 1]

    def save(self, path: str):
        joblib.dump(self.model, path)

    def load(self, path: str):
        self.model = joblib.load(path)

    @property
    def feature_importances_(self):
        return self.model.feature_importances_


class XGBoostStrategy(ModelStrategy):
    name = "XGBoost"

    def __init__(self, **kwargs):
        self.model = XGBClassifier(
            n_estimators=kwargs.get("n_estimators", 300),
            max_depth=kwargs.get("max_depth", 6),
            learning_rate=kwargs.get("learning_rate", 0.1),
            scale_pos_weight=kwargs.get("scale_pos_weight", 1),
            eval_metric="auc",
            use_label_encoder=False,
            random_state=kwargs.get("random_state", 42),
            n_jobs=-1,
        )

    def train(self, X_train, y_train, X_val=None, y_val=None):
        if X_val is not None and y_val is not None:
            self.model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
        else:
            self.model.fit(X_train, y_train)

    def predict(self, X) -> np.ndarray:
        return self.model.predict(X)

    def predict_proba(self, X) -> np.ndarray:
        return self.model.predict_proba(X)[:, 1]

    def save(self, path: str):
        joblib.dump(self.model, path)

    def load(self, path: str):
        self.model = joblib.load(path)

    @property
    def feature_importances_(self):
        return self.model.feature_importances_


class LightGBMStrategy(ModelStrategy):
    name = "LightGBM"

    def __init__(self, **kwargs):
        self.model = LGBMClassifier(
            n_estimators=kwargs.get("n_estimators", 300),
            num_leaves=kwargs.get("num_leaves", 31),
            learning_rate=kwargs.get("learning_rate", 0.1),
            class_weight=kwargs.get("class_weight", "balanced"),
            random_state=kwargs.get("random_state", 42),
            n_jobs=-1,
            verbose=-1,
        )

    def train(self, X_train, y_train, X_val=None, y_val=None):
        self.model.fit(X_train, y_train)

    def predict(self, X) -> np.ndarray:
        return self.model.predict(X)

    def predict_proba(self, X) -> np.ndarray:
        return self.model.predict_proba(X)[:, 1]

    def save(self, path: str):
        joblib.dump(self.model, path)

    def load(self, path: str):
        self.model = joblib.load(path)

    @property
    def feature_importances_(self):
        return self.model.feature_importances_
