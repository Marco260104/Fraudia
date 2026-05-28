import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    average_precision_score,
)
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from src.models.model_strategies import (
    RandomForestStrategy, XGBoostStrategy, LightGBMStrategy,
)
from src.models.fraud_model import FraudModel

SEED = 42
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
np.random.seed(SEED)

sns.set_style("whitegrid")
plt.rcParams.update({
    "figure.max_open_warning": 0, "font.size": 10,
    "axes.titlesize": 12, "axes.labelsize": 10,
})
MODEL_COLORS = {"RandomForest": "#2E86AB", "XGBoost": "#A23B72", "LightGBM": "#F18F01"}
CMAP = "Blues"


def load_preprocessed():
    data = joblib.load(os.path.join(MODELS_DIR, "preprocessed_data.pkl"))
    return (
        data["X_train"], data["X_val"], data["X_test"],
        data["y_train"], data["y_val"], data["y_test"],
        data["feature_cols"],
    )


def plot_cm_detailed(ax, cm, title, labels=("Legitimo", "Fraude")):
    tn, fp, fn, tp = cm.ravel()
    total = cm.sum()
    cm_pct = cm / total * 100
    annot = np.empty_like(cm, dtype=object)
    for i in range(2):
        for j in range(2):
            annot[i, j] = f"{cm[i, j]}\n({cm_pct[i, j]:.1f}%)"
    sns.heatmap(cm, annot=annot, fmt="", cmap=CMAP, ax=ax, cbar=False,
                xticklabels=labels, yticklabels=labels,
                linewidths=1, linecolor="white", annot_kws={"fontsize": 11})
    ax.set_xlabel("Predicho", fontsize=10)
    ax.set_ylabel("Real", fontsize=10)
    p = tp / (tp + fp) if (tp + fp) > 0 else 0
    r = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * p * r / (p + r) if (p + r) > 0 else 0
    ax.set_title(f"{title}\nPrec: {p:.3f} Rec: {r:.3f} F1: {f1:.3f}", fontsize=10, fontweight="bold")


def train_and_compare():
    print("Cargando datos preprocesados...")
    X_train, X_val, X_test, y_train, y_val, y_test, feature_cols = load_preprocessed()
    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
    print(f"scale_pos_weight: {scale_pos_weight:.2f}")

    strategies = {
        "RandomForest": RandomForestStrategy(n_estimators=300, max_depth=15,
                                              min_samples_leaf=5, random_state=SEED),
        "XGBoost": XGBoostStrategy(n_estimators=300, max_depth=6, learning_rate=0.1,
                                    scale_pos_weight=scale_pos_weight, random_state=SEED),
        "LightGBM": LightGBMStrategy(n_estimators=300, num_leaves=31, learning_rate=0.1,
                                      random_state=SEED),
    }

    results = {}
    trained_models = {}

    for name, strategy in strategies.items():
        print(f"\nEntrenando {name}...")
        model = FraudModel(strategy)
        model.train(X_train, y_train, X_val, y_val)
        trained_models[name] = model

        y_pred = model.predict(X_val)
        y_proba = model.predict_proba(X_val)
        cm = confusion_matrix(y_val, y_pred)
        report = classification_report(y_val, y_pred, output_dict=True)

        results[name] = {
            "y_pred": y_pred, "y_proba": y_proba,
            "roc_auc": roc_auc_score(y_val, y_proba),
            "avg_pr": average_precision_score(y_val, y_proba),
            "cm": cm, "report": report,
        }

        tn, fp, fn, tp = cm.ravel()
        print(f"  AUC-ROC: {results[name]['roc_auc']:.4f}")
        print(f"  Avg PR:  {results[name]['avg_pr']:.4f}")
        print(f"  Matriz:  TN={tn} FP={fp} FN={fn} TP={tp}")
        print(f"  F1:      {report['1']['f1-score']:.4f}")

    best_name = max(results, key=lambda k: results[k]["roc_auc"])
    print(f"\nMejor modelo: {best_name} (AUC-ROC: {results[best_name]['roc_auc']:.4f})")

    best_model = trained_models[best_name]
    y_test_pred = best_model.predict(X_test)
    y_test_proba = best_model.predict_proba(X_test)
    cm_test = confusion_matrix(y_test, y_test_pred)
    report_test = classification_report(y_test, y_test_pred, output_dict=True)
    roc_auc_test = roc_auc_score(y_test, y_test_proba)
    avg_pr_test = average_precision_score(y_test, y_test_proba)

    tn, fp, fn, tp = cm_test.ravel()
    print(f"\nEvaluacion final en test ({best_name}):")
    print(f"  AUC-ROC: {roc_auc_test:.4f}")
    print(f"  Avg PR:  {avg_pr_test:.4f}")
    print(f"  Matriz:  TN={tn} FP={fp} FN={fn} TP={tp}")
    print(f"  F1:      {report_test['1']['f1-score']:.4f}")

    os.makedirs(MODELS_DIR, exist_ok=True)
    for name, model in trained_models.items():
        model.save(os.path.join(MODELS_DIR, f"{name.lower()}.pkl"))
    best_model.save_best(MODELS_DIR)
    print("Modelos guardados en models/")

    # --- Graficos ---
    fig, axes = plt.subplots(1, 3, figsize=(18, 5.5))
    for ax, (name, res) in zip(axes, results.items()):
        plot_cm_detailed(ax, res["cm"], name)
    plt.suptitle("Matrices de Confusion - Validacion", fontsize=14, fontweight="bold", y=1.02)
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "confusion_matrices.png"), dpi=200, bbox_inches="tight")
    plt.close()

    fig, ax = plt.subplots(figsize=(9, 7))
    for name, res in results.items():
        from sklearn.metrics import roc_curve
        fpr, tpr, _ = roc_curve(y_val, res["y_proba"])
        color = MODEL_COLORS.get(name, "#333")
        ls = "--" if name == best_name else "-"
        lw = 3 if name == best_name else 1.8
        ax.plot(fpr, tpr, linestyle=ls, linewidth=lw, color=color,
                label=f"{name} (AUC = {res['roc_auc']:.4f})")
    ax.plot([0, 1], [0, 1], "k--", alpha=0.3)
    ax.set_xlabel("Tasa de Falsos Positivos (FPR)")
    ax.set_ylabel("Tasa de Verdaderos Positivos (TPR)")
    ax.set_title("Curvas ROC - Comparacion de Modelos", fontsize=13, fontweight="bold")
    ax.legend(loc="lower right")
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "roc_comparison.png"), dpi=200, bbox_inches="tight")
    plt.close()

    print("Graficos guardados en reports/")


if __name__ == "__main__":
    train_and_compare()
