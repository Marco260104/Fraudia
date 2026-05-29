import type { CSSProperties } from 'react'
import {
  ArrowRight,
  Bell,
  CaretDown,
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
  { label: 'Casos críticos', icon: WarningCircle, href: '/casos-criticos', badge: '18' },
  { label: 'Alertas IA', icon: Bell, href: '/alertas-ia', active: true },
  { label: 'Mapa de siniestros', icon: CirclesThree, href: '/mapa-siniestros' },
  { label: 'Narrativas similares', icon: ShieldCheck, href: '/narrativas-similares' },
]

const entityMenu = [
  { label: 'Vehículos', icon: FileText, href: '/vehiculos' },
  { label: 'Proveedores', icon: UsersThree, href: '/proveedores' },
  { label: 'Asegurados', icon: UserCircle, href: '/asegurados' },
]

const toolMenu = [
  { label: 'Calculadora de riesgo', icon: ShieldCheck, href: '/calculadora' },
  { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes' },
  { label: 'Configuración', icon: SlidersHorizontal },
]

const tabs = [
  { label: 'Todas', count: null, active: true },
  { label: 'Críticas', count: '18', tone: 'red' },
  { label: 'Altas', count: '27', tone: 'orange' },
  { label: 'Medias', count: '41', tone: 'amber' },
  { label: 'Informativas', count: '12', tone: 'blue' },
]

const overviewCards = [
  { title: 'Alertas generadas', value: '98', accent: 'red', delta: '+24% vs ayer' },
  { title: 'Alertas críticas', value: '18', accent: 'red', delta: '+28% vs ayer' },
  { title: 'Patrones detectados', value: '37', accent: 'violet', delta: '+19% vs ayer' },
  { title: 'Casos impactados', value: '56', accent: 'blue', delta: '+32% vs ayer' },
  { title: 'Precisión IA', value: '94%', accent: 'green', delta: '+6% vs semana anterior' },
]

const alerts = [
  {
    title: 'Narrativa clonada detectada',
    description: 'Similitud del 94% con caso anterior',
    severity: 'Crítica',
    type: 'NLP - Similitud',
    caseId: '#FR-87291',
    entity: 'Carlos Méndez',
    time: '09:42',
    state: 'Nueva',
  },
  {
    title: 'Taller con múltiples reclamos',
    description: '4 reclamos en 30 días',
    severity: 'Alta',
    type: 'Patrón de frecuencia',
    caseId: '#FR-76123',
    entity: 'Taller Express',
    time: '09:31',
    state: 'En revisión',
  },
  {
    title: 'Red colaborativa detectada',
    description: 'Conexión entre 5 asegurados',
    severity: 'Crítica',
    type: 'Análisis de redes',
    caseId: '#FR-65109',
    entity: 'Red de talleres',
    time: '09:18',
    state: 'Nueva',
  },
  {
    title: 'Geolocalización anómala',
    description: 'Ubicación fuera de patrón habitual',
    severity: 'Media',
    type: 'Geolocalización',
    caseId: '#FR-55867',
    entity: 'Laura Torres',
    time: '08:59',
    state: 'En revisión',
  },
  {
    title: 'Proveedor vinculado',
    description: 'Vínculo con casos de alto riesgo',
    severity: 'Alta',
    type: 'Vinculación',
    caseId: '#FR-44321',
    entity: 'Taller Express',
    time: '08:47',
    state: 'Investigando',
  },
  {
    title: 'Patrón temporal inusual',
    description: 'Actividad fuera del horario habitual',
    severity: 'Media',
    type: 'Análisis temporal',
    caseId: '#FR-33211',
    entity: 'Vehículo KIA',
    time: '08:35',
    state: 'Nueva',
  },
  {
    title: 'Monto inusual detectado',
    description: 'Monto 2.3x mayor al promedio',
    severity: 'Media',
    type: 'Análisis financiero',
    caseId: '#FR-22134',
    entity: 'Vanessa Ortiz',
    time: '08:21',
    state: 'En revisión',
  },
  {
    title: 'Múltiples asegurados vinculados',
    description: 'Mismo taller, diferentes asegurados',
    severity: 'Crítica',
    type: 'Análisis de redes',
    caseId: '#FR-11987',
    entity: 'Taller Express',
    time: '08:05',
    state: 'Investigando',
  },
]

const alertDetails = [
  { label: 'ID', value: 'AL-2025-00981' },
  { label: 'Caso relacionado', value: '#FR-87291' },
  { label: 'Asegurado', value: 'Carlos Méndez' },
  { label: 'Proveedor', value: 'Taller Express' },
  { label: 'Detectado', value: 'Hoy, 09:42 AM' },
  { label: 'Modelo IA', value: 'NLP Similarity v2.1' },
]

const keyIndicators = ['Texto muy similar', 'Mismos datos', 'Mismo taller', 'Mismo tipo de incidente']

const relatedNodes = [
  { label: 'Carlos M.', x: '18%', y: '24%', tone: 'green' },
  { label: 'Ana R.', x: '18%', y: '42%', tone: 'green' },
  { label: 'Luis G.', x: '18%', y: '60%', tone: 'green' },
  { label: 'Pedro G.', x: '18%', y: '78%', tone: 'green' },
  { label: 'KIA Sportage', x: '82%', y: '24%', tone: 'blue' },
  { label: 'Mazda 3', x: '82%', y: '42%', tone: 'blue' },
  { label: 'Hyundai Tucson', x: '82%', y: '60%', tone: 'blue' },
  { label: '#FR-87291', x: '50%', y: '88%', tone: 'violet' },
  { label: '#FR-65109', x: '35%', y: '88%', tone: 'violet' },
  { label: '#FR-44321', x: '65%', y: '88%', tone: 'violet' },
]

const models = [
  { name: 'NLP Similarity v2.1', detail: 'Análisis de similitud de textos', score: '95%', active: true },
  { name: 'Network Analysis v3.4', detail: 'Detección de redes colaborativas', score: '93%', active: true },
  { name: 'Behavioral Pattern v2.8', detail: 'Patrones de comportamiento', score: '92%', active: true },
  { name: 'Geo Analysis v1.6', detail: 'Análisis geoespacial', score: '89%', active: true },
]

const activity = [
  { time: '09:42', title: 'Nueva coincidencia narrativa detectada', note: 'Caso #FR-87291 - Similitud 94%', tone: 'red' },
  { time: '09:41', title: 'Taller vinculado a 4 reclamos', note: 'Taller Express - Patrón confirmado', tone: 'orange' },
  { time: '09:40', title: 'Riesgo elevado automáticamente', note: 'Caso #FR-76123 - Score 89%', tone: 'red' },
  { time: '09:38', title: 'Red colaborativa identificada', note: '5 asegurados conectados', tone: 'orange' },
  { time: '09:35', title: 'Alerta escalada a analista', note: 'Caso #FR-55867 - Geolocalización anómala', tone: 'violet' },
]

function toClassName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ArrowGlyph() {
  return <span className="arrow-glyph">→</span>
}

export function AlertsPage() {
  return (
    <main className="page alerts-page">
      <div className="dashboard-layout alerts-layout">
        <aside className="dashboard-sidebar alerts-sidebar">
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
            <p>Pregúntame sobre patrones, alertas o investigaciones.</p>
            <button type="button" className="dashboard-assistant-cta">
              <span>Abrir chat</span>
              <ArrowGlyph />
            </button>
          </section>
        </aside>

        <section className="dashboard-main alerts-main">
          <header className="dashboard-topbar alerts-topbar">
            <label className="dashboard-search">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Buscar alerta, caso, patrón, asegurado, proveedor..." />
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

          <section className="alerts-page-head">
            <div>
              <h1>Alertas IA</h1>
              <p>Detección inteligente de patrones y comportamientos sospechosos</p>
            </div>

            <div className="alerts-actions">
              <button type="button" className="alerts-range">
                Últimas 24 horas <CaretDown size={14} weight="bold" />
              </button>
              <button type="button" className="alerts-config">
                <SlidersHorizontal size={16} weight="bold" />
                Configurar alertas
              </button>
            </div>
          </section>

          <section className="alerts-tabs">
            {tabs.map((tab) => (
              <button key={tab.label} type="button" className={`alerts-tab ${tab.active ? 'is-active' : ''}`}>
                {tab.label}
                {tab.count ? <strong className={`tone-${tab.tone}`}>{tab.count}</strong> : null}
              </button>
            ))}
          </section>

          <section className="alerts-overview">
            {overviewCards.map((card) => (
              <article key={card.title} className="alerts-card">
                <p>{card.title}</p>
                <strong>{card.value}</strong>
                <span className={`alerts-delta accent-${card.accent}`}>{card.delta}</span>
                <div className="alerts-graph" data-accent={card.accent}>
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

          <section className="alerts-grid">
            <article className="alerts-panel alerts-table-panel">
              <div className="panel-head">
                <div>
                  <h2>Alertas detectadas por IA</h2>
                </div>
              </div>

              <div className="alerts-table">
                <div className="alerts-table-head">
                  <span>Alerta</span>
                  <span>Severidad</span>
                  <span>Tipo de detección</span>
                  <span>Caso relacionado</span>
                  <span>Entidad</span>
                  <span>Detectado</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>

                {alerts.map((row) => (
                  <div key={`${row.title}-${row.caseId}`} className="alerts-table-row">
                    <div className="alerts-title-cell">
                      <span className={`alerts-icon tone-${toClassName(row.severity)}`} />
                      <div>
                        <strong>{row.title}</strong>
                        <p>{row.description}</p>
                      </div>
                    </div>
                    <span className={`alerts-badge severity-${toClassName(row.severity)}`}>{row.severity}</span>
                    <span>{row.type}</span>
                    <strong>{row.caseId}</strong>
                    <span>{row.entity}</span>
                    <span>{row.time}</span>
                    <span className={`alerts-state state-${toClassName(row.state)}`}>{row.state}</span>
                    <div className="alerts-actions-row">
                      <button type="button">
                        <Eye size={16} weight="bold" />
                      </button>
                      <button type="button">
                        <ChartLineUp size={16} weight="bold" />
                      </button>
                      <button type="button">
                        <ArrowRight size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="alerts-pagination">
                <span>Mostrando 1 a 8 de 98 alertas</span>
                <div className="pagination-controls">
                  <button type="button">‹</button>
                  <button type="button" className="is-active">
                    1
                  </button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <span>…</span>
                  <button type="button">13</button>
                  <button type="button">›</button>
                </div>
              </div>
            </article>

            <aside className="alerts-rail">
              <article className="alerts-panel selected-alert-panel">
                <p className="panel-kicker">Alerta seleccionada</p>
                <div className="selected-alert-head">
                  <span className="selected-level">CRÍTICA</span>
                  <span className="selected-id">ID: {alertDetails[0].value}</span>
                </div>
                <h3>Narrativa clonada detectada</h3>
                <p className="selected-subtitle">Alta similitud con caso anterior</p>

                <div className="selected-score-row">
                  <div className="selected-gauge">
                    <span className="selected-gauge-track" />
                    <span className="selected-gauge-fill" />
                  </div>
                  <div className="selected-score-copy">
                    <strong>94%</strong>
                    <span>Similitud</span>
                  </div>
                </div>

                <dl className="alert-detail-list">
                  {alertDetails.slice(1).map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="indicators-block">
                  <h4>Indicadores clave</h4>
                  <div className="indicator-tags">
                    {keyIndicators.map((indicator) => (
                      <span key={indicator}>{indicator}</span>
                    ))}
                  </div>
                </div>

                <button type="button" className="btn btn-primary alerts-primary">
                  Ver análisis completo
                </button>

                <div className="alerts-secondary-actions">
                  <button type="button" className="btn btn-secondary">
                    Marcar como revisada
                  </button>
                  <button type="button" className="btn btn-secondary danger-outline">
                    Escalar alerta <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
              </article>

              <article className="alerts-panel pattern-panel">
                <div className="panel-head">
                  <div>
                    <h2>Patrón detectado</h2>
                  </div>
                </div>

                <div className="pattern-board">
                  <div className="pattern-core">
                    <strong>Taller Express</strong>
                  </div>
                  {relatedNodes.map((node) => (
                    <div
                      key={node.label}
                      className={`pattern-node tone-${node.tone}`}
                      style={{ left: node.x, top: node.y } as CSSProperties}
                    >
                      <span />
                      <strong>{node.label}</strong>
                    </div>
                  ))}
                </div>

                <div className="pattern-legend">
                  <span className="legend-item tone-green">Asegurados</span>
                  <span className="legend-item tone-orange">Proveedores</span>
                  <span className="legend-item tone-blue">Vehículos</span>
                  <span className="legend-item tone-violet">Casos</span>
                </div>
              </article>

              <article className="alerts-panel models-panel">
                <div className="panel-head">
                  <div>
                    <h2>Modelos IA activos</h2>
                  </div>
                </div>

                <div className="models-list">
                  {models.map((model) => (
                    <div key={model.name} className="model-row">
                      <span className="model-icon" />
                      <div>
                        <strong>{model.name}</strong>
                        <p>{model.detail}</p>
                      </div>
                      <strong className="model-score">{model.score}</strong>
                      <span className={`model-state ${model.active ? 'is-active' : ''}`}>Activo</span>
                    </div>
                  ))}
                </div>

                <a href="#" className="text-link">
                  Ver rendimiento de modelos <ArrowGlyph />
                </a>
              </article>
            </aside>
          </section>

          <section className="alerts-footer-grid">
            <article className="alerts-panel map-panel">
              <div className="panel-head">
                <div>
                  <h2>Mapa de alertas activas</h2>
                </div>
              </div>
              <div className="alerts-map">
                <span className="map-heat heat-red" />
                <span className="map-heat heat-orange" />
                <span className="map-heat heat-blue" />
                <span className="map-badge badge-3">3</span>
                <span className="map-badge badge-5">5</span>
                <span className="map-badge badge-7">7</span>
                <span className="map-badge badge-12">12</span>
                <div className="map-controls">
                  <button type="button">+</button>
                  <button type="button">-</button>
                </div>
                <div className="map-legend">
                  <span>Bajo</span>
                  <div className="map-gradient" />
                  <span>Alto</span>
                </div>
              </div>
            </article>

            <article className="alerts-panel activity-panel">
              <div className="panel-head">
                <div>
                  <h2>Actividad IA en tiempo real</h2>
                </div>
              </div>

              <div className="activity-list">
                {activity.map((item) => (
                  <div key={`${item.time}-${item.title}`} className={`activity-row tone-${item.tone}`}>
                    <span className="activity-icon" />
                    <strong>{item.time}</strong>
                    <div>
                      <p>{item.title}</p>
                      <span>{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#" className="text-link">
                Ver todas las actividades <ArrowGlyph />
              </a>
            </article>
          </section>
        </section>
      </div>
    </main>
  )
}

