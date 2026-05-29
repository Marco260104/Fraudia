# Uso de Inteligencia Artificial

La solución usa IA de forma híbrida:

## 1. Reglas de negocio

- Detectan señales fuertes de posible fraude
- Construyen un `risk_rule_score`
- Sirven como base explicable para el analista

## 2. Machine Learning supervisado

- Entrena 4 modelos sobre el dataset consolidado
- El objetivo es estimar probabilidad de caso riesgoso
- El label de entrenamiento es simulado a partir de reglas trazables

## 3. Selección dinámica del top 3

- Se ordenan los modelos por ROC AUC de validación
- En inferencia se comparan las probabilidades de los 3 mejores
- Se elige la probabilidad más alta para el score final

## 4. Explicabilidad

- `feature_importance.png` muestra las variables más influyentes
- El score final se complementa con el score por reglas
- La salida se presenta como alerta para revisión humana, no como acusación automática

## 5. Justificación del enfoque

- Logistic Regression aporta una línea base interpretable
- Random Forest y Extra Trees capturan interacciones no lineales
- Gradient Boosting aporta robustez frente a relaciones complejas
- La comparación visual permite justificar el top 3 elegido

