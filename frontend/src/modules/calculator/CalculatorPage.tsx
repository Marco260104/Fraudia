import { useState } from 'react'
import { Brain, ShieldCheck, Spinner, WarningDiamond } from '@phosphor-icons/react'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import { API_BASE_URL } from '../../config/api'
import './CalculatorPage.css'

export function CalculatorPage() {
  const [fechaEvento, setFechaEvento] = useState('')
  const [ramo, setRamo] = useState('Vehículos')
  const [montoReclamado, setMontoReclamado] = useState('')
  const [placa, setPlaca] = useState('')
  const [idProveedor, setIdProveedor] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState(false)

  const handleSimulate = async () => {
    if (!fechaEvento || !montoReclamado) {
      alert("Por favor completa los campos obligatorios: Fecha del evento y Monto reclamado.")
      return
    }

    setIsLoading(true)
    setError(false)
    setResult(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/calculator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha_evento: fechaEvento,
          ramo: ramo,
          monto_reclamado: parseFloat(montoReclamado),
          placa: placa,
          id_proveedor: idProveedor
        })
      })

      if (!res.ok) throw new Error('Error en el backend')
      
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    if (level === 'Alto') return '#ef4444' // red
    if (level === 'Medio') return '#f59e0b' // yellow
    return '#10b981' // green
  }

  return (
    <div className={`calc-page`}>
      <div className="calc-layout">
        
        {/* SIDEBAR */}
        <DashboardSidebar activeRoute="/calculadora" />

        {/* MAIN CONTENT */}
        <main className="calc-main">
          <div className="calc-content" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            
            {/* HEADER */}
            <header className="calc-header" style={{ marginBottom: '32px' }}>
              <div className="calc-title-group">
                <h1>Calculadora de Riesgo IA</h1>
                <p>Evalúa el riesgo de un nuevo siniestro en tiempo real</p>
              </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              {/* FORMULARIO */}
              <div style={{ background: '#1c1c1f', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={24} weight="bold" color="#60a5fa" /> Datos del Siniestro
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#c4c5cc' }}>Fecha del evento *</span>
                    <input 
                      type="date" 
                      value={fechaEvento}
                      onChange={e => setFechaEvento(e.target.value)}
                      style={{ background: '#121214', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '6px', colorScheme: 'dark' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#c4c5cc' }}>Ramo *</span>
                    <select 
                      value={ramo}
                      onChange={e => setRamo(e.target.value)}
                      style={{ background: '#121214', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '6px' }}
                    >
                      <option value="Vehículos">Vehículos</option>
                      <option value="Salud">Salud</option>
                      <option value="Hogar">Hogar</option>
                      <option value="Vida">Vida</option>
                    </select>
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#c4c5cc' }}>Monto reclamado ($) *</span>
                    <input 
                      type="number" 
                      placeholder="Ej: 15000"
                      value={montoReclamado}
                      onChange={e => setMontoReclamado(e.target.value)}
                      style={{ background: '#121214', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '6px' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#c4c5cc' }}>Placa del vehículo (Opcional)</span>
                    <input 
                      type="text" 
                      placeholder="Ej: ABC-1234"
                      value={placa}
                      onChange={e => setPlaca(e.target.value)}
                      style={{ background: '#121214', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '6px' }}
                    />
                  </label>

                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.875rem', color: '#c4c5cc' }}>ID Proveedor/Taller (Opcional)</span>
                    <input 
                      type="text" 
                      placeholder="Ej: TALLER-001"
                      value={idProveedor}
                      onChange={e => setIdProveedor(e.target.value)}
                      style={{ background: '#121214', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '6px' }}
                    />
                  </label>
                </div>

                <button 
                  className="btn-run" 
                  onClick={handleSimulate}
                  disabled={isLoading}
                  style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  {isLoading ? <Spinner size={20} className="spinner-anim" /> : null}
                  {isLoading ? 'Calculando...' : 'Calcular Score'}
                </button>
              </div>

              {/* RESULTADOS */}
              <div style={{ background: '#1c1c1f', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={24} weight="bold" color="#a78bfa" /> Resultados del Modelo
                </h3>

                {error ? (
                  <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '16px', borderRadius: '8px', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                    <WarningDiamond size={24} weight="bold" style={{ marginBottom: '8px' }} />
                    <p>Ocurrió un error al contactar al motor de IA. Revisa la conexión con el backend.</p>
                  </div>
                ) : result ? (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px', padding: '24px', background: '#121214', borderRadius: '8px', border: `1px solid ${getLevelColor(result.level)}` }}>
                      <span style={{ fontSize: '1rem', color: '#c4c5cc', textTransform: 'uppercase', letterSpacing: '1px' }}>Riesgo {result.level}</span>
                      <div style={{ fontSize: '4rem', fontWeight: 800, color: getLevelColor(result.level), lineHeight: 1 }}>
                        {result.score}
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: '#e4e4e7' }}>Explicabilidad (Alertas detectadas)</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0, listStyle: 'none' }}>
                        {result.alerts.map((alert: string, idx: number) => (
                          <li key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '6px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <WarningDiamond size={16} color={getLevelColor(result.level)} weight="fill" />
                            {alert}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: '#8f9099' }}>
                      <span>Modelo utilizado: <strong style={{ color: '#c4c5cc' }}>{result.model}</strong></span>
                      {result.model === 'rules_fallback' && (
                        <span style={{ background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          Modo reglas
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#63636b' }}>
                    <ShieldCheck size={48} weight="thin" style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ textAlign: 'center', maxWidth: '250px' }}>Ingresa los datos del siniestro y calcula el score para ver los resultados.</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner-anim { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  )
}
