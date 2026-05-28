import os
import joblib
from sklearn.model_selection import train_test_split

from src.ingestion.load_data import DataLoader
from src.features.build_features import FeatureBuilder

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "synthetic")
OUTPUT_DIR = os.path.join(BASE_DIR, "models")
SEED = 42


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Cargando y mergeando datos...")
    loader = DataLoader(BASE_DIR)
    df = loader.merge_all()

    print("Construyendo features...")
    builder = FeatureBuilder(seed=SEED)
    X = builder.prepare_features(df, fit=True)

    y = df["etiqueta_fraude"]
    feature_cols = builder.get_feature_cols()

    print(f"\nFeatures totales: {X.shape[1]}")
    print(f"Distribucion target: {y.value_counts().to_dict()}")
    print(f"Fraud rate: {y.mean()*100:.1f}%")

    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=0.15, random_state=SEED, stratify=y
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=0.1765, random_state=SEED, stratify=y_temp
    )

    print(f"\nSplit sizes:")
    print(f"  Train: {len(X_train)} ({y_train.mean()*100:.1f}% fraude)")
    print(f"  Val:   {len(X_val)} ({y_val.mean()*100:.1f}% fraude)")
    print(f"  Test:  {len(X_test)} ({y_test.mean()*100:.1f}% fraude)")

    output = {
        "X_train": X_train, "X_val": X_val, "X_test": X_test,
        "y_train": y_train, "y_val": y_val, "y_test": y_test,
        "feature_cols": feature_cols,
    }
    joblib.dump(output, os.path.join(OUTPUT_DIR, "preprocessed_data.pkl"))
    builder.save(os.path.join(OUTPUT_DIR, "feature_builder.pkl"))

    print("\nDatos guardados en models/")


if __name__ == "__main__":
    main()
