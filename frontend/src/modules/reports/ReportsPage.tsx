import {
  Bell, CirclesThree, House, MapTrifold, ShieldCheck,
  Stethoscope, UserCircle, UsersThree, WarningCircle, FileText,
  Brain, ArrowRight, ArrowUpRight, ArrowDownRight, Target,
  DownloadSimple, Lightning, Lightbulb, ChartLineUp
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import './ReportsPage.css'

const mainMenu = [
  { label: 'Centro de inteligencia', icon: House, href: '/demo', active: false },
  { label: 'Casos críticos', icon: WarningCircle, href: '/casos-criticos', badge: '18', active: false },
  { label: 'Alertas IA', icon: Bell, href: '/alertas-ia', active: false },
  { label: 'Mapa de siniestros', icon: MapTrifold, href: '/mapa-siniestros', active: false },
  { label: 'Narrativas similares', icon: CirclesThree, href: '/narrativas-similares', active: false },
]

const entityMenu = [
  { label: 'Vehículos', icon: FileText, href: '/vehiculos', active: false },
  { label: 'Proveedores', icon: UsersThree, href: '/proveedores', active: false },
  { label: 'Asegurados', icon: UserCircle, href: '/demo', active: false },
  { label: 'Talleres', icon: Stethoscope, href: '/demo', active: false },
]

const toolMenu = [
  { label: 'Calculadora de riesgo', icon: ShieldCheck, href: '/calculadora', active: false },
  { label: 'Reportes Inteligentes', icon: ChartLineUp, href: '/reportes', active: true },
]

export function ReportsPage() {
  return (
    <div className="reports-page">
      <div className="reports-layout">
        
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar" style={{ zIndex: 10 }}>
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
                  <Link key={item.label} to={item.href} className={`dashboard-nav-item ${item.active ? 'is-active' : ''}`}>
                    <Icon size={18} weight="bold" />
                    <span>{item.label}</span>
                    {item.badge ? <strong>{item.badge}</strong> : null}
                  </Link>
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
                  <Link key={item.label} to={item.href} className={`dashboard-nav-item ${item.active ? 'is-active' : ''}`}>
                    <Icon size={18} weight="bold" />
                    <span>{item.label}</span>
                  </Link>
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
                  <Link key={item.label} to={item.href} className={`dashboard-nav-item ${item.active ? 'is-active' : ''}`}>
                    <Icon size={18} weight="bold" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="reports-main">
          <div className="reports-content">
            
            {/* TOPBAR */}
            <header className="rep-header">
              <div className="rep-title">
                <h1>Reportes Inteligentes</h1>
                <p>Análisis ejecutivo y monitoreo estratégico de fraude</p>
              </div>
              <div className="rep-actions">
                <div className="ai-status">
                  <div className="ai-dot"></div>
                  IA Analítica Activa
                </div>
                <button className="rep-btn-sec">
                  <DownloadSimple size={16} weight="bold" style={{ display: 'inline', marginRight: '6px' }} />
                  Exportar PDF
                </button>
                <button className="rep-btn-pri">
                  + Generar reporte
                </button>
              </div>
            </header>

            {/* EXECUTIVE OVERVIEW (HERO) */}
            <div className="rep-hero">
              <div className="hero-particle" style={{ left: '10%', animationDelay: '0s' }}></div>
              <div className="hero-particle" style={{ left: '30%', animationDelay: '2s' }}></div>
              <div className="hero-particle" style={{ left: '60%', animationDelay: '1s' }}></div>
              <div className="hero-particle" style={{ left: '85%', animationDelay: '3s' }}></div>
              
              <div className="hero-main-metric">
                <h2>$4.8M</h2>
                <p>Bajo Investigación Activa</p>
              </div>

              <div className="hero-secondary-metrics">
                <div className="hero-stat">
                  <span className="val">18</span>
                  <span className="lbl">Casos Críticos</span>
                </div>
                <div className="hero-stat">
                  <span className="val">32</span>
                  <span className="lbl">Redes Sospechosas</span>
                </div>
                <div className="hero-stat">
                  <span className="val">87%</span>
                  <span className="lbl">Precisión IA</span>
                </div>
                <div className="hero-stat">
                  <span className="val">124</span>
                  <span className="lbl">Alertas Procesadas</span>
                </div>
              </div>
            </div>

            {/* KPI INTELLIGENCE ROW */}
            <div className="kpi-row">
              <div className="kpi-card kpi-red">
                <div className="kpi-title">Casos alto riesgo</div>
                <div className="kpi-value-row">
                  <span className="val">18</span>
                  <span className="delta up"><ArrowUpRight weight="bold"/> +12%</span>
                </div>
              </div>
              <div className="kpi-card kpi-purple">
                <div className="kpi-title">Pérdidas evitadas</div>
                <div className="kpi-value-row">
                  <span className="val">$1.2M</span>
                  <span className="delta neutral"><ArrowUpRight weight="bold"/> +8%</span>
                </div>
              </div>
              <div className="kpi-card kpi-orange">
                <div className="kpi-title">Narrativas clonadas</div>
                <div className="kpi-value-row">
                  <span className="val">87</span>
                  <span className="delta up"><ArrowUpRight weight="bold"/> +15%</span>
                </div>
              </div>
              <div className="kpi-card kpi-red">
                <div className="kpi-title">Talleres observados</div>
                <div className="kpi-value-row">
                  <span className="val">32</span>
                  <span className="delta neutral"><ArrowRight weight="bold"/> 0%</span>
                </div>
              </div>
              <div className="kpi-card kpi-blue">
                <div className="kpi-title">T. Promedio Detección</div>
                <div className="kpi-value-row">
                  <span className="val">1.8h</span>
                  <span className="delta down"><ArrowDownRight weight="bold"/> -20%</span>
                </div>
              </div>
            </div>

            {/* FORENSIC ANALYTICS */}
            <div className="forensic-grid">
              
              {/* Left: AI Fraud Trends */}
              <div className="forensic-panel">
                <div className="panel-header">
                  <h3><Lightning size={18} weight="fill" color="var(--rep-blue)"/> Tendencias de Fraude e IA (Proyección)</h3>
                </div>
                <div className="trend-chart-container">
                  <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    {/* Area under historical line */}
                    <path d="M0 150 Q 100 120, 200 80 T 400 100 L 400 200 L 0 200 Z" className="trend-area" />
                    {/* Historical Line */}
                    <path d="M0 150 Q 100 120, 200 80 T 400 100" className="trend-line" />
                    {/* Predictive Line */}
                    <path d="M400 100 Q 500 130, 600 50" className="trend-line-pred" />
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#e2e8f0" strokeDasharray="4 4" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#e2e8f0" strokeDasharray="4 4" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#e2e8f0" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>

              {/* Right: Risk Distribution */}
              <div className="forensic-panel">
                <div className="panel-header">
                  <h3><Target size={18} weight="fill" color="var(--rep-red)"/> Distribución de Riesgo</h3>
                </div>
                <div className="radial-container">
                  <svg className="radial-chart" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="16" fill="none" />
                    {/* Green Segment */}
                    <circle cx="50" cy="50" r="40" className="radial-segment rad-green" strokeDasharray="250" strokeDashoffset="120" />
                    {/* Orange Segment */}
                    <circle cx="50" cy="50" r="40" className="radial-segment rad-orange" strokeDasharray="250" strokeDashoffset="200" />
                    {/* Red Segment */}
                    <circle cx="50" cy="50" r="40" className="radial-segment rad-red" strokeDasharray="250" strokeDashoffset="220" />
                  </svg>
                  
                  <div className="radial-legend">
                    <div className="legend-item"><span className="leg-label"><span className="leg-dot" style={{background:'#10b981'}}></span> Bajo (Verde)</span> <span>52%</span></div>
                    <div className="legend-item"><span className="leg-label"><span className="leg-dot" style={{background:'#f97316'}}></span> Medio (Amarillo)</span> <span>34%</span></div>
                    <div className="legend-item"><span className="leg-label"><span className="leg-dot" style={{background:'#ef4444'}}></span> Crítico (Rojo)</span> <span>14%</span></div>
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM GRID */}
            <div className="bottom-grid">
              
              {/* Report Generator */}
              <div className="generator-panel">
                <div className="panel-header">
                  <h3><FileText size={18} weight="fill" /> Configuración de Reporte</h3>
                </div>
                
                <div className="gen-grid">
                  <div className="gen-group">
                    <label>Tipo de reporte</label>
                    <select className="gen-select">
                      <option>Ejecutivo</option>
                      <option>Auditoría</option>
                      <option>Riesgo operativo</option>
                      <option>Red sospechosa</option>
                    </select>
                  </div>
                  <div className="gen-group">
                    <label>Periodo</label>
                    <select className="gen-select">
                      <option>Últimos 30 días</option>
                      <option>Últimos 90 días</option>
                      <option>Este año</option>
                    </select>
                  </div>
                  <div className="gen-group">
                    <label>Nivel de Riesgo</label>
                    <select className="gen-select">
                      <option>Solo Críticos</option>
                      <option>Medios y Críticos</option>
                      <option>Todos</option>
                    </select>
                  </div>
                  <div className="gen-group">
                    <label>Ciudad</label>
                    <select className="gen-select">
                      <option>Nacional (Global)</option>
                      <option>Quito</option>
                      <option>Guayaquil</option>
                    </select>
                  </div>
                </div>

                <button className="gen-btn">Generar Análisis IA</button>
              </div>

              {/* AI Live Summary */}
              <div className="ai-summary-panel">
                <div className="ai-scan-line"></div>
                <div className="panel-header" style={{ marginBottom: 0 }}>
                  <h3 style={{ color: 'white' }}><Brain size={20} weight="fill" color="#a78bfa" /> Resumen Analítico IA</h3>
                </div>
                <div className="ai-text">
                  <p>La IA identificó un incremento del <span className="ai-highlight">18%</span> en patrones de narrativa similar durante los últimos 30 días, sugiriendo la actividad de una red coordinada.</p>
                  <p>Las ciudades con mayor concentración de alertas fueron <span className="ai-highlight">Quito</span> y <span className="ai-highlight">Guayaquil</span>.</p>
                  <p>Adicionalmente, <span className="ai-highlight">tres proveedores</span> concentran el 42% de los casos críticos observados, requiriendo revisión de contratos.</p>
                </div>
              </div>

            </div>

            {/* PREDICTIVE INSIGHTS */}
            <div>
              <div className="panel-header" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px' }}><Lightbulb size={20} weight="fill" color="var(--rep-orange)"/> Insights Predictivos (Forecasting)</h3>
              </div>
              <div className="predictive-row">
                <div className="pred-card">
                  <div className="pred-icon"><WarningCircle size={24} weight="fill" /></div>
                  <div className="pred-info">
                    <h4>Posible incremento de fraude vehicular en próximos 15 días</h4>
                    <span className="pred-confidence">92% Confianza</span>
                  </div>
                </div>
                <div className="pred-card">
                  <div className="pred-icon"><UsersThree size={24} weight="fill" /></div>
                  <div className="pred-info">
                    <h4>Proveedor principal con patrón operativo anómalo</h4>
                    <span className="pred-confidence">84% Confianza</span>
                  </div>
                </div>
                <div className="pred-card">
                  <div className="pred-icon"><FileText size={24} weight="fill" /></div>
                  <div className="pred-info">
                    <h4>Alta recurrencia proyectada en pólizas de reciente emisión</h4>
                    <span className="pred-confidence">76% Confianza</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
