# Limitaciones del Sistema Fraudia

Este documento describe las limitaciones técnicas y operativas conocidas del sistema Fraudia v1.0.

---

## 1. Etiquetado heurístico (no supervisado real)

El label de fraude (`fraude_flag`) utilizado para entrenar el modelo fue generado mediante un conjunto de reglas heurísticas (similitud narrativa alta + proveedor en lista restrictiva + documentación incompleta), **no a partir de casos reales confirmados de fraude** por auditores humanos. Esto significa que el modelo aprende a reproducir las mismas reglas con las que fue etiquetado, creando un sesgo circular. La capacidad del modelo para detectar fraudes novedosos que no siguen estos patrones puede ser limitada.

## 2. Dataset sintético de 500 registros

El conjunto de datos de entrenamiento contiene **500 registros sintéticos** generados para este prototipo. Este volumen es insuficiente para generalizar a patrones reales de fraude en una cartera de seguros activa (que puede contener decenas de miles de siniestros). Las métricas de rendimiento (ROC-AUC > 0.98) reflejan el sobreajuste sobre un conjunto de datos pequeño y sintético.

## 3. Similitud NLP basada en TF-IDF, no en embeddings semánticos

El módulo de comparación de narrativas utiliza **TF-IDF con similitud coseno**, que mide coincidencia de palabras literales. Esta aproximación no captura sinónimos, reformulaciones, ni similitud semántica profunda. Un defraudador que cambie sistemáticamente el vocabulario puede eludir esta detección. La implementación correcta requeriría embeddings semánticos (e.g., Sentence-BERT, multilingual-e5).

## 4. Ausencia de datos de vehículos con número de chasis y motor

La tabla de siniestros solo contiene la **placa del vehículo**, sin número de chasis (VIN) ni número de motor. Esto impide detectar fraudes comunes como la sustitución de placas, los vehículos clonados, o el robo de identidad vehicular. Un sistema de producción requeriría integración con el RUNT o el SRI (Ecuador) para validar la identidad física del vehículo.

## 5. Modelo no validado en producción real

El modelo Random Forest fue entrenado y evaluado únicamente sobre el conjunto de datos sintético. **No ha sido validado con casos reales, no ha pasado por pruebas de campo, y no ha sido auditado por peritos en fraude de seguros.** Su uso debe limitarse estrictamente a demostraciones y prototipos. Cualquier decisión operativa basada en sus scores requiere revisión humana obligatoria.

## 6. Los scores son orientativos y requieren revisión humana obligatoria

Los scores de riesgo generados por Fraudia (tanto el score del modelo ML como el score compuesto de reglas) son **indicadores de priorización para el analista, no dictámenes de fraude**. El sistema no debe utilizarse para rechazar automáticamente reclamos ni para tomar decisiones adversas contra asegurados sin la revisión, validación e intervención de un analista forense certificado. Todo output del sistema debe interpretarse como "requiere revisión" y no como "es fraude confirmado".

---

*Última actualización: Mayo 2026 — Fraudia v1.0 (Prototipo de Hackathon)*
