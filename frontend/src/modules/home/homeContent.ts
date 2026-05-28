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
    value: '2021–2025',
    detail: 'Evidencia y entrenamiento consolidados.',
  },
  {
    label: 'Modelo',
    value: 'Híbrido',
    detail: 'Reglas + IA + explicación.',
  },
  {
    label: 'Prioridad',
    value: 'Score',
    detail: 'Semáforo operativo para revisión.',
  },
  {
    label: 'Entrega',
    value: 'Demo',
    detail: 'Base lista para módulos internos.',
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
    title: 'Análisis de siniestros',
    description: 'Priorización de casos por reglas, score y señales de alerta explicables.',
    icon: Files,
    tone: 'blue',
  },
  {
    title: 'Score de riesgo',
    description: 'Clasificación por semáforo con trazabilidad completa del motivo.',
    icon: ChartLineUp,
    tone: 'teal',
  },
  {
    title: 'Agente de revisión',
    description: 'Consulta asistida para entender el caso y la explicación del sistema.',
    icon: Brain,
    tone: 'violet',
  },
  {
    title: 'Proveedores y patrones',
    description: 'Cruce de recurrencias, relación entre actores y señales repetidas.',
    icon: Buildings,
    tone: 'amber',
  },
  {
    title: 'Alertas operativas',
    description: 'Disparadores claros para revisión humana, nunca decisiones automáticas.',
    icon: BellRinging,
    tone: 'rose',
  },
  {
    title: 'Gobierno de negocio',
    description: 'Arquitectura corporativa preparada para crecer por módulos.',
    icon: ArrowsLeftRight,
    tone: 'green',
  },
]

export const problemPoints: HomePoint[] = [
  {
    title: 'Cruce de señales dispersas',
    description: 'Unimos pólizas, siniestros, proveedores, documentos e historial de reclamos.',
    icon: SquaresFour,
    tone: 'blue',
  },
  {
    title: 'Revisión manual lenta',
    description: 'La operación necesita prioridad clara y un camino de revisión más corto.',
    icon: Files,
    tone: 'amber',
  },
  {
    title: 'Reglas sin trazabilidad',
    description: 'Cada alerta debe explicar qué variable disparó el aumento de riesgo.',
    icon: Sparkle,
    tone: 'violet',
  },
  {
    title: 'No acusar automáticamente',
    description: 'El producto solo recomienda revisión humana y conserva la evidencia.',
    icon: ShieldCheck,
    tone: 'teal',
  },
]

export const solutionFlow: HomePoint[] = [
  {
    title: 'Ingesta limpia',
    description: 'Consolidación de datos sintéticos y públicos en un solo flujo.',
    icon: Files,
    tone: 'blue',
  },
  {
    title: 'Reglas + IA',
    description: 'Motor híbrido con umbrales, anomalías y NLP para enriquecer la señal.',
    icon: Brain,
    tone: 'violet',
  },
  {
    title: 'Score explicable',
    description: 'Salida priorizada con semáforo y factores legibles para el analista.',
    icon: ChartLineUp,
    tone: 'teal',
  },
  {
    title: 'Seguimiento',
    description: 'Notificación de hallazgos y casos con prioridad de revisión.',
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
  { name: 'Reporte tardío', value: '> 7 días' },
  { name: 'Falta de documentos', value: 'Sí / No' },
  { name: 'Monto elevado', value: '≥ 95% suma asegurada' },
  { name: 'Proveedor recurrente', value: 'Observado' },
  { name: 'Narrativa similar', value: '> 85%' },
  { name: 'Borde de vigencia', value: '< 30 días' },
]

export const evidenceAssets: HomeAsset[] = [
  {
    src: '/assets/reports/roc_comparison.png',
    title: 'ROC comparativo',
    description: 'Separación entre modelos candidatos.',
  },
  {
    src: '/assets/reports/pr_comparison.png',
    title: 'Precision-Recall',
    description: 'Lectura de desempeño en clases desbalanceadas.',
  },
  {
    src: '/assets/reports/metrics_comparison.png',
    title: 'Métricas',
    description: 'Comparación consolidada del mejor enfoque.',
  },
  {
    src: '/assets/reports/feature_importance.png',
    title: 'Importancia de variables',
    description: 'Señales que más empujan el score de riesgo.',
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
    description: 'Recepción controlada de evidencia y datos del siniestro.',
  },
  {
    title: 'Lectura cognitiva',
    image: '/assets/fraudia-process-step-2-brain-circuit.png',
    description: 'Unión de señales de riesgo con reglas e IA.',
  },
  {
    title: 'Score de riesgo',
    image: '/assets/fraudia-process-step-3-speedometer-needle.png',
    description: 'Priorización del caso con semáforo y score explicable.',
  },
  {
    title: 'Alertas',
    image: '/assets/fraudia-process-step-4-bell-alert.png',
    description: 'Notificación de patrones sospechosos para revisión humana.',
  },
  {
    title: 'Validación',
    image: '/assets/fraudia-process-step-5-shield-check.png',
    description: 'Cierre del ciclo con evidencia, trazabilidad y control.',
  },
]

export const footerGroups: FooterLinkGroup[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Problema', href: '#problema' },
      { label: 'Solución', href: '#solucion' },
      { label: 'Datos', href: '#datos' },
    ],
  },
  {
    title: 'Operación',
    links: [
      { label: 'Training', href: '#training' },
      { label: 'Evidencia', href: '#evidencia' },
      { label: 'Arquitectura', href: '#arquitectura' },
    ],
  },
  {
    title: 'Acción',
    links: [
      { label: 'Probar demo', href: '/demo' },
      { label: 'Volver arriba', href: '/' },
      { label: 'Contactar equipo', href: 'mailto:fraudia@proyecto.local' },
    ],
  },
]
