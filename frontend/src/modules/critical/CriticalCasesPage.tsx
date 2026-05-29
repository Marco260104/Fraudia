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
  X
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import { API_BASE_URL } from '../../config/api'

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
    city: 'Guayaquil, Guayas',
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
    city: 'Quito, Pichincha',
    vehicle: 'Mazda CX-5 2020',
    date: '28/05/2025',
    amount: '$15,230',
    score: '89%',
    state: 'Investigación IA',
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
  ]

  const defaultMapPins = [
    { label: '3', x: '48%', y: '8%', tone: 'red', sucursal: 'Quito' },
    { label: '5', x: '26%', y: '62%', tone: 'red', sucursal: 'Portoviejo' },
    { label: '7', x: '73%', y: '23%', tone: 'red', sucursal: 'Guayaquil' },
    { label: '12', x: '55%', y: '44%', tone: 'red', sucursal: 'Cuenca' },
  ]

  const [cases, setCases] = useState(criticalCases)
  const [kpiData, setKpiData] = useState(overviewCards)
  const [activeCase, setActiveCase] = useState<any>(null)
  const [detections, setDetections] = useState(defaultDetections)
  const [pins, setPins] = useState(defaultMapPins)
  
  // DRAWER STATE
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [timelineData, setTimelineData] = useState(timeline)
  const [feedbackSending, setFeedbackSending] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/kpis`)
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
      .catch(err => console.log('Usando fallback para KPIs:', err))

    fetch(`${API_BASE_URL}/api/cases/critical?limit=10`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCases(data)
          setActiveCase(data[0])
        }
      })
      .catch(err => console.log('Usando fallback para Casos Críticos:', err))

    fetch(`${API_BASE_URL}/api/detections`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDetections(data)
      })
      .catch(err => console.log('Usando fallback para Detecciones:', err))

    fetch(`${API_BASE_URL}/api/map-claims`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setPins(data)
      })
      .catch(err => console.log('Usando fallback para Pines del Mapa:', err))
  }, [])

  useEffect(() => {
    if (!selectedCase) return
    setFeedbackSent(false)
    setTimelineData(timeline) // reset while fetching

    fetch(`${API_BASE_URL}/api/cases/${selectedCase.caseId}/timeline`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTimelineData(data)
        }
      })
      .catch(err => {
        console.log(`Usando fallback de timeline para ${selectedCase.caseId}:`, err)
        setTimelineData([
          { time: '09:14', label: 'Reclamo generado', tone: 'green' },
          { time: '09:15', label: 'Validación IA iniciada', tone: 'blue' },
          { time: '09:16', label: selectedCase.risk === 'CRÍTICO' ? 'Riesgo Crítico Detectado' : 'Validación completada', tone: selectedCase.risk === 'CRÍTICO' ? 'red' : 'orange' },
          { time: '09:17', label: selectedCase.alert, tone: 'red' },
          { time: '09:18', label: selectedCase.state, tone: 'violet' },
        ])
      })
  }, [selectedCase])

  const openDrawer = (caseData: any) => {
    setSelectedCase(caseData)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedCase(null), 300)
  }

  const handleSendFeedback = () => {
    if (!selectedCase) return
    setFeedbackSending(true)
    fetch(`${API_BASE_URL}/api/cases/${selectedCase.caseId.replace('#', '')}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: "investigate", notes: "Iniciado desde panel" })
    })
      .then(res => res.json())
      .then(() => {
        setFeedbackSent(true)
        setFeedbackSending(false)
        setTimeout(() => setFeedbackSent(false), 3000)
      })
      .catch(err => {
        console.error(err)
        setFeedbackSending(false)
        alert('Error al enviar feedback')
      })
  }

  return (
    <main className="page critical-page">
      <div className="dashboard-layout critical-layout">
        <DashboardSidebar activeRoute="/casos-criticos" />

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

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                id="btn-exportar-csv"
                type="button"
                onClick={() => {
                  fetch(`${API_BASE_URL}/api/cases/export`)
                    .then(res => res.blob())
                    .then(blob => {
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'casos_criticos.csv'
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    })
                    .catch(err => console.error('Error exportando CSV:', err))
                }}
                className="btn btn-secondary case-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 14px' }}
              >
                ⬇ Exportar CSV
              </button>

              <div className="critical-threat">
                <span className="threat-dot" />
                <strong>Threat Level</strong>
                <b>SEVERO</b>
              </div>
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
                      <button type="button" onClick={(e) => { e.stopPropagation(); openDrawer(row); }}>
                        <Eye size={16} weight="bold" /> Ver Detalles
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
                  <button type="button" className="btn btn-primary case-primary" onClick={() => activeCase && openDrawer(activeCase)}>
                    Abrir línea de tiempo
                  </button>
                </div>
              </article>

              <div className="critical-rail-grid">
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
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </aside>
          </section>
        </section>

        {/* DRAWER LATERAL */}
        {isDrawerOpen && (
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: '#1c1c1f', zIndex: 100, borderLeft: '1px solid rgba(255,255,255,0.1)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Línea de tiempo del caso</h2>
              <button onClick={closeDrawer} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {selectedCase && (
              <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedCase.caseId}</h3>
                <p style={{ margin: '4px 0 0', color: '#a1a1aa' }}>{selectedCase.insured}</p>
                <div style={{ marginTop: '8px', display: 'inline-block', background: selectedCase.risk === 'CRÍTICO' ? '#ef4444' : '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  RIESGO {selectedCase.risk}
                </div>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div className="timeline-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {timelineData.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.tone === 'red' ? '#ef4444' : item.tone === 'orange' ? '#f59e0b' : item.tone === 'blue' ? '#3b82f6' : '#10b981', marginTop: '6px' }} />
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#e4e4e7' }}>{item.time}</strong>
                      <p style={{ margin: '2px 0 0', fontSize: '0.95rem', color: '#a1a1aa' }}>{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {feedbackSent && (
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '12px', borderRadius: '6px', textAlign: 'center', marginBottom: '16px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  ✅ Feedback enviado correctamente.
                </div>
              )}
              <button 
                onClick={handleSendFeedback} 
                disabled={feedbackSending}
                style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: feedbackSending ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {feedbackSending ? 'Enviando...' : 'Enviar Feedback'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function ClockIcon() {
  return <span className="clock-icon">◔</span>
}
