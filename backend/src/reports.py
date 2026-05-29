from __future__ import annotations

from pathlib import Path
from typing import Iterable

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import auc, confusion_matrix, precision_recall_curve, roc_curve


def _setup_chart(title: str, xlabel: str, ylabel: str):
    fig, ax = plt.subplots(figsize=(12, 7), dpi=160)
    ax.set_title(title, fontsize=16, fontweight="bold")
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.grid(True, axis="y", alpha=0.2)
    return fig, ax


def save_metrics_comparison(metrics: dict[str, dict[str, float]], path: Path) -> None:
    labels = list(metrics)
    auc_values = [metrics[m]["roc_auc"] for m in labels]
    f1_values = [metrics[m]["f1"] for m in labels]
    precision_values = [metrics[m]["precision"] for m in labels]
    recall_values = [metrics[m]["recall"] for m in labels]

    fig, ax = plt.subplots(figsize=(14, 7), dpi=160)
    x = np.arange(len(labels))
    width = 0.2
    ax.bar(x - 1.5 * width, auc_values, width, label="ROC AUC")
    ax.bar(x - 0.5 * width, f1_values, width, label="F1")
    ax.bar(x + 0.5 * width, precision_values, width, label="Precision")
    ax.bar(x + 1.5 * width, recall_values, width, label="Recall")
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=20, ha="right")
    ax.set_ylim(0, 1.05)
    ax.set_ylabel("Score")
    ax.set_title("Comparación de modelos por métricas")
    ax.grid(True, axis="y", alpha=0.2)
    ax.legend(ncol=4, loc="lower center", bbox_to_anchor=(0.5, -0.18))
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def save_roc_curves(y_true, y_scores: dict[str, np.ndarray], path: Path) -> None:
    fig, ax = plt.subplots(figsize=(10, 8), dpi=160)
    for name, scores in y_scores.items():
        fpr, tpr, _ = roc_curve(y_true, scores)
        ax.plot(fpr, tpr, linewidth=2, label=f"{name} (AUC={auc(fpr, tpr):.3f})")
    ax.plot([0, 1], [0, 1], linestyle="--", color="gray", linewidth=1)
    ax.set_title("Curvas ROC comparativas")
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.legend()
    ax.grid(True, alpha=0.2)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def save_pr_curves(y_true, y_scores: dict[str, np.ndarray], path: Path) -> None:
    fig, ax = plt.subplots(figsize=(10, 8), dpi=160)
    for name, scores in y_scores.items():
        precision, recall, _ = precision_recall_curve(y_true, scores)
        ax.plot(recall, precision, linewidth=2, label=name)
    ax.set_title("Curvas Precision-Recall comparativas")
    ax.set_xlabel("Recall")
    ax.set_ylabel("Precision")
    ax.legend()
    ax.grid(True, alpha=0.2)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def save_confusion_matrices(y_true, y_preds: dict[str, np.ndarray], path: Path) -> None:
    labels = list(y_preds)
    fig, axes = plt.subplots(2, 2, figsize=(12, 10), dpi=160)
    axes = axes.flatten()
    for ax, name in zip(axes, labels):
        cm = confusion_matrix(y_true, y_preds[name])
        ax.imshow(cm, cmap="Blues")
        ax.set_title(name)
        ax.set_xticks([0, 1])
        ax.set_yticks([0, 1])
        ax.set_xlabel("Predicho")
        ax.set_ylabel("Real")
        for i in range(2):
            for j in range(2):
                ax.text(j, i, str(cm[i, j]), ha="center", va="center", color="black")
    for ax in axes[len(labels):]:
        ax.axis("off")
    fig.suptitle("Matrices de confusión por modelo", fontsize=16, fontweight="bold")
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def save_feature_importance(feature_names: Iterable[str], importances: Iterable[float], path: Path, top_n: int = 15) -> None:
    pairs = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)[:top_n]
    names = [name for name, _ in pairs][::-1]
    values = [value for _, value in pairs][::-1]
    fig, ax = plt.subplots(figsize=(12, 8), dpi=160)
    ax.barh(names, values, color="#1f77b4")
    ax.set_title("Importancia de variables del mejor modelo")
    ax.set_xlabel("Importancia")
    ax.grid(True, axis="x", alpha=0.2)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)


def save_distribution(series, path: Path, title: str, xlabel: str) -> None:
    fig, ax = plt.subplots(figsize=(10, 6), dpi=160)
    ax.hist(series, bins=20, color="#4c78a8", alpha=0.85)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel("Casos")
    ax.grid(True, axis="y", alpha=0.2)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight")
    plt.close(fig)
