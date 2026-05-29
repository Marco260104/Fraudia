import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'
import {
  Bell, Building, MagnifyingGlass, ShieldCheck,
  UserCircle
} from '@phosphor-icons/react'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'

import './ProvidersPage.css'

interface Provider {
  id_proveedor: string
  nombre_proveedor: string
  tipo_proveedor: string
  ciudad_proveedor: string
  siniestros_asociados: number
  lista_restrictiva: string
  motivo_restriccion: string
  promedio_monto: number
  alerta_nivel: string
}

const smartCards = [
  { id: 'T-002', name: 'AutoMecánica L&R', city: 'Envigado', risk: 'Alto', claims: 38, score: '89%', riskClass: 'high', trend: [20, 30, 45, 60, 80, 89] },
  { id: 'T-003', name: 'Car Center Pro', city: 'Bello', risk: 'Medio', claims: 24, score: '62%', riskClass: 'med', trend: [30, 35, 40, 50, 55, 62] },
  { id: 'T-004', name: 'MotorFix', city: 'Sabaneta', risk: 'Bajo', claims: 12, score: '35%', riskClass: 'low', trend: [40, 38, 35, 30, 33, 35] },
  { id: 'T-005', name: 'Taller La 80', city: 'Medellín', risk: 'Medio', claims: 29, score: '71%', riskClass: 'med', trend: [40, 45, 55, 60, 68, 71] }
]

const terminalLogs = [
  { time: '09:42', text: 'Taller Express vinculado a nuevo caso #FR-87291', type: 'warning' },
  { time: '09:44', text: 'AutoMecánica L&R supera umbral de riesgo IA (89%)', type: 'critical' },
  { time: '09:45', text: 'Patrón de repetición detectado: 4 casos en 7 días (Car Center Pro)', type: 'warning' },
  { time: '09:50', text: 'Escaneo de red completado. 12 nuevas conexiones identificadas.', type: 'info' },
  { time: '09:55', text: 'Monto inusual detectado ($15k) en reparación estándar.', type: 'critical' },
]

// Datos para la matriz (Frecuencia vs Monto Promedio)
// x: Frecuencia (0-100), y: Monto Promedio (0-100)
const riskMatrixPoints = [
  { id: 'T-001', x: 85, y: 90, type: 'high-risk', name: 'Taller Express' },
  { id: 'T-002', x: 75, y: 80, type: 'high-risk', name: 'AutoMecánica L&R' },
  { id: 'T-003', x: 60, y: 40, type: 'med-risk', name: 'Car Center Pro' },
  { id: 'T-004', x: 20, y: 30, type: 'low-risk', name: 'MotorFix' },
  { id: 'T-005', x: 65, y: 65, type: 'med-risk', name: 'Taller La 80' },
  { id: 'T-006', x: 90, y: 20, type: 'med-risk', name: 'Frenos Rápidos' },
  { id: 'T-007', x: 30, y: 85, type: 'high-risk', name: 'Pintura VIP' },
]

export function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/providers')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setProviders(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error cargando proveedores:', err)
        setError('No se pudo conectar al servidor')
        setLoading(false)
      })
  }, [])

  const paretoData = useMemo(() => {
    return [...providers]
      .sort((a, b) => b.siniestros_asociados - a.siniestros_asociados)
      .slice(0, 5)
      .map(p => ({ name: p.nombre_proveedor, casos: p.siniestros_asociados }))
  }, [providers])

  return (
    <div className="providers-page">
      <div className="providers-layout">
        {/* Sidebar Reutilizado (Adaptado a layout específico) */}
        <DashboardSidebar activeRoute="/proveedores" />

        <main className="providers-main">
          {/* Topbar */}
          <header className="dashboard-topbar">
            <label className="dashboard-search">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Buscar proveedor, taller, NIT, ciudad..." />
              <kbd>⌘ K</kbd>
            </label>

            <div className="dashboard-topbar-actions">
              <button type="button" className="icon-button">
                <Bell size={18} weight="bold" />
                <span className="topbar-badge">5</span>
              </button>
              <button type="button" className="profile-chip">
                <UserCircle size={24} weight="bold" />
                <span>
                  <strong>Analista Senior</strong>
                  <small>Unidad Antifraude</small>
                </span>
              </button>
              <button type="button" className="profile-avatar">AS<span /></button>
            </div>
          </header>

          <div className="providers-page-head">
            <div>
              <h1>Network Intelligence: Proveedores</h1>
              <p>Ecosistema de actores monitoreados por IA y scoring de riesgo operacional.</p>
            </div>
            <button className="btn btn-primary-sm" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Exportar Reporte Grafo
            </button>
          </div>

          {/* HERO SECTION: Network & Profile */}
          <section className="providers-hero">
            
            {/* Visual Network (Izquierda) */}
            <article className="glass-panel">
              <div className="network-visualizer">
                {/* SVG Graph */}
                <svg className="network-svg" viewBox="0 0 800 500">
                  <path className="network-path orange-path" d="M400,250 Q250,100 150,150" />
                  <path className="network-path orange-path" d="M400,250 Q550,100 650,150" />
                  <path className="network-path" d="M400,250 Q200,350 150,400" />
                  <path className="network-path" d="M400,250 Q600,350 650,400" />
                  <path className="network-path" d="M400,250 Q450,100 350,80" />
                  <path className="network-path" d="M400,250 Q300,450 450,450" />
                  
                  <path className="network-path" d="M150,150 L100,80" />
                  <path className="network-path" d="M650,150 L750,100" />
                  <path className="network-path" d="M150,400 L80,350" />
                  <path className="network-path" d="M650,400 L720,450" />
                </svg>

                {/* Nodes HTML Overlay */}
                <div className="network-node" style={{ left: '50%', top: '50%', zIndex: 10 }}>
                  <div className="node-dot is-core"><Building size={14} weight="fill"/></div>
                  <span className="node-label">Taller Express</span>
                </div>
                
                <div className="network-node" style={{ left: '18.75%', top: '30%' }}>
                  <div className="node-dot is-insured"></div>
                  <span className="node-label">Asegurado A</span>
                </div>
                
                <div className="network-node" style={{ left: '81.25%', top: '30%' }}>
                  <div className="node-dot is-claim"></div>
                  <span className="node-label">#FR-87291</span>
                </div>

                <div className="network-node" style={{ left: '18.75%', top: '80%' }}>
                  <div className="node-dot is-insured"></div>
                  <span className="node-label">Asegurado B</span>
                </div>

                <div className="network-node" style={{ left: '81.25%', top: '80%' }}>
                  <div className="node-dot is-claim"></div>
                  <span className="node-label">#FR-76123</span>
                </div>
                
                <div className="network-node" style={{ left: '43.75%', top: '16%' }}>
                  <div className="node-dot"></div>
                  <span className="node-label">Ciudad: Medellín</span>
                </div>

                <div className="network-node" style={{ left: '56.25%', top: '90%' }}>
                  <div className="node-dot"></div>
                  <span className="node-label">Taller Asociado</span>
                </div>

                {/* Floating KPIs */}
                <div className="kpi-overlay" style={{ top: '24px', left: '24px' }}>
                  <strong>142</strong>
                  <span>Reclamos</span>
                </div>
                <div className="kpi-overlay" style={{ bottom: '24px', left: '24px' }}>
                  <strong>87</strong>
                  <span>Conexiones</span>
                </div>
                <div className="kpi-overlay" style={{ top: '24px', right: '24px' }}>
                  <strong>$1.2M</strong>
                  <span>Procesados</span>
                </div>
                <div className="kpi-overlay" style={{ bottom: '24px', right: '24px' }}>
                  <strong>92%</strong>
                  <span>Anomalías</span>
                </div>

              </div>
            </article>

            {/* Provider Profile (Derecha) */}
            <article className="glass-panel provider-profile">
              <div className="profile-head">
                <div>
                  <h2>Taller Express</h2>
                  <p>Proveedor monitoreado (NIT: 890900123-1)</p>
                </div>
                <span className="risk-badge-high">RIESGO ALTO</span>
              </div>

              {/* Hexagonal Radar SVG */}
              <div className="radar-container">
                <svg className="radar-svg" viewBox="-120 -120 240 240">
                  {/* Hexagon Grid (3 levels) */}
                  {[40, 75, 110].map(r => (
                    <polygon key={`grid-${r}`} className="radar-grid" points={`
                      0,-${r} ${r*0.866},-${r*0.5} ${r*0.866},${r*0.5} 
                      0,${r} -${r*0.866},${r*0.5} -${r*0.866},-${r*0.5}
                    `} />
                  ))}
                  
                  {/* Axis lines */}
                  {[0, 60, 120, 180, 240, 300].map(angle => {
                    const rad = (angle - 90) * Math.PI / 180;
                    return (
                      <line key={`axis-${angle}`} className="radar-axis" x1="0" y1="0" 
                            x2={110 * Math.cos(rad)} y2={110 * Math.sin(rad)} />
                    )
                  })}

                  {/* Data Area (Taller Express Risk Profile) */}
                  <polygon className="radar-area" points={`
                    0,-100 
                    ${80*0.866},-${80*0.5} 
                    ${95*0.866},${95*0.5} 
                    0,40 
                    -${70*0.866},${70*0.5} 
                    -${90*0.866},-${90*0.5}
                  `} />

                  {/* Labels */}
                  <text x="0" y="-115" className="radar-label">Recurrencia</text>
                  <text x="95" y="-55" className="radar-label">Anomalías</text>
                  <text x="95" y="60" className="radar-label">Montos</text>
                  <text x="0" y="125" className="radar-label">Tiempos</text>
                  <text x="-95" y="60" className="radar-label">Conexiones</text>
                  <text x="-95" y="-55" className="radar-label">Reclamos</text>
                </svg>
              </div>

            </article>
          </section>

          {/* MIDDLE PANELS: Matrix & Activity */}
          <section className="providers-two-col">
            {/* Riesgo / Matriz de Proveedores */}
            <article className="bottom-panel">
              <h2 className="section-title">Matriz de Riesgo Operacional</h2>
              <svg className="matrix-svg" viewBox="-20 -20 240 240">
                {/* Grid */}
                {[0, 50, 100, 150, 200].map(val => (
                  <g key={`mgrid-${val}`}>
                    <line className="matrix-grid" x1="0" y1={val} x2="200" y2={val} />
                    <line className="matrix-grid" x1={val} y1="0" x2={val} y2="200" />
                  </g>
                ))}
                
                {/* Axes */}
                <line className="matrix-axis" x1="0" y1="200" x2="200" y2="200" />
                <line className="matrix-axis" x1="0" y1="200" x2="0" y2="0" />
                
                <text x="100" y="230" className="matrix-label" textAnchor="middle">Frecuencia de Reclamos →</text>
                <text x="-100" y="-15" className="matrix-label" textAnchor="middle" transform="rotate(-90)">← Monto Promedio</text>

                {/* Quadrants background */}
                <rect x="100" y="0" width="100" height="100" fill="rgba(239, 68, 68, 0.05)" />
                
                {/* Points */}
                {riskMatrixPoints.map(p => (
                  <circle 
                    key={p.id}
                    className={`matrix-point ${p.type}`}
                    cx={p.x * 2}
                    cy={200 - (p.y * 2)}
                    r="5"
                  >
                    <title>{p.name}</title>
                  </circle>
                ))}
              </svg>
            </article>

            {/* Actividad en Vivo */}
            <article className="bottom-panel">
              <h2 className="section-title">Actividad Operacional</h2>
              <div className="terminal-list">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={`terminal-item ${log.type}`}>
                    <span className="terminal-time">[{log.time}]</span>
                    <span className="terminal-text">{log.text}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* SMART CARDS GRID */}
          <section className="smart-cards-section">
            <div style={{ marginBottom: '32px', background: '#1c1c1f', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Top 5 Proveedores (Principio de Pareto)</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Mayor concentración de siniestros asociados</p>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paretoData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="casos" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h2 className="section-title">Grid de Proveedores</h2>
            {error && <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>Cargando proveedores...</div>
            ) : (
              <div className="smart-cards-grid">
                {providers.length > 0
                  ? providers.slice(0, 4).map(card => {
                      const risk = card.alerta_nivel === 'rojo' ? 'Alto' : card.alerta_nivel === 'amarillo' ? 'Medio' : 'Bajo'
                      return (
                        <div key={card.id_proveedor} className="smart-card">
                          <div className="card-top">
                            <div>
                              <h3>{card.nombre_proveedor}</h3>
                              <span>{card.ciudad_proveedor}</span>
                            </div>
                            <span className="risk-badge-high" style={{
                              background: risk === 'Alto' ? '#fef2f2' : risk === 'Medio' ? '#fff7ed' : '#f0fdf4',
                              color: risk === 'Alto' ? '#ef4444' : risk === 'Medio' ? '#ea580c' : '#16a34a',
                              borderColor: risk === 'Alto' ? '#fecaca' : risk === 'Medio' ? '#fed7aa' : '#bbf7d0',
                            }}>
                              Riesgo: {risk}
                            </span>
                          </div>

                          <div className="card-metrics">
                            <div>
                              <strong>{card.siniestros_asociados}</strong>
                              <small>Reclamos</small>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <strong>${card.promedio_monto?.toLocaleString() ?? '-'}</strong>
                              <small>Monto prom.</small>
                            </div>
                          </div>

                          <div className="card-actions">
                            <button className="btn-outline">Ver red</button>
                            <button className="btn-primary-sm">Analizar</button>
                          </div>
                        </div>
                      )
                    })
                  : smartCards.map(card => (
                      <div key={card.id} className="smart-card">
                        <div className="card-top">
                          <div>
                            <h3>{card.name}</h3>
                            <span>{card.city}</span>
                          </div>
                          <span className="risk-badge-high" style={{
                            background: card.risk === 'Alto' ? '#fef2f2' : card.risk === 'Medio' ? '#fff7ed' : '#f0fdf4',
                            color: card.risk === 'Alto' ? '#ef4444' : card.risk === 'Medio' ? '#ea580c' : '#16a34a',
                            borderColor: card.risk === 'Alto' ? '#fecaca' : card.risk === 'Medio' ? '#fed7aa' : '#bbf7d0',
                          }}>
                            Riesgo: {card.risk}
                          </span>
                        </div>

                        <div className="card-metrics">
                          <div>
                            <strong>{card.claims}</strong>
                            <small>Reclamos</small>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong>{card.score}</strong>
                            <small>IA Score</small>
                          </div>
                        </div>

                        <div className="mini-visual">
                          {card.trend.map((val, i) => (
                            <div
                              key={i}
                              className={`mini-bar ${val >= 80 ? 'high' : val >= 50 ? 'med' : ''}`}
                              style={{ height: `${val}%` }}
                            ></div>
                          ))}
                        </div>

                        <div className="card-actions">
                          <button className="btn-outline">Ver red</button>
                          <button className="btn-primary-sm">Analizar</button>
                        </div>
                      </div>
                    ))
                }
              </div>
            )}
          </section>

          {/* BOTTOM PANELS */}
          <section className="providers-two-col">
            
            {/* Mapa de Proveedores */}
            <article className="bottom-panel">
              <h2 className="section-title">Mapa Operacional</h2>
              <div className="map-placeholder">
                <div className="map-grid-overlay"></div>
                <div className="density-blob blob-1"></div>
                <div className="density-blob blob-2"></div>
                <div className="density-blob blob-3"></div>
                <div style={{ position: 'absolute', top: '45%', left: '55%', width: 8, height: 8, background: '#1e293b', borderRadius: '50%', border: '2px solid white' }}></div>
                <div style={{ position: 'absolute', top: '25%', left: '35%', width: 8, height: 8, background: '#1e293b', borderRadius: '50%', border: '2px solid white' }}></div>
              </div>
            </article>

            {/* IA en Tiempo Real */}
            <article className="bottom-panel">
              <h2 className="section-title">IA en Tiempo Real</h2>
              <div className="terminal-list">
                <div className="terminal-item info">
                  <span className="terminal-time">[IA:Sys]</span>
                  <span className="terminal-text">Actualizando scores operacionales en tiempo real...</span>
                </div>
                <div className="terminal-item critical">
                  <span className="terminal-time">[IA:Alert]</span>
                  <span className="terminal-text">Clúster de reclamos concentrado en Zona Norte. Ajustando ponderador de riesgo.</span>
                </div>
                <div className="terminal-item warning">
                  <span className="terminal-time">[IA:Graph]</span>
                  <span className="terminal-text">Analizando relaciones secundarias de Taller Express (profundidad 3).</span>
                </div>
              </div>
            </article>
          </section>

        </main>
      </div>
    </div>
  )
}

