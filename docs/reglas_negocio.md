# Reglas de Negocio — Sistema Fraudia

Este documento describe las señales de riesgo utilizadas por el motor de scoring compuesto de Fraudia para calcular el nivel de alerta de cada siniestro.

---

## Tabla de Señales de Riesgo (Score Compuesto)

| # | Señal de Riesgo | Peso en Score | Tipo | Descripción |
|---|----------------|---------------|------|-------------|
| 1 | **Similitud narrativa alta (NLP)** | 30% (escala) | Automática | Score TF-IDF de similitud entre la descripción del siniestro y el corpus histórico. Un valor ≥ 0.80 indica posible copia de relato. |
| 2 | **Proveedor en lista restrictiva** | +25 puntos | Booleano | El taller o proveedor asociado al siniestro consta en la lista de observados por conductas previas (sobrefacturación, clonación de relatos, colusión). |
| 3 | **Siniestro cercano al inicio de vigencia** | +20 puntos | Temporal | El siniestro ocurrió dentro de los primeros 30 días de inicio de la póliza. Este patrón es indicativo de fraude planeado ("fraude exprés"). |
| 4 | **Documentación incompleta** | +15 puntos | Documental | El campo `docs_completos = 'No'` indica que el expediente carece de documentos obligatorios (parte policial, cotización firmada, cédula del tercero, etc.). |
| 5 | **Demora en reporte del siniestro** | +10 puntos | Temporal | El siniestro fue reportado más de 7 días después de la fecha de ocurrencia. Las demoras atípicas pueden indicar preparación del expediente fraudulento. |

**Fórmula del score compuesto:**

```
score = (similitud_narrativa_max × 30)
      + (25 si prov_lista_restrictiva = 'Sí')
      + (20 si dias_desde_inicio_poliza < 30)
      + (15 si docs_completos = 'No')
      + (10 si dias_ocurrencia_reporte > 7)

score_final = min(100, score)
```

---

## Umbrales de Clasificación

| Rango de Score | Nivel | Estado Sugerido |
|----------------|-------|-----------------|
| 0 – 39% | **Bajo** | Sin alerta. Procesamiento normal. |
| 40 – 64% | **Medio** | En revisión. Requiere verificación documental. |
| 65 – 84% | **Alto** | Investigación IA. Asignar a analista antifraude. |
| 85 – 100% | **Crítico** | Escalado automático. Suspender proceso de pago. |

---

## Señales Adicionales (No Incorporadas en Score Automático)

Las siguientes señales son analizadas contextualmente por el analista pero no se incluyen en el scoring automático actual:

| Señal | Descripción |
|-------|-------------|
| Recurrencia del asegurado | Más de 2 siniestros en los últimos 12 meses |
| Red de colusión | Mismo taller + mismo asegurado en más de 3 casos |
| Monto atípico | Monto reclamado > 2.5 desviaciones estándar del ramo |
| Patrón geográfico | Concentración de siniestros en misma zona sin justificación |
| Coincidencia de fotos | Imágenes de daños reutilizadas en múltiples casos |

---

## Umbral de Decisión del Modelo ML

El modelo Random Forest genera una probabilidad de fraude entre 0.0 y 1.0. El umbral de decisión predeterminado es **0.50** (ajustable desde `/configuración`). Este umbral determina qué casos aparecen en la vista de "Casos Críticos".

---

*Fuente: Documento del reto — Hackathon Fraudia 2026*
