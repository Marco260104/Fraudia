import { useEffect, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  Bell,
  ChartLineUp,
  CirclesThree,
  Eye,
  FileText,
  House,
  MagnifyingGlass,
  Question,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  UserCircle,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react'

const mainMenu = [
  { label: 'Centro de inteligencia', icon: House, href: '/demo' },
  { label: 'Casos críticos', icon: WarningCircle, href: '/casos-criticos', active: true, badge: '18' },
  { label: 'Alertas IA', icon: Bell, href: '/alertas-ia' },
  { label: 'Mapa de siniestros', icon: CirclesThree, href: '/mapa-siniestros' },
  { label: 'Narrativas similares', icon: ShieldCheck, href: '/narrativas-similares' },
]

const entityMenu = [
  { label: 'Vehículos', icon: FileText, href: '/vehiculos' },
  { label: 'Proveedores', icon: UsersThree, href: '/proveedores' },
  { label: 'Asegurados', icon: UserCircle, href: '/asegurados' },
  { label: 'Talleres', icon: Stethoscope, href: '/talleres' },
]

const toolMenu = [
  { label: 'Calculadora de riesgo', icon: ChartLineUp, href: '/calculadora' },
  { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes' },
  { label: 'Configuración', icon: SlidersHorizontal, href: '/configuracion' },
]

const overviewCards = [
  { title: 'Casos críticos', value: '18', accent: 'red', delta: '+12% vs ayer' },
  { title: 'Monto bajo investigación', value: '$4.8M', accent: 'orange', delta: '+820K esta semana' },
  { title: 'Redes sospechosas detectadas', value: '32', accent: 'blue', delta: 'Conexiones activas' },
  { title: 'Riesgo promedio', value: '91%', accent: 'red', delta: 'Nivel severo' },
  { title: 'Casos escalados', value: '7', accent: 'violet', delta: '+75% vs ayer' },
]

const alertTags = ['Narrativa clonada', 'Proveedor vinculado', 'Múltiples reclamos']

const criticalCases = [
  {
    caseId: '#FR-87291',
    insured: 'Carlos Méndez',
    risk: 'CRÍTICO',
    alert: 'Narrativa duplicada',
    provider: 'Taller Express',
    city: 'Medellín, Antioquia',
    vehicle: 'KIA Sportage 2021',
    date: '28/05/2025',
    amount: '$28,450',
    score: '96%',
    state: 'Escalado',
  },
  {
    caseId: '#FR-76123',
    insured: 'Ana Rodríguez',
    risk: 'ALTO',
    alert: 'Taller sospechoso',
    provider: 'AutoMecánica L&R',
    city: 'Envigado, Antioquia',
    vehicle: 'Mazda CX-5 2020',
    date: '28/05/2025',
    amount: '$15,230',
    score: '89%',
    state: 'Investigación IA',
  },
  {
    caseId: '#FR-65109',
    insured: 'Pedro Gómez',
    risk: 'ALTO',
    alert: 'Patrón recurrente',
    provider: 'Car Center Pro',
    city: 'Bello, Antioquia',
    vehicle: 'Hyundai Tucson 2022',
    date: '27/05/2025',
    amount: '$9,890',
    score: '82%',
    state: 'En revisión',
  },
  {
    caseId: '#FR-55867',
    insured: 'Laura Torres',
    risk: 'MEDIO',
    alert: 'Red colaborativa',
    provider: 'Taller La 80',
    city: 'Itagüí, Antioquia',
    vehicle: 'Chevrolet Spark 2019',
    date: '26/05/2025',
    amount: '$6,420',
    score: '71%',
    state: 'Investigación IA',
  },
  {
    caseId: '#FR-44321',
    insured: 'Miguel Ramírez',
    risk: 'ALTO',
    alert: 'Geolocalización anómala',
    provider: 'MotorFix',
    city: 'Sabaneta, Antioquia',
    vehicle: 'Nissan Versa 2021',
    date: '26/05/2025',
    amount: '$3,210',
    score: '78%',
    state: 'Escalado',
  },
  {
    caseId: '#FR-33211',
    insured: 'Jorge Velásquez',
    risk: 'MEDIO',
    alert: 'Narrativa duplicada',
    provider: 'Taller Express',
    city: 'Medellín, Antioquia',
    vehicle: 'Renault Duster 2020',
    date: '25/05/2025',
    amount: '$7,890',
    score: '65%',
    state: 'En revisión',
  },
  {
    caseId: '#FR-22134',
    insured: 'Vanessa Ortiz',
    risk: 'ALTO',
    alert: 'Taller sospechoso',
    provider: 'AutoMecánica L&R',
    city: 'Medellín, Antioquia',
    vehicle: 'Toyota Corolla 2022',
    date: '25/05/2025',
    amount: '$12,300',
    score: '87%',
    state: 'Investigación IA',
  },
  {
    caseId: '#FR-11987',
    insured: 'Ricardo López',
    risk: 'CRÍTICO',
    alert: 'Múltiples reclamos',
    provider: 'Taller Express',
    city: 'Itagüí, Antioquia',
    vehicle: 'Kia Picanto 2018',
    date: '24/05/2025',
    amount: '$31,450',
    score: '94%',
    state: 'Bloqueado',
  },
]

const timeline = [
  { time: '09:14', label: 'Reclamo generado', tone: 'green' },
  { time: '09:15', label: 'Validación IA iniciada', tone: 'blue' },
  { time: '09:16', label: 'Coincidencia encontrada', tone: 'orange' },
  { time: '09:17', label: 'Red sospechosa detectada', tone: 'red' },
  { time: '09:18', label: 'Escalado automático', tone: 'red' },
]

const relatedNodes = [
  { label: '4 Reclamos', x: '55%', y: '22%', tone: 'violet' },
  { label: '2 Vehículos', x: '83%', y: '50%', tone: 'blue' },
  { label: '3 Asegurados', x: '52%', y: '84%', tone: 'green' },
  { label: '1 Proveedor', x: '23%', y: '48%', tone: 'orange' },
]

function ArrowGlyph() {
  return <span className="arrow-glyph">→</span>
}

function ScoreBar({ value }: { value: string }) {
  return <span className="critical-score-bar" style={{ width: value }} />
}

function toClassName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function CriticalCasesPage() {
  const defaultDetections = [
    { time: '09:42', title: 'Nueva coincidencia narrativa detectada', detail: 'Caso #FR-87291 - Similitud 94%', tone: 'red' },
    { time: '09:44', title: 'Taller vinculado a 4 reclamos', detail: 'Taller Express - Red detectada', tone: 'orange' },
    { time: '09:45', title: 'Riesgo elevado automáticamente', detail: 'Caso #FR-76123 - Score 89%', tone: 'red' },
    { time: '09:47', title: 'Geolocalización sospechosa identificada', detail: 'Caso #FR-65109 - Patrón inusual', tone: 'orange' },
    { time: '09:48', title: 'Caso escalado por IA', detail: 'Caso #FR-87291 - Escalado automático', tone: 'violet' },
  ]

  const defaultMapPins = [
    { label: '3', x: '48%', y: '8%', tone: 'red', sucursal: 'Quito' },
    { label: '5', x: '26%', y: '62%', tone: 'red', sucursal: 'Portoviejo' },
    { label: '7', x: '73%', y: '23%', tone: 'red', sucursal: 'Guayaquil' },
    { label: '12', x: '55%', y: '44%', tone: 'red', sucursal: 'Cuenca' },
  ]

  const [cases, setCases] = useState(criticalCases)
  const [kpiData, setKpiData] = useState(overviewCards)
  const [activeCase, setActiveCase] = useState<(typeof criticalCases)[number]>(criticalCases[0])
  const [detections, setDetections] = useState(defaultDetections)
  const [pins, setPins] = useState(defaultMapPins)
  const [timelineData, setTimelineData] = useState(timeline)

  useEffect(() => {
    // 1. Cargar KPIs reales de la base de datos
    fetch('http://localhost:8000/api/kpis')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setKpiData([
            { title: 'Casos críticos', value: data.casos_criticos, accent: 'red', delta: '+12% vs ayer' },
            { title: 'Monto bajo investigación', value: data.monto_reclamado, accent: 'orange', delta: 'Suma total en BD' },
            { title: 'Redes sospechosas detectadas', value: '32', accent: 'blue', delta: 'Conexiones activas' },
            { title: 'Riesgo promedio', value: data.riesgo_promedio, accent: 'red', delta: 'Nivel severo' },
            { title: 'Casos escalados', value: '7', accent: 'violet', delta: '+75% vs ayer' },
          ])
        }
      })
      .catch(err => console.log('Usando fallback para KPIs (Servidor API apagado):', err))

    // 2. Cargar casos críticos reales de la base de datos
    fetch('http://localhost:8000/api/cases/critical')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCases(data)
          setActiveCase(data[0])
        }
      })
      .catch(err => console.log('Usando fallback para Casos Críticos (Servidor API apagado):', err))

    // 3. Cargar detecciones en tiempo real de la base de datos
    fetch('http://localhost:8000/api/detections')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDetections(data)
        }
      })
      .catch(err => console.log('Usando fallback para Detecciones (Servidor API apagado):', err))

    // 4. Cargar pines del mapa de la base de datos
    fetch('http://localhost:8000/api/map-claims')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPins(data)
        }
      })
      .catch(err => console.log('Usando fallback para Pines del Mapa (Servidor API apagado):', err))
  }, [])

  // 5. Escuchar cambios de activeCase para cargar su timeline dinámico
  useEffect(() => {
    if (!activeCase) return

    fetch(`http://localhost:8000/api/cases/${activeCase.caseId}/timeline`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTimelineData(data)
        }
      })
      .catch(err => {
        console.log(`Usando fallback de timeline para ${activeCase.caseId}:`, err)
        setTimelineData([
          { time: '09:14', label: 'Reclamo generado', tone: 'green' },
          { time: '09:15', label: 'Validación IA iniciada', tone: 'blue' },
          { time: '09:16', label: activeCase.risk === 'CRÍTICO' ? 'Riesgo Crítico Detectado' : 'Validación completada', tone: activeCase.risk === 'CRÍTICO' ? 'red' : 'orange' },
          { time: '09:17', label: activeCase.alert, tone: 'red' },
          { time: '09:18', label: activeCase.state, tone: 'violet' },
        ])
      })
  }, [activeCase])

  return (
    <main className="page critical-page">
      <div className="dashboard-layout critical-layout">
        <aside className="dashboard-sidebar critical-sidebar">
          <button type="button" className="dashboard-brand">
            <img src="/assets/Logo.png" alt="Fraudia" />
            <span>fraudia</span>
          </button>

          <div className="dashboard-nav-group">
            <p className="dashboard-nav-label">Menú principal</p>
            <nav className="dashboard-nav">
              {mainMenu.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`dashboard-nav-item ${item.active ? 'is-active' : ''}`}
                  >
                    <Icon size={18} weight="bold" />
                    <span>{item.label}</span>
                    {item.badge ? <strong>{item.badge}</strong> : null}
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="dashboard-nav-group">
            <p className="dashboard-nav-label">Entidades</p>
            <nav className="dashboard-nav">
              {entityMenu.map((item) => {
                const Icon = item.icon

                return (
                  <a key={item.label} href={item.href} className="dashboard-nav-item">
                    <Icon size={18} weight="bold" />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="dashboard-nav-group">
            <p className="dashboard-nav-label">Herramientas</p>
            <nav className="dashboard-nav">
              {toolMenu.map((item) => {
                const Icon = item.icon

                return (
                  <a key={item.label} href={item.href} className="dashboard-nav-item">
                    <Icon size={18} weight="bold" />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>

          <section className="dashboard-assistant">
            <div className="dashboard-assistant-head">
              <ShieldCheck size={20} weight="bold" />
              <strong>IA Assistant</strong>
            </div>
            <p>Pregúntame sobre patrones, redes o análisis forense.</p>
            <button type="button" className="dashboard-assistant-cta">
              <span>Abrir chat</span>
              <ArrowGlyph />
            </button>
          </section>
        </aside>

        <section className="dashboard-main critical-main">
          <header className="dashboard-topbar critical-topbar">
            <label className="dashboard-search">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Buscar caso, asegurado, vehículo, proveedor..." />
              <kbd>⌘ K</kbd>
            </label>

            <div className="dashboard-topbar-actions">
              <button type="button" className="icon-button">
                <Bell size={18} weight="bold" />
                <span className="topbar-badge">8</span>
              </button>
              <button type="button" className="icon-button">
                <Question size={18} weight="bold" />
              </button>
              <button type="button" className="profile-chip">
                <UserCircle size={24} weight="bold" />
                <span>
                  <strong>Analista Senior</strong>
                  <small>Unidad Antifraude</small>
                </span>
              </button>
              <button type="button" className="profile-avatar">
                AS
                <span />
              </button>
            </div>
          </header>

          <section className="critical-page-head">
            <div>
              <h1>Casos críticos</h1>
              <p>Monitoreo avanzado de siniestros de alto riesgo</p>
            </div>

            <div className="critical-threat">
              <span className="threat-dot" />
              <strong>Threat Level</strong>
              <b>SEVERO</b>
            </div>
          </section>

          <section className="critical-tabs">
            <button type="button" className="critical-tab is-active">
              Todos
            </button>
            <button type="button" className="critical-tab">
              Alto riesgo
            </button>
            <button type="button" className="critical-tab">
              Escalados
            </button>
            <button type="button" className="critical-tab">
              Redes detectadas
            </button>

            <div className="critical-status">
              <span className="status-dot" />
              <strong>18</strong>
              <span>casos activos</span>
            </div>

            <button type="button" className="btn btn-primary critical-new">
              <span>+</span>
              Nuevo análisis
            </button>
          </section>

          <section className="critical-overview">
            {kpiData.map((card) => (
              <article key={card.title} className="critical-overview-card">
                <p>{card.title}</p>
                <strong>{card.value}</strong>
                <span className={`critical-delta accent-${card.accent}`}>{card.delta}</span>
                <div className="critical-graph" data-accent={card.accent}>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            ))}
          </section>

          <section className="critical-grid">
            <article className="critical-panel critical-table-panel">
              <div className="panel-head">
                <div>
                  <h2>Centro forense IA</h2>
                </div>
              </div>

              <div className="critical-table">
                <div className="critical-table-head">
                  <span>Caso</span>
                  <span>Asegurado</span>
                  <span>Riesgo</span>
                  <span>Tipo de alerta</span>
                  <span>Monto</span>
                  <span>Score IA</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>

                {cases.map((row) => (
                  <div 
                    key={row.caseId} 
                    className={`critical-table-row ${activeCase && activeCase.caseId === row.caseId ? 'is-active-row' : ''}`}
                    onClick={() => setActiveCase(row)}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{row.caseId}</strong>
                    <span>{row.insured}</span>
                    <span className={`critical-badge risk-${toClassName(row.risk)}`}>{row.risk}</span>
                    <span>{row.alert}</span>
                    <span>{row.amount}</span>
                    <div className="critical-score-cell">
                      <ScoreBar value={row.score} />
                      <strong>{row.score}</strong>
                    </div>
                    <span className={`critical-state state-${toClassName(row.state)}`}>
                      {row.state}
                    </span>
                    <div className="critical-actions">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setActiveCase(row); }}>
                        <Eye size={16} weight="bold" />
                      </button>
                      <button type="button" onClick={(e) => e.stopPropagation()}>
                        <FileText size={16} weight="bold" />
                      </button>
                      <button type="button" onClick={(e) => e.stopPropagation()}>
                        <ClockIcon />
                      </button>
                      <button type="button" onClick={(e) => e.stopPropagation()}>
                        <ArrowRight size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <aside className="critical-rail">
              <article className="critical-panel active-case-panel">
                <p className="panel-kicker">Caso activo</p>
                {activeCase && (
                  <>
                    <div className="active-case-head">
                      <div>
                        <strong>{activeCase.caseId}</strong>
                        <span className={`risk-pill ${activeCase.risk === 'CRÍTICO' ? 'danger' : activeCase.risk === 'ALTO' ? 'warning' : 'info'}`}>
                          {activeCase.risk}
                        </span>
                      </div>
                      <div className="critical-gauge">
                        <span className="critical-gauge-track" />
                        <span 
                          className="critical-gauge-fill" 
                          style={{ transform: `rotate(${(parseFloat(activeCase.score) / 100) * 180 - 90}deg)` } as CSSProperties} 
                        />
                        <span className="critical-gauge-needle" />
                      </div>
                    </div>

                    <div className="active-score critical-score">
                      <strong>{activeCase.score}</strong>
                      <span>RIESGO {activeCase.risk}</span>
                    </div>

                    <dl className="case-details">
                      <div>
                        <dt>Asegurado</dt>
                        <dd>{activeCase.insured}</dd>
                      </div>
                      <div>
                        <dt>Proveedor</dt>
                        <dd>{activeCase.provider || 'Taller Express'}</dd>
                      </div>
                      <div>
                        <dt>Ciudad</dt>
                        <dd>{activeCase.city || 'Quito, Pichincha'}</dd>
                      </div>
                      <div>
                        <dt>Vehículo</dt>
                        <dd>{activeCase.vehicle || 'KIA Sportage 2021'}</dd>
                      </div>
                      <div>
                        <dt>Monto reclamado</dt>
                        <dd>{activeCase.amount}</dd>
                      </div>
                      <div>
                        <dt>Fecha del evento</dt>
                        <dd>{activeCase.date || '28/05/2025'}</dd>
                      </div>
                    </dl>
                  </>
                )}

                <div className="case-actions">
                  <button type="button" className="btn btn-primary case-primary">
                    Ver análisis completo
                  </button>
                  <div className="critical-secondary-actions">
                    <button type="button" className="btn btn-secondary case-secondary">
                      Bloquear proceso
                    </button>
                    <button type="button" className="btn btn-secondary case-secondary">
                      Escalar caso
                    </button>
                  </div>
                </div>
              </article>

              <article className="critical-panel alerts-panel">
                <div className="panel-head">
                  <div>
                    <h2>Alertas IA</h2>
                  </div>
                </div>

                <div className="alert-tags">
                  {alertTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>

              <div className="critical-rail-grid">
                <article className="critical-panel timeline-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Timeline forense</h2>
                    </div>
                  </div>

                  <div className="timeline-list">
                    {timelineData.map((item, idx) => (
                      <div key={idx} className="timeline-row">
                        <span className={`timeline-dot tone-${item.tone}`} />
                        <strong>{item.time}</strong>
                        <p>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="critical-panel network-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Red sospechosa</h2>
                    </div>
                  </div>

                  <div className="network-board">
                    <div className="network-core">
                      <strong>Taller Express</strong>
                    </div>
                    {relatedNodes.map((node) => (
                      <div
                        key={node.label}
                        className={`network-node tone-${node.tone}`}
                        style={{ left: node.x, top: node.y } as CSSProperties}
                      >
                        <span />
                        <strong>{node.label}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </aside>
          </section>

          <section className="critical-footer-grid">
            <article className="critical-panel map-panel">
              <div className="panel-head">
                <div>
                  <h2>Mapa de incidentes críticos</h2>
                </div>
              </div>
              <div className="critical-map">
                <span className="map-heat heat-red" />
                <span className="map-heat heat-orange" />
                <span className="map-heat heat-yellow" />
                {pins.map((pin) => (
                  <span
                    key={pin.sucursal}
                    className="map-badge"
                    style={{
                      left: pin.x,
                      top: pin.y,
                      backgroundColor: pin.tone === 'red' ? '#ef4444' : pin.tone === 'orange' ? '#f97316' : '#3b82f6',
                      width: parseInt(pin.label) > 12 ? '42px' : '34px',
                      height: parseInt(pin.label) > 12 ? '42px' : '34px'
                    } as CSSProperties}
                  >
                    {pin.label}
                  </span>
                ))}
                <div className="map-controls">
                  <button type="button">+</button>
                  <button type="button">-</button>
                </div>
                <div className="map-legend">
                  <span>Bajo riesgo</span>
                  <div className="map-gradient" />
                  <span>Alto riesgo</span>
                </div>
              </div>
            </article>

            <article className="critical-panel detections-panel">
              <div className="panel-head">
                <div>
                  <h2>Detecciones IA en tiempo real</h2>
                </div>
              </div>

              <div className="detections-list">
                {detections.map((item, idx) => (
                  <div key={idx} className={`detection-item tone-${item.tone}`}>
                    <strong>{item.time}</strong>
                    <div>
                      <p>{item.title}</p>
                      <span>{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#" className="text-link">
                Ver todas las detecciones <ArrowGlyph />
              </a>
            </article>
          </section>
        </section>
      </div>
    </main>
  )
}

function ClockIcon() {
  return <span className="clock-icon">◔</span>
}

