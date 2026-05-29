import {
  Bell, CirclesThree, House, MapTrifold, ShieldCheck,
  Stethoscope, UserCircle, UsersThree, WarningCircle, FileText,
  SlidersHorizontal, PaperPlaneRight, Microphone,
  MagnifyingGlass, Sparkle, ChatCircle, Warning, ChartLineUp,
  Brain, Network, MapPin, Repeat, ArrowRight
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import './AssistantPage.css'

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
  { label: 'Configuración', icon: SlidersHorizontal, href: '/configuracion', active: false },
]

export function AssistantPage() {
  return (
    <div className="assistant-page">
      <div className="ast-layout">
        
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar" style={{ zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          <div>
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
          </div>
        
          <div className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px', cursor: 'default' }}>
            <div className="sac-icon"><ShieldCheck size={24} weight="fill" /></div>
            <div className="sac-info">
              <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 1, fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
                Chat Activo
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="ast-main">
          <div className="ast-content">
            
            {/* HEADER */}
            <header className="ast-header">
              <div className="ast-title">
                <h1>IA Assistant</h1>
                <p>Tu asistente inteligente para análisis antifraude</p>
              </div>
              <div className="ast-status-pill">
                <div className="ast-status-top">
                  <div className="dot"></div>
                  IA activa
                </div>
                <div className="ast-status-bot">Modelo: FRAUDIA v2.3</div>
              </div>
            </header>

            {/* HERO SECTION */}
            <div className="ast-hero">
              <div className="ast-hero-bg"></div>
              <svg className="ast-hero-svg" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(37,99,235,0.1)" />
                    <stop offset="50%" stopColor="rgba(124,58,237,0.4)" />
                    <stop offset="100%" stopColor="rgba(37,99,235,0.1)" />
                  </linearGradient>
                </defs>
                <path d="M0 150 Q 250 50, 500 150 T 1000 150" />
                <path d="M0 200 Q 250 100, 500 200 T 1000 200" style={{ animationDelay: '-5s', opacity: 0.7 }} />
                <path d="M0 100 Q 250 200, 500 100 T 1000 100" style={{ animationDelay: '-10s', opacity: 0.5 }} />
              </svg>

              <div className="ast-hero-content">
                <div className="ast-greeting">
                  <div className="ast-shield-icon">
                    <ShieldCheck size={36} weight="fill" />
                  </div>
                  <div className="ast-greeting-text">
                    <h2>Hola, María 👋</h2>
                    <p>Soy tu asistente de inteligencia artificial.<br/>¿En qué puedo ayudarte hoy?</p>
                  </div>
                </div>

                <div className="ast-input-box">
                  <input type="text" placeholder="Escribe tu pregunta aquí..." />
                  
                  <div className="ast-input-actions">
                    <div className="ast-input-tags">
                      <span className="ast-tag"><MagnifyingGlass size={16} className="ast-tag-icon" weight="bold"/> Búsqueda profunda</span>
                      <span className="ast-tag"><Sparkle size={16} className="ast-tag-icon" style={{color: 'var(--ast-purple)'}} weight="bold"/> Análisis IA</span>
                      <span className="ast-tag"><span style={{width: 6, height: 6, background: 'var(--ast-green)', borderRadius: '50%', display: 'inline-block', marginRight: 2}}></span> Datos en tiempo real</span>
                    </div>
                    <div className="ast-input-buttons">
                      <button className="ast-btn-mic"><Microphone size={18} weight="fill" /></button>
                      <button className="ast-btn-send"><PaperPlaneRight size={20} weight="fill" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUGGESTED QUESTIONS */}
            <section>
              <h3 className="ast-section-title">Preguntas sugeridas</h3>
              <div className="ast-suggestions-grid">
                <div className="ast-sugg-card">
                  <div className="ast-sugg-head">
                    <div className="ast-sugg-icon icon-blue"><Network size={20} weight="fill" /></div>
                    <h4 className="ast-sugg-title">Patrones de fraude</h4>
                  </div>
                  <p>¿Cuáles son los patrones de fraude más frecuentes en los últimos 30 días?</p>
                  <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                </div>

                <div className="ast-sugg-card">
                  <div className="ast-sugg-head">
                    <div className="ast-sugg-icon icon-purple"><Brain size={20} weight="fill" /></div>
                    <h4 className="ast-sugg-title">Proveedores en riesgo</h4>
                  </div>
                  <p>¿Qué proveedores tienen mayor concentración de casos sospechosos?</p>
                  <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                </div>

                <div className="ast-sugg-card">
                  <div className="ast-sugg-head">
                    <div className="ast-sugg-icon icon-orange"><UsersThree size={20} weight="fill" /></div>
                    <h4 className="ast-sugg-title">Asegurados recurrentes</h4>
                  </div>
                  <p>¿Qué asegurados tienen mayor frecuencia de reclamos atípicos?</p>
                  <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                </div>

                <div className="ast-sugg-card">
                  <div className="ast-sugg-head">
                    <div className="ast-sugg-icon icon-blue"><FileText size={20} weight="fill" /></div>
                    <h4 className="ast-sugg-title">Narrativas similares</h4>
                  </div>
                  <p>Muéstrame los casos con narrativas similares detectadas por la IA.</p>
                  <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                </div>

                <div className="ast-sugg-card">
                  <div className="ast-sugg-head">
                    <div className="ast-sugg-icon icon-red"><Warning size={20} weight="fill" /></div>
                    <h4 className="ast-sugg-title">Alertas críticas</h4>
                  </div>
                  <p>¿Qué alertas críticas requieren atención inmediata?</p>
                  <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                </div>

                <div className="ast-sugg-card">
                  <div className="ast-sugg-head">
                    <div className="ast-sugg-icon icon-green"><ChartLineUp size={20} weight="fill" /></div>
                    <h4 className="ast-sugg-title">Impacto económico</h4>
                  </div>
                  <p>¿Cuál ha sido el impacto económico del fraude detectado este mes?</p>
                  <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                </div>
              </div>
            </section>

            {/* BOTTOM SPLIT */}
            <div className="ast-bottom-grid">
              
              {/* RECENT CONVERSATIONS */}
              <div className="ast-panel">
                <div className="ast-panel-header">
                  <h3>Conversaciones recientes</h3>
                </div>
                <div className="ast-conv-list">
                  <div className="ast-conv-item">
                    <div className="ast-conv-left">
                      <ChatCircle size={18} className="ast-conv-icon" weight="fill" />
                      Análisis de casos críticos en Guayaquil
                    </div>
                    <div className="ast-conv-time">Hoy, 09:42 AM</div>
                  </div>
                  <div className="ast-conv-item">
                    <div className="ast-conv-left">
                      <ChatCircle size={18} className="ast-conv-icon" weight="fill" />
                      Proveedores con mayor riesgo en Pichincha
                    </div>
                    <div className="ast-conv-time">Hoy, 08:15 AM</div>
                  </div>
                  <div className="ast-conv-item">
                    <div className="ast-conv-left">
                      <ChatCircle size={18} className="ast-conv-icon" weight="fill" />
                      Patrones de narrativa clonada detectados
                    </div>
                    <div className="ast-conv-time">Ayer, 04:33 PM</div>
                  </div>
                  <div className="ast-conv-item">
                    <div className="ast-conv-left">
                      <ChatCircle size={18} className="ast-conv-icon" weight="fill" />
                      Impacto económico del fraude Q1 2025
                    </div>
                    <div className="ast-conv-time">Ayer, 11:20 AM</div>
                  </div>
                </div>
              </div>

              {/* AI CAPABILITIES */}
              <div className="ast-panel">
                <div className="ast-panel-header">
                  <h3>Capacidades de IA</h3>
                  <span className="ast-cap-count">6 activas</span>
                </div>
                <div className="ast-cap-list">
                  
                  <div className="ast-cap-item">
                    <div className="ast-sugg-icon icon-blue"><Network size={16} weight="fill" /></div>
                    <div className="ast-cap-info">
                      <h4>Análisis de patrones</h4>
                      <p>Detecta comportamientos anómalos</p>
                    </div>
                  </div>

                  <div className="ast-cap-item">
                    <div className="ast-sugg-icon icon-purple"><ChatCircle size={16} weight="fill" /></div>
                    <div className="ast-cap-info">
                      <h4>Procesamiento de lenguaje</h4>
                      <p>Analiza narrativas y documentos</p>
                    </div>
                  </div>

                  <div className="ast-cap-item">
                    <div className="ast-sugg-icon icon-blue"><Brain size={16} weight="fill" /></div>
                    <div className="ast-cap-info">
                      <h4>Redes y relaciones</h4>
                      <p>Identifica conexiones sospechosas</p>
                    </div>
                  </div>

                  <div className="ast-cap-item">
                    <div className="ast-sugg-icon icon-orange"><Warning size={16} weight="fill" /></div>
                    <div className="ast-cap-info">
                      <h4>Predicción de riesgo</h4>
                      <p>Evalúa probabilidad de fraude</p>
                    </div>
                  </div>

                  <div className="ast-cap-item">
                    <div className="ast-sugg-icon icon-green"><MapPin size={16} weight="fill" /></div>
                    <div className="ast-cap-info">
                      <h4>Análisis geoespacial</h4>
                      <p>Inteligencia de ubicación</p>
                    </div>
                  </div>

                  <div className="ast-cap-item">
                    <div className="ast-sugg-icon icon-red"><Repeat size={16} weight="fill" /></div>
                    <div className="ast-cap-info">
                      <h4>Aprendizaje continuo</h4>
                      <p>Mejora con nuevos datos</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* DISCLAIMER */}
            <div className="ast-disclaimer">
              <ShieldCheck size={18} weight="fill" style={{marginTop: 2}}/>
              <div>
                La IA Assistant proporciona análisis y recomendaciones basadas en datos.<br/>
                Todas las decisiones finales deben ser validadas por analistas humanos.
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
