import os
import pandas as pd


class DataLoader:
    def __init__(self, base_dir: str = None):
        self.base_dir = base_dir or os.path.dirname(
            os.path.dirname(os.path.dirname(__file__))
        )
        self.data_dir = os.path.join(self.base_dir, "data", "synthetic")

    def load_csv(self, filename: str) -> pd.DataFrame:
        path = os.path.join(self.data_dir, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"No se encontro {path}. Ejecuta generate primero.")
        return pd.read_csv(path)

    def load_all(self) -> dict:
        return {
            "siniestros": self.load_csv("siniestros.csv"),
            "documentos": self.load_csv("documentos.csv"),
            "asegurados": self.load_csv("asegurados.csv"),
            "proveedores": self.load_csv("proveedores.csv"),
            "polizas": self.load_csv("polizas.csv"),
        }

    def merge_all(self) -> pd.DataFrame:
        tables = self.load_all()
        df = tables["siniestros"].copy()

        docs_agg = tables["documentos"].groupby("id_siniestro").agg(
            total_docs=("id_documento", "count"),
            pct_entregados=("entregado", "mean"),
            pct_legibles=("legible", "mean"),
            pct_inconsistentes=("inconsistencia_detectada", "mean"),
        ).reset_index()
        df = df.merge(docs_agg, on="id_siniestro", how="left")

        keep_aseg = ["id_asegurado", "segmento", "antiguedad_anios",
                      "reclamos_12m", "total_siniestros_hist", "perfil_riesgo"]
        df = df.merge(tables["asegurados"][keep_aseg], on="id_asegurado", how="left")

        keep_prov = ["id_proveedor", "tipo", "reclamos_asociados",
                      "monto_promedio_reclamado", "porcentaje_casos_observados"]
        df = df.merge(tables["proveedores"][keep_prov], on="id_proveedor", how="left")

        keep_pol = ["id_poliza", "prima", "deducible", "duracion_meses",
                     "canal_venta", "ciudad"]
        df = df.merge(tables["polizas"][keep_pol], on="id_poliza", how="left")

        print(f"DataFrame merged: {df.shape[0]} rows, {df.shape[1]} columns")
        return df

    def data_exists(self) -> bool:
        required = ["siniestros.csv", "documentos.csv", "asegurados.csv",
                     "proveedores.csv", "polizas.csv"]
        return all(os.path.exists(os.path.join(self.data_dir, f)) for f in required)
