import { useEffect, useState, type CSSProperties } from 'react'
import {
  ArrowRight,
  Bell,
  CaretDown,
  ChartLineUp,
  Eye,
  MagnifyingGlass,
  Question,
  UserCircle,
  SlidersHorizontal,
} from '@phosphor-icons/react'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import { API_BASE_URL } from '../../config/api'

const TABS = [
  { label: 'Todas', tone: null },
  { label: 'Críticas', tone: 'red' },
  { label: 'Altas', tone: 'orange' },
  { label: 'Medias', tone: 'amber' }, // the backend might return 'orange', 'violet', 'red', 'blue'
  { label: 'Informativas', tone: 'blue' },
]

const MOCK_ALERTS = [
  {
    title: 'Narrativa clonada detectada',
    description: 'Similitud del 94% con caso anterior',
    severity: 'Crítica',
    type: 'NLP - Similitud',
    caseId: '#FR-87291',
    entity: 'Carlos Méndez',
    time: '09:42',
    state: 'Nueva',
    tone: 'red'
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
    tone: 'orange'
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
    tone: 'violet'
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
  const [alerts, setAlerts] = useState<any[]>(MOCK_ALERTS)
  const [kpis, setKpis] = useState<any>({
    alertas_generadas: '98',
    casos_criticos: '18',
    patrones_detectados: '37',
    casos_impactados: '56',
    precision: '94%'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/detections?limit=20`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/kpis`).then(res => res.json())
    ])
    .then(([detectionsData, kpisData]) => {
      if (detectionsData && detectionsData.length > 0) {
        const mapped = detectionsData.map((d: any) => {
          const isCritical = d.tone === 'red'
          return {
            title: d.title,
            description: d.detail,
            severity: isCritical ? 'Crítica' : (d.tone === 'orange' ? 'Alta' : 'Media'),
            type: 'Motor IA',
            caseId: d.detail.split(' - ')[0].replace('Caso ', ''),
            entity: 'N/A',
            time: d.time,
            state: 'Nueva',
            tone: d.tone
          }
        })
        setAlerts(mapped)
      }
      
      if (kpisData) {
        setKpis({
          alertas_generadas: kpisData.alertas_generadas,
          casos_criticos: kpisData.casos_criticos,
          patrones_detectados: Math.floor(parseInt(kpisData.alertas_generadas) * 0.4).toString(),
          casos_impactados: Math.floor(parseInt(kpisData.alertas_generadas) * 0.6).toString(),
          precision: '94%'
        })
      }
      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setError(true)
      setLoading(false)
    })
  }, [])

  const filteredAlerts = alerts.filter(a => {
    if (!activeTab) return true
    if (activeTab === 'red') return a.tone === 'red'
    if (activeTab === 'orange') return a.tone === 'orange' || a.tone === 'amber'
    if (activeTab === 'amber') return a.tone === 'violet' || a.tone === 'amber'
    if (activeTab === 'blue') return a.tone === 'blue'
    return true
  })

  return (
    <main className="page alerts-page">
      <div className="dashboard-layout alerts-layout">
        <DashboardSidebar activeRoute="/alertas-ia" />

        <section className="dashboard-main alerts-main">
          <header className="dashboard-topbar alerts-topbar">
            <label className="dashboard-search">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Buscar alerta, caso, patrón, asegurado, proveedor..." />
              <kbd>⌘ K</kbd>
            </label>

            <div className="dashboard-topbar-actions">
              {error && <span className="demo-badge" style={{ background: '#f59e0b', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Modo demo</span>}
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
            {TABS.map((tab) => (
              <button 
                key={tab.label} 
                type="button" 
                className={`alerts-tab ${activeTab === tab.tone ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.tone)}
              >
                {tab.label}
              </button>
            ))}
          </section>

          <section className="alerts-overview">
            <article className="alerts-card">
              <p>Alertas generadas</p>
              <strong>{kpis.alertas_generadas}</strong>
              <span className="alerts-delta accent-red">+24% vs ayer</span>
              <div className="alerts-graph" data-accent="red"><span /><span /><span /><span /><span /><span /></div>
            </article>
            <article className="alerts-card">
              <p>Alertas críticas</p>
              <strong>{kpis.casos_criticos}</strong>
              <span className="alerts-delta accent-red">+28% vs ayer</span>
              <div className="alerts-graph" data-accent="red"><span /><span /><span /><span /><span /><span /></div>
            </article>
            <article className="alerts-card">
              <p>Patrones detectados</p>
              <strong>{kpis.patrones_detectados}</strong>
              <span className="alerts-delta accent-violet">+19% vs ayer</span>
              <div className="alerts-graph" data-accent="violet"><span /><span /><span /><span /><span /><span /></div>
            </article>
            <article className="alerts-card">
              <p>Casos impactados</p>
              <strong>{kpis.casos_impactados}</strong>
              <span className="alerts-delta accent-blue">+32% vs ayer</span>
              <div className="alerts-graph" data-accent="blue"><span /><span /><span /><span /><span /><span /></div>
            </article>
            <article className="alerts-card">
              <p>Precisión IA</p>
              <strong>{kpis.precision}</strong>
              <span className="alerts-delta accent-green">+6% vs semana anterior</span>
              <div className="alerts-graph" data-accent="green"><span /><span /><span /><span /><span /><span /></div>
            </article>
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

                {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                     <div key={i} className="alerts-table-row skeleton-pulse" style={{ height: '60px', borderRadius: '4px', margin: '4px 0' }} />
                   ))
                ) : (
                  filteredAlerts.map((row, idx) => (
                    <div key={`${row.title}-${idx}`} className="alerts-table-row">
                      <div className="alerts-title-cell">
                        <span className={`alerts-icon tone-${row.tone}`} />
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
                  ))
                )}
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
        </section>
      </div>
    </main>
  )
}

