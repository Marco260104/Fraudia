import type { CSSProperties } from 'react'
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
  UserCircle,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react'

const mainMenu = [
  { label: 'Centro de inteligencia', icon: House, href: '/demo' },
  { label: 'Casos críticos', icon: WarningCircle, href: '/casos-criticos', active: true, badge: '18' },
  { label: 'Alertas IA', icon: Bell, href: '/demo' },
  { label: 'Mapa de siniestros', icon: CirclesThree, href: '/demo' },
  { label: 'Narrativas similares', icon: ShieldCheck, href: '/demo' },
]

const entityMenu = [
  { label: 'Vehículos', icon: FileText },
  { label: 'Proveedores', icon: UsersThree },
  { label: 'Asegurados', icon: UserCircle },
]

const toolMenu = [
  { label: 'Calculadora de riesgo', icon: ChartLineUp },
  { label: 'Reportes', icon: FileText },
  { label: 'Configuración', icon: SlidersHorizontal },
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
    amount: '$28,450',
    score: '96%',
    state: 'Escalado',
  },
  {
    caseId: '#FR-76123',
    insured: 'Ana Rodríguez',
    risk: 'ALTO',
    alert: 'Taller sospechoso',
    amount: '$15,230',
    score: '89%',
    state: 'Investigación IA',
  },
  {
    caseId: '#FR-65109',
    insured: 'Pedro Gómez',
    risk: 'ALTO',
    alert: 'Patrón recurrente',
    amount: '$9,890',
    score: '82%',
    state: 'En revisión',
  },
  {
    caseId: '#FR-55867',
    insured: 'Laura Torres',
    risk: 'MEDIO',
    alert: 'Red colaborativa',
    amount: '$6,420',
    score: '71%',
    state: 'Investigación IA',
  },
  {
    caseId: '#FR-44321',
    insured: 'Miguel Ramírez',
    risk: 'ALTO',
    alert: 'Geolocalización anómala',
    amount: '$3,210',
    score: '78%',
    state: 'Escalado',
  },
  {
    caseId: '#FR-33211',
    insured: 'Jorge Velásquez',
    risk: 'MEDIO',
    alert: 'Narrativa duplicada',
    amount: '$7,890',
    score: '65%',
    state: 'En revisión',
  },
  {
    caseId: '#FR-22134',
    insured: 'Vanessa Ortiz',
    risk: 'ALTO',
    alert: 'Taller sospechoso',
    amount: '$12,300',
    score: '87%',
    state: 'Investigación IA',
  },
  {
    caseId: '#FR-11987',
    insured: 'Ricardo López',
    risk: 'CRÍTICO',
    alert: 'Múltiples reclamos',
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
                  <a key={item.label} href="/demo" className="dashboard-nav-item">
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
                  <a key={item.label} href="/demo" className="dashboard-nav-item">
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
            {overviewCards.map((card) => (
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

                {criticalCases.map((row) => (
                  <div key={row.caseId} className="critical-table-row">
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
                      <button type="button">
                        <Eye size={16} weight="bold" />
                      </button>
                      <button type="button">
                        <FileText size={16} weight="bold" />
                      </button>
                      <button type="button">
                        <ClockIcon />
                      </button>
                      <button type="button">
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
                <div className="active-case-head">
                  <div>
                    <strong>#FR-87291</strong>
                    <span className="risk-pill danger">CRÍTICO</span>
                  </div>
                  <div className="critical-gauge">
                    <span className="critical-gauge-track" />
                    <span className="critical-gauge-fill" />
                    <span className="critical-gauge-needle" />
                  </div>
                </div>

                <div className="active-score critical-score">
                  <strong>96%</strong>
                  <span>RIESGO CRÍTICO</span>
                </div>

                <dl className="case-details">
                  <div>
                    <dt>Asegurado</dt>
                    <dd>Carlos Méndez</dd>
                  </div>
                  <div>
                    <dt>Proveedor</dt>
                    <dd>Taller Express</dd>
                  </div>
                  <div>
                    <dt>Ciudad</dt>
                    <dd>Medellín, Antioquia</dd>
                  </div>
                  <div>
                    <dt>Vehículo</dt>
                    <dd>KIA Sportage 2021</dd>
                  </div>
                  <div>
                    <dt>Monto reclamado</dt>
                    <dd>$28,450</dd>
                  </div>
                  <div>
                    <dt>Fecha del evento</dt>
                    <dd>28/05/2025</dd>
                  </div>
                </dl>

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
                    {timeline.map((item) => (
                      <div key={item.time} className="timeline-row">
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
                <span className="map-badge badge-3">3</span>
                <span className="map-badge badge-5">5</span>
                <span className="map-badge badge-7">7</span>
                <span className="map-badge badge-12">12</span>
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
                <div className="detection-item tone-red">
                  <strong>09:42</strong>
                  <div>
                    <p>Nueva coincidencia narrativa detectada</p>
                    <span>Caso #FR-87291 - Similitud 94%</span>
                  </div>
                </div>
                <div className="detection-item tone-orange">
                  <strong>09:44</strong>
                  <div>
                    <p>Taller vinculado a 4 reclamos</p>
                    <span>Taller Express - Red detectada</span>
                  </div>
                </div>
                <div className="detection-item tone-red">
                  <strong>09:45</strong>
                  <div>
                    <p>Riesgo elevado automáticamente</p>
                    <span>Caso #FR-76123 - Score 89%</span>
                  </div>
                </div>
                <div className="detection-item tone-orange">
                  <strong>09:47</strong>
                  <div>
                    <p>Geolocalización sospechosa identificada</p>
                    <span>Caso #FR-65109 - Patrón inusual</span>
                  </div>
                </div>
                <div className="detection-item tone-violet">
                  <strong>09:48</strong>
                  <div>
                    <p>Caso escalado por IA</p>
                    <span>Caso #FR-87291 - Escalado automático</span>
                  </div>
                </div>
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
