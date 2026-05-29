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
import { Link } from 'react-router-dom'


import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'

const kpis = [
  { title: 'Siniestros analizados hoy', value: '1,247', accent: 'blue', delta: '+24% vs ayer' },
  { title: 'Alertas generadas', value: '56', accent: 'orange', delta: '+18% vs ayer' },
  { title: 'Casos crÃ­ticos', value: '18', accent: 'red', delta: '+12% vs ayer' },
  { title: 'Riesgo promedio', value: '67%', accent: 'amber', delta: 'Alto' },
  { title: 'Monto reclamado', value: '$2.45M', accent: 'green', delta: '+32% vs ayer' },
]

const relationNodes = [
  { label: 'Asegurado', x: '14%', y: '70%', tone: 'teal' },
  { label: 'Asegurado', x: '19%', y: '38%', tone: 'teal' },
  { label: 'Asegurado', x: '23%', y: '56%', tone: 'teal' },
  { label: 'PÃ³liza', x: '31%', y: '25%', tone: 'violet' },
  { label: 'VehÃ­culo', x: '39%', y: '19%', tone: 'blue' },
  { label: 'VehÃ­culo', x: '53%', y: '19%', tone: 'blue' },
  { label: 'VehÃ­culo', x: '61%', y: '40%', tone: 'blue' },
  { label: 'VehÃ­culo', x: '69%', y: '27%', tone: 'blue' },
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
    insured: 'Carlos MÃ©ndez',
    date: '28/05/2025',
    branch: 'VehÃ­culos',
    vehicle: 'KIA Sportage 2021',
    city: 'MedellÃ­n, Antioquia',
    amount: '$28,450',
    score: '89%',
    level: 'Alto',
  },
  {
    id: '#76123',
    insured: 'Ana RodrÃ­guez',
    date: '28/05/2025',
    branch: 'VehÃ­culos',
    vehicle: 'Mazda CX-5 2020',
    city: 'Envigado, Antioquia',
    amount: '$15,230',
    score: '76%',
    level: 'Alto',
  },
  {
    id: '#65109',
    insured: 'Pedro GÃ³mez',
    date: '27/05/2025',
    branch: 'VehÃ­culos',
    vehicle: 'Hyundai Tucson 2022',
    city: 'Bello, Antioquia',
    amount: '$9,890',
    score: '72%',
    level: 'Alto',
  },
  {
    id: '#55867',
    insured: 'Laura Torres',
    date: '26/05/2025',
    branch: 'Salud',
    vehicle: 'N/A',
    city: 'Sabaneta, Antioquia',
    amount: '$6,420',
    score: '65%',
    level: 'Medio',
  },
  {
    id: '#44321',
    insured: 'Miguel RamÃ­rez',
    date: '26/05/2025',
    branch: 'Hogar',
    vehicle: 'N/A',
    city: 'ItagÃ¼Ã­, Antioquia',
    amount: '$3,210',
    score: '58%',
    level: 'Medio',
  },
]

function AccentBar({ value }: { value: string }) {
  return <span className="case-score-bar" style={{ width: value }} />
}

export function DemoPage() {
  const [kpiData, setKpiData] = useState(kpis)
  const [claimCases, setClaimCases] = useState(cases)
  const [activeCase, setActiveCase] = useState<(typeof cases)[number]>(cases[0])
  const [pins, setPins] = useState(mapPins)
  const [narrativeData, setNarrativeData] = useState({
    original_text: "El vehiculo fue impactado mientras estaba estacionado en la via publica por un tercero que se dio a la fuga...",
    score: "89%",
    similar_list: similarClaims
  })


  useEffect(() => {
    // 1. Cargar KPIs reales de la base de datos
    fetch('http://localhost:8000/api/kpis')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setKpiData([
            { title: 'Siniestros analizados hoy', value: data.siniestros_analizados, accent: 'blue', delta: '+24% vs ayer' },
            { title: 'Alertas generadas', value: data.alertas_generadas, accent: 'orange', delta: '+18% vs ayer' },
            { title: 'Casos crÃ­ticos', value: data.casos_criticos, accent: 'red', delta: '+12% vs ayer' },
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

    // 3. Cargar pines del mapa de la base de datos
    fetch('http://localhost:8000/api/map-claims')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPins(data)
        }
      })
      .catch(err => console.log('Usando fallback para Pines del Mapa (Servidor API apagado):', err))

    // 4. Cargar narrativas similares de la base de datos
    fetch('http://localhost:8000/api/narratives/similar')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setNarrativeData(data)
        }
      })
      .catch(err => console.log('Usando fallback para Narrativas Similares (Servidor API apagado):', err))
  }, [])


  return (
    <main className="page dashboard-page">
      <div className="dashboard-layout">
        <DashboardSidebar activeRoute="/dashboard" />

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <label className="dashboard-search">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Buscar siniestro, placa, asegurado, proveedor..." />
              <kbd>âŒ˜ K</kbd>
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
                        <dt>VehÃ­culo</dt>
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
                    Ver anÃ¡lisis completo
                  </button>
                  <button type="button" className="btn btn-secondary case-secondary">
                    Ver expediente <Eye size={16} weight="bold" />
                  </button>
                </div>
              </div>

              <div className="calculator-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
                <ShieldCheck size={48} weight="duotone" color="var(--accent-blue)" style={{ marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Calculadora de Riesgo IA</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
                  EvalÃºa el riesgo de un nuevo siniestro con nuestro motor cognitivo y reglas de negocio.
                </p>
                <Link to="/dashboard?tab=calculadora" className="btn btn-primary" style={{ textDecoration: 'none', width: '100%' }}>
                  Ir a la calculadora
                </Link>
              </div>
            </article>
          </section>

          <section className="dashboard-grid dashboard-grid-bottom">
            <article className="dashboard-panel panel-map">
              <div className="panel-head">
                <div>
                  <h2>Mapa de siniestros</h2>
                  <p>ConcentraciÃ³n de siniestros por zona geogrÃ¡fica.</p>
                </div>
                <button type="button" className="filter-pill">
                  Ãšltimos 30 dÃ­as <CaretDown size={14} weight="bold" />
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
                {pins.map((pin, idx) => (
                  <span
                    key={idx}
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
                  <p>ComparaciÃ³n de textos con IA.</p>
                </div>
              </div>

              <div className="narrative-card">
                <p>
                  {narrativeData.original_text}
                </p>
                <strong>
                  {narrativeData.score}
                  <span>Similitud</span>
                </strong>
              </div>

              <div className="similar-grid">
                <div className="similar-list">
                  <h3>Otros siniestros con narrativa similar</h3>
                  {narrativeData.similar_list.map((claim) => (
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
                <h2>Ãšltimos siniestros analizados</h2>
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
  return <span className="arrow-icon">â†’</span>
}

