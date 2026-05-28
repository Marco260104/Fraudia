import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder
import joblib
import os


class FeatureBuilder:
    def __init__(self, seed: int = 42):
        self.seed = seed
        self.encoders = {}
        self.vectorizer = None
        self.feature_cols = None

    def build(self, df: pd.DataFrame) -> pd.DataFrame:
        result = df.copy()

        result["ratio_monto"] = result["monto_reclamado"] / (result["monto_estimado"] + 0.01)
        result["documentos_faltantes"] = 1.0 - result["pct_entregados"]
        result["cobertura_es_ptxrb"] = (
            result["cobertura"].str.contains("PTxRB|Robo total", na=False).astype(int)
        )
        result["dias_borde_inicio_score"] = np.where(
            result["dias_inicio_poliza"] <= 10, 8,
            np.where(result["dias_inicio_poliza"] <= 30, 4, 0)
        )
        result["dias_borde_fin_score"] = np.where(
            result["dias_fin_poliza"] <= 10, 8,
            np.where(result["dias_fin_poliza"] <= 30, 4, 0)
        )
        result["frecuencia_proveedor"] = result["id_proveedor"].map(
            result["id_proveedor"].value_counts().to_dict()
        )
        result["docs_completos_bin"] = (result["documentos_completos"] == "Sí").astype(int)

        return result

    def build_nlp(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        result = df.copy()

        if fit or self.vectorizer is None:
            self.vectorizer = TfidfVectorizer(max_features=500, lowercase=True)
            tfidf_matrix = self.vectorizer.fit_transform(
                result["descripcion"].fillna("")
            )
        else:
            tfidf_matrix = self.vectorizer.transform(
                result["descripcion"].fillna("")
            )

        sim_matrix = cosine_similarity(tfidf_matrix)
        np.fill_diagonal(sim_matrix, 0)
        result["similitud_narrativa_max"] = sim_matrix.max(axis=1)
        return result

    def encode_categorical(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        result = df.copy()
        cat_cols = [
            "ramo", "cobertura", "estado", "sucursal", "beneficiario_tipo",
            "segmento", "perfil_riesgo", "tipo", "canal_venta", "ciudad",
        ]

        for col in cat_cols:
            if fit or col not in self.encoders:
                le = LabelEncoder()
                result[col + "_enc"] = le.fit_transform(result[col].astype(str))
                self.encoders[col] = le
            else:
                le = self.encoders[col]
                known_classes = set(le.classes_)
                result[col + "_enc"] = result[col].astype(str).map(
                    lambda x: le.transform([x])[0] if x in known_classes else -1
                )
        return result

    def get_feature_cols(self) -> list:
        if self.feature_cols:
            return self.feature_cols

        self.feature_cols = [
            "monto_reclamado", "monto_estimado", "dias_inicio_poliza",
            "dias_fin_poliza", "dias_ocurrencia_reporte",
            "historial_siniestros_asegurado", "score_cliente_asegurado",
            "mora_actual_asegurado", "reclamos_12m", "total_siniestros_hist",
            "antiguedad_anios", "prima", "deducible", "duracion_meses",
            "ratio_monto", "documentos_faltantes", "pct_legibles",
            "pct_inconsistentes", "frecuencia_proveedor", "reclamos_asociados",
            "monto_promedio_reclamado", "porcentaje_casos_observados",
            "proveedor_en_lista_restrictiva", "cobertura_es_ptxrb",
            "dias_borde_inicio_score", "dias_borde_fin_score",
            "docs_completos_bin", "similitud_narrativa_max",
        ]
        cat_encoded = [
            "ramo_enc", "cobertura_enc", "estado_enc", "sucursal_enc",
            "beneficiario_tipo_enc", "segmento_enc", "perfil_riesgo_enc",
            "tipo_enc", "canal_venta_enc", "ciudad_enc",
        ]
        self.feature_cols += cat_encoded
        return self.feature_cols

    def prepare_features(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        result = self.build(df)
        result = self.build_nlp(result, fit=fit)
        result = self.encode_categorical(result, fit=fit)
        return result[self.get_feature_cols()]

    def save(self, path: str):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(
            {"encoders": self.encoders, "vectorizer": self.vectorizer,
             "feature_cols": self.feature_cols},
            path,
        )

    def load(self, path: str):
        data = joblib.load(path)
        self.encoders = data["encoders"]
        self.vectorizer = data["vectorizer"]
        self.feature_cols = data["feature_cols"]
