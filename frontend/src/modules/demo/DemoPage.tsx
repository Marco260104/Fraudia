import { useEffect, useState, type CSSProperties } from 'react'
import {
  Bell,
  CaretDown,
  ChartLineUp,
  CirclesThree,
  Eye,
  FileText,
  House,
  MapTrifold,
  MagnifyingGlass,
  Question,
  SlidersHorizontal,
  ShieldCheck,
  Stethoscope,
  UserCircle,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react'

const mainMenu = [
  { label: 'Centro de inteligencia', icon: House, href: '/demo', active: true },
  { label: 'Casos críticos', icon: WarningCircle, href: '/casos-criticos', badge: '18' },
  { label: 'Alertas IA', icon: Bell, href: '/demo' },
  { label: 'Mapa de siniestros', icon: MapTrifold, href: '/demo' },
  { label: 'Narrativas similares', icon: CirclesThree, href: '/demo' },
]

const entityMenu = [
  { label: 'Vehiculos', icon: FileText },
  { label: 'Proveedores', icon: UsersThree },
  { label: 'Asegurados', icon: UserCircle },
  { label: 'Talleres', icon: Stethoscope },
]

const toolMenu = [
  { label: 'Calculadora de riesgo', icon: ChartLineUp, active: true },
  { label: 'Reportes', icon: FileText },
  { label: 'Configuración', icon: SlidersHorizontal },
]

const kpis = [
  { title: 'Siniestros analizados hoy', value: '1,247', accent: 'blue', delta: '+24% vs ayer' },
  { title: 'Alertas generadas', value: '56', accent: 'orange', delta: '+18% vs ayer' },
  { title: 'Casos críticos', value: '18', accent: 'red', delta: '+12% vs ayer' },
  { title: 'Riesgo promedio', value: '67%', accent: 'amber', delta: 'Alto' },
  { title: 'Monto reclamado', value: '$2.45M', accent: 'green', delta: '+32% vs ayer' },
]

const relationNodes = [
  { label: 'Asegurado', x: '14%', y: '70%', tone: 'teal' },
  { label: 'Asegurado', x: '19%', y: '38%', tone: 'teal' },
  { label: 'Asegurado', x: '23%', y: '56%', tone: 'teal' },
  { label: 'Póliza', x: '31%', y: '25%', tone: 'violet' },
  { label: 'Vehículo', x: '39%', y: '19%', tone: 'blue' },
  { label: 'Vehículo', x: '53%', y: '19%', tone: 'blue' },
  { label: 'Vehículo', x: '61%', y: '40%', tone: 'blue' },
  { label: 'Vehículo', x: '69%', y: '27%', tone: 'blue' },
  { label: 'Proveedor', x: '76%', y: '41%', tone: 'orange' },
  { label: 'Proveedor', x: '73%', y: '70%', tone: 'blue' },
  { label: 'Documento', x: '57%', y: '70%', tone: 'violet' },
  { label: 'Documento', x: '44%', y: '74%', tone: 'violet' },
  { label: 'Documento', x: '31%', y: '68%', tone: 'violet' },
]

const mapPins = [
  { label: '7', x: '76%', y: '12%', tone: 'blue' },
  { label: '9', x: '84%', y: '37%', tone: 'blue' },
  { label: '12', x: '32%', y: '56%', tone: 'blue' },
  { label: '15', x: '61%', y: '82%', tone: 'blue' },
]

const similarClaims = [
  { id: '#S-78123', score: '85%' },
  { id: '#S-65109', score: '82%' },
  { id: '#S-55867', score: '79%' },
  { id: '#S-44321', score: '76%' },
]

const cases = [
  {
    id: '#87291',
    insured: 'Carlos Méndez',
    date: '28/05/2025',
    branch: 'Vehículos',
    amount: '$28,450',
    score: '89%',
    level: 'Alto',
  },
  {
    id: '#76123',
    insured: 'Ana Rodríguez',
    date: '28/05/2025',
    branch: 'Vehículos',
    amount: '$15,230',
    score: '76%',
    level: 'Alto',
  },
  {
    id: '#65109',
    insured: 'Pedro Gómez',
    date: '27/05/2025',
    branch: 'Vehículos',
    amount: '$9,890',
    score: '72%',
    level: 'Alto',
  },
  {
    id: '#55867',
    insured: 'Laura Torres',
    date: '26/05/2025',
    branch: 'Salud',
    amount: '$6,420',
    score: '65%',
    level: 'Medio',
  },
  {
    id: '#44321',
    insured: 'Miguel Ramírez',
    date: '26/05/2025',
    branch: 'Hogar',
    amount: '$3,210',
    score: '58%',
    level: 'Medio',
  },
]

const calculatorFields = [
  { label: 'Fecha del evento', placeholder: 'dd/mm/aaaa' },
  { label: 'Ramo', placeholder: 'Seleccionar ramo' },
  { label: 'Placa del vehiculo', placeholder: 'ABC123' },
  { label: 'Monto reclamado (COP)', placeholder: '$ 0', wide: true },
  { label: 'Taller o proveedor', placeholder: 'Seleccionar proveedor', wide: true },
]

function AccentBar({ value }: { value: string }) {
  return <span className="case-score-bar" style={{ width: value }} />
}

export function DemoPage() {
  const [kpiData, setKpiData] = useState(kpis)
  const [claimCases, setClaimCases] = useState(cases)
  const [activeCase, setActiveCase] = useState<any>(cases[0])

  // Estados de la calculadora de riesgo
  const [fechaEvento, setFechaEvento] = useState('')
  const [ramo, setRamo] = useState('Vehículos')
  const [placa, setPlaca] = useState('')
  const [montoReclamado, setMontoReclamado] = useState('')
  const [proveedor, setProveedor] = useState('')
  
  // Resultado del cálculo
  const [calculatedScore, setCalculatedScore] = useState<string | null>(null)
  const [calculatedLevel, setCalculatedLevel] = useState<string | null>(null)
  const [calculatorAlerts, setCalculatorAlerts] = useState<string[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    // 1. Cargar KPIs reales de la base de datos
    fetch('http://localhost:8000/api/kpis')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setKpiData([
            { title: 'Siniestros analizados hoy', value: data.siniestros_analizados, accent: 'blue', delta: '+24% vs ayer' },
            { title: 'Alertas generadas', value: data.alertas_generadas, accent: 'orange', delta: '+18% vs ayer' },
            { title: 'Casos críticos', value: data.casos_criticos, accent: 'red', delta: '+12% vs ayer' },
            { title: 'Riesgo promedio', value: data.riesgo_promedio, accent: 'amber', delta: 'Alto' },
            { title: 'Monto reclamado', value: data.monto_reclamado, accent: 'green', delta: 'Suma total en BD' },
          ])
        }
      })
      .catch(err => console.log('Usando fallback para KPIs (Servidor API apagado):', err))

    // 2. Cargar casos reales de la base de datos
    fetch('http://localhost:8000/api/cases')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setClaimCases(data)
          setActiveCase(data[0])
        }
      })
      .catch(err => console.log('Usando fallback para Casos (Servidor API apagado):', err))
  }, [])

  const handleCalculateRisk = () => {
    if (!fechaEvento || !montoReclamado) {
      alert("Por favor completa los campos obligatorios: Fecha del evento y Monto reclamado.")
      return
    }

    setIsCalculating(true)
    fetch('http://localhost:8000/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fecha_evento: fechaEvento,
        ramo: ramo,
        placa: placa,
        monto_reclamado: parseFloat(montoReclamado.replace(/[^0-9.]/g, '')) || 0,
        id_proveedor: proveedor
      })
    })
      .then(res => res.json())
      .then(data => {
        setCalculatedScore(data.score)
        setCalculatedLevel(data.level)
        setCalculatorAlerts(data.alerts)
        setIsCalculating(false)
      })
      .catch(err => {
        console.log("Error al calcular riesgo con API:", err)
        // Fallback local simulado en caso de error
        const randomScore = Math.floor(Math.random() * 40) + 50
        setCalculatedScore(`${randomScore}%`)
        setCalculatedLevel(randomScore > 75 ? "Alto" : "Medio")
        setCalculatorAlerts(["Monto de reclamo elevado", "Taller frecuente en siniestros"])
        setIsCalculating(false)
      })
  }

  return (
    <main className="page dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
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
                  <a key={item.label} href="#" className="dashboard-nav-item">
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
                  <a
                    key={item.label}
                    href="#"
                    className={`dashboard-nav-item ${item.active ? 'is-tool-active' : ''}`}
                  >
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
            <p>Pregúntame sobre patrones, casos o cualquier análisis que necesites.</p>
            <button type="button" className="dashboard-assistant-cta">
              <span>Abrir chat</span>
              <ArrowIcon />
            </button>
          </section>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <label className="dashboard-search">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Buscar siniestro, placa, asegurado, proveedor..." />
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

          <div className="dashboard-page-head">
            <div>
              <h1>Centro de inteligencia antifraude</h1>
              <p>
                <span className="live-dot" />
                En tiempo real
              </p>
            </div>
          </div>

          <section className="dashboard-kpis">
            {kpiData.map((item) => (
              <article key={item.title} className="kpi-card">
                <p>{item.title}</p>
                <strong>{item.value}</strong>
                <span className={`kpi-delta accent-${item.accent}`}>{item.delta}</span>
                <div className="kpi-sparkline" data-accent={item.accent}>
                  <span />
                  <span />
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

          <section className="dashboard-grid">
            <article className="dashboard-panel panel-network">
              <div className="panel-head">
                <div>
                  <h2>Red de relaciones sospechosas</h2>
                  <span className="panel-info">i</span>
                </div>
                <div className="panel-filters">
                  <button type="button" className="filter-pill">
                    Todos los ramos <CaretDown size={14} weight="bold" />
                  </button>
                  <button type="button" className="mini-button">
                    <SlidersHorizontal size={16} weight="bold" />
                  </button>
                  <button type="button" className="mini-button">
                    <CirclesThree size={16} weight="bold" />
                  </button>
                </div>
              </div>

              <div className="relation-board">
                <div className="relation-center">
                  <ShieldCheck size={24} weight="fill" />
                  <strong>Taller Express</strong>
                </div>

                <svg viewBox="0 0 1000 420" className="relation-lines" aria-hidden="true">
                  <path d="M 500 210 C 430 150, 290 110, 170 112" />
                  <path d="M 500 210 C 410 120, 300 82, 248 70" />
                  <path d="M 500 210 C 590 130, 668 104, 820 116" />
                  <path d="M 500 210 C 610 230, 702 236, 836 250" />
                  <path d="M 500 210 C 435 270, 330 310, 202 324" />
                  <path d="M 500 210 C 556 286, 614 318, 700 338" />
                  <path d="M 500 210 C 470 292, 418 330, 362 344" />
                  <path d="M 500 210 C 518 292, 560 336, 646 350" />
                  <path d="M 500 210 C 520 164, 540 132, 600 108" />
                  <path d="M 500 210 C 470 166, 424 136, 360 118" />
                </svg>

                {relationNodes.map((node, index) => (
                  <div
                    key={`${node.label}-${index}`}
                    className={`relation-node tone-${node.tone}`}
                    style={{ left: node.x, top: node.y } as CSSProperties}
                  >
                    <span />
                    <strong>{node.label}</strong>
                  </div>
                ))}

                <div className="relation-legend">
                  <div>
                    <span className="legend-dot tone-violet" />
                    <span>Siniestro</span>
                    <small>Riesgo alto</small>
                  </div>
                  <div>
                    <span className="legend-dot tone-blue" />
                    <span>Vehiculo</span>
                    <small>Riesgo medio</small>
                  </div>
                  <div>
                    <span className="legend-dot tone-teal" />
                    <span>Asegurado</span>
                    <small>Riesgo bajo</small>
                  </div>
                  <div>
                    <span className="legend-dot tone-orange" />
                    <span>Proveedor</span>
                    <small>Riesgo alto</small>
                  </div>
                </div>
              </div>
            </article>

            <article className="dashboard-panel panel-right">
              <div className="active-case">
                <p className="panel-kicker">Caso activo</p>
                {activeCase && (
                  <>
                    <div className="active-case-head">
                      <div>
                        <strong>{activeCase.id}</strong>
                        <span className={`risk-pill ${activeCase.level === 'Alto' ? 'danger' : 'warning'}`}>
                          {activeCase.level ? `${activeCase.level.toUpperCase()} RIESGO` : 'ALTO RIESGO'}
                        </span>
                      </div>
                      <div className="risk-gauge">
                        <span className="risk-gauge-track" />
                        <span 
                          className="risk-gauge-fill" 
                          style={{ transform: `rotate(${(parseFloat(activeCase.score) / 100) * 180 - 90}deg)` } as CSSProperties} 
                        />
                        <span className="risk-gauge-needle" />
                      </div>
                    </div>

                    <div className="active-score">
                      <strong>{activeCase.score}</strong>
                      <span>Score de riesgo</span>
                    </div>

                    <dl className="case-details">
                      <div>
                        <dt>Fecha del evento</dt>
                        <dd>{activeCase.date || '28/05/2025'}</dd>
                      </div>
                      <div>
                        <dt>Asegurado</dt>
                        <dd>{activeCase.insured}</dd>
                      </div>
                      <div>
                        <dt>Vehículo</dt>
                        <dd>{activeCase.vehicle || 'KIA Sportage 2021'}</dd>
                      </div>
                      <div>
                        <dt>Ciudad</dt>
                        <dd>{activeCase.city || 'Quito, Pichincha'}</dd>
                      </div>
                      <div>
                        <dt>Monto reclamado</dt>
                        <dd>{activeCase.amount}</dd>
                      </div>
                    </dl>
                  </>
                )}

                <div className="case-actions">
                  <button type="button" className="btn btn-primary case-primary">
                    Ver análisis completo
                  </button>
                  <button type="button" className="btn btn-secondary case-secondary">
                    Ver expediente <Eye size={16} weight="bold" />
                  </button>
                </div>
              </div>

              <div className="calculator-card">
                <div className="calculator-head">
                  <p className="panel-kicker">Calculadora de riesgo</p>
                  <span>Evalúa el riesgo de un nuevo siniestro</span>
                </div>

                <div className="calculator-grid">
                  <label className="calculator-field">
                    <span>Fecha del evento (Obligatorio)</span>
                    <input 
                      type="date" 
                      value={fechaEvento} 
                      onChange={(e) => setFechaEvento(e.target.value)} 
                      style={{ colorScheme: 'dark' }}
                    />
                  </label>
                  <label className="calculator-field">
                    <span>Ramo</span>
                    <select 
                      value={ramo} 
                      onChange={(e) => setRamo(e.target.value)}
                      style={{ background: '#121214', color: 'white', border: '1px solid rgba(255,255,255,0.08)', padding: '10px', borderRadius: '6px', width: '100%', height: '42px' }}
                    >
                      <option value="Vehículos">Vehículos</option>
                      <option value="Hogar">Hogar</option>
                      <option value="Salud">Salud</option>
                    </select>
                  </label>
                  <label className="calculator-field">
                    <span>Placa del vehículo</span>
                    <input 
                      placeholder="ABC123" 
                      value={placa} 
                      onChange={(e) => setPlaca(e.target.value)} 
                    />
                  </label>
                  <label className="calculator-field is-wide">
                    <span>Monto reclamado ($ USD - Obligatorio)</span>
                    <input 
                      placeholder="e.g. 15000" 
                      type="number"
                      value={montoReclamado} 
                      onChange={(e) => setMontoReclamado(e.target.value)} 
                    />
                  </label>
                  <label className="calculator-field is-wide">
                    <span>Taller o proveedor (ID)</span>
                    <input 
                      placeholder="e.g. TALLER-001" 
                      value={proveedor} 
                      onChange={(e) => setProveedor(e.target.value)} 
                    />
                  </label>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary calculator-cta" 
                  onClick={handleCalculateRisk}
                  disabled={isCalculating}
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  {isCalculating ? 'Calculando...' : 'Calcular riesgo'}
                </button>

                {calculatedScore && (
                  <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '1.25rem', color: calculatedLevel === 'Alto' ? '#f43f5e' : '#f59e0b' }}>
                        {calculatedScore}
                      </strong>
                      <span className={`risk-pill ${calculatedLevel === 'Alto' ? 'danger' : 'warning'}`} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {calculatedLevel?.toUpperCase()} RIESGO
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8f9099' }}>
                      <strong style={{ color: '#c4c5cc' }}>Reglas de negocio activadas:</strong>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', lineHeight: '1.4' }}>
                        {calculatorAlerts.map((alert, i) => (
                          <li key={i} style={{ marginBottom: '2px' }}>{alert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="calculator-foot">
                  <ShieldCheck size={18} weight="bold" />
                  <p>Obtén una estimación instantánea del riesgo basada en IA y reglas de negocio.</p>
                </div>
              </div>
            </article>
          </section>

          <section className="dashboard-grid dashboard-grid-bottom">
            <article className="dashboard-panel panel-map">
              <div className="panel-head">
                <div>
                  <h2>Mapa de siniestros</h2>
                  <p>Concentración de siniestros por zona geográfica.</p>
                </div>
                <button type="button" className="filter-pill">
                  Últimos 30 días <CaretDown size={14} weight="bold" />
                </button>
              </div>

              <div className="map-board">
                <div className="map-zoom">
                  <button type="button">+</button>
                  <button type="button">-</button>
                </div>
                <div className="map-heat map-heat-orange" />
                <div className="map-heat map-heat-red" />
                <div className="map-heat map-heat-blue" />
                {mapPins.map((pin) => (
                  <span
                    key={pin.label}
                    className={`map-pin tone-${pin.tone}`}
                    style={{ left: pin.x, top: pin.y } as CSSProperties}
                  >
                    {pin.label}
                  </span>
                ))}

                <div className="map-legend">
                  <span>Bajo riesgo</span>
                  <div className="map-gradient" />
                  <span>Alto riesgo</span>
                </div>
              </div>
            </article>

            <article className="dashboard-panel panel-narratives">
              <div className="panel-head">
                <div>
                  <h2>Narrativas similares detectadas</h2>
                  <p>Comparación de textos con IA.</p>
                </div>
              </div>

              <div className="narrative-card">
                <p>
                  El vehiculo fue impactado mientras estaba estacionado en la via publica por un tercero que se dio a
                  la fuga...
                </p>
                <strong>
                  89%
                  <span>Similitud</span>
                </strong>
              </div>

              <div className="similar-grid">
                <div className="similar-list">
                  <h3>Otros siniestros con narrativa similar</h3>
                  {similarClaims.map((claim) => (
                    <div key={claim.id} className="similar-row">
                      <span>{claim.id}</span>
                      <strong>{claim.score}</strong>
                    </div>
                  ))}
                  <a href="#" className="text-link">
                    Ver todos los similares <ArrowIcon />
                  </a>
                </div>

                <div className="similar-network" aria-hidden="true">
                  <div className="similar-core" />
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={index}
                      className="similar-node"
                      style={
                        {
                          ['--node-angle' as never]: `${index * 30}deg`,
                          ['--node-distance' as never]: `${34 + (index % 3) * 13}%`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="dashboard-panel panel-table">
            <div className="panel-head">
              <div>
                <h2>Últimos siniestros analizados</h2>
              </div>
              <a href="#" className="text-link">
                Ver todos <CaretDown size={14} weight="bold" />
              </a>
            </div>

            <div className="claims-table">
              <div className="claims-head">
                <span>ID Siniestro</span>
                <span>Asegurado</span>
                <span>Fecha</span>
                <span>Ramo</span>
                <span>Monto reclamado</span>
                <span>Score de riesgo</span>
                <span>Nivel</span>
                <span>Acciones</span>
              </div>

              {claimCases.map((row) => (
                <div 
                  key={row.id} 
                  className={`claims-row ${activeCase && activeCase.id === row.id ? 'is-active-row' : ''}`}
                  onClick={() => setActiveCase(row)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{row.id}</strong>
                  <span>{row.insured}</span>
                  <span>{row.date}</span>
                  <span>{row.branch}</span>
                  <span>{row.amount}</span>
                  <div className="claims-score">
                    <AccentBar value={row.score} />
                    <strong>{row.score}</strong>
                  </div>
                  <span className={`claims-level level-${row.level.toLowerCase()}`}>{row.level}</span>
                  <div className="claims-actions">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setActiveCase(row); }}>
                      <Eye size={16} weight="bold" />
                    </button>
                    <button type="button" onClick={(e) => e.stopPropagation()}>
                      <FileText size={16} weight="bold" />
                    </button>
                    <button type="button" onClick={(e) => e.stopPropagation()}>
                      <WarningCircle size={16} weight="bold" />
                    </button>
                    <button type="button" onClick={(e) => e.stopPropagation()}>
                      <CaretDown size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

function ArrowIcon() {
  return <span className="arrow-icon">→</span>
}
