import { useState } from 'react'
import {
  Bell, CirclesThree, House, MapTrifold, ShieldCheck,
  Stethoscope, UserCircle, UsersThree, WarningCircle, FileText,
  Brain, ArrowRight, SlidersHorizontal
} from '@phosphor-icons/react'
import './CalculatorPage.css'

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
  { label: 'Calculadora de riesgo', icon: ShieldCheck, href: '/calculadora', active: true },
  { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes', active: false },
  { label: 'Configuración', icon: SlidersHorizontal, href: '/configuracion', active: false },
]

export function CalculatorPage() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [score, setScore] = useState(64)
  const [simComplete, setSimComplete] = useState(false)

  const handleSimulate = () => {
    if (isSimulating || simComplete) return
    setIsSimulating(true)
    
    // Simulate score climbing from 64 to 82
    let current = 64
    const target = 82
    
    const interval = setInterval(() => {
      current += 1
      setScore(current)
      
      if (current >= target) {
        clearInterval(interval)
        setIsSimulating(false)
        setSimComplete(true)
      }
    }, 100) // fast climb
  }

  return (
    <div className={`calc-page ${isSimulating ? 'is-simulating' : ''}`}>
      <div className="calc-layout">
        
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
                  <a key={item.label} href={item.href} className={`dashboard-nav-item ${item.active ? 'is-active' : ''}`}>
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
                  <a key={item.label} href={item.href} className={`dashboard-nav-item ${item.active ? 'is-active' : ''}`}>
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
                  <a key={item.label} href={item.href} className={`dashboard-nav-item ${item.active ? 'is-active' : ''}`}>
                    <Icon size={18} weight="bold" />
                    <span>{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="calc-main">
          <div className="calc-content">
            
            {/* HEADER */}
            <header className="calc-header">
              <div className="calc-title-group">
                <h1>Calculadora de Riesgo IA</h1>
                <p>Motor inteligente de evaluación antifraude en tiempo real</p>
              </div>
              <div className="calc-actions">
                <div className="ai-status">
                  <div className="ai-dot"></div>
                  IA activa
                </div>
                <button className="btn-run" onClick={handleSimulate}>
                  {simComplete ? 'Evaluación completada' : isSimulating ? 'Procesando...' : '+ Ejecutar evaluación'}
                </button>
              </div>
            </header>

            {/* THREE COLUMNS */}
            <div className="calc-grid">
              
              {/* LEFT: INPUT MODULES */}
              <div className="input-modules">
                <div className="input-module">
                  <label>Monto reclamado</label>
                  <div className="val">$28,500</div>
                </div>
                <div className="input-module">
                  <label>Días desde inicio de póliza</label>
                  <div className="val">8 días</div>
                </div>
                <div className="input-module critical">
                  <label>Narrativa similar detectada</label>
                  <div className="val" style={{ color: '#ef4444' }}>87%</div>
                </div>
                <div className="input-module critical">
                  <label>Documentos inconsistentes</label>
                  <div className="val" style={{ color: '#ef4444' }}>2 encontrados</div>
                </div>
                <div className="input-module">
                  <label>Proveedor asociado</label>
                  <div className="val">Taller Express Norte</div>
                </div>
                <div className="input-module">
                  <label>Historial del asegurado</label>
                  <div className="val">3 reclamos (18 meses)</div>
                </div>
              </div>

              {/* CENTER: AI CORE */}
              <div className="ai-core-container">
                <div className="ai-reactor">
                  <div className="ring ring-outer"></div>
                  <div className="ring ring-mid"></div>
                  <div className="ring ring-inner"></div>
                  
                  {/* Particles generated randomly (pure css via nth-child mapping if preferred, but doing statically here for simplicity) */}
                  <div className="particle" style={{ top: '30%', left: '20%', '--tx': '-40px', '--ty': '-60px', animationDelay: '0s' } as any}></div>
                  <div className="particle" style={{ top: '60%', left: '80%', '--tx': '50px', '--ty': '20px', animationDelay: '1s' } as any}></div>
                  <div className="particle" style={{ top: '80%', left: '30%', '--tx': '-20px', '--ty': '50px', animationDelay: '2s' } as any}></div>
                  <div className="particle" style={{ top: '20%', left: '70%', '--tx': '40px', '--ty': '-40px', animationDelay: '1.5s' } as any}></div>

                  <div className="core-sphere">
                    <div className="core-score">{score}</div>
                    <div className="core-label">RIESGO ALTO</div>
                  </div>
                </div>
              </div>

              {/* RIGHT: RISK ANALYSIS SYSTEM */}
              <div className="risk-system">
                
                {/* 1. Risk Factors */}
                <div className="risk-panel">
                  <h3 className="panel-title">Factores de Riesgo</h3>
                  <div className="factor-list">
                    
                    <div className="factor-item">
                      <div className="factor-head">
                        <span>Narrativa sospechosa</span>
                        <span>87%</span>
                      </div>
                      <div className="factor-bar-bg">
                        <div className="factor-bar-fill fill-red" style={{ width: isSimulating ? '87%' : '10%' }}></div>
                      </div>
                    </div>
                    
                    <div className="factor-item">
                      <div className="factor-head">
                        <span>Frecuencia de reclamos</span>
                        <span>82%</span>
                      </div>
                      <div className="factor-bar-bg">
                        <div className="factor-bar-fill fill-red" style={{ width: isSimulating ? '82%' : '10%' }}></div>
                      </div>
                    </div>
                    
                    <div className="factor-item">
                      <div className="factor-head">
                        <span>Proveedor recurrente</span>
                        <span>73%</span>
                      </div>
                      <div className="factor-bar-bg">
                        <div className="factor-bar-fill fill-orange" style={{ width: isSimulating ? '73%' : '10%' }}></div>
                      </div>
                    </div>

                    <div className="factor-item">
                      <div className="factor-head">
                        <span>Monto atípico</span>
                        <span>91%</span>
                      </div>
                      <div className="factor-bar-bg">
                        <div className="factor-bar-fill fill-red" style={{ width: isSimulating ? '91%' : '10%' }}></div>
                      </div>
                    </div>

                    <div className="factor-item">
                      <div className="factor-head">
                        <span>Reporte tardío</span>
                        <span>64%</span>
                      </div>
                      <div className="factor-bar-bg">
                        <div className="factor-bar-fill fill-blue" style={{ width: isSimulating ? '64%' : '10%' }}></div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. Rules Activated */}
                <div className="risk-panel">
                  <h3 className="panel-title">Reglas Activadas (Motor IA)</h3>
                  <div className="rules-list">
                    <div className="rule-item" style={{ opacity: isSimulating || simComplete ? 1 : 0.5 }}>
                      <span className="rule-badge">RF-05</span>
                      <span className="rule-desc">Siniestro cerca de vigencia</span>
                      <span className="rule-pts">+8 pts</span>
                    </div>
                    <div className="rule-item" style={{ opacity: isSimulating || simComplete ? 1 : 0.5 }}>
                      <span className="rule-badge">RF-07</span>
                      <span className="rule-desc">Narrativa clonada</span>
                      <span className="rule-pts">+8 pts</span>
                    </div>
                    <div className="rule-item" style={{ opacity: isSimulating || simComplete ? 1 : 0.5 }}>
                      <span className="rule-badge">RF-02</span>
                      <span className="rule-desc">Documento inconsistente</span>
                      <span className="rule-pts">+10 pts</span>
                    </div>
                  </div>
                </div>

                {/* 3. AI Explanation Panel */}
                <div className="copilot-panel">
                  <div className="copilot-title">
                    <Brain size={16} weight="bold" />
                    Análisis Cognitivo
                  </div>
                  <div className="copilot-text">
                    La IA detectó múltiples patrones atípicos asociados históricamente a casos de alto riesgo de fraude.
                    <ul>
                      <li>Narrativa con 87% de similitud</li>
                      <li>Reclamo cercano al inicio de póliza</li>
                      <li>Proveedor asociado a alertas previas</li>
                      <li>Reporte tardío del evento</li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>

            {/* BOTTOM: LIVE SIMULATION */}
            <div className="sim-panel">
              <div className="sim-info">
                <h3>Simulación Operacional</h3>
                <p>Monitoreando impacto probabilístico en tiempo real a medida que se procesan las reglas.</p>
              </div>
              <div className="sim-score-display">
                <span className="score-old">64</span>
                <ArrowRight weight="bold" className="score-arrow" />
                <span className="score-new">{score}</span>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
