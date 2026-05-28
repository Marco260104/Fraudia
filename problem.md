 ## Detector de Posibles Fraudes en Siniestros usando Inteligencia Artificial

**Documento de levantamiento funcional, alcance técnico, entregables y criterios de evaluación**

| Elemento               | Definición                                                                   |
| ---------------------- | ---------------------------------------------------------------------------- |
| Sector                 | Asegurador                                                                   |
| Tipo de solución       | Prototipo funcional basado en Inteligencia Artificial                        |
| Datos permitidos       | Datos públicos reales o datos sintéticos                                     |
| Entregables            | Prototipo funcional, código fuente, dataset, documentación y demo            |
| Herramientas esperadas | Claude, ChatGPT, GitHub, Python, Oracle y R                                  |
| Principio clave        | La solución genera alertas de revisión, no acusaciones automáticas de fraude |

---

# Contenido

1. Resumen ejecutivo
2. Planteamiento del problema
3. Objetivos
4. Alcance del reto
5. Usuarios beneficiarios
6. Datos mínimos requeridos
7. Señales de posible fraude
8. Reglas de negocio sugeridas
9. Uso esperado de Inteligencia Artificial
10. Funcionalidades del prototipo
11. Casos de uso
12. Preguntas que el agente de IA debe responder
13. Score de riesgo sugerido
14. Entregables obligatorios
15. Estructura del repositorio
16. Requisitos técnicos y estándares
17. Seguridad, privacidad y ética
18. Criterios de evaluación
19. Métricas sugeridas
20. Riesgos y mitigaciones
21. Formato de presentación

---

# 1. Resumen ejecutivo

El sector asegurador enfrenta el reto de identificar oportunamente posibles patrones irregulares en los siniestros reportados. La detección manual depende de la experiencia del analista, reglas dispersas, revisión documental y cruces de información que pueden tomar tiempo.

El reto consiste en desarrollar un prototipo funcional basado en Inteligencia Artificial que analice información de siniestros y genere un score de riesgo de posible fraude, acompañado de alertas explicables, patrones detectados y recomendaciones para revisión humana.

La solución no debe emitir una acusación de fraude ni rechazar automáticamente un siniestro. Su propósito es identificar casos sospechosos, anómalos o de mayor riesgo para que sean revisados por un analista especializado.

---

# 2. Planteamiento del problema

En una aseguradora, los siniestros pueden presentar señales de riesgo que no siempre son evidentes en una revisión individual. Algunas alertas aparecen al cruzar variables de pólizas, asegurados, proveedores, documentos, fechas, montos e historial de reclamos.

* Frecuencia inusual de reclamos por asegurado o póliza.
* Montos reclamados superiores al promedio del ramo o del tipo de siniestro.
* Repetición de beneficiarios, proveedores, talleres, intermediarios asociados a casos observados.
* Reclamos ocurridos muy cerca de la fecha de inicio y fin de vigencia de la póliza.
* Documentos incompletos, ilegibles o inconsistentes.
* Narrativas similares entre diferentes reclamos.
* Cambios recientes en datos del asegurado antes del siniestro.
* Reporte tardío del evento frente a la fecha de ocurrencia.

---

# 3. Objetivos

## 3.1 Objetivo general

Desarrollar un prototipo funcional de Inteligencia Artificial que permita analizar siniestros de seguros, detectar patrones anómalos o señales de posible fraude, asignar un score de riesgo y generar explicaciones para apoyar la revisión del analista.

## 3.2 Objetivos específicos

1. Cargar y procesar información sintética o pública de siniestros.
2. Identificar patrones atípicos en reclamos.
3. Calcular un score de riesgo por siniestro.
4. Clasificar casos en niveles de riesgo: verde, amarillo, rojo.
5. Generar alertas explicables para el analista.
6. Permitir consultas en lenguaje natural sobre los casos detectados.
7. Presentar un dashboard o interfaz funcional.
8. Documentar el modelo, reglas, datos y limitaciones.
9. Entregar código fuente ejecutable y reproducible.
10. Proponer una arquitectura escalable para una implementación futura.

---

# 4. Alcance del reto

## 4.1 Incluye

* Carga de un dataset de siniestros, pólizas, asegurados, vehículos (placa, chasis, motor, marca, modelo, año), beneficiarios, proveedores y documentos.
* Análisis de variables del reclamo, pólizas, asegurados, vehículos (placa, chasis, motor, marca, modelo, año), beneficiarios, proveedores y documentos.
* Detección de anomalías o señales de riesgo.
* Generación de score de posible fraude.
* Priorización de casos para revisión, semáforo: verde, amarillo, rojo.
* Explicación del motivo de cada alerta.
* Interfaz, dashboard, aplicación o notebook funcional para la demo.
* Exportación o visualización de un resumen o bandeja de casos sospechosos.

## 4.2 No incluye

* Acusar formalmente a un asegurado de fraude.
* Rechazar automáticamente un siniestro.
* Sustituir el análisis humano.
* Usar datos personales reales o información confidencial.
* Tomar decisiones automáticas de pago o rechazo.
* Presentar conclusiones legales definitivas.

---

# 5. Usuarios beneficiarios

| Usuario                | Beneficio esperado                                   |
| ---------------------- | ---------------------------------------------------- |
| Analista de siniestros | Priorización de casos y explicación de alertas       |
| Analista antifraude    | Identificación temprana de patrones sospechosos      |
| Jefatura de siniestros | Visión consolidada de riesgos operativos             |
| Riesgos                | Monitoreo de exposición y comportamiento anómalo     |
| Auditoría interna      | Evidencia y trazabilidad para revisión               |
| Tecnología             | Base para prototipo escalable e integrable           |
| Gerencia               | Reducción potencial de pérdidas y mejora del control |

---

# 6. Datos mínimos requeridos

Para el reto se recomienda trabajar con datos sintéticos o públicos. Si se representa información interna de una aseguradora, los datos deberán ser sintéticos y no contener información personal identificable.

## 6.1 Tabla: Siniestros

| Campo                          | Descripción                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| id_siniestro                   | Identificador único del siniestro                                                         |
| id_poliza                      | Identificador de la póliza                                                                |
| id_asegurado                   | Identificador anónimo del asegurado                                                       |
| ramo                           | Vehículos, salud, vida, generales, hogar u otro                                           |
| cobertura                      | Choque, robo, atención médica, incendio, daño u otro                                      |
| fecha_ocurrencia               | Fecha del evento                                                                          |
| fecha_reporte                  | Fecha de notificación                                                                     |
| monto_reclamado                | Valor solicitado por el asegurado o proveedor                                             |
| monto_estimado                 | Valor estimado por la aseguradora                                                         |
| monto_pagado                   | Valor pagado, si aplica                                                                   |
| estado                         | Reserva, Pago Total, Pago Parcial, Anticipo, Negativa, Cierre Sin Consecuencia, Liquidado |
| sucursal                       | Sucursal del siniestro                                                                    |
| descripcion                    | Texto libre del reclamo                                                                   |
| documentos_completos           | Indicador Sí/No                                                                           |
| beneficiario                   | Taller, clínica, perito u otro                                                            |
| dias_desde_inicio_poliza       | Días entre inicio de póliza y siniestro                                                   |
| dias_desde_fin_poliza          | Días entre fin de póliza y siniestro                                                      |
| dias_entre_ocurrencia_reporte  | Diferencia entre ocurrencia y reporte                                                     |
| historial_siniestros_asegurado | Número de siniestros previos del asegurado                                                |
| etiqueta_fraude_simulada       | 0/1, solo para entrenamiento o evaluación si aplica                                       |

## 6.2 Tablas complementarias sugeridas

### Pólizas

* id_poliza
* id_asegurado
* ramo
* fecha_inicio
* fecha_fin
* prima
* suma_asegurada
* deducible
* canal_venta
* ciudad
* estado_poliza

### Asegurados sintéticos

* id_asegurado
* segmento
* antigüedad
* ciudad
* número de pólizas
* reclamos últimos 12 meses
* mora actual
* score cliente simulado

### Beneficiarios / Proveedores

* id_proveedor
* tipo
* ciudad
* reclamos asociados
* monto promedio reclamado
* porcentaje de casos observados
* antigüedad

### Documentos

* id_documento
* id_siniestro
* tipo_documento
* entregado
* legible
* fecha_emision
* inconsistencia_detectada
* observacion

---

# 7. Señales de posible fraude

| Señal                                     | Ejemplo                                                                                              | Puntuación                                             |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Reclamo cercano al borde de vigencia      | Siniestro ocurrido pocos días después de contratar la póliza o antes del fin de vigencia (≤ 30 días) | ≤ 10 días: 8 pts / 11-30 días: 4 pts / >30 días: 0 pts |
| Demora denuncia por robo                  | Tiempo prolongado entre evento y denuncia formal                                                     | >48h: 8 pts / 24-48h: 4 pts / <24h: 0 pts              |
| Alta frecuencia de reclamos asegurado     | Múltiples siniestros en ≤18 meses                                                                    | ≥3: 8 pts / 2: 4 pts                                   |
| Alta frecuencia de reclamos vehículo      | Vehículo con varios siniestros                                                                       | ≥3: 6 pts / 2: 3 pts                                   |
| Alta frecuencia de conductor vehículo     | Conductor involucrado en varios siniestros                                                           | ≥3: 8 pts / 2: 4 pts                                   |
| Alta frecuencia reclamos solo RC          | Cobertura RC repetitiva                                                                              | >2 eventos: 6 pts / 1 evento: 3 pts                    |
| Beneficiario / proveedor recurrente       | Proveedor ligado a casos observados                                                                  | Lista restrictiva: 10 pts / >2 casos: 5 pts            |
| Documentos incompletos                    | Falta evidencia obligatoria                                                                          | Documento legal faltante: 4 pts                        |
| Dinámica sospechosa                       | Relato inconsistente con impacto                                                                     | Impacto ilógico: 6 pts                                 |
| Eventos sin tercero identificado          | No existe o huye tercero involucrado                                                                 | Daño severo sin evidencia: 5 pts                       |
| Documentos inconsistentes                 | Fechas o valores no coinciden                                                                        | Alteración confirmada: 10 pts                          |
| Reporte tardío                            | Reporte muchos días después                                                                          | >7 días: 5 pts / 4-7 días: 3 pts                       |
| Narrativas similares                      | Reclamos con textos parecidos                                                                        | >85% similitud: 8 pts / 70-84%: 4 pts                  |
| Monto cercano o superior a suma asegurada | Reclamo muy alto                                                                                     | >95% suma asegurada: 4 pts                             |

---

# 8. Reglas de negocio sugeridas críticas

| Código | Regla                                                         | Clasificación |
| ------ | ------------------------------------------------------------- | ------------- |
| RF-01  | Cobertura Pérdida Total por Robo (PTxRB)                      | Rojo          |
| RF-02  | Evidencia de falsificación o adulteración documental evidente | Rojo          |
| RF-03  | Coincidencia exacta con lista restrictiva                     | Rojo          |
| RF-04  | Dinámica del accidente físicamente imposible                  | Rojo          |
| RF-05  | Siniestro extremo al borde de vigencia (<48 hrs)              | Amarillo      |
| RF-06  | Demora atípica en denuncia de robo (>4 días)                  | Amarillo      |
| RF-07  | Narrativa idéntica (clonada)                                  | Amarillo      |

---

# 9. Uso esperado de Inteligencia Artificial

| Enfoque                           | Aplicación esperada                                    |
| --------------------------------- | ------------------------------------------------------ |
| Machine Learning supervisado      | Predicción de probabilidad de fraude                   |
| Detección de anomalías            | Identificación de comportamientos anómalos             |
| Procesamiento de lenguaje natural | Similitud textual, extracción de entidades y resúmenes |
| Agente IA explicativo             | Consultas en lenguaje natural                          |
| Enfoque híbrido                   | Reglas + anomalías + NLP + dashboard                   |

La mejor solución combinaría reglas de negocio, modelo de anomalías o clasificación, análisis de texto, dashboard y agente de explicación.

---

# 10. Funcionalidades del prototipo

## 10.1 Funcionalidades mínimas

1. Carga de datos de siniestros.
2. Cálculo de variables de riesgo.
3. Detección de alertas por reglas.
4. Modelo de IA para score de posible fraude.
5. Clasificación de riesgo: bajo, medio, alto o crítico.
6. Dashboard o interfaz para revisar casos.
7. Explicación automática del motivo de la alerta.

## 10.2 Funcionalidades deseables

* Chat con consultas en lenguaje natural.
* Análisis del texto del reclamo.
* Red de relaciones entre asegurados y proveedores.
* Ranking de proveedores con más alertas.
* Simulación de ahorro potencial.
* Exportación de reportes.
* API funcional para integración futura.

---

# 11. Casos de uso

| Código | Caso de uso              | Resultado esperado                        |
| ------ | ------------------------ | ----------------------------------------- |
| CU-01  | Cargar siniestros        | Validar estructura y procesar información |
| CU-02  | Calcular score de riesgo | Cada siniestro recibe un puntaje          |
| CU-03  | Priorizar casos          | Visualización ordenada por riesgo         |
| CU-04  | Explicar alerta          | Mostrar factores de riesgo                |
| CU-05  | Consultar mediante IA    | Respuestas basadas en datos               |
| CU-06  | Generar reporte          | Resumen ejecutivo de casos críticos       |

---

# 12. Preguntas que el agente de IA debe responder

1. ¿Cuáles son los 10 siniestros con mayor riesgo de posible fraude?
2. ¿Por qué este siniestro fue marcado como alto riesgo?
3. ¿Qué proveedores concentran más alertas?
4. ¿Qué ramos tienen mayor porcentaje de casos sospechosos?
5. ¿Qué ciudades presentan mayor concentración de alertas?
6. ¿Qué asegurados tienen mayor frecuencia de reclamos?
7. ¿Qué documentos faltan en los casos críticos?
8. ¿Qué casos tienen montos atípicos?
9. ¿Qué siniestros ocurrieron cerca del inicio de la póliza?
10. ¿Qué patrones se repiten en los reclamos sospechosos?
11. Genera un resumen ejecutivo de los casos críticos.
12. Recomienda qué casos debería revisar primero el analista.

---

# 13. Score de riesgo sugerido

| Rango  | Nivel             | Acción sugerida                 |
| ------ | ----------------- | ------------------------------- |
| 0-40   | 🟢 Verde Bajo     | Continuar flujo normal          |
| 41-75  | 🟡 Amarillo Medio | Escalar a Unidad Antifraude     |
| 76-100 | 🔴 Rojo Alto      | Revisión especializada de campo |

Los pesos son referenciales. Los equipos pueden proponer otro esquema si explican lógica, validación y trazabilidad.

---

# 14. Entregables obligatorios

| Entregable                | Descripción                              |
| ------------------------- | ---------------------------------------- |
| Prototipo funcional       | Dashboard, notebook o sistema ejecutable |
| Código fuente             | Repositorio GitHub                       |
| Dataset                   | Sintético o público                      |
| README                    | Instalación y ejecución                  |
| Arquitectura              | Diagrama técnico                         |
| Modelo de datos           | Tablas y relaciones                      |
| Explicación del modelo IA | Algoritmos y métricas                    |
| Rúbrica de alertas        | Reglas utilizadas                        |
| Demo funcional            | Presentación en vivo                     |
| Presentación ejecutiva    | Problema, solución e impacto             |

---

# 15. Estructura sugerida del repositorio GitHub

```plaintext
fraudia-claims/
├── README.md
├── requirements.txt
├── .env.example
├── data/
│   ├── raw/
│   ├── processed/
│   └── synthetic/
├── notebooks/
│   ├── 01_exploracion_datos.ipynb
│   ├── 02_modelo_fraude.ipynb
│   └── 03_evaluacion_modelo.ipynb
├── src/
│   ├── ingestion/load_data.py
│   ├── features/build_features.py
│   ├── rules/fraud_rules.py
│   ├── models/fraud_model.py
│   ├── explainability/explain_score.py
│   ├── ai_agent/claims_agent.py
│   └── app/main.py
├── docs/
│   ├── arquitectura.md
│   ├── modelo_datos.md
│   ├── reglas_negocio.md
│   ├── uso_ia.md
│   └── limitaciones.md
├── tests/
│   └── test_rules.py
└── presentation/
    └── pitch.pdf
```

---

# 16. Requisitos técnicos y estándares

| Categoría     | Estándar mínimo                             |
| ------------- | ------------------------------------------- |
| Lenguajes     | Python, R y SQL                             |
| Base de datos | Oracle, PostgreSQL, MySQL o archivos planos |
| Repositorio   | GitHub                                      |
| Documentación | README y arquitectura                       |
| Código        | Modular, comentado y reproducible           |
| Interfaz      | Dashboard o aplicación funcional            |
| Dependencias  | requirements.txt                            |
| Configuración | Uso de .env.example                         |

---

# 17. Seguridad, privacidad y ética

* No usar datos personales reales.
* No usar información confidencial.
* Usar datos sintéticos o públicos.
* Anonimizar identificadores.
* No subir credenciales a GitHub.
* No exponer llaves API.
* Documentar fuentes de datos.
* Aclarar que es una alerta, no una acusación.
* Mantener revisión humana.
* Explicar limitaciones y falsos positivos.

---

# 18. Criterios de evaluación

| Criterio                   | Peso |
| -------------------------- | ---- |
| Entendimiento del problema | 15%  |
| Calidad del prototipo      | 20%  |
| Uso efectivo de IA         | 20%  |
| Explicabilidad del score   | 15%  |
| Calidad técnica            | 10%  |
| Seguridad y ética          | 10%  |
| Impacto y escalabilidad    | 10%  |

---

# 19. Métricas sugeridas

| Tipo de enfoque    | Métricas                       |
| ------------------ | ------------------------------ |
| Modelo supervisado | Precision, Recall, F1, ROC     |
| Modelo anomalías   | Ranking y score de rareza      |
| NLP                | Similitud textual y coherencia |

---

# 20. Riesgos y mitigaciones

| Riesgo                         | Mitigación                        |
| ------------------------------ | --------------------------------- |
| Confundir alerta con acusación | Usar lenguaje de “posible fraude” |
| Sesgo en datos                 | Variables explicables             |
| Falsos positivos               | Revisión humana                   |
| Datos sensibles                | Datos sintéticos                  |
| Modelo caja negra              | Explicabilidad                    |
| Sobreajuste                    | Validación                        |
| Mal uso legal                  | Declarar limitaciones             |
| Dependencia APIs               | Tener alternativa demo            |

---

# 21. Formato de presentación

| Tiempo | Contenido              |
| ------ | ---------------------- |
| 1 min  | Problema y oportunidad |
| 1 min  | Solución propuesta     |
| 4 min  | Demo funcional         |
| 2 min  | Arquitectura y uso IA  |
| 1 min  | Impacto negocio        |
| 1 min  | Limitaciones           |
| 5 min  | Preguntas del jurado   |

---

# 22. Matriz de evaluación hackIAthon 2026

| Dimensión                 | Peso | 1 Limitado         | 2 Básico            | 3 Funcional            | 4 Avanzado           | 5 Excepcional                 |
| ------------------------- | ---- | ------------------ | ------------------- | ---------------------- | -------------------- | ----------------------------- |
| Tecnología y Arquitectura | 10%  | Código desordenado | Scripts aislados    | Repositorio organizado | Arquitectura robusta | Nivel producción              |
| Análisis del caso         | 15%  | No detecta señales | Reglas simples      | Semáforo riesgo        | Cruce variables      | Redes complejas               |
| Uso IA y Prototipo        | 40%  | Solo IF/ELSE       | ML básico           | IA funcional           | APIs IA              | ML + NLP + Agente IA          |
| Explicabilidad y Ética    | 25%  | Caja negra         | Explicación técnica | Explicación simple     | Resumen IA           | Riesgos y sesgos documentados |
| Pitch e Impacto           | 10%  | Sin demo           | Solo técnico        | Estructura clara       | Comunicación fluida  | Pitch persuasivo              |

---

# 23. Guía de preparación para el Pitch

## 1. Cuestionario crítico

* ¿Cómo detectan similitud entre narrativas?
* ¿Cómo ayuda al analista?
* ¿Cómo evitan acusaciones injustas?

## 2. Pruebas de fuego

* Consulta agentica:

  * “¿Qué proveedores concentran el 80% de alertas rojas?”
* Prueba de score:

  * “Cargue un siniestro ocurrido 24 horas después de la póliza”
* Verificación GitHub:

  * Mostrar estructura modular

## 3. Entregables obligatorios

* Prototipo funcional
* Código fuente
* Dataset
* Presentación ejecutiva PDF