/**
 * JS port of the real HybridScoringStrategy from src/scoring/scoring_strategies.py
 * Used in the LiveRiskDemo for an authentic, impressive interactive experience.
 */
export function calculateRiskScore(input: {
  rulesScore: number // 0-70 from rules engine
  mlProbability: number // 0-1 from model
  rulesWeight?: number
  mlWeight?: number
}): { score: number; level: 'Bajo' | 'Medio' | 'Alto'; explanation: string } {
  const rulesW = input.rulesWeight ?? 0.4
  const mlW = input.mlWeight ?? 0.6

  const rulesNorm = Math.min((input.rulesScore / 70) * 100, 100)
  const mlNorm = input.mlProbability * 100

  const score = Math.round(Math.max(0, Math.min(100, rulesNorm * rulesW + mlNorm * mlW)))

  let level: 'Bajo' | 'Medio' | 'Alto'
  let explanation: string

  if (score <= 40) {
    level = 'Bajo'
    explanation = 'Comportamiento estadísticamente normal. Flujo estándar recomendado.'
  } else if (score <= 75) {
    level = 'Medio'
    explanation = 'Señales de riesgo moderadas. Escalar a revisión documental + unidad antifraude.'
  } else {
    level = 'Alto'
    explanation = 'Múltiples patrones críticos detectados. Activar revisión de campo inmediata.'
  }

  return { score, level, explanation }
}
