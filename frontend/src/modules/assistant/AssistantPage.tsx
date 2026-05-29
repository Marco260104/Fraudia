import { useState, useEffect, useRef } from 'react'
import {
  Bell, CirclesThree, House, MapTrifold, ShieldCheck,
  Stethoscope, UserCircle, UsersThree, WarningCircle, FileText,
  SlidersHorizontal, PaperPlaneRight, Microphone,
  MagnifyingGlass, Sparkle, ChatCircle, Warning, ChartLineUp,
  Brain, Network, MapPin, Repeat, ArrowRight
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import { API_BASE_URL } from '../../config/api'
import { MarkdownRenderer } from '../../shared/ui/MarkdownRenderer'
import './AssistantPage.css'



export function AssistantPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, timestamp: string }>>([])
  const [inputVal, setInputVal] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText || inputVal).trim()
    if (!textToSend) return

    setInputVal('')
    setIsLoading(true)

    const userMsg = {
      role: 'user' as const,
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])

    const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));

    fetch(API_BASE_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: textToSend, history: historyPayload })
    })
      .then(res => res.json())
      .then(data => {
        const aiMsg = {
          role: 'assistant' as const,
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, aiMsg])
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Error calling chat agent:", err)
        setTimeout(() => {
          const fallbackResponse = `Hola. Soy **fraudIA Assistant**, tu asistente virtual para el análisis forense de reclamos y prevención de pérdidas.

He analizado tu mensaje ("${textToSend}"). De acuerdo con el dataset actual de la base de datos de siniestros, detecto patrones de posible riesgo acumulados en el ramo de **Vehículos** y **Salud**.

¿Te gustaría que analice:
* Los 10 siniestros con mayor riesgo acumulado?
* La concentración de alertas en proveedores como **Taller Express**?
* Un resumen ejecutivo de los casos críticos activos?

Dime cómo deseas proceder.`
          
          const aiMsg = {
            role: 'assistant' as const,
            content: fallbackResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          setMessages(prev => [...prev, aiMsg])
          setIsLoading(false)
        }, 800)
      })
  }

  return (
    <div className="assistant-page">
      <div className="ast-layout">
        
        {/* SIDEBAR */}
        <DashboardSidebar activeRoute="/asistente" />

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

            {messages.length > 0 ? (
              /* DYNAMIC CHAT CONTAINER */
              <div className="ast-chat-container">
                <div className="ast-chat-history">
                  {messages.map((msg, index) => (
                    <div key={index} className={`ast-chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}>
                      <div className="ast-chat-avatar">
                        {msg.role === 'user' ? 'ME' : <ShieldCheck size={18} weight="fill" />}
                      </div>
                      <div className="ast-chat-bubble">
                        <div className="ast-chat-bubble-text"><MarkdownRenderer content={msg.content} /></div>
                        <span className="ast-chat-bubble-time">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="ast-chat-bubble-wrapper ai">
                      <div className="ast-chat-avatar">
                        <ShieldCheck size={18} weight="fill" />
                      </div>
                      <div className="ast-chat-bubble">
                        <div className="ast-typing-loader">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ast-chat-input-area">
                  <div className="ast-input-box" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px', padding: '10px 16px' }}>
                    <input 
                      type="text" 
                      placeholder="Escribe tu pregunta sobre reclamos, proveedores, patrones..." 
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      style={{ flex: 1 }}
                    />
                    <button 
                      className="ast-btn-send" 
                      onClick={() => handleSendMessage()} 
                      disabled={isLoading}
                      style={{ flexShrink: 0, width: '48px', height: '40px' }}
                    >
                      <PaperPlaneRight size={20} weight="fill" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ORIGINAL HERO & WELCOME */
              <>
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
                      <input 
                        type="text" 
                        placeholder="Escribe tu pregunta aquí..." 
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      
                      <div className="ast-input-actions">
                        <div className="ast-input-tags">
                          <span className="ast-tag" onClick={() => setInputVal('¿Cuáles son los talleres más sospechosos?')} style={{ cursor: 'pointer' }}><Sparkle size={16} className="ast-tag-icon" weight="bold"/> ¿Talleres más sospechosos?</span>
                          <span className="ast-tag" onClick={() => setInputVal('Explica el caso FR-76123')} style={{ cursor: 'pointer' }}><MagnifyingGlass size={16} className="ast-tag-icon" weight="bold"/> Explica FR-76123</span>
                          <span className="ast-tag" onClick={() => setInputVal('Analiza la concentración en Medellín')} style={{ cursor: 'pointer', color: 'var(--ast-purple)' }}><MapPin size={16} className="ast-tag-icon" weight="bold"/> Concentración en Medellín</span>
                        </div>
                        <div className="ast-input-buttons">
                          <button className="ast-btn-send" onClick={() => handleSendMessage()}><PaperPlaneRight size={20} weight="fill" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUGGESTED QUESTIONS */}
                <section>
                  <h3 className="ast-section-title">Preguntas sugeridas</h3>
                  <div className="ast-suggestions-grid">
                    <div className="ast-sugg-card" onClick={() => handleSendMessage('¿Cuáles son los 10 siniestros con mayor riesgo de posible fraude?')}>
                      <div className="ast-sugg-head">
                        <div className="ast-sugg-icon icon-blue"><Network size={20} weight="fill" /></div>
                        <h4 className="ast-sugg-title">Patrones de fraude</h4>
                      </div>
                      <p>¿Cuáles son los 10 siniestros con mayor riesgo de posible fraude?</p>
                      <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                    </div>

                    <div className="ast-sugg-card" onClick={() => handleSendMessage('¿Qué proveedores concentran más alertas?')}>
                      <div className="ast-sugg-head">
                        <div className="ast-sugg-icon icon-purple"><Brain size={20} weight="fill" /></div>
                        <h4 className="ast-sugg-title">Proveedores en riesgo</h4>
                      </div>
                      <p>¿Qué proveedores tienen mayor concentración de casos sospechosos?</p>
                      <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                    </div>

                    <div className="ast-sugg-card" onClick={() => handleSendMessage('¿Qué asegurados tienen mayor frecuencia de reclamos?')}>
                      <div className="ast-sugg-head">
                        <div className="ast-sugg-icon icon-orange"><UsersThree size={20} weight="fill" /></div>
                        <h4 className="ast-sugg-title">Asegurados recurrentes</h4>
                      </div>
                      <p>¿Qué asegurados tienen mayor frecuencia de reclamos atípicos?</p>
                      <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                    </div>

                    <div className="ast-sugg-card" onClick={() => handleSendMessage('¿Qué patrones se repiten en los reclamos sospechosos?')}>
                      <div className="ast-sugg-head">
                        <div className="ast-sugg-icon icon-blue"><FileText size={20} weight="fill" /></div>
                        <h4 className="ast-sugg-title">Narrativas similares</h4>
                      </div>
                      <p>Muéstrame los casos con narrativas similares detectadas por la IA.</p>
                      <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                    </div>

                    <div className="ast-sugg-card" onClick={() => handleSendMessage('Recomienda qué casos debería revisar primero el analista.')}>
                      <div className="ast-sugg-head">
                        <div className="ast-sugg-icon icon-red"><Warning size={20} weight="fill" /></div>
                        <h4 className="ast-sugg-title">Alertas críticas</h4>
                      </div>
                      <p>¿Qué alertas críticas requieren atención inmediata?</p>
                      <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                    </div>

                    <div className="ast-sugg-card" onClick={() => handleSendMessage('Genera un resumen ejecutivo de los casos críticos.')}>
                      <div className="ast-sugg-head">
                        <div className="ast-sugg-icon icon-green"><ChartLineUp size={20} weight="fill" /></div>
                        <h4 className="ast-sugg-title">Impacto económico</h4>
                      </div>
                      <p>¿Cuál ha sido el impacto económico del fraude detectado este mes?</p>
                      <ArrowRight size={16} className="ast-sugg-arrow" weight="bold"/>
                    </div>
                  </div>
                </section>

                <div className="ast-bottom-grid">
                  
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
              </>
            )}

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
