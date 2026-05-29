import { useState } from 'react'
import {
  Bell, CirclesThree, House, MapTrifold, ShieldCheck,
  Stethoscope, UserCircle, UsersThree, WarningCircle, FileText,
  Brain, SlidersHorizontal, Sliders, Database, Globe, ChatText, Robot, Lightning, User, Lock, Terminal, Shield
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import './ConfigPage.css'

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
  { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes', active: false },
  { label: 'Configuración', icon: SlidersHorizontal, href: '/configuracion', active: true },
]

export function ConfigPage() {
  const [sensitivity, setSensitivity] = useState(82)
  const [ruleWeight, setRuleWeight] = useState(65)

  return (
    <div className="config-page">
      <div className="config-layout">
        
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
        
          <Link to="/asistente" className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
            <div className="sac-icon"><ShieldCheck size={24} weight="fill" /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p>Asistente inteligente</p>
            </div>
          </Link>
        </aside>

        {/* MAIN CONTENT */}
        <main className="config-main">
          <div className="config-content">
            
            {/* HEADER */}
            <header className="cfg-header">
              <div className="cfg-title">
                <h1>Configuración Inteligente</h1>
                <p>Administración avanzada del motor antifraude y reglas IA</p>
              </div>
              <div className="cfg-actions">
                <div className="cfg-status-pill">
                  <div className="cfg-dot"></div>
                  Sistema Seguro
                </div>
                <button className="cfg-btn-sec">Guardar cambios</button>
                <button className="cfg-btn-pri">Publicar configuración</button>
              </div>
            </header>

            {/* TOP HERO: SYSTEM STATUS (AI BRAIN) */}
            <div className="cfg-hero">
              <div className="cfg-hero-bg"></div>
              <svg className="hero-svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
                {/* Connecting Lines */}
                <path d="M 500 150 L 300 100" className="svg-line" />
                <path d="M 500 150 L 300 100" className="svg-line-pulse" />
                
                <path d="M 500 150 L 300 200" className="svg-line" />
                <path d="M 500 150 L 300 200" className="svg-line-pulse" style={{ animationDelay: '1s' }} />
                
                <path d="M 500 150 L 700 80" className="svg-line" />
                <path d="M 500 150 L 700 80" className="svg-line-pulse" style={{ animationDelay: '2s' }} />
                
                <path d="M 500 150 L 700 220" className="svg-line" />
                <path d="M 500 150 L 700 220" className="svg-line-pulse" style={{ animationDelay: '0.5s' }} />

                <path d="M 500 150 L 500 50" className="svg-line" />
                <path d="M 500 150 L 500 250" className="svg-line" />

                {/* Nodes */}
                <circle cx="300" cy="100" r="24" className="svg-node active" />
                <text x="300" y="100" className="svg-text">NLP</text>
                <text x="300" y="136" className="svg-text-sub">Similarity Engine</text>

                <circle cx="300" cy="200" r="24" className="svg-node active" />
                <text x="300" y="200" className="svg-text">RULES</text>
                <text x="300" y="236" className="svg-text-sub">Business Logic</text>

                <circle cx="700" cy="80" r="24" className="svg-node active" />
                <text x="700" y="80" className="svg-text">RISK</text>
                <text x="700" y="116" className="svg-text-sub">Scoring AI</text>

                <circle cx="700" cy="220" r="24" className="svg-node active" />
                <text x="700" y="220" className="svg-text">NET</text>
                <text x="700" y="256" className="svg-text-sub">Graph Analysis</text>

                <circle cx="500" cy="50" r="20" className="svg-node" />
                <text x="500" y="50" className="svg-text">OCR</text>

                <circle cx="500" cy="250" r="20" className="svg-node" />
                <text x="500" y="250" className="svg-text">XAI</text>

                {/* Central Brain */}
                <circle cx="500" cy="150" r="45" className="svg-node-core" />
                <text x="500" y="145" className="svg-text" style={{ fontSize: '18px' }}>FRAUDIA</text>
                <text x="500" y="165" className="svg-text-sub" style={{ fill: '#a78bfa' }}>CORE SYSTEM</text>
              </svg>
            </div>

            {/* CONFIGURATION GRID */}
            <div className="cfg-grid-2">
              
              {/* SECTION 1: AI RISK ENGINE */}
              <div className="cfg-panel">
                <div className="cfg-panel-header">
                  <div className="cfg-panel-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--cfg-blue)' }}>
                    <Sliders size={20} weight="fill" />
                  </div>
                  <h2>Motor de Riesgo IA</h2>
                </div>
                
                <div className="risk-engine-controls">
                  <div className="risk-ring-container">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="26" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      <circle cx="30" cy="30" r="26" fill="none" stroke={sensitivity > 80 ? 'var(--cfg-red)' : 'var(--cfg-blue)'} strokeWidth="6" strokeDasharray={`${(sensitivity / 100) * 163} 163`} strokeLinecap="round" transform="rotate(-90 30 30)" style={{ transition: 'all 0.3s' }} />
                      <text x="30" y="34" textAnchor="middle" fontSize="14" fontWeight="bold" fill="var(--cfg-darker)">{sensitivity}%</text>
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div className="slider-group">
                        <div className="slider-header">
                          <span>Sensibilidad IA</span>
                          <span className="slider-val" style={{ color: sensitivity > 80 ? 'var(--cfg-red)' : 'var(--cfg-blue)', background: sensitivity > 80 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)' }}>Nivel {sensitivity > 80 ? 'Crítico' : 'Alto'}</span>
                        </div>
                        <input type="range" min="0" max="100" value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className={sensitivity > 80 ? 'slider-critical' : ''} />
                      </div>
                    </div>
                  </div>

                  <div className="slider-group" style={{ marginTop: '8px' }}>
                    <div className="slider-header">
                      <span>Peso de Reglas de Negocio</span>
                      <span className="slider-val" style={{ color: 'var(--cfg-purple)', background: 'rgba(124, 58, 237, 0.1)' }}>{ruleWeight}% Impacto</span>
                    </div>
                    <input type="range" min="0" max="100" value={ruleWeight} onChange={(e) => setRuleWeight(Number(e.target.value))} style={{ accentColor: 'var(--cfg-purple)' }} />
                  </div>
                  
                  <div className="slider-group" style={{ marginTop: '8px' }}>
                    <div className="slider-header">
                      <span>Umbral de Similitud Narrativa</span>
                      <span className="slider-val" style={{ color: 'var(--cfg-orange)', background: 'rgba(249, 115, 22, 0.1)' }}>85% Match</span>
                    </div>
                    <input type="range" min="0" max="100" defaultValue="85" />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BUSINESS RULES */}
              <div className="cfg-panel">
                <div className="cfg-panel-header">
                  <div className="cfg-panel-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--cfg-red)' }}>
                    <Shield size={20} weight="fill" />
                  </div>
                  <h2>Reglas de Negocio</h2>
                </div>
                
                <div className="rules-list">
                  <div className="rule-card">
                    <div className="rule-info">
                      <span className="rule-id">RF-01</span>
                      <div>
                        <div className="rule-name">Pérdida Total por Robo</div>
                        <span className="rule-risk r-crit">Crítico</span>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider-tg"></span>
                    </label>
                  </div>

                  <div className="rule-card">
                    <div className="rule-info">
                      <span className="rule-id">RF-07</span>
                      <div>
                        <div className="rule-name">Narrativa Clonada (&gt;85%)</div>
                        <span className="rule-risk r-crit">Crítico</span>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider-tg"></span>
                    </label>
                  </div>

                  <div className="rule-card">
                    <div className="rule-info">
                      <span className="rule-id">RF-04</span>
                      <div>
                        <div className="rule-name">Dinámica Físicamente Imposible</div>
                        <span className="rule-risk r-warn">Alto</span>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider-tg"></span>
                    </label>
                  </div>
                  
                  <div className="rule-card">
                    <div className="rule-info">
                      <span className="rule-id">RF-12</span>
                      <div>
                        <div className="rule-name">Taller con Historial Sospechoso</div>
                        <span className="rule-risk r-warn">Alto</span>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider-tg"></span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            <div className="cfg-grid-3">
              
              {/* SECTION 3: ANALYST PERMISSIONS */}
              <div className="cfg-panel">
                <div className="cfg-panel-header">
                  <div className="cfg-panel-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--cfg-green)' }}>
                    <Lock size={20} weight="fill" />
                  </div>
                  <h2>Permisos de Analistas</h2>
                </div>
                <div className="rules-list">
                  <div className="analyst-card">
                    <div className="ana-avatar">SA</div>
                    <div className="ana-info">
                      <h4>Supervisor SIU</h4>
                      <p>Control Total + Auditoría</p>
                    </div>
                    <div className="ana-lvl">Nivel 5</div>
                  </div>
                  <div className="analyst-card">
                    <div className="ana-avatar">AA</div>
                    <div className="ana-info">
                      <h4>Analista Antifraude</h4>
                      <p>Visibilidad IA + Reglas</p>
                    </div>
                    <div className="ana-lvl">Nivel 4</div>
                  </div>
                  <div className="analyst-card">
                    <div className="ana-avatar">AU</div>
                    <div className="ana-info">
                      <h4>Auditoría Externa</h4>
                      <p>Solo Lectura Reportes</p>
                    </div>
                    <div className="ana-lvl">Nivel 3</div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: AI MODELS */}
              <div className="cfg-panel">
                <div className="cfg-panel-header">
                  <div className="cfg-panel-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--cfg-purple)' }}>
                    <Brain size={20} weight="fill" />
                  </div>
                  <h2>Modelos IA Activos</h2>
                </div>
                <div className="rules-list">
                  <div className="model-card">
                    <div className="mod-head">
                      <h3 className="mod-title">NLP Similarity Engine</h3>
                      <span className="mod-ver">v2.4.1</span>
                    </div>
                    <div className="mod-metrics">
                      <span className="mod-health"><Lightning size={14} weight="bold"/> Online</span>
                      <span>Load: 42%</span>
                    </div>
                    <div className="mod-bar-bg"><div className="mod-bar-fill" style={{ width: '42%' }}></div></div>
                  </div>
                  
                  <div className="model-card">
                    <div className="mod-head">
                      <h3 className="mod-title">Behavioral Scoring</h3>
                      <span className="mod-ver">v1.8.0</span>
                    </div>
                    <div className="mod-metrics">
                      <span className="mod-health"><Lightning size={14} weight="bold"/> Online</span>
                      <span>Load: 88%</span>
                    </div>
                    <div className="mod-bar-bg"><div className="mod-bar-fill" style={{ width: '88%', background: 'var(--cfg-orange)' }}></div></div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: INTEGRATIONS */}
              <div className="cfg-panel">
                <div className="cfg-panel-header">
                  <div className="cfg-panel-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--cfg-orange)' }}>
                    <Globe size={20} weight="fill" />
                  </div>
                  <h2>Integraciones Core</h2>
                </div>
                <div className="int-grid">
                  <div className="int-node active">
                    <div className="int-icon"><Database size={20} weight="fill" /></div>
                    <div className="int-info">
                      <h4>Oracle DB</h4>
                      <p>12ms latency</p>
                    </div>
                    <div className="int-status on"></div>
                  </div>
                  <div className="int-node active">
                    <div className="int-icon"><ChatText size={20} weight="fill" /></div>
                    <div className="int-info">
                      <h4>WhatsApp</h4>
                      <p>Active</p>
                    </div>
                    <div className="int-status on"></div>
                  </div>
                  <div className="int-node active">
                    <div className="int-icon"><Robot size={20} weight="fill" /></div>
                    <div className="int-info">
                      <h4>OpenAI</h4>
                      <p>API v4</p>
                    </div>
                    <div className="int-status on"></div>
                  </div>
                  <div className="int-node">
                    <div className="int-icon"><FileText size={20} weight="fill" /></div>
                    <div className="int-info">
                      <h4>OCR Legacy</h4>
                      <p>Standby</p>
                    </div>
                    <div className="int-status"></div>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION 6: FORENSIC WORKFLOWS */}
            <div className="cfg-panel" style={{ padding: '0', overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <div className="cfg-panel-header" style={{ padding: '0 0 16px 0', borderBottom: 'none' }}>
                <div className="cfg-panel-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                  <Lightning size={20} weight="fill" />
                </div>
                <h2>Orquestación y Workflows</h2>
              </div>
              
              <div className="workflow-container">
                <div className="wf-path"></div>
                <div className="wf-path-glow"></div>
                
                <div className="wf-step">
                  <div className="wf-icon"><FileText size={24} weight="fill" /></div>
                  <span>Siniestro</span>
                </div>
                
                <div className="wf-step">
                  <div className="wf-icon"><Shield size={24} weight="fill" /></div>
                  <span>Reglas</span>
                </div>

                <div className="wf-step">
                  <div className="wf-icon" style={{ borderColor: 'var(--cfg-purple)', color: '#a78bfa', boxShadow: '0 0 15px rgba(124,58,237,0.3)' }}><Brain size={24} weight="fill" /></div>
                  <span style={{ color: '#a78bfa' }}>Score IA</span>
                </div>

                <div className="wf-step">
                  <div className="wf-icon"><ChatText size={24} weight="fill" /></div>
                  <span>Explicación</span>
                </div>

                <div className="wf-step">
                  <div className="wf-icon"><User size={24} weight="fill" /></div>
                  <span>Analista</span>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: TERMINAL */}
            <div className="terminal-panel">
              <div className="term-header">
                <div className="term-title"><Terminal size={16} /> Live System Activity Feed</div>
                <div className="term-status">● System Healthy</div>
              </div>
              <div className="term-logs">
                <div className="log-line">
                  <span className="log-time">[09:42:15]</span>
                  <span className="log-sys">SYSTEM</span>
                  <span className="log-msg">Modelo NLP Similarity Engine actualizado a v2.4.1 exitosamente.</span>
                </div>
                <div className="log-line">
                  <span className="log-time">[09:43:02]</span>
                  <span className="log-sys">USER: ADMIN</span>
                  <span className="log-msg">Regla de negocio RF-07 modificada: Umbral cambiado a 85%.</span>
                </div>
                <div className="log-line">
                  <span className="log-time">[09:44:11]</span>
                  <span className="log-sys">INTEGRATION</span>
                  <span className="log-msg">Sincronización con base de datos Oracle completada (Latencia: 12ms).</span>
                </div>
                <div className="log-line">
                  <span className="log-time">[09:45:30]</span>
                  <span className="log-warn">WARNING</span>
                  <span className="log-msg">Alta carga detectada en Behavioral Scoring (Load: 88%). Auto-escalado iniciado.</span>
                </div>
                <div className="log-line">
                  <span className="log-time">[09:46:05]</span>
                  <span className="log-sys">SYSTEM</span>
                  <span className="log-msg">Motor de riesgo recalibrado. Nueva sensibilidad: 82%.</span>
                </div>
                <div className="log-line">
                  <span className="log-time">[09:48:12]</span>
                  <span className="log-crit">CRITICAL ALERT</span>
                  <span className="log-msg">Red de fraude detectada en sector Envigado. 3 talleres vinculados. Workflow ejecutado.</span>
                </div>
                <div className="log-line">
                  <span className="log-time">[09:48:15]</span>
                  <span className="log-sys">WORKFLOW</span>
                  <span className="log-msg">Explicación XAI generada. Caso escalado a Analista SIU (Nivel 4).</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
