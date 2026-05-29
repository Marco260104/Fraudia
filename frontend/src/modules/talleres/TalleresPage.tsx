import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronDown,
  FileText,
  Fingerprint,
  Gauge,
  HeartPulse,
  Home,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Wrench,
  ShieldCheck
} from 'lucide-react'
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts'

type SidebarItem = { label: string; icon: typeof Home; href: string; badge?: string; group: 'main' | 'entities' | 'tools' }

const sidebarItems: SidebarItem[] = [
  { label: 'Centro de inteligencia', icon: Home, href: '/demo', group: 'main' },
  { label: 'Casos críticos', icon: Shield, href: '/casos-criticos', badge: '18', group: 'main' },
  { label: 'Alertas IA', icon: Bell, href: '/alertas-ia', group: 'main' },
  { label: 'Mapa de siniestros', icon: MapPin, href: '/mapa-siniestros', group: 'main' },
  { label: 'Narrativas similares', icon: FileText, href: '/narrativas-similares', group: 'main' },
  { label: 'Vehículos', icon: CarFront, href: '/vehiculos', group: 'entities' },
  { label: 'Proveedores', icon: Building2, href: '/proveedores', group: 'entities' },
  { label: 'Asegurados', icon: UserRound, href: '/asegurados', group: 'entities' },
  { label: 'Talleres', icon: Wrench, href: '/talleres', group: 'entities' },
  { label: 'Calculadora de riesgo', icon: Target, href: '/demo', group: 'tools' },
  { label: 'Reportes', icon: FileText, href: '/demo', group: 'tools' },
  { label: 'Configuración', icon: Fingerprint, href: '/demo', group: 'tools' },
]

const kpis = [
  { title: 'Talleres analizados', value: '428', delta: '↑ 14% vs ayer', tone: 'blue', icon: Wrench },
  { title: 'Talleres de riesgo', value: '63', delta: '↑ 9% vs semana', tone: 'red', icon: Gauge },
  { title: 'Relación con casos', value: '92', delta: '↑ 21% vs ayer', tone: 'indigo', icon: Users },
  { title: 'Alertas técnicas', value: '31', delta: '↑ 4% vs ayer', tone: 'amber', icon: TrendingUp },
]

const workshopData = [
  { name: 'Taller Express', score: 96, risk: 'Crítico', city: 'Medellín', incidents: 58, vehicles: '24' },
  { name: 'AutoMecánica L&R', score: 89, risk: 'Alto', city: 'Envigado', incidents: 41, vehicles: '18' },
  { name: 'Car Center Pro', score: 84, risk: 'Alto', city: 'Bello', incidents: 33, vehicles: '16' },
  { name: 'Taller La 80', score: 72, risk: 'Medio', city: 'Itagüí', incidents: 27, vehicles: '12' },
]

const radarData = [
  { axis: 'Reclamos', value: 92 },
  { axis: 'Tiempos', value: 74 },
  { axis: 'Consistencia', value: 88 },
  { axis: 'Geografía', value: 68 },
  { axis: 'Repetición', value: 81 },
  { axis: 'Vínculos', value: 86 },
]

const activity = [
  { time: '09:42', text: 'Taller vinculado a 4 siniestros' },
  { time: '09:44', text: 'Coincidencia de proveedor recurrente' },
  { time: '09:47', text: 'Trazabilidad de reparación validada' },
]

export default function TalleresPage() {
  const location = useLocation()
  const [selected, setSelected] = useState(workshopData[0])

  const operationalNotes = useMemo(
    () => [
      'Historial de inspección consistente',
      'Picos de actividad en horarios similares',
      'Coincidencia de vehículos de alta exposición',
    ],
    [],
  )

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700;800&display=swap');
        .page{--bg-primary:#f6f8fc;--bg-card:#fff;--bg-tertiary:#eef4fb;--text-primary:#0f172a;--text-secondary:#64748b;--border:#dbe3ef;--accent-blue:#2563eb;--accent-green:#10b981;--accent-indigo:#6366f1;--accent-amber:#f59e0b;--accent-red:#dc2626;min-height:100vh;background:var(--bg-primary);color:var(--text-primary);font-family:'IBM Plex Sans',sans-serif}
        .shell{display:grid;grid-template-columns:220px 1fr;min-height:100vh}
        .sidebar{display:flex;flex-direction:column;gap:18px;padding:16px 14px;background:rgba(255,255,255,.92);border-right:1px solid #e8eef7;overflow-y:auto}
        .brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-primary);padding:8px 4px 14px;border-bottom:1px solid #e8eef7}
        .brand-mark{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(37,99,235,.16),rgba(16,185,129,.12));color:var(--accent-blue)}
        .brand strong{display:block;font-size:1.4rem;letter-spacing:-.04em}
        .brand span{display:block;font-size:12px;color:var(--text-secondary)}
        .group{display:grid;gap:6px}
        .label{margin:0 0 4px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-secondary);font-weight:700}
        .item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;text-decoration:none;color:var(--text-secondary)}
        .item:hover,.item.active{background:rgba(37,99,235,.08);color:var(--text-primary)}
        .badge{margin-left:auto;min-width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--accent-red);color:#fff;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}
        .footer{margin-top:auto;padding-top:16px;border-top:1px solid #e8eef7}
        .assistant{padding:16px;border-radius:16px;border:1px solid var(--border);background:linear-gradient(180deg,#fff,#f6f8fc);box-shadow:0 12px 24px rgba(15,23,42,.06)}
        .assistant-top{display:flex;align-items:center;gap:10px;font-weight:700}.sparkle{color:var(--accent-blue);animation:pulseGlow 2.8s ease-in-out infinite}
        .assistant p{margin:0;color:var(--text-secondary);line-height:1.6;font-size:13px}
        .content{display:grid;grid-template-rows:60px 1fr;min-width:0;overflow:hidden}
        .topbar{display:flex;align-items:center;justify-content:space-between;gap:12px;height:60px;padding:0 20px;background:rgba(255,255,255,.9);border-bottom:1px solid #e8eef7}
        .search{width:min(520px,100%);margin:0 auto;position:relative}.search input{width:100%;height:40px;padding:0 44px 0 42px;border-radius:12px;border:1px solid var(--border);background:#fff}
        .search .i,.search .k{position:absolute;top:50%;transform:translateY(-50%);color:var(--text-secondary);font-size:12px}.search .i{left:14px}.search .k{right:12px;padding:2px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg-primary);font-family:'JetBrains Mono',monospace}
        .top-right{display:flex;align-items:center;gap:12px}.chip{position:relative;width:34px;height:34px;display:grid;place-items:center;border-radius:50%}.badge-dot{position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:999px;background:var(--accent-red);color:#fff;font-family:'JetBrains Mono',monospace;font-size:10px;display:grid;place-items:center;border:2px solid #fff}
        .profile{display:flex;align-items:center;gap:10px}.profile strong{display:block;font-size:13px}.profile span{display:block;font-size:12px;color:var(--text-secondary)}.avatar{position:relative;width:36px;height:36px;border-radius:999px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent-blue),var(--accent-indigo));color:#fff;font-family:'JetBrains Mono',monospace;font-weight:700}
        .dot{position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:999px;background:var(--accent-green);border:2px solid #fff}
        .scroll{overflow-y:auto;padding:18px}
        .head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.head h1{margin:0;font-size:24px;letter-spacing:-.03em}.head p{margin:6px 0 0;color:var(--text-secondary);font-size:13px}
        .head-actions{display:flex;gap:10px;flex-wrap:wrap}.rt,.btn{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:10px;font-weight:600}.rt{border:1px solid var(--border);background:#fff}.btn{border:1px solid var(--border);background:transparent}.btn.primary{background:var(--accent-blue);color:#fff;border-color:var(--accent-blue)}
        .pulse{width:10px;height:10px;border-radius:999px;background:var(--accent-green);box-shadow:0 0 0 0 rgba(16,185,129,.55);animation:pulseRing 2s ease-out infinite}
        .hero{display:grid;grid-template-columns:minmax(0,1.2fr) 320px;gap:14px;margin-top:14px}
        .card{border:1px solid var(--border);border-radius:18px;background:var(--bg-card);box-shadow:0 10px 30px rgba(15,23,42,.06)}
        .hero-main{padding:20px;display:grid;grid-template-columns:180px 1fr;gap:18px;align-items:center;overflow:hidden;position:relative}
        .hero-main:before,.hero-main:after{content:'';position:absolute;border-radius:999px;filter:blur(20px);opacity:.5;pointer-events:none}
        .hero-main:before{width:200px;height:200px;right:-70px;top:-70px;background:radial-gradient(circle,rgba(37,99,235,.14),transparent 60%)}
        .hero-main:after{width:160px;height:160px;left:42%;bottom:-60px;background:radial-gradient(circle,rgba(16,185,129,.12),transparent 58%)}
        .avatar-shell{position:relative;width:170px;height:170px;display:grid;place-items:center}.orb{position:absolute;border-radius:999px;filter:blur(10px)}.orb.a{width:120px;height:120px;background:radial-gradient(circle,rgba(37,99,235,.16),transparent 62%);transform:translate(-22px,-12px)}.orb.b{width:100px;height:100px;background:radial-gradient(circle,rgba(16,185,129,.16),transparent 60%);transform:translate(22px,20px)}
        .glass{position:relative;width:140px;height:140px;border-radius:34px;display:grid;place-items:center;background:linear-gradient(180deg,rgba(255,255,255,.74),rgba(245,249,255,.5));border:1px solid rgba(255,255,255,.65);box-shadow:0 24px 50px rgba(15,23,42,.1),inset 0 1px 0 rgba(255,255,255,.85);backdrop-filter:blur(16px)}
        .init{width:98px;height:98px;border-radius:999px;display:grid;place-items:center;font-size:2.3rem;font-weight:800;letter-spacing:-.06em;color:#fff;background:linear-gradient(135deg,var(--accent-blue),var(--accent-indigo) 52%,var(--accent-green));box-shadow:0 0 20px rgba(16,185,129,.18)}
        .hero-copy h2{margin:0;font-size:28px;line-height:1.05;letter-spacing:-.04em}.hero-copy p{margin:8px 0 0;color:var(--text-secondary)}
        .meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.meta span{display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--border);background:#fff;font-size:12px}
        .meta .d{width:8px;height:8px;border-radius:999px;background:var(--accent-green)}
        .trust{padding:18px;border-radius:18px;border:1px solid var(--border);background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(246,249,255,.96));display:grid;gap:10px;align-content:center}
        .trust .label{font-size:12px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin:0}
        .score{display:flex;align-items:center;gap:16px}.score .n{font-family:'JetBrains Mono',monospace;font-size:4rem;line-height:1;font-weight:800;letter-spacing:-.08em;background:linear-gradient(180deg,var(--accent-blue),var(--accent-green));-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 18px rgba(16,185,129,.12)}
        .score .bar{width:14px;height:110px;border-radius:999px;background:linear-gradient(180deg,rgba(37,99,235,.14),rgba(16,185,129,.12));padding:2px;display:flex;align-items:flex-end}.score .bar span{width:100%;border-radius:inherit;background:linear-gradient(180deg,var(--accent-blue),var(--accent-green));box-shadow:0 0 20px rgba(16,185,129,.18)}
        .tag{display:inline-flex;width:fit-content;padding:4px 10px;border-radius:999px;font-size:12px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#0f766e;background:rgba(16,185,129,.12)}
        .kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}.kpi{padding:16px;border-radius:16px;border:1px solid var(--border);background:#fff;display:grid;gap:12px}.kpi .top{display:flex;align-items:flex-start;gap:10px}.kpi .ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:rgba(37,99,235,.08);color:var(--accent-blue)}.kpi .v{display:block;margin-top:6px;font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:800;letter-spacing:-.04em}.kpi .bars{display:flex;align-items:end;gap:6px;min-height:40px}.kpi .bars span{flex:1;border-radius:999px 999px 8px 8px;background:linear-gradient(180deg,rgba(37,99,235,.95),rgba(37,99,235,.22))}
        .main{display:grid;grid-template-columns:1.1fr .9fr;gap:14px;margin-top:14px}.panel{padding:18px;border-radius:18px;border:1px solid var(--border);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06)}
        .head2{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}.head2 h3{margin:0;font-size:16px}.head2 p{margin:6px 0 0;font-size:13px;color:var(--text-secondary)}
        .workshop-list{display:grid;gap:10px}.workshop{padding:14px;border-radius:16px;border:1px solid var(--border);background:linear-gradient(180deg,#fff,#fbfdff);display:grid;grid-template-columns:1fr 90px 80px;gap:14px;align-items:center;cursor:pointer}.workshop.active{border-color:rgba(37,99,235,.45);box-shadow:0 12px 24px rgba(15,23,42,.08)}
        .workshop strong{font-size:14px}.muted{color:var(--text-secondary);font-size:12px}.mono{font-family:'JetBrains Mono',monospace}
        .risk{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;font-size:11px;font-family:'JetBrains Mono',monospace;font-weight:700}.risk.red{background:rgba(220,38,38,.1);color:#dc2626}.risk.orange{background:rgba(245,158,11,.12);color:#b45309}.risk.green{background:rgba(16,185,129,.12);color:#047857}
        .right{display:grid;gap:14px}.radar{height:270px}.mini{padding:14px;border-radius:16px;border:1px solid var(--border);background:#fff}.feed{display:grid;gap:10px}.feed-item{display:grid;grid-template-columns:54px 1fr;gap:10px;align-items:center;padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:#fff}.feed-time{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text-secondary)}.foot{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.history{padding:18px;border-radius:18px;border:1px solid var(--border);background:#fff}
        .history-list{display:grid;gap:12px}.history-row{padding:14px;border-radius:16px;border:1px solid var(--border);background:linear-gradient(180deg,#fff,#fbfdff)}
        .history-row strong{display:block}.history-meta{margin-top:6px;color:var(--text-secondary);font-size:12px}.history-bottom{margin-top:10px;display:flex;justify-content:space-between;align-items:center}
        @keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(16,185,129,.45)}70%{box-shadow:0 0 0 10px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}
        @keyframes pulseGlow{0%,100%{opacity:.8;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        @media (max-width:1280px){.shell{grid-template-columns:220px 1fr}.kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.main,.hero,.foot{grid-template-columns:1fr}}
        @media (max-width:1024px){.shell{grid-template-columns:1fr}.sidebar{min-height:auto}.hero-main{grid-template-columns:1fr}.kpi-grid{grid-template-columns:1fr}}
      `}</style>
      <div className="shell">
        <aside className="sidebar">
          <Link to="/demo" className="brand">
            <span className="brand-mark"><Shield size={18} strokeWidth={2.5} /></span>
            <span><strong>fraudia</strong><span>Detección de fraude en siniestros</span></span>
          </Link>
          <div className="group">
            <p className="label">Menú principal</p>
            {sidebarItems.filter((i) => i.group === 'main').map((item) => {
              const Icon = item.icon
              return <Link key={item.label} to={item.href} className={`item ${location.pathname === item.href ? 'active' : ''}`}><Icon size={18} /><span>{item.label}</span>{item.badge ? <span className="badge">{item.badge}</span> : null}</Link>
            })}
          </div>
          <div className="group">
            <p className="label">Entidades</p>
            {sidebarItems.filter((i) => i.group === 'entities').map((item) => {
              const Icon = item.icon
              const active = item.href === '/talleres' && location.pathname === '/talleres'
              return <Link key={item.label} to={item.href} className={`item ${active ? 'active' : ''}`}><Icon size={18} /><span>{item.label}</span></Link>
            })}
          </div>
          <div className="group">
            <p className="label">Herramientas</p>
            {sidebarItems.filter((i) => i.group === 'tools').map((item) => {
              const Icon = item.icon
              return <Link key={item.label} to={item.href} className="item"><Icon size={18} /><span>{item.label}</span></Link>
            })}
          </div>
          <div className="footer">
            <section className="assistant">
              <div className="assistant-top"><Sparkles className="sparkle" size={18} /><span>IA Assistant</span></div>
              <p>Consulta trazabilidad, relaciones y señales de riesgo de talleres.</p>
              <button className="btn" type="button" style={{ width: '100%', justifyContent: 'space-between' }}><span>Abrir chat</span><ArrowRight size={16} /></button>
            </section>
          </div>
        
          <Link to="/asistente" className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
            <div className="sac-icon"><ShieldCheck size={24} /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p>Asistente inteligente</p>
            </div>
          </Link>
        </aside>
        <div className="content">
          <header className="topbar">
            <div style={{ width: 220 }} />
            <div className="search"><Search className="i" size={16} /><input placeholder="Buscar taller, ciudad, proveedor..." /><span className="k">⌘ K</span></div>
            <div className="top-right">
              <button className="chip" type="button"><Bell size={18} /><span className="badge-dot">3</span></button>
              <button className="chip" type="button"><HeartPulse size={18} /></button>
              <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
              <div className="profile"><div><strong>Analista Senior</strong><span>Unidad Antifraude</span></div><div className="avatar">AS<span className="dot" /></div></div>
            </div>
          </header>
          <div className="scroll">
            <div className="head">
              <div><h1>Inteligencia de talleres</h1><p>Analítica operativa, trazabilidad y señales de confianza para red de reparación</p></div>
              <div className="head-actions"><span className="rt"><span className="pulse" />Monitoreo activo</span><button className="btn" type="button"><ChevronDown size={16} />Filtros</button><button className="btn primary" type="button">Exportar reporte</button></div>
            </div>
            <section className="hero">
              <div className="hero-main card">
                <div className="avatar-shell"><div className="orb a" /><div className="orb b" /><div className="glass"><div className="init">TX</div></div></div>
                <div className="hero-copy"><span className="rt"><CheckCircle2 size={14} />Red operativa verificada</span><h2>Taller Express</h2><p>Centro operativo monitoreado por coincidencias técnicas, tiempos y siniestros vinculados.</p><div className="meta"><span><CalendarDays size={14} />Operativo desde 2019</span><span><CarFront size={14} />24 vehículos vinculados</span><span><UserRound size={14} />31 asegurados recurrentes</span></div></div>
              </div>
              <div className="trust"><div className="label">Operational trust</div><div className="score"><div className="n">91</div><div className="bar"><span style={{ height: '91%' }} /></div></div><div className="tag">RIESGO CONTENIDO</div><p>Patrón estable con picos de revisión en ventanas cortas.</p></div>
            </section>
            <section className="kpi-grid">{kpis.map((kpi) => { const Icon = kpi.icon; return <article className="kpi" key={kpi.title}><div className="top"><span className="ico"><Icon size={16} /></span><div><p className="muted">{kpi.title}</p><strong className="v">{kpi.value}</strong></div></div><div className="muted">{kpi.delta}</div><div className="bars">{[16, 24, 32, 40, 28].map((bar, i) => <span key={i} style={{ height: `${bar + i * 8}%` }} />)}</div></article> })}</section>
            <section className="main">
              <article className="panel">
                <div className="head2"><div><h3>Workshop portfolio</h3><p>Historial operativo y relación con siniestros</p></div><div className="rt"><Gauge size={14} />Score dinámico</div></div>
                <div className="workshop-list">{workshopData.map((w) => <div key={w.name} className={`workshop ${selected.name === w.name ? 'active' : ''}`} onClick={() => setSelected(w)}><div><strong>{w.name}</strong><div className="muted">{w.city} · {w.vehicles} vehículos</div></div><div className="mono" style={{ fontSize: 18, fontWeight: 800, color: w.score >= 90 ? '#2563eb' : '#10b981' }}>{w.score}</div><div><span className={`risk ${w.risk === 'Crítico' ? 'red' : w.risk === 'Alto' ? 'orange' : 'green'}`}>{w.risk}</span></div></div>)}</div>
              </article>
              <div className="right">
                <article className="panel"><div className="head2"><div><h3>Perfil conductual</h3><p>Radar técnico de confianza</p></div></div><div className="radar"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData}><PolarGrid stroke="rgba(100,116,139,.18)" /><PolarAngleAxis dataKey="axis" tick={{ fill: '#64748b', fontSize: 12 }} /><PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false} /><Tooltip content={() => null} /><Radar dataKey="value" stroke="#2563eb" fill="rgba(37,99,235,.2)" fillOpacity={1} strokeWidth={2} /></RadarChart></ResponsiveContainer></div></article>
                <article className="mini"><div className="head2"><div><h3>Actividad IA</h3><p>Validaciones recientes</p></div></div><div className="feed">{activity.map((a) => <div key={a.time} className="feed-item"><div className="feed-time">{a.time}</div><div><span className={`badge-dot ${a.time === '09:42' ? 'green' : a.time === '09:44' ? 'blue' : 'indigo'}`} style={{ position: 'static', display: 'inline-block', marginRight: 8, width: 8, height: 8, border: 'none' }} />{a.text}</div></div>)}</div></article>
              </div>
            </section>
            <section className="foot">
              <article className="history"><div className="head2"><div><h3>Historial operativo</h3><p>Línea de eventos históricos</p></div></div><div className="history-list">{operationalNotes.map((note, i) => <div key={note} className="history-row"><strong>{['Inspección técnica', 'Reparación recurrente', 'Verificación documental'][i]}</strong><div className="history-meta">{note}</div><div className="history-bottom"><span className={`risk ${i === 2 ? 'green' : 'orange'}`}>{i === 2 ? 'Bajo' : 'Medio'}</span><span className="mono">{['2022','2023','2024'][i]}</span></div></div>)}</div></article>
              <article className="history"><div className="head2"><div><h3>Lectura de confianza</h3><p>Señales que suben o bajan el score</p></div></div><div className="history-list"><div className="history-row"><strong>{selected.name}</strong><div className="history-meta">Último score operativo: 91 / 100</div><div className="history-bottom"><span className="risk green">Confiable</span><span className="mono">836 → 842</span></div></div><div className="history-row"><strong>Observación IA</strong><div className="history-meta">Trazabilidad coherente y talleres consistentes</div></div></div></article>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
