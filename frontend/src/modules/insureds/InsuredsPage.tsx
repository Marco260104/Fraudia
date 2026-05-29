import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import {
  Activity,
  ArrowRight,
  Bell,
  Buildings,
  CalendarDays,
  Car,
  CheckCircle2,
  CaretDown,
  Clock3,
  FileText,
  Fingerprint,
  HeartPulse,
  House,
  Link,
  MapPin,
  Radar,
  MagnifyingGlass,
  Shield,
  Sparkle,
  Target,
  UserRound,
  Wrench,
  ShieldCheck
} from '@phosphor-icons/react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type SidebarItem = {
  label: string
  icon: typeof House
  href: string
  badge?: string
  group: 'main' | 'entities' | 'tools'
}

type IntelligenceBlock = {
  label: string
  value: string
  tone: 'blue' | 'green' | 'indigo' | 'violet' | 'amber'
  icon: typeof Target
  bars: number[]
}

const sidebarItems: SidebarItem[] = [
  { label: 'Centro de inteligencia', icon: House, href: '/demo', group: 'main' },
  { label: 'Casos críticos', icon: Shield, href: '/casos-criticos', badge: '18', group: 'main' },
  { label: 'Alertas IA', icon: Bell, href: '/alertas-ia', group: 'main' },
  { label: 'Mapa de siniestros', icon: MapPin, href: '/mapa-siniestros', group: 'main' },
  { label: 'Narrativas similares', icon: FileText, href: '/narrativas-similares', group: 'main' },
  { label: 'Vehículos', icon: Car, href: '/vehiculos', group: 'entities' },
  { label: 'Proveedores', icon: Buildings, href: '/proveedores', group: 'entities' },
  { label: 'Asegurados', icon: UserRound, href: '/asegurados', group: 'entities' },
  { label: 'Talleres', icon: Wrench, href: '/talleres', group: 'entities' },
  { label: 'Calculadora de riesgo', icon: Target, href: '/demo', group: 'tools' },
  { label: 'Reportes', icon: FileText, href: '/demo', group: 'tools' },
  { label: 'Configuración', icon: Fingerprint, href: '/demo', group: 'tools' },
]

const intelligenceBlocks: IntelligenceBlock[] = [
  { label: 'Frecuencia de reclamos', value: '12%', tone: 'blue', icon: Activity, bars: [24, 40, 32, 48, 38] },
  { label: 'Consistencia narrativa', value: '94%', tone: 'green', icon: CheckCircle2, bars: [44, 52, 54, 60, 64] },
  { label: 'Patrón geográfico', value: '88%', tone: 'indigo', icon: MapPin, bars: [28, 36, 45, 50, 52] },
  { label: 'Tiempo entre incidentes', value: '76%', tone: 'violet', icon: Clock3, bars: [18, 30, 26, 34, 40] },
  { label: 'Historial operativo', value: '91%', tone: 'amber', icon: Shield, bars: [42, 44, 48, 55, 58] },
]

const timeline = [
  { year: '2022', title: 'Reclamo menor validado', desc: 'Impacto leve y cierre estándar sin anomalías.', tone: 'green' },
  { year: '2023', title: 'Cambio de vehículo', desc: 'Actualización de placa y continuidad operativa estable.', tone: 'blue' },
  { year: '2024', title: 'Taller recurrente', desc: 'Aparece un taller frecuente en dos procesos consecutivos.', tone: 'amber' },
  { year: '2025', title: 'Coincidencia narrativa IA', desc: 'La IA identifica repetición de estructura textual en el reclamo.', tone: 'red' },
]

const incidents = [
  { title: 'COLISIÓN TRASERA', meta: 'Medellín · 2024', risk: 'Medio', amount: '$8,450' },
  { title: 'CAMBIO DE VEHÍCULO', meta: 'Envigado · 2023', risk: 'Bajo', amount: '$0' },
  { title: 'TALLER RECURRENTE', meta: 'Bello · 2024', risk: 'Medio', amount: '$15,230' },
]

const activityFeed = [
  { time: '09:42', text: 'Consistencia narrativa validada', tone: 'green' },
  { time: '09:44', text: 'Riesgo reducido automáticamente', tone: 'blue' },
  { time: '09:45', text: 'Historial geográfico coincide', tone: 'indigo' },
]

const relationGroups = [
  { title: 'Vehículos asociados', items: ['KIA Sportage 2021', 'Mazda CX-5 2020'] },
  { title: 'Talleres frecuentes', items: ['Taller Express', 'AutoMecánica L&R'] },
  { title: 'Ubicaciones recurrentes', items: ['Medellín', 'Envigado', 'Bello'] },
  { title: 'Casos vinculados', items: ['#FR-87291', '#FR-76123', '#FR-65109'] },
]

const radarData = [
  { axis: 'Consistencia', value: 94 },
  { axis: 'Anomalías', value: 22 },
  { axis: 'Frecuencia', value: 68 },
  { axis: 'Geografía', value: 87 },
  { axis: 'Narrativa', value: 91 },
  { axis: 'Relaciones', value: 79 },
]

const radarMax = 100

function toneClass(tone: IntelligenceBlock['tone']) {
  return tone
}

function NarrativeAvatar() {
  return (
    <div className="insured-avatar-shell">
      <div className="insured-avatar-orb orb-a" />
      <div className="insured-avatar-orb orb-b" />
      <div className="insured-avatar-glass">
        <div className="insured-avatar-initials">CM</div>
      </div>
    </div>
  )
}

function ScoreBar({ target }: { target: number }) {
  const [displayScore, setDisplayScore] = useState(target - 6)

  useEffect(() => {
    const start = performance.now()
    const from = target - 6
    const duration = 900
    let frame = 0

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplayScore(Math.round(from + (target - from) * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return (
    <div className="trust-score-card">
      <span className="trust-score-label">Trust score</span>
      <div className="trust-score-stack">
        <div className="trust-score-number">{displayScore}</div>
        <div className="trust-score-bar">
          <span style={{ height: `${Math.max(20, Math.min(100, displayScore / 9.5))}%` }} />
        </div>
      </div>
      <div className="trust-score-tag" style={{
        background: displayScore > 700 ? 'rgba(16,185,129,.1)' : displayScore > 500 ? 'rgba(245,158,11,.1)' : 'rgba(220,38,38,.1)',
        color: displayScore > 700 ? '#10b981' : displayScore > 500 ? '#ea580c' : '#dc2626',
        borderColor: displayScore > 700 ? '#bbf7d0' : displayScore > 500 ? '#fed7aa' : '#fecaca',
      }}>
        {displayScore > 700 ? 'BAJO RIESGO' : displayScore > 500 ? 'RIESGO MEDIO' : 'ALTO RIESGO'}
      </div>
      <p>{displayScore > 700 ? 'Comportamiento estable y baja fricción operativa.' : displayScore > 500 ? 'Riesgo moderado, requiere monitoreo preventivo.' : 'Desviaciones operativas críticas e historial adverso.'}</p>
    </div>
  )
}

interface Insured {
  id_asegurado: string
  nombres_asegurado: string
  ciudad: string
  antiguedad_asegurado: number
  reclamos_ult_12m: number
  reclamos_historico_total: number
  perfil_riesgo_historico: string
  total_siniestros_activos: number
  nivel_riesgo: string
}

export default function AseguradosPage() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [activeYear] = useState('2025')

  const [insureds, setInsureds] = useState<Insured[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/insureds')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setInsureds(data)
          setSelectedId(data[0].id_asegurado)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error cargando asegurados:', err)
        setError('No se pudo conectar al servidor')
        setLoading(false)
      })
  }, [])

  const activeInsured = insureds.find(i => i.id_asegurado === selectedId) || null

  const selectedProfile = activeInsured ? {
    name: activeInsured.nombres_asegurado,
    role: `Perfil asegurado monitoreado (${activeInsured.perfil_riesgo_historico})`,
    since: `Cliente antigüedad: ${activeInsured.antiguedad_asegurado} años`,
    id: activeInsured.id_asegurado,
  } : {
    name: 'Carlos Méndez',
    role: 'Perfil asegurado monitoreado',
    since: 'Cliente desde 2021',
    id: '#AS-42091',
  }

  const intelligenceBlocks = useMemo(() => {
    if (!activeInsured) return [
      { label: 'Frecuencia de reclamos', value: '12%', tone: 'blue' as const, icon: Activity, bars: [24, 40, 32, 48, 38] },
      { label: 'Consistencia narrativa', value: '94%', tone: 'green' as const, icon: CheckCircle2, bars: [44, 52, 54, 60, 64] },
      { label: 'Patrón geográfico', value: '88%', tone: 'indigo' as const, icon: MapPin, bars: [28, 36, 45, 50, 52] },
      { label: 'Tiempo entre incidentes', value: '76%', tone: 'violet' as const, icon: Clock3, bars: [18, 30, 26, 34, 40] },
      { label: 'Historial operativo', value: '91%', tone: 'amber' as const, icon: Shield, bars: [42, 44, 48, 55, 58] },
    ]

    const freqVal = activeInsured.reclamos_ult_12m * 20
    const histVal = activeInsured.reclamos_historico_total * 10
    const risk = activeInsured.nivel_riesgo
    
    return [
      { label: 'Reclamos 12m', value: `${activeInsured.reclamos_ult_12m}`, tone: (risk === 'alto' ? 'red' : 'blue') as 'red' | 'blue', icon: Activity, bars: [10, 20, 30, 45, freqVal] },
      { label: 'Consistencia narrativa', value: risk === 'alto' ? '68%' : '94%', tone: (risk === 'alto' ? 'amber' : 'green') as 'amber' | 'green', icon: CheckCircle2, bars: [80, 85, 90, 92, risk === 'alto' ? 68 : 94] },
      { label: 'Siniestros Activos', value: `${activeInsured.total_siniestros_activos}`, tone: (activeInsured.total_siniestros_activos > 1 ? 'red' : 'indigo') as 'red' | 'indigo', icon: MapPin, bars: [5, 10, 15, 20, activeInsured.total_siniestros_activos * 30] },
      { label: 'Reclamos Históricos', value: `${activeInsured.reclamos_historico_total}`, tone: 'violet' as const, icon: Clock3, bars: [20, 30, 40, 50, histVal] },
      { label: 'Perfil de riesgo', value: activeInsured.perfil_riesgo_historico, tone: (risk === 'alto' ? 'red' : risk === 'medio' ? 'amber' : 'green') as 'red' | 'amber' | 'green', icon: Shield, bars: [30, 40, 50, 60, risk === 'alto' ? 90 : risk === 'medio' ? 60 : 25] },
    ]
  }, [activeInsured])

  const filteredRelations = useMemo(
    () =>
      relationGroups.filter((group) =>
        `${group.title} ${group.items.join(' ')}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  return (
    <main className="insured-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

        .insured-page {
          --bg-primary: #f6f8fc;
          --bg-secondary: #ffffff;
          --bg-tertiary: #eef4fb;
          --bg-card: #ffffff;
          --accent-blue: #2563eb;
          --accent-green: #10b981;
          --accent-indigo: #6366f1;
          --accent-violet: #8b5cf6;
          --accent-amber: #f59e0b;
          --accent-red: #dc2626;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --text-muted: #94a3b8;
          --border: #dbe3ef;
          --border-subtle: #e8eef7;
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 28%),
            radial-gradient(circle at top left, rgba(16, 185, 129, 0.06), transparent 26%),
            var(--bg-primary);
          color: var(--text-primary);
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .insured-shell {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          min-height: 100vh;
        }

        .insured-sidebar {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 16px 14px;
          background: rgba(255, 255, 255, 0.92);
          border-right: 1px solid var(--border-subtle);
          overflow-y: auto;
        }

        .insured-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
          padding: 8px 4px 14px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .insured-brand-mark {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.16), rgba(16, 185, 129, 0.12));
          color: var(--accent-blue);
        }

        .insured-brand strong {
          display: block;
          font-size: 1.4rem;
          letter-spacing: -0.04em;
        }

        .insured-brand span {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .insured-group {
          display: grid;
          gap: 6px;
        }

        .insured-label {
          margin: 0 0 4px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .insured-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-secondary);
          transition: background 180ms ease, color 180ms ease, transform 180ms ease;
        }

        .insured-item:hover {
          background: rgba(37, 99, 235, 0.06);
          transform: translateX(2px);
        }

        .insured-item.is-active {
          background: rgba(37, 99, 235, 0.12);
          color: var(--text-primary);
          box-shadow: inset 3px 0 0 var(--accent-blue);
        }

        .insured-badge {
          margin-left: auto;
          min-width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          border-radius: 999px;
          background: var(--accent-red);
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
        }

        .insured-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .assistant-card {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 248, 252, 0.98));
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
          display: grid;
          gap: 12px;
        }

        .assistant-top {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }

        .assistant-sparkle {
          color: var(--accent-blue);
          animation: pulseGlow 2.8s ease-in-out infinite;
        }

        .assistant-card p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 13px;
        }

        .insured-content {
          display: grid;
          grid-template-rows: 60px minmax(0, 1fr);
          min-width: 0;
          overflow: hidden;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          height: 60px;
          padding: 0 20px;
          background: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(18px);
        }

        .search-shell {
          width: min(520px, 100%);
          margin: 0 auto;
          position: relative;
        }

        .search-input {
          width: 100%;
          height: 40px;
          padding: 0 44px 0 42px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-secondary);
        }

        .search-icon,
        .search-shortcut {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          font-size: 12px;
        }

        .search-icon { left: 14px; }
        .search-shortcut {
          right: 12px;
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          font-family: 'JetBrains Mono', monospace;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .icon-chip {
          position: relative;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: var(--text-primary);
        }

        .bell-wrapper {
          position: relative;
        }

        .bell-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: var(--accent-red);
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          display: grid;
          place-items: center;
          border: 2px solid var(--bg-secondary);
        }

        .divider {
          width: 1px;
          height: 28px;
          background: var(--border);
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile strong {
          display: block;
          font-size: 13px;
        }

        .profile span {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .avatar {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
          color: white;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        .online-dot {
          position: absolute;
          right: -1px;
          bottom: -1px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--accent-green);
          border: 2px solid var(--bg-secondary);
        }

        .scroll-pane {
          overflow-y: auto;
          min-width: 0;
          padding: 18px;
        }

        .content-grid {
          display: grid;
          gap: 14px;
        }

        .page-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .page-head h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .page-head p {
          margin: 6px 0 0;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .head-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .real-time-chip,
        .secondary-button,
        .primary-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          font-weight: 600;
        }

        .real-time-chip {
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--accent-green);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55);
          animation: pulseRing 2s ease-out infinite;
        }

        .secondary-button {
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
        }

        .secondary-button:hover {
          background: var(--bg-tertiary);
        }

        .primary-button {
          border: 1px solid var(--accent-blue);
          background: var(--accent-blue);
          color: #fff;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(260px, 1.1fr) 300px;
          gap: 14px;
        }

        .hero-main,
        .hero-side,
        .nar-card {
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--bg-card);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        .hero-main {
          padding: 20px;
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          gap: 18px;
          align-items: center;
          overflow: hidden;
          position: relative;
        }

        .hero-main::before,
        .hero-main::after {
          content: '';
          position: absolute;
          border-radius: 999px;
          filter: blur(20px);
          opacity: 0.5;
          pointer-events: none;
        }

        .hero-main::before {
          width: 220px;
          height: 220px;
          right: -70px;
          top: -70px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.16), transparent 60%);
        }

        .hero-main::after {
          width: 180px;
          height: 180px;
          left: 45%;
          bottom: -70px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.12), transparent 58%);
        }

        .profile-copy h2 {
          margin: 0;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .profile-copy p {
          margin: 8px 0 0;
          color: var(--text-secondary);
        }

        .profile-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--text-primary);
          font-size: 12px;
        }

        .meta-chip .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent-green);
        }

        .avatar-wrap {
          position: relative;
          display: grid;
          place-items: center;
        }

        .insured-avatar-shell {
          position: relative;
          width: 170px;
          height: 170px;
          display: grid;
          place-items: center;
        }

        .insured-avatar-orb {
          position: absolute;
          inset: auto;
          border-radius: 999px;
          filter: blur(10px);
          opacity: 0.9;
        }

        .orb-a {
          width: 130px;
          height: 130px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.18), transparent 62%);
          transform: translate(-28px, -18px);
        }

        .orb-b {
          width: 112px;
          height: 112px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.18), transparent 60%);
          transform: translate(28px, 22px);
        }

        .insured-avatar-glass {
          position: relative;
          width: 140px;
          height: 140px;
          border-radius: 36px;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(245, 249, 255, 0.5));
          border: 1px solid rgba(255, 255, 255, 0.65);
          box-shadow:
            0 24px 50px rgba(15, 23, 42, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
        }

        .insured-avatar-initials {
          width: 100px;
          height: 100px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.06em;
          color: white;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo) 52%, var(--accent-green));
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.18);
        }

        .trust-score-card {
          padding: 18px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 249, 255, 0.96));
          display: grid;
          gap: 10px;
          align-content: center;
        }

        .trust-score-label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .trust-score-stack {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .trust-score-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 4rem;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.08em;
          background: linear-gradient(180deg, var(--accent-blue), var(--accent-green));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 18px rgba(16, 185, 129, 0.12);
        }

        .trust-score-bar {
          width: 14px;
          height: 110px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(37, 99, 235, 0.14), rgba(16, 185, 129, 0.12));
          padding: 2px;
          display: flex;
          align-items: flex-end;
        }

        .trust-score-bar span {
          width: 100%;
          border-radius: inherit;
          background: linear-gradient(180deg, var(--accent-blue), var(--accent-green));
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.18);
        }

        .trust-score-tag {
          display: inline-flex;
          width: fit-content;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: #0f766e;
          background: rgba(16, 185, 129, 0.12);
        }

        .trust-score-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.5;
        }

        .block-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .intel-block {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          display: grid;
          gap: 12px;
        }

        .intel-head {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .intel-ico {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: grid;
          place-items: center;
        }

        .intel-blue { background: rgba(37, 99, 235, 0.08); color: var(--accent-blue); }
        .intel-green { background: rgba(16, 185, 129, 0.08); color: var(--accent-green); }
        .intel-indigo { background: rgba(99, 102, 241, 0.08); color: var(--accent-indigo); }
        .intel-violet { background: rgba(139, 92, 246, 0.08); color: var(--accent-violet); }
        .intel-amber { background: rgba(245, 158, 11, 0.08); color: var(--accent-amber); }

        .intel-title {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
        }

        .intel-value {
          display: block;
          margin-top: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .intel-bars {
          display: flex;
          align-items: end;
          gap: 6px;
          min-height: 40px;
        }

        .intel-bars span {
          flex: 1;
          border-radius: 999px 999px 8px 8px;
          background: linear-gradient(180deg, rgba(37, 99, 235, 0.9), rgba(99, 102, 241, 0.3));
        }

        .intel-bars.blue span { background: linear-gradient(180deg, rgba(37, 99, 235, 0.95), rgba(37, 99, 235, 0.22)); }
        .intel-bars.green span { background: linear-gradient(180deg, rgba(16, 185, 129, 0.95), rgba(16, 185, 129, 0.22)); }
        .intel-bars.indigo span { background: linear-gradient(180deg, rgba(99, 102, 241, 0.95), rgba(99, 102, 241, 0.22)); }
        .intel-bars.violet span { background: linear-gradient(180deg, rgba(139, 92, 246, 0.95), rgba(139, 92, 246, 0.22)); }
        .intel-bars.amber span { background: linear-gradient(180deg, rgba(245, 158, 11, 0.95), rgba(245, 158, 11, 0.22)); }

        .main-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
          gap: 14px;
          align-items: start;
        }

        .timeline-card,
        .panel-card {
          padding: 18px;
          border-radius: 18px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        .section-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .section-head h2,
        .section-head h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .section-head p {
          margin: 6px 0 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .year-switch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 36px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--text-primary);
        }

        .timeline {
          position: relative;
          display: grid;
          gap: 18px;
          padding-left: 8px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 18px;
          top: 10px;
          bottom: 10px;
          width: 1px;
          background: linear-gradient(180deg, rgba(37, 99, 235, 0.18), rgba(16, 185, 129, 0.18));
        }

        .timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 72px minmax(0,1fr);
          gap: 16px;
          align-items: start;
        }

        .timeline-badge {
          position: relative;
          z-index: 1;
          justify-self: start;
          display: inline-flex;
          min-width: 56px;
          height: 34px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          border: 1px solid var(--border);
          background: #fff;
        }

        .timeline-badge.green { color: var(--accent-green); background: rgba(16, 185, 129, 0.08); }
        .timeline-badge.blue { color: var(--accent-blue); background: rgba(37, 99, 235, 0.08); }
        .timeline-badge.amber { color: var(--accent-amber); background: rgba(245, 158, 11, 0.08); }
        .timeline-badge.red { color: var(--accent-red); background: rgba(220, 38, 38, 0.08); }

        .timeline-body {
          padding: 14px 16px;
          border-radius: 16px;
          background: linear-gradient(180deg, rgba(255,255,255,.98), rgba(248,250,253,.95));
          border: 1px solid var(--border);
        }

        .timeline-body h4 {
          margin: 0;
          font-size: 14px;
        }

        .timeline-body p {
          margin: 8px 0 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .timeline-meta {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 12px;
        }

        .behavior-grid {
          display: grid;
          gap: 14px;
        }

        .radar-wrap {
          height: 270px;
        }

        .right-stack {
          display: grid;
          gap: 14px;
        }

        .relations-grid {
          display: grid;
          gap: 10px;
        }

        .relation-card {
          padding: 14px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, #fff, #fbfdff);
        }

        .relation-card h4 {
          margin: 0 0 10px;
          font-size: 13px;
        }

        .pill-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--text-primary);
          font-size: 12px;
        }

        .pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent-blue);
        }

        .mini-network {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
          color: var(--text-muted);
          font-size: 12px;
        }

        .mini-node {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(180deg, var(--accent-blue), var(--accent-indigo));
          box-shadow: 0 0 16px rgba(37, 99, 235, 0.16);
        }

        .incidents-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .incident-card {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, #fff, #fbfdff);
          display: grid;
          gap: 10px;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .incident-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
        }

        .incident-card strong {
          font-size: 14px;
        }

        .incident-meta {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .incident-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .risk-chip {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        .risk-low { background: rgba(16, 185, 129, 0.12); color: #047857; }
        .risk-medium { background: rgba(245, 158, 11, 0.12); color: #b45309; }
        .risk-high { background: rgba(37, 99, 235, 0.12); color: #1d4ed8; }

        .activity-feed {
          display: grid;
          gap: 10px;
        }

        .activity-item {
          display: grid;
          grid-template-columns: 54px minmax(0,1fr);
          gap: 10px;
          align-items: center;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: #fff;
        }

        .activity-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .activity-text {
          font-size: 13px;
          color: var(--text-primary);
        }

        .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          margin-right: 8px;
          display: inline-block;
        }

        .blue { background: var(--accent-blue); }
        .green { background: var(--accent-green); }
        .indigo { background: var(--accent-indigo); }
        .amber { background: var(--accent-amber); }
        .red { background: var(--accent-red); }

        .analytics-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 14px;
        }

        .footer-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .map-note {
          color: var(--text-secondary);
          font-size: 12px;
        }

        .trend-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.08);
          color: #047857;
          font-size: 12px;
          font-weight: 700;
        }

        .right-aside {
          display: grid;
          gap: 14px;
        }

        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }

        @media (max-width: 1440px) {
          .hero {
            grid-template-columns: minmax(0, 1fr) 280px;
          }
        }

        @media (max-width: 1280px) {
          .insured-shell {
            grid-template-columns: 220px minmax(0, 1fr);
          }

          .block-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .main-layout,
          .analytics-grid,
          .footer-row {
            grid-template-columns: 1fr;
          }

          .incidents-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 1024px) {
          .insured-shell {
            grid-template-columns: 1fr;
          }

          .insured-sidebar {
            min-height: auto;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .hero-main {
            grid-template-columns: 1fr;
            justify-items: start;
          }

          .block-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .incidents-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="insured-shell">
        <DashboardSidebar activeRoute="/asegurados" />

        <div className="insured-content">
          <header className="topbar">
            <div style={{ width: 220 }} />
            <div className="search-shell">
              <MagnifyingGlass className="search-icon" size={16} />
              <input
                className="search-input"
                placeholder="Buscar perfil, riesgo, vehículo, taller..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="search-shortcut">⌘ K</span>
            </div>

            <div className="topbar-right">
              <button className="icon-chip bell-wrapper" type="button" aria-label="Notificaciones">
                <Bell size={18} />
                <span className="bell-badge">4</span>
              </button>
              <button className="icon-chip" type="button" aria-label="Ayuda">
                <HeartPulse size={18} />
              </button>
              <div className="divider" />
              <div className="profile">
                <div>
                  <strong>Analista Senior</strong>
                  <span>Unidad Antifraude</span>
                </div>
                <div className="avatar">
                  AS
                  <span className="online-dot" />
                </div>
              </div>
            </div>
          </header>

          <div className="scroll-pane">
            <div className="content-grid">
              <div className="page-head">
                <div>
                  <h1>Perfil inteligente del asegurado</h1>
                  <p>Analítica conductual centrada en confianza, consistencia y señales de riesgo</p>
                </div>

                <div className="head-actions">
                  <span className="real-time-chip">
                    <span className="pulse-dot" />
                    Perfil activo
                  </span>
                  <button className="secondary-button" type="button">
                    <CaretDown size={16} />
                    Más acciones
                  </button>
                </div>
              </div>

              {loading && <div style={{ padding: 12, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center', marginBottom: 12 }}>Cargando datos del backend...</div>}
              {error && <div style={{ padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 12, border: '1px solid #fecaca', textAlign: 'center', marginBottom: 12 }}>{error}</div>}

              {insureds.length > 0 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 12, maxWidth: '100%' }}>
                  {insureds.map(ins => (
                    <button
                      key={ins.id_asegurado}
                      onClick={() => setSelectedId(ins.id_asegurado)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: '1px solid',
                        borderColor: selectedId === ins.id_asegurado ? 'var(--accent-blue)' : 'var(--border)',
                        background: selectedId === ins.id_asegurado ? 'rgba(37,99,235,.1)' : 'var(--bg-secondary)',
                        color: selectedId === ins.id_asegurado ? 'var(--accent-blue)' : 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      👤 {ins.nombres_asegurado} ({ins.reclamos_ult_12m} reclamos)
                    </button>
                  ))}
                </div>
              )}

              <section className="hero">
                <div className="hero-main">
                  <div className="avatar-wrap">
                    <NarrativeAvatar />
                  </div>

                  <div className="profile-copy">
                    <span className="trend-pill" style={{
                      background: activeInsured?.nivel_riesgo === 'alto' ? 'rgba(220,38,38,.08)' : activeInsured?.nivel_riesgo === 'medio' ? 'rgba(245,158,11,.08)' : 'rgba(16, 185, 129, 0.08)',
                      color: activeInsured?.nivel_riesgo === 'alto' ? '#dc2626' : activeInsured?.nivel_riesgo === 'medio' ? '#d97706' : '#047857'
                    }}>
                      <Sparkle size={14} />
                      {activeInsured?.nivel_riesgo === 'alto' ? 'Riesgo Crítico IA' : activeInsured?.nivel_riesgo === 'medio' ? 'Riesgo Moderado' : 'Perfil de confianza'}
                    </span>
                    <h2>{selectedProfile.name}</h2>
                    <p>{selectedProfile.role}</p>
                    <p>{selectedProfile.since}</p>

                    <div className="profile-meta">
                      <span className="meta-chip"><span className="dot" /> Monitoreo continuo</span>
                      <span className="meta-chip"><CalendarDays size={14} /> Cliente premium</span>
                      <span className="meta-chip"><Fingerprint size={14} /> Identidad verificada</span>
                    </div>
                  </div>
                </div>

                <ScoreBar target={activeInsured ? (activeInsured.nivel_riesgo === 'alto' ? 380 : activeInsured.nivel_riesgo === 'medio' ? 640 : 842) : 842} />
              </section>

              <section className="block-grid">
                {intelligenceBlocks.map((block) => {
                  const Icon = block.icon
                  return (
                    <article key={block.label} className="intel-block">
                      <div className="intel-head">
                        <span className={`intel-ico intel-${toneClass(block.tone)}`}>
                          <Icon size={16} />
                        </span>
                        <div>
                          <p className="intel-title">{block.label}</p>
                          <strong className="intel-value">{block.value}</strong>
                        </div>
                      </div>
                      <div className={`intel-bars ${block.tone}`}>
                        {block.bars.map((bar, index) => (
                          <span key={`${block.label}-${index}`} style={{ height: `${bar}%` }} />
                        ))}
                      </div>
                    </article>
                  )
                })}
              </section>

              <section className="main-layout">
                <article className="timeline-card">
                  <div className="section-head">
                    <div>
                      <h2>Timeline humano</h2>
                      <p>Línea de vida aseguradora interpretada por IA conductual</p>
                    </div>
                    <button className="year-switch" type="button">
                      {activeYear}
                      <CaretDown size={14} />
                    </button>
                  </div>

                  <div className="timeline">
                    {timeline.map((item) => (
                      <div className="timeline-item" key={item.year}>
                        <div className={`timeline-badge ${item.tone}`}>{item.year}</div>
                        <div className="timeline-body">
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                          <div className="timeline-meta">
                            <Clock3 size={14} />
                            Actualizado por IA
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <div className="right-stack">
                  <article className="panel-card">
                    <div className="section-head">
                      <div>
                        <h3>Perfil conductual</h3>
                        <p>Radar de señales de confianza y riesgo</p>
                      </div>
                      <Radar size={16} color="#2563eb" />
                    </div>

                    <div className="radar-wrap">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(100,116,139,0.18)" />
                          <PolarAngleAxis dataKey="axis" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, radarMax]}
                            tick={false}
                            axisLine={false}
                          />
                          <Tooltip content={() => null} />
                          <RechartsRadar
                            dataKey="value"
                            stroke="#2563eb"
                            fill="rgba(37,99,235,.22)"
                            fillOpacity={1}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>

                  <article className="panel-card">
                    <div className="section-head">
                      <div>
                        <h3>Relaciones</h3>
                        <p>Entorno relacionado y puntos de contacto</p>
                      </div>
                      <Link size={16} color="#6366f1" />
                    </div>

                    <div className="relations-grid">
                      {filteredRelations.map((group) => (
                        <div className="relation-card" key={group.title}>
                          <h4>{group.title}</h4>
                          <div className="pill-wrap">
                            {group.items.map((item) => (
                              <span className="pill" key={item}>
                                <span className="pill-dot" />
                                {item}
                              </span>
                            ))}
                          </div>
                          <div className="mini-network">
                            <span className="mini-node" />
                            Red relacionada estable
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="panel-card">
                    <div className="section-head">
                      <div>
                        <h3>Actividad IA en vivo</h3>
                        <p>Eventos de confianza procesados en tiempo real</p>
                      </div>
                      <Activity size={16} color="#10b981" />
                    </div>

                    <div className="activity-feed">
                      {activityFeed.map((item) => (
                        <div className="activity-item" key={item.time}>
                          <div className="activity-time">{item.time}</div>
                          <div className="activity-text">
                            <span className={`activity-dot ${item.tone}`} />
                            {item.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </section>

              <section className="footer-row">
                <article className="timeline-card">
                  <div className="section-head">
                    <div>
                      <h2>Historial operativo</h2>
                      <p>Eventos históricos en formato financiero digital</p>
                    </div>
                  </div>

                  <div className="incidents-row">
                    {incidents.map((incident) => (
                      <article className="incident-card" key={incident.title}>
                        <strong>{incident.title}</strong>
                        <div className="incident-meta">{incident.meta}</div>
                        <div className="incident-foot">
                          <span className={`risk-chip ${incident.risk === 'Bajo' ? 'risk-low' : incident.risk === 'Medio' ? 'risk-medium' : 'risk-high'}`}>
                            Riesgo: {incident.risk}
                          </span>
                          <span className="mono">{incident.amount}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </article>

                <article className="timeline-card">
                  <div className="section-head">
                    <div>
                      <h2>Lectura de confianza</h2>
                      <p>La IA valida el comportamiento y ajusta el score dinámicamente</p>
                    </div>
                  </div>

                  <div className="behavior-grid">
                    <div className="timeline-body">
                      <h4>842 puntos · bajo riesgo</h4>
                      <p>836 → 842 en esta sesión por consistencia narrativa y continuidad geográfica.</p>
                    </div>

                    <div className="timeline-body">
                      <h4>Señales principales</h4>
                      <p>Frecuencia baja de reclamos, relaciones estables y talleres recurrentes controlados.</p>
                    </div>

                    <div className="timeline-body">
                      <h4>Confianza operativa</h4>
                      <p>La identidad mantiene un patrón consistente a través del historial de siniestros.</p>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
