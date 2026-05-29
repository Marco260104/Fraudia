import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  Building2,
  ChevronDown,
  Eye,
  FileText,
  Filter,
  HelpCircle,
  Home,
  Link2,
  Map,
  MessageSquareQuote,
  Network,
  Search,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Wrench,
  CarFront,
  ClipboardList,
  Layers3,
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'

type SidebarItem = {
  label: string
  icon: typeof Home
  href: string
  badge?: string
  group: 'main' | 'entities' | 'tools'
}

type SparkConfig = {
  title: string
  value: string
  subtitle: string
  stroke: string
  icon: typeof MessageSquareQuote
  tone: string
}

type NarrativeRow = {
  id: string
  similarity: string
  severity: 'CRÍTICO' | 'ALTO' | 'MEDIO'
  excerpt: string
  insured: string
  date: string
  amount: string
  vehicle: string
  provider: string
  city: string
}

const sidebarItems: SidebarItem[] = [
  { label: 'Centro de inteligencia', icon: Home, href: '/demo', group: 'main' },
  { label: 'Casos críticos', icon: ShieldAlert, href: '/casos-criticos', badge: '18', group: 'main' },
  { label: 'Alertas IA', icon: Bell, href: '/alertas-ia', group: 'main' },
  { label: 'Mapa de siniestros', icon: Map, href: '/mapa-siniestros', group: 'main' },
  { label: 'Narrativas similares', icon: FileText, href: '/narrativas-similares', group: 'main' },
  { label: 'Vehículos', icon: CarFront, href: '/vehiculos', group: 'entities' },
  { label: 'Proveedores', icon: Building2, href: '/proveedores', group: 'entities' },
  { label: 'Asegurados', icon: Users, href: '/asegurados', group: 'entities' },
  { label: 'Talleres', icon: Wrench, href: '/talleres', group: 'entities' },
  { label: 'Calculadora de riesgo', icon: Target, href: '/calculadora', group: 'tools' },
  { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes', group: 'tools' },
  { label: 'Configuración', icon: SlidersHorizontal, href: '/configuracion', group: 'tools' },
]

const kpiData = [
  [1240, 1255, 1268, 1261, 1272, 1280, 1278, 1295, 1312, 1308, 1320, 1327],
  [54, 58, 61, 59, 63, 65, 64, 68, 71, 69, 74, 86],
  [280, 287, 292, 289, 294, 301, 298, 307, 312, 309, 318, 327],
  [88, 89, 90, 90, 91, 92, 92, 93, 93, 94, 94, 94],
  [16, 17, 18, 18, 20, 21, 20, 21, 22, 21, 22, 23],
]

const sparkConfigs: SparkConfig[] = [
  { title: 'Narrativas analizadas hoy', value: '1,247', subtitle: '↑ 24% vs ayer', stroke: '#2563eb', icon: MessageSquareQuote, tone: 'blue' },
  { title: 'Grupos de narrativas', value: '86', subtitle: '↑ 18% vs ayer', stroke: '#ea580c', icon: Layers3, tone: 'orange' },
  { title: 'Coincidencias encontradas', value: '327', subtitle: '↑ 31% vs ayer', stroke: '#7c3aed', icon: Network, tone: 'violet' },
  { title: 'Precisión del modelo', value: '94%', subtitle: '↑ 6% vs semana anterior', stroke: '#16a34a', icon: Target, tone: 'green' },
  { title: 'Narrativas críticas', value: '23', subtitle: '↑ 27% vs ayer', stroke: '#dc2626', icon: ShieldAlert, tone: 'red' },
]

const tabs = ['Todas', 'Alta similitud', 'Patrones detectados', 'Grupos de riesgo'] as const

const narratives: NarrativeRow[] = [
  {
    id: '#FR-87291',
    similarity: '96%',
    severity: 'CRÍTICO',
    excerpt: 'El vehículo se encontraba estacionado y fue impactado por alcance en la parte trasera por otro automóvil...',
    insured: 'Carlos Méndez',
    date: '28/05/2025',
    amount: '$28,450',
    vehicle: 'KIA Sportage 2021',
    provider: 'Taller Express',
    city: 'Medellín, Antioquia',
  },
  {
    id: '#FR-76123',
    similarity: '93%',
    severity: 'ALTO',
    excerpt: 'Vehículo detenido en semáforo, es impactado por detrás por otro vehículo a baja velocidad...',
    insured: 'Ana Rodríguez',
    date: '28/05/2025',
    amount: '$15,230',
    vehicle: 'Mazda CX-5 2020',
    provider: 'AutoMecánica L&R',
    city: 'Envigado, Antioquia',
  },
  {
    id: '#FR-65109',
    similarity: '91%',
    severity: 'ALTO',
    excerpt: 'Impacto trasero mientras el vehículo se encontraba detenido en congestión vehicular...',
    insured: 'Pedro Gómez',
    date: '27/05/2025',
    amount: '$9,890',
    vehicle: 'Hyundai Tucson 2022',
    provider: 'Car Center Pro',
    city: 'Bello, Antioquia',
  },
  {
    id: '#FR-55867',
    similarity: '89%',
    severity: 'MEDIO',
    excerpt: 'Vehículo detenido por tránsito lento, colisión trasera sin daños mayores aparentes...',
    insured: 'Laura Torres',
    date: '27/05/2025',
    amount: '$6,420',
    vehicle: 'Chevrolet Spark 2019',
    provider: 'Taller La 80',
    city: 'Itagüí, Antioquia',
  },
  {
    id: '#FR-44321',
    similarity: '88%',
    severity: 'ALTO',
    excerpt: 'Alcance por detrás en vía urbana, el vehículo estaba frenado por tráfico...',
    insured: 'Miguel Ramírez',
    date: '26/05/2025',
    amount: '$3,210',
    vehicle: 'Nissan Versa 2021',
    provider: 'MotorFix',
    city: 'Sabaneta, Antioquia',
  },
]

const patternCards = [
  { title: 'Patrón: Impacto trasero', desc: 'Coincidencias en colisiones por alcance en vehículos detenidos o a baja velocidad.', cases: '142 casos', level: 'Alto', tone: 'red' },
  { title: 'Patrón: Semáforo / Tráfico', desc: 'Narrativas relacionadas con detenciones en semáforos o congestión vehicular.', cases: '98 casos', level: 'Medio', tone: 'orange' },
  { title: 'Patrón: Estacionado', desc: 'Vehículos estacionados impactados en la parte trasera.', cases: '64 casos', level: 'Medio', tone: 'violet' },
  { title: 'Patrón: Vía urbana', desc: 'Colisiones en calles y avenidas de zonas urbanas.', cases: '55 casos', level: 'Bajo', tone: 'blue' },
]

const similarIds = [
  { id: '#FR-76123', score: '93%' },
  { id: '#FR-65109', score: '91%' },
  { id: '#FR-55867', score: '89%' },
  { id: '#FR-44321', score: '88%' },
  { id: '#FR-33211', score: '85%' },
]

const networkNodes = [
  { label: '#FR-76123', x: 72, y: 20, tone: 'orange' },
  { label: '#FR-65109', x: 104, y: 66, tone: 'orange' },
  { label: '#FR-55867', x: 72, y: 110, tone: 'amber' },
  { label: '#FR-44321', x: 20, y: 102, tone: 'violet' },
  { label: '#FR-33211', x: 12, y: 58, tone: 'blue' },
]

function sparkCss(tone: string) {
  return tone === 'red'
    ? 'spark-red'
    : tone === 'orange'
      ? 'spark-orange'
      : tone === 'violet'
        ? 'spark-violet'
        : tone === 'green'
          ? 'spark-green'
          : 'spark-blue'
}

function SparkCard({ config, data }: { config: SparkConfig; data: number[] }) {
  const Icon = config.icon
  return (
    <article className="nar-card nar-kpi">
      <div className="kpi-head">
        <span className={`kpi-ico ${sparkCss(config.tone)}`}>
          <Icon size={16} />
        </span>
        <div>
          <p>{config.title}</p>
          <strong>{config.value}</strong>
        </div>
      </div>
      <span className="kpi-sub">{config.subtitle}</span>
      <div className="spark-wrap">
        <ResponsiveContainer width="100%" height={42}>
          <LineChart data={data.map((value) => ({ value }))}>
            <CartesianGrid stroke="transparent" />
            <Tooltip content={() => null} />
            <Line type="monotone" dataKey="value" stroke={config.stroke} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default function NarrativasSimilaresPage() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Alta similitud')
  const [selectedId, setSelectedId] = useState('#FR-87291')

  const filteredNarratives = useMemo(() => {
    const query = search.trim().toLowerCase()
    return narratives.filter((item) => {
      const matchesQuery =
        !query ||
        [item.id, item.insured, item.vehicle, item.provider, item.city, item.excerpt]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesTab =
        activeTab === 'Todas'
          ? true
          : activeTab === 'Alta similitud'
            ? Number(item.similarity.replace('%', '')) >= 88
            : activeTab === 'Patrones detectados'
              ? ['CRÍTICO', 'ALTO'].includes(item.severity)
              : true

      return matchesQuery && matchesTab
    })
  }, [activeTab, search])

  const selected = useMemo(
    () => filteredNarratives.find((item) => item.id === selectedId) ?? filteredNarratives[0] ?? narratives[0],
    [filteredNarratives, selectedId]
  )

  const highlight = (text: string, query: string) => {
    if (!query.trim()) return text
    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index < 0) return text
    return (
      <>
        {text.slice(0, index)}
        <mark>{text.slice(index, index + query.length)}</mark>
        {text.slice(index + query.length)}
      </>
    )
  }

  return (
    <main className="nar-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

        .nar-page {
          --bg-primary: #f5f7fb;
          --bg-secondary: #ffffff;
          --bg-tertiary: #eef3fb;
          --bg-card: #ffffff;
          --accent-blue: #2563eb;
          --accent-red: #dc2626;
          --accent-orange: #ea580c;
          --accent-yellow: #d97706;
          --accent-green: #16a34a;
          --accent-purple: #7c3aed;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --text-muted: #94a3b8;
          --border: #d7dfee;
          --border-subtle: #e5eaf3;
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .nar-shell {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr) 330px;
          min-height: 100vh;
          overflow: hidden;
        }

        .nar-sidebar {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 16px 14px;
          background: rgba(255,255,255,0.92);
          border-right: 1px solid var(--border-subtle);
          overflow-y: auto;
        }

        .nar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
          padding: 8px 4px 14px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .nar-brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          color: var(--accent-blue);
          background: linear-gradient(135deg, rgba(37,99,235,.16), rgba(124,58,237,.14));
        }

        .nar-brand strong {
          display: block;
          font-size: 1.4rem;
          letter-spacing: -.04em;
        }

        .nar-brand span {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .nar-group { display: grid; gap: 6px; }
        .nar-label {
          margin: 0 0 4px;
          font-size: 10px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 700;
        }
        .nar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-secondary);
          transition: background .18s ease, color .18s ease, transform .18s ease;
        }
        .nar-item:hover { background: rgba(37,99,235,.06); transform: translateX(2px); }
        .nar-item.is-active {
          background: rgba(37,99,235,.12);
          color: var(--text-primary);
          box-shadow: inset 3px 0 0 var(--accent-blue);
        }
        .nar-badge {
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
        .nar-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }
        .assistant-card {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255,255,255,.98), rgba(245,247,251,.98));
          box-shadow: 0 12px 24px rgba(15,23,42,.08);
          display: grid;
          gap: 12px;
        }
        .assistant-top { display: flex; align-items: center; gap: 10px; font-weight: 700; }
        .assistant-sparkle { color: #60a5fa; animation: pulseGlow 2.8s ease-in-out infinite; }
        .assistant-card p { margin: 0; color: var(--text-secondary); line-height: 1.6; font-size: 13px; }

        .nar-center { display: grid; grid-template-rows: 60px minmax(0,1fr); overflow: hidden; min-width: 0; }
        .nar-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          height: 60px;
          padding: 0 20px;
          background: rgba(255,255,255,.9);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(18px);
        }
        .search-shell { width: min(480px,100%); margin: 0 auto; position: relative; }
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
        .search-input::placeholder { color: var(--text-secondary); }
        .search-icon, .search-shortcut {
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
        .top-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .icon-chip { position: relative; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; color: var(--text-primary); }
        .bell-badge {
          position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; border-radius: 999px;
          background: var(--accent-red); color: white; font-family: 'JetBrains Mono', monospace; font-size: 10px;
          display: grid; place-items: center; border: 2px solid var(--bg-secondary);
        }
        .divider { width: 1px; height: 28px; background: var(--border); }
        .profile { display: flex; align-items: center; gap: 10px; }
        .profile strong { display: block; font-size: 13px; }
        .profile span { display: block; font-size: 12px; color: var(--text-secondary); }
        .avatar {
          position: relative; width: 36px; height: 36px; border-radius: 999px; display: grid; place-items: center;
          background: var(--accent-blue); color: white; font-family: 'JetBrains Mono', monospace; font-weight: 700;
        }
        .online-dot { position: absolute; right: -1px; bottom: -1px; width: 10px; height: 10px; border-radius: 999px; background: var(--accent-green); border: 2px solid var(--bg-secondary); }

        .scroll-pane { overflow-y: auto; min-width: 0; padding: 18px 18px 20px; }
        .content-grid { display: grid; gap: 14px; }
        .page-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
        .page-head h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -.03em; }
        .page-head p { margin: 6px 0 0; color: var(--text-secondary); font-size: 13px; }
        .head-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .real-time-chip, .secondary-button, .primary-button {
          display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px; border-radius: 10px; font-weight: 600;
        }
        .real-time-chip { border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary); font-size: 13px; }
        .pulse-dot { width: 10px; height: 10px; border-radius: 999px; background: var(--accent-green); box-shadow: 0 0 0 0 rgba(22,163,74,.55); animation: pulseRing 2s ease-out infinite; }
        .secondary-button { border: 1px solid var(--border); background: transparent; color: var(--text-primary); }
        .secondary-button:hover { background: var(--bg-tertiary); }
        .primary-button { border: 1px solid var(--accent-blue); background: var(--accent-blue); color: #fff; }

        .kpi-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
        .nar-card {
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--bg-card);
          box-shadow: 0 8px 24px rgba(15,23,42,.08);
        }
        .nar-kpi { padding: 16px; min-height: 160px; display: flex; flex-direction: column; gap: 8px; }
        .kpi-head { display: flex; gap: 10px; align-items: flex-start; }
        .kpi-head p { margin: 0; font-size: 12px; color: var(--text-secondary); }
        .kpi-head strong { display: block; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 28px; letter-spacing: -.03em; }
        .kpi-ico { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; flex: 0 0 auto; }
        .spark-blue { background: rgba(37,99,235,.1); color: #60a5fa; }
        .spark-orange { background: rgba(234,88,12,.1); color: #fb923c; }
        .spark-violet { background: rgba(124,58,237,.1); color: #a78bfa; }
        .spark-green { background: rgba(22,163,74,.1); color: #4ade80; }
        .spark-red { background: rgba(220,38,38,.1); color: #f87171; }
        .kpi-sub { color: var(--text-secondary); font-size: 12px; }
        .spark-wrap { margin-top: auto; min-height: 42px; }

        .tabs-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .tabs { display: inline-flex; gap: 8px; flex-wrap: wrap; }
        .tab {
          min-height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-card);
          color: var(--text-secondary); cursor: pointer; font-weight: 600;
        }
        .tab.is-active { background: rgba(37,99,235,.08); color: var(--accent-blue); border-color: rgba(37,99,235,.28); }

        .nar-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 14px; align-items: start; }
        .main-stack { display: grid; gap: 14px; min-width: 0; }
        .table-card, .pattern-card, .right-section { padding: 16px; }
        .section-head { display:flex; align-items:flex-start; justify-content:space-between; gap: 12px; margin-bottom: 14px; }
        .section-head h2, .right-section h3 { margin:0; font-size: 14px; font-weight: 700; }
        .section-head p { margin: 5px 0 0; color: var(--text-secondary); font-size: 13px; }

        .narrative-list { display: grid; gap: 10px; }
        .narrative-row {
          display: grid;
          grid-template-columns: 80px minmax(0,1.6fr) 140px 110px 110px 150px 120px;
          gap: 14px;
          align-items: center;
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: #fff;
          transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease, background .18s ease;
          cursor: pointer;
        }
        .narrative-row:hover { transform: translateY(-1px); border-color: rgba(37,99,235,.24); box-shadow: 0 12px 24px rgba(15,23,42,.08); }
        .narrative-row.is-active { border-color: rgba(37,99,235,.55); box-shadow: inset 0 0 0 1px rgba(37,99,235,.15); }
        .score-ring { width: 54px; height: 54px; border-radius: 999px; display:grid; place-items:center; font-family:'JetBrains Mono', monospace; font-weight:800; color: var(--accent-red); border: 4px solid rgba(220,38,38,.18); }
        .score-ring.orange { color: var(--accent-orange); border-color: rgba(234,88,12,.22); }
        .score-ring.violet { color: var(--accent-purple); border-color: rgba(124,58,237,.22); }
        .score-ring.green { color: var(--accent-green); border-color: rgba(22,163,74,.22); }
        .row-title { display:flex; align-items:center; gap:8px; font-weight:700; font-size: 13px; }
        .severity {
          display:inline-flex; align-items:center; padding: 2px 8px; border-radius:999px; font-family:'JetBrains Mono', monospace; font-size: 11px; font-weight:700;
        }
        .severity.crítico { background: rgba(220,38,38,.08); color: #ef4444; }
        .severity.alto { background: rgba(234,88,12,.08); color: #f97316; }
        .severity.medio { background: rgba(217,119,6,.08); color: #d97706; }
        .muted { color: var(--text-secondary); font-size: 12px; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .excerpt { color: var(--text-secondary); font-size: 12px; line-height: 1.45; margin-top: 6px; }
        .mini-actions { display:flex; gap: 8px; justify-content:flex-end; }
        .mini-action {
          width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--border); background: #fff; display:grid; place-items:center; color: var(--text-secondary);
        }

        .pattern-grid { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
        .pat-item {
          padding: 14px; border-radius: 12px; border: 1px solid var(--border); background: linear-gradient(180deg, #fff, #fbfdff);
          display:grid; gap: 8px;
        }
        .pat-top { display:flex; gap: 10px; align-items:flex-start; }
        .pat-ico { width: 34px; height: 34px; border-radius: 10px; display:grid; place-items:center; }
        .pat-ico.red { background: rgba(220,38,38,.08); color: #ef4444; }
        .pat-ico.orange { background: rgba(234,88,12,.08); color: #f97316; }
        .pat-ico.violet { background: rgba(124,58,237,.08); color: #8b5cf6; }
        .pat-ico.blue { background: rgba(37,99,235,.08); color: #2563eb; }
        .pat-item strong { font-size: 13px; }
        .pat-item p { margin: 0; color: var(--text-secondary); font-size: 12px; line-height: 1.5; }
        .pat-foot { display:flex; justify-content:space-between; align-items:center; gap: 10px; }

        .right-column { display:flex; flex-direction:column; gap: 12px; padding: 16px; border-left: 1px solid var(--border-subtle); background: rgba(255,255,255,.92); overflow-y:auto; }
        .right-section { display:grid; gap: 12px; }
        .narrative-highlight { display:grid; place-items:center; gap: 4px; padding: 12px 0 2px; }
        .big-score {
          width: 110px; height: 110px; border-radius: 999px; display:grid; place-items:center; font-family:'JetBrains Mono', monospace; font-weight:800; color: var(--accent-red);
          border: 6px solid rgba(220,38,38,.18);
        }
        .big-score span { display:block; font-size: 12px; color: var(--text-secondary); font-family: 'IBM Plex Sans', sans-serif; font-weight: 600; margin-top: 4px; }
        .detail-list { display:grid; gap: 10px; }
        .detail-row { display:grid; grid-template-columns: 1fr auto; gap: 10px; align-items:center; }
        .detail-row span { color: var(--text-secondary); font-size: 12px; }
        .detail-row strong { font-size: 13px; }
        .quote-box {
          padding: 14px; border-radius: 12px; background: #f8fafc; border: 1px solid var(--border);
          color: var(--text-secondary); font-size: 13px; line-height: 1.7;
        }
        .similar-list { display:grid; gap: 8px; }
        .similar-row { display:flex; align-items:center; justify-content:space-between; gap: 10px; font-size: 13px; }
        .similar-row strong { font-family:'JetBrains Mono', monospace; }
        .view-link {
          display:inline-flex; align-items:center; gap: 8px; color: var(--accent-blue); text-decoration:none; font-weight: 600; font-size: 13px;
        }
        .view-link:hover { text-decoration: underline; }

        .network-box { position: relative; height: 220px; border-radius: 16px; background: linear-gradient(180deg, #fbfdff, #f6f8fe); border: 1px solid var(--border); overflow: hidden; }
        .network-core {
          position:absolute; left:50%; top:50%; width:72px; height:72px; transform: translate(-50%,-50%); border-radius:999px;
          display:grid; place-items:center; background: var(--accent-red); color:#fff; font-family:'JetBrains Mono', monospace; font-weight:800; box-shadow: 0 10px 24px rgba(220,38,38,.24);
        }
        .network-node {
          position:absolute; transform: translate(-50%,-50%); width: 34px; height: 34px; border-radius:999px; display:grid; place-items:center; font-size: 10px; font-family:'JetBrains Mono', monospace; color:#fff;
        }
        .network-node.blue { background:#2563eb; }
        .network-node.orange { background:#f97316; }
        .network-node.violet { background:#8b5cf6; }
        .network-node.amber { background:#f59e0b; }
        .network-line { position:absolute; left:50%; top:50%; width: 1px; height: 1px; transform-origin: 0 0; border-top: 2px dashed rgba(37,99,235,.24); }

        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(22,163,74,.45); } 70% { box-shadow: 0 0 0 10px rgba(22,163,74,0); } 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); } }
        @keyframes pulseGlow { 0%,100% { opacity: .8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }

        .highlight mark { background: rgba(37,99,235,.14); color: var(--accent-blue); padding: 0 .15em; border-radius: 4px; }

        @media (max-width: 1440px) {
          .nar-shell { grid-template-columns: 220px minmax(0, 1fr) 300px; }
        }
        @media (max-width: 1280px) {
          .nar-shell { grid-template-columns: 220px minmax(0, 1fr); }
          .right-column { display: none; }
          .kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .pattern-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .narrative-row { grid-template-columns: 80px minmax(0,1fr) 110px 90px 120px 90px; }
          .narrative-row > :nth-child(7) { display: none; }
        }
        @media (max-width: 1024px) {
          .nar-shell { grid-template-columns: 1fr; height: auto; }
          .nar-sidebar { min-height: auto; }
          .nar-center { grid-template-rows: 60px auto; }
          .kpi-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .nar-layout { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="nar-shell">
        <aside className="nar-sidebar">
          <Link to="/demo" className="nar-brand">
            <span className="nar-brand-mark">
              <Shield size={18} strokeWidth={2.5} />
            </span>
            <span>
              <strong>fraudia</strong>
              <span>Detección de fraude en siniestros</span>
            </span>
          </Link>

          <div className="nar-group">
            <p className="nar-label">Menú principal</p>
            {sidebarItems.filter((item) => item.group === 'main').map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} to={item.href} className={`nar-item ${location.pathname === item.href ? 'is-active' : ''}`}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge ? <span className="nar-badge">{item.badge}</span> : null}
                </Link>
              )
            })}
          </div>

          <div className="nar-group">
            <p className="nar-label">Entidades</p>
            {sidebarItems.filter((item) => item.group === 'entities').map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} to={item.href} className="nar-item">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="nar-group">
            <p className="nar-label">Herramientas</p>
            {sidebarItems.filter((item) => item.group === 'tools').map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.label} to={item.href} className="nar-item">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="nar-footer">
            <section className="assistant-card">
              <div className="assistant-top">
                <Sparkles className="assistant-sparkle" size={18} />
                <span>IA Assistant</span>
              </div>
              <p>Pregúntame sobre narrativas, patrones o coincidencias.</p>
              <button className="secondary-button" type="button" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Abrir chat</span>
                <ArrowRight size={16} />
              </button>
            </section>
          </div>
        </aside>

        <div className="nar-center">
          <header className="nar-topbar">
            <div style={{ width: 220 }} />
            <div className="search-shell">
              <Search className="search-icon" size={16} />
              <input
                className="search-input"
                placeholder="Buscar narrativa, caso, asegurado, vehículo..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="search-shortcut">⌘ K</span>
            </div>

            <div className="top-right">
              <button className="icon-chip" type="button" aria-label="Notificaciones">
                <Bell size={18} />
                <span className="bell-badge">6</span>
              </button>
              <button className="icon-chip" type="button" aria-label="Ayuda">
                <HelpCircle size={18} />
              </button>
              <div className="divider" />
              <div className="profile">
                <div>
                  <strong>Analista Senior</strong>
                  <span>Unidad Antifraude</span>
                </div>
                <div className="avatar">AS<span className="online-dot" /></div>
              </div>
            </div>
          </header>

          <div className="scroll-pane">
            <div className="content-grid">
              <div className="page-head">
                <div>
                  <h1>Narrativas similares</h1>
                  <p>Identifica siniestros con descripciones y patrones similares mediante IA</p>
                </div>
                <div className="head-actions">
                  <span className="real-time-chip">
                    <span className="pulse-dot" />
                    En tiempo real
                  </span>
                  <button className="secondary-button" type="button">
                    <Filter size={16} />
                    Filtros
                  </button>
                  <button className="primary-button" type="button">
                    <SlidersHorizontal size={16} />
                    Ordenar
                  </button>
                </div>
              </div>

              <div className="kpi-grid">
                {sparkConfigs.map((config, index) => (
                  <SparkCard key={config.title} config={config} data={kpiData[index]} />
                ))}
              </div>

              <div className="tabs-row">
                <div className="tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      className={`tab ${activeTab === tab ? 'is-active' : ''}`}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button className="secondary-button" type="button">
                  Ordenar por: Similitud (mayor)
                  <ChevronDown size={14} />
                </button>
              </div>

              <section className="nar-layout">
                <div className="main-stack">
                  <article className="nar-card table-card">
                    <div className="section-head">
                      <div>
                        <h2>Narrativas con alta similitud</h2>
                        <p>Siniestros con descripciones y patrones similares detectados por IA</p>
                      </div>
                    </div>

                    <div className="narrative-list">
                      {filteredNarratives.map((row) => (
                        <div
                          key={row.id}
                          className={`narrative-row ${selected.id === row.id ? 'is-active' : ''}`}
                          onClick={() => setSelectedId(row.id)}
                        >
                          <div className={`score-ring ${Number(row.similarity.replace('%', '')) >= 95 ? 'red' : Number(row.similarity.replace('%', '')) >= 90 ? 'orange' : Number(row.similarity.replace('%', '')) >= 88 ? 'violet' : 'green'}`}>
                            {row.similarity}
                          </div>
                          <div>
                            <div className="row-title">
                              <span className="mono">{row.id}</span>
                              <span className={`severity ${row.severity.toLowerCase()}`}>{row.severity}</span>
                            </div>
                            <div className="excerpt highlight">{highlight(row.excerpt, search)}</div>
                          </div>
                          <div>
                            <span className="muted">Asegurado</span>
                            <strong>{row.insured}</strong>
                          </div>
                          <div>
                            <span className="muted">Fecha</span>
                            <strong className="mono">{row.date}</strong>
                          </div>
                          <div>
                            <span className="muted">Monto</span>
                            <strong>{row.amount}</strong>
                          </div>
                          <div>
                            <span className="muted">Vehículo</span>
                            <strong>{row.vehicle}</strong>
                          </div>
                          <div className="mini-actions">
                            <button className="mini-action" type="button" aria-label="Ver detalle"><Eye size={15} /></button>
                            <button className="mini-action" type="button" aria-label="Vincular"><Link2 size={15} /></button>
                            <button className="mini-action" type="button" aria-label="Documento"><ClipboardList size={15} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <section className="nar-card pattern-card">
                    <div className="section-head">
                      <div>
                        <h2>Patrones detectados en narrativas similares</h2>
                        <p>Resumen de coincidencias y grupos detectados por IA</p>
                      </div>
                    </div>

                    <div className="pattern-grid">
                      {patternCards.map((pattern) => (
                        <article key={pattern.title} className="pat-item">
                          <div className="pat-top">
                            <span className={`pat-ico ${pattern.tone}`}>
                              <FileText size={16} />
                            </span>
                            <div>
                              <strong>{pattern.title}</strong>
                              <p>{pattern.desc}</p>
                            </div>
                          </div>
                          <div className="pat-foot">
                            <div>
                              <span className="muted">Coincidencias</span>
                              <strong className="mono" style={{ display: 'block' }}>{pattern.cases}</strong>
                            </div>
                            <div>
                              <span className="muted">Riesgo asociado</span>
                              <strong className="severity alto" style={{ marginTop: 4 }}>{pattern.level}</strong>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="right-column">
                  <section className="right-section">
                    <div className="section-head" style={{ marginBottom: 0 }}>
                      <div>
                        <h3>Narrativa seleccionada</h3>
                      </div>
                      <span className="muted mono">ID: {selected.id}</span>
                    </div>

                    <div className="narrative-highlight">
                      <div className="big-score">
                        96%
                        <span>Muy alta</span>
                      </div>
                      <span className={`severity ${selected.severity.toLowerCase()}`}>{selected.severity}</span>
                    </div>

                    <div className="detail-list">
                      <div className="detail-row"><span>Asegurado</span><strong>{selected.insured}</strong></div>
                      <div className="detail-row"><span>Vehículo</span><strong>{selected.vehicle}</strong></div>
                      <div className="detail-row"><span>Fecha del evento</span><strong className="mono">{selected.date}</strong></div>
                      <div className="detail-row"><span>Monto reclamado</span><strong>{selected.amount}</strong></div>
                      <div className="detail-row"><span>Proveedor</span><strong>{selected.provider}</strong></div>
                      <div className="detail-row"><span>Ciudad</span><strong>{selected.city}</strong></div>
                    </div>
                  </section>

                  <section className="right-section">
                    <h3>Fragmento de narrativa</h3>
                    <div className="quote-box">
                      “El vehículo se encontraba estacionado en la vía esperando el cambio de semáforo, cuando fue impactado por alcance en la parte trasera por otro automóvil. El impacto fue leve pero causó daños en el parachoques y la tapa del baúl.”
                    </div>
                  </section>

                  <section className="right-section">
                    <h3>Similares más relevantes</h3>
                    <div className="similar-list">
                      {similarIds.map((item) => (
                        <div className="similar-row" key={item.id}>
                          <strong className="mono">{item.id}</strong>
                          <span className="mono">{item.score}</span>
                        </div>
                      ))}
                    </div>
                    <a href="#detalle" className="view-link">
                      Ver todas las similares <ArrowRight size={16} />
                    </a>
                  </section>

                  <section className="right-section">
                    <h3>Red de narrativas similares</h3>
                    <div className="network-box" aria-hidden="true">
                      <div className="network-core">{selected.id}</div>
                      <svg width="100%" height="100%" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
                        {networkNodes.map((node) => (
                          <line
                            key={node.label}
                            x1="70"
                            y1="70"
                            x2={node.x}
                            y2={node.y}
                            stroke={node.tone === 'orange' ? '#fdba74' : node.tone === 'violet' ? '#c4b5fd' : node.tone === 'amber' ? '#fcd34d' : '#93c5fd'}
                            strokeDasharray="4 4"
                          />
                        ))}
                      </svg>
                      {networkNodes.map((node) => (
                        <div
                          key={node.label}
                          className={`network-node ${node.tone}`}
                          style={{ left: `${node.x}%`, top: `${node.y}%` } as CSSProperties}
                        >
                          {node.label.replace('#FR-', '')}
                        </div>
                      ))}
                    </div>
                  </section>
                </aside>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

