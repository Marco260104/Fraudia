"""Entrena RandomForest, XGBoost, LightGBM, compara y elige el mejor."""

import pandas as pd
import numpy as np
import os
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_curve, roc_auc_score, precision_recall_curve,
                             average_precision_score)
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

SEED = 42
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

np.random.seed(SEED)

# --- Cargar datos preprocesados ---
print("Cargando datos preprocesados...")
data = joblib.load(os.path.join(MODELS_DIR, "preprocessed_data.pkl"))
X_train = data["X_train"]
X_val = data["X_val"]
X_test = data["X_test"]
y_train = data["y_train"]
y_val = data["y_val"]
y_test = data["y_test"]
feature_cols = data["feature_cols"]

scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
print(f"scale_pos_weight para XGBoost: {scale_pos_weight:.2f}")

# --- Modelos ---
models = {
    "RandomForest": RandomForestClassifier(
        n_estimators=300, max_depth=15, min_samples_leaf=5,
        class_weight="balanced", random_state=SEED, n_jobs=-1
    ),
    "XGBoost": XGBClassifier(
        n_estimators=300, max_depth=6, learning_rate=0.1,
        scale_pos_weight=scale_pos_weight,
        eval_metric="auc", use_label_encoder=False,
        random_state=SEED, n_jobs=-1
    ),
    "LightGBM": LGBMClassifier(
        n_estimators=300, num_leaves=31, learning_rate=0.1,
        class_weight="balanced", random_state=SEED,
        n_jobs=-1, verbose=-1
    ),
}

# --- Entrenamiento y evaluacion en validation ---
results = {}
trained_models = {}

for name, model in models.items():
    print(f"\nEntrenando {name}...")
    if name == "XGBoost":
        model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    else:
        model.fit(X_train, y_train)

    trained_models[name] = model
    y_pred = model.predict(X_val)
    y_proba = model.predict_proba(X_val)[:, 1]

    fpr, tpr, _ = roc_curve(y_val, y_proba)
    roc_auc_val = roc_auc_score(y_val, y_proba)
    precision, recall, _ = precision_recall_curve(y_val, y_proba)
    avg_pr = average_precision_score(y_val, y_proba)
    cm = confusion_matrix(y_val, y_pred)
    report = classification_report(y_val, y_pred, output_dict=True)

    results[name] = {
        "y_pred": y_pred, "y_proba": y_proba,
        "fpr": fpr, "tpr": tpr, "roc_auc": roc_auc_val,
        "precision": precision, "recall": recall, "avg_pr": avg_pr,
        "cm": cm, "report": report,
    }

    tn, fp, fn, tp = cm.ravel()
    print(f"  AUC-ROC: {roc_auc_val:.4f}")
    print(f"  Avg PR:  {avg_pr:.4f}")
    print(f"  Matriz:  TN={tn} FP={fp} FN={fn} TP={tp}")
    print(f"  F1:      {report['1']['f1-score']:.4f}")
    print(f"  Recall:  {report['1']['recall']:.4f}")
    print(f"  Precision: {report['1']['precision']:.4f}")

# --- Seleccionar mejor modelo por AUC-ROC ---
best_name = max(results, key=lambda k: results[k]["roc_auc"])
print(f"\nMejor modelo en validation: {best_name} (AUC-ROC: {results[best_name]['roc_auc']:.4f})")

# --- Evaluacion final en test del mejor modelo ---
print(f"\nEvaluando {best_name} en test set...")
best_model = trained_models[best_name]
y_test_pred = best_model.predict(X_test)
y_test_proba = best_model.predict_proba(X_test)[:, 1]

cm_test = confusion_matrix(y_test, y_test_pred)
report_test = classification_report(y_test, y_test_pred, output_dict=True)
roc_auc_test = roc_auc_score(y_test, y_test_proba)
avg_pr_test = average_precision_score(y_test, y_test_proba)

tn, fp, fn, tp = cm_test.ravel()
print(f"  AUC-ROC: {roc_auc_test:.4f}")
print(f"  Avg PR:  {avg_pr_test:.4f}")
print(f"  Matriz:  TN={tn} FP={fp} FN={fn} TP={tp}")
print(f"  F1:      {report_test['1']['f1-score']:.4f}")
print(f"  Recall:  {report_test['1']['recall']:.4f}")
print(f"  Precision: {report_test['1']['precision']:.4f}")

# --- Guardar modelos ---
for name, model in trained_models.items():
    joblib.dump(model, os.path.join(MODELS_DIR, f"{name.lower()}.pkl"))
print("Modelos guardados en models/")

# ===================== GRAFICOS PROFESIONALES =====================

sns.set_style("whitegrid")
plt.rcParams.update({
    "figure.max_open_warning": 0,
    "font.size": 10,
    "axes.titlesize": 12,
    "axes.labelsize": 10,
})

MODEL_COLORS = {"RandomForest": "#2E86AB", "XGBoost": "#A23B72", "LightGBM": "#F18F01"}
CMAP = "Blues"

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
                linewidths=1, linecolor="white",
                annot_kws={"fontsize": 11})
    ax.set_xlabel("Predicho", fontsize=10)
    ax.set_ylabel("Real", fontsize=10)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    metrics_text = f"Precision: {precision:.3f}  Recall: {recall:.3f}  F1: {f1:.3f}"
    ax.set_title(f"{title}\n{metrics_text}", fontsize=10, fontweight="bold")

# --- 1. Matrices de confusion detalladas (3 paneles) ---
fig, axes = plt.subplots(1, 3, figsize=(18, 5.5))
for ax, (name, res) in zip(axes, results.items()):
    plot_cm_detailed(ax, res["cm"], name)
plt.suptitle("Matrices de Confusion - Validacion", fontsize=14, fontweight="bold", y=1.02)
plt.tight_layout()
plt.savefig(os.path.join(REPORTS_DIR, "confusion_matrices.png"), dpi=200, bbox_inches="tight")
plt.close()
print("Grafico: reports/confusion_matrices.png")

# --- 2. ROC comparativa con threshold markers ---
fig, ax = plt.subplots(figsize=(9, 7))
for name, res in results.items():
    color = MODEL_COLORS.get(name, "#333")
    ls = "--" if name == best_name else "-"
    lw = 3 if name == best_name else 1.8
    ax.plot(res["fpr"], res["tpr"], linestyle=ls, linewidth=lw, color=color,
            label=f"{name} (AUC = {res['roc_auc']:.4f})")
ax.plot([0, 1], [0, 1], "k--", alpha=0.3, linewidth=1)
ax.fill_between([0, 1], [0, 1], alpha=0.05, color="gray")
ax.set_xlim([-0.02, 1.02])
ax.set_ylim([-0.02, 1.08])
ax.set_xlabel("Tasa de Falsos Positivos (FPR)", fontsize=11)
ax.set_ylabel("Tasa de Verdaderos Positivos (TPR)", fontsize=11)
ax.set_title("Curvas ROC - Comparacion de Modelos", fontsize=13, fontweight="bold")
ax.legend(loc="lower right", fontsize=10, framealpha=0.9)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(REPORTS_DIR, "roc_comparison.png"), dpi=200, bbox_inches="tight")
plt.close()
print("Grafico: reports/roc_comparison.png")

# --- 3. Precision-Recall comparativa ---
fig, ax = plt.subplots(figsize=(9, 7))
for name, res in results.items():
    color = MODEL_COLORS.get(name, "#333")
    ls = "--" if name == best_name else "-"
    lw = 3 if name == best_name else 1.8
    ax.plot(res["recall"], res["precision"], linestyle=ls, linewidth=lw, color=color,
            label=f"{name} (AP = {res['avg_pr']:.4f})")
ax.axhline(y=sum(y_val == 1) / len(y_val), color="red", linestyle=":", alpha=0.5,
           label=f"Baseline ({y_val.mean():.3f})")
ax.set_xlim([-0.02, 1.02])
ax.set_ylim([-0.02, 1.08])
ax.set_xlabel("Recall", fontsize=11)
ax.set_ylabel("Precision", fontsize=11)
ax.set_title("Curvas Precision-Recall - Comparacion de Modelos", fontsize=13, fontweight="bold")
ax.legend(loc="lower left", fontsize=10, framealpha=0.9)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(REPORTS_DIR, "pr_comparison.png"), dpi=200, bbox_inches="tight")
plt.close()
print("Grafico: reports/pr_comparison.png")

# --- 4. Feature Importance del mejor modelo ---
if hasattr(best_model, "feature_importances_"):
    importances = best_model.feature_importances_
    indices = np.argsort(importances)[::-1][:15]
    colors = plt.cm.Blues(np.linspace(0.4, 0.9, 15))[::-1]
    fig, ax = plt.subplots(figsize=(10, 7))
    bars = ax.barh(range(len(indices)), importances[indices][::-1], color=colors, edgecolor="white")
    ax.set_yticks(range(len(indices)))
    ax.set_yticklabels([feature_cols[i] for i in indices[::-1]], fontsize=9)
    ax.set_xlabel("Importancia (Gain)", fontsize=11)
    ax.set_title(f"Top 15 Features - {best_name}", fontsize=13, fontweight="bold")
    for bar, val in zip(bars, importances[indices][::-1]):
        ax.text(val + 0.002, bar.get_y() + bar.get_height() / 2,
                f"{val:.4f}", va="center", fontsize=8)
    ax.set_xlim([0, max(importances) * 1.15])
    ax.grid(True, axis="x", alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(REPORTS_DIR, "feature_importance.png"), dpi=200, bbox_inches="tight")
    plt.close()
    print("Grafico: reports/feature_importance.png")

# --- 5. Barras comparativas de metricas ---
metrics_df = pd.DataFrame({
    name: {
        "AUC-ROC": res["roc_auc"],
        "Avg Precision": res["avg_pr"],
        "F1 (Fraude)": res["report"]["1"]["f1-score"],
        "Recall (Fraude)": res["report"]["1"]["recall"],
        "Precision (Fraude)": res["report"]["1"]["precision"],
    }
    for name, res in results.items()
}).T

fig, ax = plt.subplots(figsize=(11, 6))
x = np.arange(len(metrics_df.columns))
width = 0.25
for i, (name, row) in enumerate(metrics_df.iterrows()):
    color = MODEL_COLORS.get(name, "#333")
    offset = (i - 1) * width
    bars = ax.bar(x + offset, row.values, width, label=name, color=color, alpha=0.85, edgecolor="white")
    for bar, val in zip(bars, row.values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.01,
                f"{val:.3f}", ha="center", va="bottom", fontsize=7, rotation=45)
ax.set_xticks(x)
ax.set_xticklabels(metrics_df.columns, fontsize=10)
ax.set_ylabel("Score", fontsize=11)
ax.set_title("Comparacion de Metricas por Modelo", fontsize=13, fontweight="bold")
ax.set_ylim([0, 1.15])
ax.legend(fontsize=10, framealpha=0.9)
ax.grid(True, axis="y", alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(REPORTS_DIR, "metrics_comparison.png"), dpi=200, bbox_inches="tight")
plt.close()
print("Grafico: reports/metrics_comparison.png")

# --- 6. Matriz de confusion del mejor modelo en TEST ---
fig, ax = plt.subplots(figsize=(6.5, 5.5))
plot_cm_detailed(ax, cm_test, f"{best_name} - Test Set")
ax.set_title(f"{best_name} - Evaluacion Final en Test\nAUC: {roc_auc_test:.4f} | AP: {avg_pr_test:.4f}",
             fontsize=11, fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(REPORTS_DIR, "confusion_test_best.png"), dpi=200, bbox_inches="tight")
plt.close()
print("Grafico: reports/confusion_test_best.png")

# ===================== RESUMEN FINAL =====================
print("\n" + "=" * 65)
print(f"  MODELO GANADOR: {best_name}")
print("=" * 65)
print(f"\n  Metricas en Validation Set:")
for name in models:
    r = results[name]
    print(f"  {name:12s} | AUC: {r['roc_auc']:.4f} | F1: {r['report']['1']['f1-score']:.4f} | "
          f"Recall: {r['report']['1']['recall']:.4f} | Prec: {r['report']['1']['precision']:.4f}")

print(f"\n  Metricas Finales en Test Set ({best_name}):")
print(f"  AUC-ROC:     {roc_auc_test:.4f}")
print(f"  Avg PR:      {avg_pr_test:.4f}")
print(f"  Precision:   {report_test['1']['precision']:.4f}")
print(f"  Recall:      {report_test['1']['recall']:.4f}")
print(f"  F1-Score:    {report_test['1']['f1-score']:.4f}")
print(f"\n  Matriz de confusion (Test):")
print(f"  TN={tn}  FP={fp}")
print(f"  FN={fn}  TP={tp}")
print("\n  Reportes y graficos en: reports/")
print("  Modelos guardados en: models/")
print("=" * 65)
