from abc import ABC, abstractmethod
import pandas as pd


class ExplanationStrategy(ABC):
    @abstractmethod
    def explain(self, row: pd.Series, alerts: list, score: int, level: str) -> str:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass


class DetailedExplanationStrategy(ExplanationStrategy):
    name = "Explicación detallada"

    def explain(self, row: pd.Series, alerts: list, score: int, level: str) -> str:
        lines = [
            f"Siniestro: {row.get('id_siniestro', 'N/A')}",
            f"Score de riesgo: {score}/100 | Nivel: {level}",
            "",
        ]

        if not alerts:
            lines.append("No se detectaron señales de riesgo significativas.")
        else:
            lines.append(f"Se detectaron {len(alerts)} señal(es) de riesgo:")
            for alert in alerts:
                lines.append(f"  - [{alert['rule']}]")
                for detail in alert["details"]:
                    lines.append(f"      > {detail}")

        lines.extend(
            [
                "",
                f"Ramo: {row.get('ramo', 'N/A')}",
                f"Cobertura: {row.get('cobertura', 'N/A')}",
                f"Monto reclamado: ${row.get('monto_reclamado', 0):,.2f}",
                f"Días ocurrencia-reporte: {row.get('dias_ocurrencia_reporte', 'N/A')}",
            ]
        )
        return "\n".join(lines)


class BriefExplanationStrategy(ExplanationStrategy):
    name = "Explicación breve"

    def explain(self, row: pd.Series, alerts: list, score: int, level: str) -> str:
        if not alerts:
            return (
                f"{row.get('id_siniestro', 'N/A')}: Sin alertas - Score {score}/100"
            )

        main_reasons = [a["rule"] for a in alerts[:3]]
        return (
            f"{row.get('id_siniestro', 'N/A')}: Score {score}/100 ({level}) - "
            f"Motivos: {'; '.join(main_reasons)}"
        )


class SummaryExplanationStrategy(ExplanationStrategy):
    name = "Resumen ejecutivo"

    def explain(self, row: pd.Series, alerts: list, score: int, level: str) -> str:
        if not alerts:
            return f"{row.get('id_siniestro', 'N/A')} - {level} - Sin observaciones"

        total_alertas = len(alerts)
        top_alerts = sorted(alerts, key=lambda a: sum(
            int(d.split(":")[-1].strip().split()[0])
            for d in a["details"]
            if any(c.isdigit() for c in d)
        ) if a["details"] else 0, reverse=True)

        alertas_str = ", ".join(a["rule"] for a in top_alerts[:3])
        return (
            f"{row.get('id_siniestro', 'N/A')} | Score: {score}/100 | {level} | "
            f"{total_alertas} alertas | Claves: {alertas_str}"
        )
