
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  Building2,
  CarFront,
  Download,
  Filter,
  HelpCircle,
  Home,
  Map,
  Search,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Wrench,
  FileText,
  AlertTriangle,
  Clock,
  Grid,
  XCircle,
  FileDigit,
  ArrowUpRight
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts'

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
  icon: typeof CarFront
  tone: string
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

const kpiDataVehicles = [
  [3000, 3100, 3200, 3400, 3600, 3700, 3841], 
  [150, 160, 180, 200, 220, 230, 247],
  [20, 22, 25, 28, 30, 35, 38], 
  [14, 14, 14, 14, 14, 14, 14], 
]

const sparkConfigsVehicles: SparkConfig[] = [
  { title: 'Vehículos analizados', value: '3,841', subtitle: '↑ 17% vs ayer', stroke: '#2563eb', icon: CarFront, tone: 'blue' },
  { title: 'Alto riesgo', value: '247', subtitle: '↑ 31% vs ayer', stroke: '#dc2626', icon: AlertTriangle, tone: 'red' },
  { title: 'Placas duplicadas', value: '38', subtitle: '↑ 9% vs ayer', stroke: '#ea580c', icon: Clock, tone: 'orange' },
  { title: 'VINs irregulares', value: '14', subtitle: '→ 0% vs ayer', stroke: '#7c3aed', icon: Grid, tone: 'violet' },
]

const vehiclesData = [
  { placa: 'MFD 341', propietario: 'Carlos Méndez', vehiculo: 'KIA Sportage 2021', siniestros: 5, score: 94, city: 'Medellín', vin: '3VWSC29M72M1', amount: '$28.4M', date: '28/05/2025' },
  { placa: 'BOG 872', propietario: 'Ana Rodríguez', vehiculo: 'Chevrolet Spark 2020', siniestros: 4, score: 88, city: 'Bogotá', vin: '9BWSC29M72M2', amount: '$15.2M', date: '28/05/2025' },
  { placa: 'CAI 519', propietario: 'Pedro Gómez', vehiculo: 'Toyota Fortuner 2022', siniestros: 3, score: 76, city: 'Cali', vin: 'JTDKA29M72M3', amount: '$9.8M', date: '27/05/2025' },
  { placa: 'MFD 763', propietario: 'Laura Torres', vehiculo: 'Renault Logan 2019', siniestros: 3, score: 72, city: 'Medellín', vin: 'VF1SC29M72M4', amount: '$6.4M', date: '27/05/2025' },
  { placa: 'RAO 201', propietario: 'Miguel Ramírez', vehiculo: 'Mazda CX-5 2021', siniestros: 2, score: 45, city: 'Bogotá', vin: 'JM3SC29M72M5', amount: '$3.2M', date: '26/05/2025' },
  { placa: 'MED 092', propietario: 'Sofia Castro', vehiculo: 'Nissan March 2020', siniestros: 6, score: 94, city: 'Medellín', vin: '3VWSC29M72M', amount: '$31.2M', date: '28/05/2025' },
]

const historyData = [
  { name: 'Ene', value: 38 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 60 },
  { name: 'Abr', value: 75 },
  { name: 'May', value: 94 },
]

function sparkCss(tone: string) {
  return tone === 'red' ? 'spark-red' : tone === 'orange' ? 'spark-orange' : tone === 'violet' ? 'spark-violet' : tone === 'green' ? 'spark-green' : 'spark-blue'
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

function formatPlaca(placa: string) {
  const [letters, numbers] = placa.split(' ')
  return (
    <div className="placa-badge">
      <span>{letters}</span>
      <strong>{numbers}</strong>
    </div>
  )
}

export default function VehiclesPage() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [selectedPlaca, setSelectedPlaca] = useState('MED 092')

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return vehiclesData.filter((item) => {
      if (!query) return true
      return [item.placa, item.propietario, item.vehiculo, item.city].join(' ').toLowerCase().includes(query)
    })
  }, [search])

  const selected = useMemo(
    () => filteredVehicles.find((item) => item.placa === selectedPlaca) ?? vehiclesData.find(v => v.placa === 'MED 092')!,
    [filteredVehicles, selectedPlaca]
  )

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
        .content-grid { display: grid; gap: 18px; }
        .page-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
        .page-head h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -.03em; }
        .page-head p { margin: 8px 0 0; color: var(--text-secondary); font-size: 14px; max-width: 320px; line-height: 1.4; }
        .head-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        
        .real-time-chip, .secondary-button, .primary-button {
          display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
        }
        .real-time-chip { border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary); font-size: 13px; cursor: default; }
        .pulse-dot { width: 10px; height: 10px; border-radius: 999px; background: var(--accent-green); box-shadow: 0 0 0 0 rgba(22,163,74,.55); animation: pulseRing 2s ease-out infinite; }
        .secondary-button { border: 1px solid var(--border); background: transparent; color: var(--text-primary); }
        .secondary-button:hover { background: var(--bg-tertiary); }
        .primary-button { border: 1px solid var(--accent-blue); background: var(--accent-blue); color: #fff; }
        .primary-button:hover { background: #1d4ed8; border-color: #1d4ed8; }

        .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .nar-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--bg-card);
          box-shadow: 0 8px 24px rgba(15,23,42,.04);
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

        .nar-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; align-items: start; }
        .main-stack { display: grid; gap: 14px; min-width: 0; }
        .table-card { padding: 18px; }
        .section-head { display:flex; align-items:flex-start; justify-content:space-between; gap: 12px; margin-bottom: 16px; }
        .section-head h2 { margin:0; font-size: 16px; font-weight: 700; }
        
        .vehicle-table { width: 100%; border-collapse: collapse; text-align: left; }
        .vehicle-table th { color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; padding: 0 12px 12px; font-weight: 600; border-bottom: 1px solid var(--border-subtle); }
        .vehicle-table td { padding: 14px 12px; border-bottom: 1px solid var(--border-subtle); font-size: 13px; }
        .vehicle-row { transition: background 0.15s ease; cursor: pointer; }
        .vehicle-row:hover { background: rgba(37,99,235,.03); }
        .vehicle-row.is-active { background: rgba(37,99,235,.06); }
        .vehicle-row:last-child td { border-bottom: none; }
        
        .placa-badge { display: inline-flex; flex-direction: column; align-items: center; background: #1e293b; color: white; border-radius: 6px; padding: 4px 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1; border: 1px solid #0f172a; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .placa-badge span { font-size: 10px; color: #cbd5e1; }
        .placa-badge strong { font-weight: 700; }
        
        .score-bar-container { width: 60px; height: 6px; background: var(--border-subtle); border-radius: 999px; overflow: hidden; display: inline-block; vertical-align: middle; }
        .score-bar { height: 100%; border-radius: 999px; }
        
        .table-footer { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 13px; }

        .right-column { display:flex; flex-direction:column; gap: 20px; padding: 20px; border-left: 1px solid var(--border-subtle); background: rgba(255,255,255,.92); overflow-y:auto; }
        .right-section { display:grid; gap: 14px; }
        .right-section h3 { margin:0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text-secondary); font-size: 11px;}
        
        .vehicle-header { display: flex; justify-content: space-between; align-items: center; }
        .vehicle-id { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 18px; }
        .severity-badge { background: rgba(220,38,38,.1); color: #dc2626; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; font-family: 'JetBrains Mono', monospace; }
        
        .vehicle-info-card { display: flex; gap: 14px; align-items: center; padding: 14px; border: 1px solid var(--border-subtle); border-radius: 12px; background: var(--bg-primary); }
        .vehicle-icon-wrap { width: 48px; height: 48px; background: rgba(37,99,235,.1); color: var(--accent-blue); border-radius: 10px; display: grid; place-items: center; }
        .vehicle-details-text strong { display: block; font-size: 15px; font-weight: 700; }
        .vehicle-details-text span { color: var(--text-secondary); font-size: 13px; }
        
        .score-display { display: flex; flex-direction: column; align-items: center; margin: 10px 0; }
        .circular-score { position: relative; width: 140px; height: 140px; display: grid; place-items: center; }
        .score-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
        .score-bg { fill: none; stroke: var(--border-subtle); stroke-width: 8; }
        .score-fill { fill: none; stroke: var(--accent-red); stroke-width: 8; stroke-linecap: round; stroke-dasharray: 283; stroke-dashoffset: calc(283 - (283 * 94) / 100); transition: stroke-dashoffset 1s ease; }
        .score-text { position: absolute; text-align: center; }
        .score-text strong { display: block; font-size: 32px; font-weight: 800; color: var(--accent-red); font-family: 'JetBrains Mono', monospace; line-height: 1; }
        .score-text span { font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; }
        
        .details-list { display: grid; gap: 10px; font-size: 13px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle); }
        .details-row { display: flex; justify-content: space-between; align-items: center; }
        .details-row span { color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
        .details-row strong { font-weight: 600; text-align: right; }
        .details-row strong.red { color: var(--accent-red); }
        .details-row strong.green { color: var(--accent-green); }
        .details-row .mono { font-family: 'JetBrains Mono', monospace; }
        
        .action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .btn-full { width: 100%; justify-content: center; }
        
        .chart-container { height: 80px; width: 100%; margin-top: 10px; }
        .chart-footer { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-secondary); margin-top: 4px; }
        .chart-footer strong { color: var(--text-primary); font-weight: 600; }
        .chart-footer strong.red { color: var(--accent-red); }
        .chart-footer strong.green { color: var(--accent-green); }
        
        .alerts-list { display: grid; gap: 12px; }
        .alert-item { display: flex; gap: 12px; align-items: flex-start; }
        .alert-icon { width: 32px; height: 32px; border-radius: 8px; display: grid; place-items: center; flex-shrink: 0; }
        .alert-icon.red { background: rgba(220,38,38,.1); color: #ef4444; }
        .alert-icon.orange { background: rgba(234,88,12,.1); color: #f97316; }
        .alert-icon.purple { background: rgba(124,58,237,.1); color: #8b5cf6; }
        .alert-content { flex: 1; min-width: 0; }
        .alert-content strong { display: block; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .alert-content span { display: block; font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .alert-time { font-size: 11px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
        
        .view-all-link { display: inline-flex; align-items: center; gap: 6px; color: var(--accent-blue); font-size: 13px; font-weight: 600; text-decoration: none; margin-top: 4px; }
        .view-all-link:hover { text-decoration: underline; }

        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(22,163,74,.45); } 70% { box-shadow: 0 0 0 10px rgba(22,163,74,0); } 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); } }
        @keyframes pulseGlow { 0%,100% { opacity: .8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }

        @media (max-width: 1440px) {
          .nar-shell { grid-template-columns: 220px minmax(0, 1fr) 300px; }
        }
        @media (max-width: 1280px) {
          .nar-shell { grid-template-columns: 220px minmax(0, 1fr); }
          .right-column { display: none; }
          .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 1024px) {
          .nar-shell { grid-template-columns: 1fr; height: auto; }
          .nar-sidebar { min-height: auto; }
          .nar-center { grid-template-rows: 60px auto; }
          .kpi-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
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
                <Link key={item.label} to={item.href} className={`nar-item ${location.pathname === item.href ? 'is-active' : ''}`}>
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
                <Link key={item.label} to={item.href} className={`nar-item ${location.pathname === item.href ? 'is-active' : ''}`}>
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
              <p>Analiza patrones en el parque automotor sospechoso.</p>
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
                placeholder="Buscar vehículo, propietario, placa o VIN..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="search-shortcut">⌘ K</span>
            </div>

            <div className="top-right">
              <button className="icon-chip" type="button" aria-label="Notificaciones">
                <Bell size={18} />
                <span className="bell-badge">8</span>
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
                  <h1>Vehículos</h1>
                  <p>Parque automotor vinculado a siniestros — análisis de riesgo por placa, modelo y historial</p>
                </div>
                <div className="head-actions">
                  <span className="real-time-chip">
                    <span className="pulse-dot" />
                    Tiempo real
                  </span>
                  <button className="secondary-button" type="button">
                    <Filter size={16} />
                    Filtros
                  </button>
                  <button className="primary-button" type="button">
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
              </div>

              <div className="kpi-grid">
                {sparkConfigsVehicles.map((config, index) => (
                  <SparkCard key={config.title} config={config} data={kpiDataVehicles[index]} />
                ))}
              </div>

              <section className="nar-layout">
                <div className="main-stack">
                  <article className="nar-card table-card">
                    <div className="section-head">
                      <div>
                        <h2>Vehículos en vigilancia activa</h2>
                      </div>
                    </div>

                    <table className="vehicle-table">
                      <thead>
                        <tr>
                          <th>PLACA</th>
                          <th>PROPIETARIO</th>
                          <th>VEHÍCULO</th>
                          <th>SINIESTROS</th>
                          <th>SCORE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVehicles.map((row) => (
                          <tr 
                            key={row.placa} 
                            className={`vehicle-row ${selected.placa === row.placa ? 'is-active' : ''}`}
                            onClick={() => setSelectedPlaca(row.placa)}
                          >
                            <td>{formatPlaca(row.placa)}</td>
                            <td><strong>{row.propietario}</strong></td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{row.vehiculo.split(' ').slice(0, 2).join(' ')}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{row.vehiculo.split(' ').slice(2).join(' ')}</span>
                              </div>
                            </td>
                            <td><strong style={{ color: row.siniestros > 3 ? 'var(--accent-red)' : row.siniestros > 2 ? 'var(--accent-orange)' : 'var(--text-primary)'}}>{row.siniestros}</strong></td>
                            <td>
                              <div className="score-bar-container">
                                <div 
                                  className="score-bar" 
                                  style={{ 
                                    width: `${row.score}%`, 
                                    background: row.score >= 80 ? 'var(--accent-red)' : row.score >= 60 ? 'var(--accent-orange)' : 'var(--accent-green)' 
                                  }} 
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="table-footer">
                      Mostrando {filteredVehicles.length} de 247 vehículos de alto riesgo
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>

        <aside className="right-column">
          <div className="right-section">
            <h3>VEHÍCULO ACTIVO</h3>
            <div className="vehicle-header">
              <span className="vehicle-id">#{selected.placa}</span>
              <span className="severity-badge">{selected.score >= 80 ? 'CRÍTICO' : selected.score >= 60 ? 'ALTO' : 'MEDIO'}</span>
            </div>
            
            <div className="vehicle-info-card">
              <div className="vehicle-icon-wrap">
                <CarFront size={24} />
              </div>
              <div className="vehicle-details-text">
                <strong>{selected.vehiculo}</strong>
                <span>{selected.propietario} · {selected.city}</span>
              </div>
            </div>
            
            <div className="score-display">
              <div className="circular-score">
                <svg className="score-svg" viewBox="0 0 100 100">
                  <circle className="score-bg" cx="50" cy="50" r="45" />
                  <circle 
                    className="score-fill" 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    style={{ strokeDashoffset: `calc(283 - (283 * ${selected.score}) / 100)`, stroke: selected.score >= 80 ? 'var(--accent-red)' : selected.score >= 60 ? 'var(--accent-orange)' : 'var(--accent-green)' }}
                  />
                </svg>
                <div className="score-text">
                  <strong style={{ color: selected.score >= 80 ? 'var(--accent-red)' : selected.score >= 60 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>{selected.score}%</strong>
                  <span>Score de riesgo</span>
                </div>
              </div>
            </div>
            
            <div className="details-list">
              <div className="details-row">
                <span><Clock size={14} /> Último siniestro</span>
                <strong>{selected.date}</strong>
              </div>
              <div className="details-row">
                <span><FileDigit size={14} /> Placa</span>
                <strong className="mono">{selected.placa}</strong>
              </div>
              <div className="details-row">
                <span><Wrench size={14} /> VIN</span>
                <strong className="mono">{selected.vin}</strong>
              </div>
              <div className="details-row">
                <span><ShieldAlert size={14} /> Siniestros</span>
                <strong className="red">{selected.siniestros} eventos</strong>
              </div>
              <div className="details-row">
                <span><FileDigit size={14} /> Total reclamado</span>
                <strong className="green">{selected.amount}</strong>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="primary-button btn-full" type="button">Ver análisis</button>
              <button className="secondary-button btn-full" type="button">Expediente <ArrowUpRight size={14} /></button>
            </div>
          </div>
          
          <div className="right-section">
            <h3>Historial de scores</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-red)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--accent-red)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={() => null} />
                  <Area type="monotone" dataKey="value" stroke="var(--accent-red)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footer">
              <span>Ene<br/>Score inicial: <strong className="green">38%</strong></span>
              <span style={{ textAlign: 'center' }}>Abr</span>
              <span style={{ textAlign: 'right' }}>May<br/>Actual: <strong className="red">94%</strong></span>
            </div>
          </div>
          
          <div className="right-section">
            <h3>Alertas del vehículo</h3>
            <div className="alerts-list">
              <div className="alert-item">
                <div className="alert-icon red"><AlertTriangle size={16} /></div>
                <div className="alert-content">
                  <strong>Siniestro en zona de alto fraude</strong>
                  <span>Sector La 80 · Medellín</span>
                </div>
                <div className="alert-time">09:42</div>
              </div>
              <div className="alert-item">
                <div className="alert-icon orange"><XCircle size={16} /></div>
                <div className="alert-content">
                  <strong>Fotos de daños duplicadas</strong>
                  <span>Match con siniestro #S-65109</span>
                </div>
                <div className="alert-time">09:28</div>
              </div>
              <div className="alert-item">
                <div className="alert-icon purple"><ArrowRight size={16} /></div>
                <div className="alert-content">
                  <strong>Vinculado a red de 4 talleres</strong>
                  <span>Taller Express + 3 más</span>
                </div>
                <div className="alert-time">09:15</div>
              </div>
            </div>
            <a href="#" className="view-all-link">Ver todas las alertas <ArrowRight size={14} /></a>
          </div>
        </aside>
      </div>
    </main>
  )
}

