from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import ExtraTreesClassifier, GradientBoostingClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, average_precision_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from .config import MODELS_DIR, REPORTS_DIR
from .data import assign_heuristic_risk, build_claim_dataset
from .reports import (
    save_confusion_matrices,
    save_distribution,
    save_feature_importance,
    save_metrics_comparison,
    save_pr_curves,
    save_roc_curves,
)


NUMERIC_FEATURES = [
    "dias_ocurrencia_reporte",
    "monto_reclamado",
    "monto_estimado",
    "monto_pagado",
    "dias_desde_inicio_poliza",
    "dias_hasta_fin_poliza",
    "reclamos_previos_asegurado",
    "suma_asegurada",
    "similitud_narrativa_max",
    "antiguedad_asegurado",
    "n_polizas_activas",
    "reclamos_ult_12m",
    "reclamos_historico_total",
    "reclamos_rc_sin_tercero",
    "siniestros_asociados",
    "promedio_monto",
    "total_documentos",
    "documentos_denuncia",
    "documentos_fotos",
    "documentos_peritaje",
    "ratio_reclamo_suma_asegurada",
    "ratio_reclamo_estimado",
    "ratio_pagado_reclamado",
    "descripcion_len",
    "descripcion_palabras",
    "es_robo",
    "es_vehicle",
]

CATEGORICAL_FEATURES = [
    "ramo",
    "cobertura",
    "estado",
    "sucursal",
    "segmento",
    "ciudad_asegurado",
    "ramo_poliza",
    "canal_venta",
    "estado_poliza",
    "tipo_proveedor",
    "ciudad_proveedor",
    "lista_restrictiva",
    "perfil_riesgo_historico",
    "docs_completos",
    "prov_lista_restrictiva",
]


def _build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            (
                "num",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="median")),
                        ("scaler", StandardScaler()),
                    ]
                ),
                NUMERIC_FEATURES,
            ),
            (
                "cat",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
                    ]
                ),
                CATEGORICAL_FEATURES,
            ),
        ],
        remainder="drop",
        verbose_feature_names_out=True,
    )


def _model_catalog() -> dict[str, Any]:
    return {
        "logistic_regression": LogisticRegression(max_iter=2000, class_weight="balanced", random_state=42),
        "random_forest": RandomForestClassifier(
            n_estimators=300,
            max_depth=10,
            min_samples_leaf=2,
            class_weight="balanced_subsample",
            random_state=42,
            n_jobs=-1,
        ),
        "gradient_boosting": GradientBoostingClassifier(random_state=42),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=400,
            max_depth=None,
            min_samples_leaf=2,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        ),
    }


def _matrix_to_dense(X):
    return X.toarray() if hasattr(X, "toarray") else np.asarray(X)


def _evaluate_model(model, X, y) -> dict[str, float]:
    probas = model.predict_proba(X)[:, 1]
    preds = (probas >= 0.5).astype(int)
    return {
        "roc_auc": roc_auc_score(y, probas),
        "pr_auc": average_precision_score(y, probas),
        "precision": precision_score(y, preds, zero_division=0),
        "recall": recall_score(y, preds, zero_division=0),
        "f1": f1_score(y, preds, zero_division=0),
        "accuracy": accuracy_score(y, preds),
    }


def train_pipeline(random_state: int = 42) -> dict[str, Any]:
    df = assign_heuristic_risk(build_claim_dataset())

    feature_df = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES + ["fraude_simulado", "id_siniestro"]].copy()
    for col in CATEGORICAL_FEATURES:
        feature_df[col] = feature_df[col].fillna("missing").astype(str)

    train_df, temp_df = train_test_split(
        feature_df,
        test_size=0.4,
        stratify=feature_df["fraude_simulado"],
        random_state=random_state,
    )
    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.5,
        stratify=temp_df["fraude_simulado"],
        random_state=random_state,
    )

    X_train = train_df.drop(columns=["fraude_simulado", "id_siniestro"])
    y_train = train_df["fraude_simulado"].astype(int).to_numpy()
    X_val = val_df.drop(columns=["fraude_simulado", "id_siniestro"])
    y_val = val_df["fraude_simulado"].astype(int).to_numpy()
    X_test = test_df.drop(columns=["fraude_simulado", "id_siniestro"])
    y_test = test_df["fraude_simulado"].astype(int).to_numpy()

    preprocessor = _build_preprocessor()
    X_train_proc = _matrix_to_dense(preprocessor.fit_transform(X_train))
    X_val_proc = _matrix_to_dense(preprocessor.transform(X_val))
    X_test_proc = _matrix_to_dense(preprocessor.transform(X_test))
    feature_names = preprocessor.get_feature_names_out()

    results = {}
    validation_scores = {}
    test_scores = {}
    fitted_models = {}

    for name, model in _model_catalog().items():
        model.fit(X_train_proc, y_train)
        fitted_models[name] = model
        validation_scores[name] = _evaluate_model(model, X_val_proc, y_val)
        test_scores[name] = _evaluate_model(model, X_test_proc, y_test)

    ranking = sorted(validation_scores.items(), key=lambda item: item[1]["roc_auc"], reverse=True)
    top3 = [name for name, _ in ranking[:3]]
    best_model_name = top3[0]
    best_model = fitted_models[best_model_name]
    best_test_scores = test_scores[best_model_name]
    best_test_predictions = (best_model.predict_proba(X_test_proc)[:, 1] >= 0.5).astype(int)

    top3_probas = {
        name: fitted_models[name].predict_proba(X_test_proc)[:, 1] for name in top3
    }
    selected_probs = np.max(np.vstack(list(top3_probas.values())), axis=0)
    selected_model_name = np.array(top3)[np.argmax(np.vstack(list(top3_probas.values())), axis=0)]

    scores_df = test_df[["id_siniestro"]].copy()
    scores_df["y_true"] = y_test
    scores_df["selected_probability"] = selected_probs
    scores_df["selected_model"] = selected_model_name
    scores_df["selected_risk_level"] = pd.cut(
        selected_probs,
        bins=[-0.01, 0.40, 0.75, 1.00],
        labels=["verde", "amarillo", "rojo"],
    ).astype(str)
    scores_df = scores_df.sort_values("selected_probability", ascending=False)

    # Persist models and preprocessing artifacts.
    joblib.dump(preprocessor, MODELS_DIR / "preprocessor.joblib")
    for name, model in fitted_models.items():
        joblib.dump(model, MODELS_DIR / f"{name}.joblib")
    joblib.dump(
        {
            "top3": top3,
            "best_model": best_model_name,
            "feature_names": list(feature_names),
            "numeric_features": NUMERIC_FEATURES,
            "categorical_features": CATEGORICAL_FEATURES,
        },
        MODELS_DIR / "registry.joblib",
    )

    summary = {
        "validation": validation_scores,
        "test": test_scores,
        "top3": top3,
        "best_model": best_model_name,
        "best_test": best_test_scores,
        "class_balance": {
            "positive": int(df["fraude_simulado"].sum()),
            "negative": int((1 - df["fraude_simulado"]).sum()),
        },
        "selected_distribution": scores_df["selected_risk_level"].value_counts(dropna=False).to_dict(),
        "scores_path": str(MODELS_DIR / "scored_claims.csv"),
    }

    scores_df.to_csv(MODELS_DIR / "scored_claims.csv", index=False)
    with (MODELS_DIR / "training_summary.json").open("w", encoding="utf-8") as fh:
        json.dump(summary, fh, ensure_ascii=False, indent=2)

    # Reports
    save_metrics_comparison(validation_scores, REPORTS_DIR / "metrics_comparison.png")
    save_roc_curves(
        y_test,
        {name: fitted_models[name].predict_proba(X_test_proc)[:, 1] for name in fitted_models},
        REPORTS_DIR / "roc_comparison.png",
    )
    save_pr_curves(
        y_test,
        {name: fitted_models[name].predict_proba(X_test_proc)[:, 1] for name in fitted_models},
        REPORTS_DIR / "pr_comparison.png",
    )
    save_confusion_matrices(
        y_test,
        {name: (fitted_models[name].predict_proba(X_test_proc)[:, 1] >= 0.5).astype(int) for name in fitted_models},
        REPORTS_DIR / "confusion_matrices.png",
    )
    save_distribution(
        df["risk_rule_score"],
        REPORTS_DIR / "risk_rule_distribution.png",
        "Distribución del score de riesgo por reglas",
        "Score",
    )
    save_distribution(
        selected_probs,
        REPORTS_DIR / "model_probability_distribution.png",
        "Distribución de probabilidad de riesgo seleccionada",
        "Probabilidad",
    )
    save_confusion_matrices(
        y_test,
        {best_model_name: best_test_predictions},
        REPORTS_DIR / "confusion_test_best.png",
    )
    save_feature_importance(
        feature_names,
        getattr(best_model, "feature_importances_", np.abs(getattr(best_model, "coef_", np.zeros(len(feature_names)))).ravel()),
        REPORTS_DIR / "feature_importance.png",
    )

    results["summary"] = summary
    results["feature_names"] = list(feature_names)
    results["test_frame"] = scores_df
    results["df"] = df
    results["models"] = fitted_models
    return results
