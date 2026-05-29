import type { ComponentType } from 'react'
import type { IconProps } from '@phosphor-icons/react'
import {
  ArrowsLeftRight,
  BellRinging,
  ChartLineUp,
  Files,
  ShieldCheck,
  Sparkle,
  SquaresFour,
  Brain,
  Buildings,
} from '@phosphor-icons/react'

export type HomeMetric = {
  value: string
  label: string
  detail: string
}

export type HomePoint = {
  title: string
  description: string
  icon: ComponentType<IconProps>
  tone?: 'blue' | 'teal' | 'violet' | 'amber' | 'green' | 'rose'
}

export type HomeSignal = {
  name: string
  value: string
}

export type HomeAsset = {
  src: string
  title: string
  description: string
}

export type FooterLinkGroup = {
  title: string
  links: Array<{ label: string; href: string }>
}

export const heroCards = [
  {
    label: 'Cobertura',
    value: '2021â€“2025',
    detail: 'Evidencia y entrenamiento consolidados.',
  },
  {
    label: 'Modelo',
    value: 'HÃ­brido',
    detail: 'Reglas + IA + explicaciÃ³n.',
  },
  {
    label: 'Prioridad',
    value: 'Score',
    detail: 'SemÃ¡foro operativo para revisiÃ³n.',
  },
  {
    label: 'Entrega',
    value: 'Demo',
    detail: 'Base lista para mÃ³dulos internos.',
  },
]

export const stats = [
  { value: '93%', label: 'Accuracy objetivo' },
  { value: '91%', label: 'Precision objetivo' },
  { value: '89%', label: 'Recall objetivo' },
  { value: '12.5k', label: 'Siniestros procesados' },
]

export const siteHighlights: HomePoint[] = [
  {
    title: 'AnÃ¡lisis de siniestros',
    description: 'PriorizaciÃ³n de casos por reglas, score y seÃ±ales de alerta explicables.',
    icon: Files,
    tone: 'blue',
  },
  {
    title: 'Score de riesgo',
    description: 'ClasificaciÃ³n por semÃ¡foro con trazabilidad completa del motivo.',
    icon: ChartLineUp,
    tone: 'teal',
  },
  {
    title: 'Agente de revisiÃ³n',
    description: 'Consulta asistida para entender el caso y la explicaciÃ³n del sistema.',
    icon: Brain,
    tone: 'violet',
  },
  {
    title: 'Proveedores y patrones',
    description: 'Cruce de recurrencias, relaciÃ³n entre actores y seÃ±ales repetidas.',
    icon: Buildings,
    tone: 'amber',
  },
  {
    title: 'Alertas operativas',
    description: 'Disparadores claros para revisiÃ³n humana, nunca decisiones automÃ¡ticas.',
    icon: BellRinging,
    tone: 'rose',
  },
  {
    title: 'Gobierno de negocio',
    description: 'Arquitectura corporativa preparada para crecer por mÃ³dulos.',
    icon: ArrowsLeftRight,
    tone: 'green',
  },
]

export const problemPoints: HomePoint[] = [
  {
    title: 'Cruce de seÃ±ales dispersas',
    description: 'Unimos pÃ³lizas, siniestros, proveedores, documentos e historial de reclamos.',
    icon: SquaresFour,
    tone: 'blue',
  },
  {
    title: 'RevisiÃ³n manual lenta',
    description: 'La operaciÃ³n necesita prioridad clara y un camino de revisiÃ³n mÃ¡s corto.',
    icon: Files,
    tone: 'amber',
  },
  {
    title: 'Reglas sin trazabilidad',
    description: 'Cada alerta debe explicar quÃ© variable disparÃ³ el aumento de riesgo.',
    icon: Sparkle,
    tone: 'violet',
  },
  {
    title: 'No acusar automÃ¡ticamente',
    description: 'El producto solo recomienda revisiÃ³n humana y conserva la evidencia.',
    icon: ShieldCheck,
    tone: 'teal',
  },
]

export const solutionFlow: HomePoint[] = [
  {
    title: 'Ingesta limpia',
    description: 'ConsolidaciÃ³n de datos sintÃ©ticos y pÃºblicos en un solo flujo.',
    icon: Files,
    tone: 'blue',
  },
  {
    title: 'Reglas + IA',
    description: 'Motor hÃ­brido con umbrales, anomalÃ­as y NLP para enriquecer la seÃ±al.',
    icon: Brain,
    tone: 'violet',
  },
  {
    title: 'Score explicable',
    description: 'Salida priorizada con semÃ¡foro y factores legibles para el analista.',
    icon: ChartLineUp,
    tone: 'teal',
  },
  {
    title: 'Seguimiento',
    description: 'NotificaciÃ³n de hallazgos y casos con prioridad de revisiÃ³n.',
    icon: BellRinging,
    tone: 'rose',
  },
  {
    title: 'Gobierno',
    description: 'Estructura modular para ampliar sin romper el producto.',
    icon: ArrowsLeftRight,
    tone: 'green',
  },
]

export const riskSignals: HomeSignal[] = [
  { name: 'Reporte tardÃ­o', value: '> 7 dÃ­as' },
  { name: 'Falta de documentos', value: 'SÃ­ / No' },
  { name: 'Monto elevado', value: 'â‰¥ 95% suma asegurada' },
  { name: 'Proveedor recurrente', value: 'Observado' },
  { name: 'Narrativa similar', value: '> 85%' },
  { name: 'Borde de vigencia', value: '< 30 dÃ­as' },
]

export const evidenceAssets: HomeAsset[] = [
  {
    src: '/assets/reports/roc_comparison.png',
    title: 'ROC comparativo',
    description: 'SeparaciÃ³n entre modelos candidatos.',
  },
  {
    src: '/assets/reports/pr_comparison.png',
    title: 'Precision-Recall',
    description: 'Lectura de desempeÃ±o en clases desbalanceadas.',
  },
  {
    src: '/assets/reports/metrics_comparison.png',
    title: 'MÃ©tricas',
    description: 'ComparaciÃ³n consolidada del mejor enfoque.',
  },
  {
    src: '/assets/reports/feature_importance.png',
    title: 'Importancia de variables',
    description: 'SeÃ±ales que mÃ¡s empujan el score de riesgo.',
  },
  {
    src: '/assets/reports/confusion_matrices.png',
    title: 'Confusion matrices',
    description: 'Aciertos y errores del clasificador final.',
  },
  {
    src: '/assets/reports/confusion_test_best.png',
    title: 'Prueba final',
    description: 'Resultado del mejor modelo en test.',
  },
]

export const trainingSteps = [
  {
    title: 'Documento y carga',
    image: '/assets/fraudia-process-step-1-document-upload.png',
    description: 'RecepciÃ³n controlada de evidencia y datos del siniestro.',
  },
  {
    title: 'Lectura cognitiva',
    image: '/assets/fraudia-process-step-2-brain-circuit.png',
    description: 'UniÃ³n de seÃ±ales de riesgo con reglas e IA.',
  },
  {
    title: 'Score de riesgo',
    image: '/assets/fraudia-process-step-3-speedometer-needle.png',
    description: 'PriorizaciÃ³n del caso con semÃ¡foro y score explicable.',
  },
  {
    title: 'Alertas',
    image: '/assets/fraudia-process-step-4-bell-alert.png',
    description: 'NotificaciÃ³n de patrones sospechosos para revisiÃ³n humana.',
  },
  {
    title: 'ValidaciÃ³n',
    image: '/assets/fraudia-process-step-5-shield-check.png',
    description: 'Cierre del ciclo con evidencia, trazabilidad y control.',
  },
]

export const footerGroups: FooterLinkGroup[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Problema', href: '#problema' },
      { label: 'SoluciÃ³n', href: '#solucion' },
      { label: 'Datos', href: '#datos' },
    ],
  },
  {
    title: 'OperaciÃ³n',
    links: [
      { label: 'Training', href: '#training' },
      { label: 'Evidencia', href: '#evidencia' },
      { label: 'Arquitectura', href: '#arquitectura' },
    ],
  },
  {
    title: 'AcciÃ³n',
    links: [
      { label: 'Probar demo', href: '/dashboard' },
      { label: 'Volver arriba', href: '/' },
      { label: 'Contactar equipo', href: 'mailto:fraudia@proyecto.local' },
    ],
  },
]
