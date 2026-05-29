import { useEffect, useState, type CSSProperties } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, ShieldCheck, Warning, Clock, User, 
  CarSimple, Stethoscope, FileText, CheckSquare, Chats,
  PushPin, CaretDown, Check
} from '@phosphor-icons/react'
import { API_BASE_URL } from '../../config/api'
import { toast } from 'sonner'

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [caseData, setCaseData] = useState<any>(null)
  
  // Interactive audit states
  const [priority, setPriority] = useState('Alta')
  const [auditState, setAuditState] = useState('Bajo revisión')
  const [auditNotes, setAuditNotes] = useState('')
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    docs: false,
    police: false,
    provider: false,
    photos: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    
    // Clean id format
    const cleanId = id.replace('#', '')
    
    fetch(`${API_BASE_URL}/api/cases/${cleanId}`)
      .then(res => {
        if (!res.ok) throw new Error('Caso no encontrado')
        return res.json()
      })
      .then(data => {
        setCaseData(data)
        setPriority(data.priority || 'Alta')
        setAuditState(data.state || 'Bajo revisión')
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching single case:', err)
        toast.error('Error al cargar expediente del siniestro')
        setLoading(false)
      })
  }, [id])

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveAudit = () => {
    if (!id) return
    setIsSubmitting(true)
    const cleanId = id.replace('#', '')
    
    fetch(`${API_BASE_URL}/api/cases/${cleanId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: auditState, 
        notes: `Prioridad: ${priority}. Notas: ${auditNotes}. Checklist: ${JSON.stringify(checklist)}` 
      })
    })
      .then(res => res.json())
      .then(() => {
        toast.success('Expediente de auditoría actualizado correctamente')
        setIsSubmitting(false)
      })
      .catch(err => {
        console.error(err)
        toast.error('Error al guardar expediente')
        setIsSubmitting(false)
      })
  }

  if (loading) {
    return (
      <div className="dashboard-layout" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'radial-gradient(circle at top left, rgba(29, 78, 216, 0.04), transparent 30%), #0f172a' }}>
        <div className="ast-typing-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p style={{ color: '#94a3b8', marginTop: '16px', fontSize: '0.95rem' }}>Cargando expediente forense del siniestro...</p>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="dashboard-layout" style={{ justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: '#0f172a', color: '#fff' }}>
        <Warning size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2>Siniestro No Encontrado</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>El caso solicitado no existe o no tiene registros en la base de datos.</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Volver al Centro de Control</button>
      </div>
    )
  }

  const scoreNum = parseInt(caseData.score || '0', 10)
  const isCritical = scoreNum >= 75
  const isHigh = scoreNum >= 50 && scoreNum < 75

  const breakdown = caseData.score_breakdown || {
    narrative_similarity: 0,
    missing_docs: 0,
    restrictive_list: 0,
    time_proximity: 0,
    reporting_delay: 0
  }

  const dias_inicio = caseData.dias_desde_inicio_poliza || 0

  return (
    <div className="case-detail-page" style={{ background: '#090d16', minHeight: '100vh', color: '#f8fafc', padding: '24px' }}>
      
      {/* HEADER SECTION */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Caso {caseData.id}</h1>
              <span className={`risk-pill ${isCritical ? 'danger' : isHigh ? 'warning' : 'info'}`} style={{ fontSize: '0.8rem', padding: '2px 10px' }}>
                RIESGO {caseData.level ? caseData.level.toUpperCase() : 'ALTO'}
              </span>
            </div>
            <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.85rem' }}>Expediente Asegurado: {caseData.insured} · Ramo: {caseData.branch}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="live-dot" style={{ background: isCritical ? '#ef4444' : '#10b981' }} />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Consenso IA: <strong>{caseData.confianza || '94%'}</strong></span>
          </div>
          <Link to="/asistente" className="btn btn-secondary" style={{ height: '38px', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Chats size={16} /> Consultar Asistente
          </Link>
        </div>
      </header>

      {/* THREE COLUMN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 0.9fr', gap: '24px', alignItems: 'start' }}>
        
        {/* COLUMN 1: EXPLICABILIDAD & NARRATIVA */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* RISK CARD GAUGE */}
          <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#3b82f6" /> Score de Riesgo Integrado
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              
              {/* Radial Score Gauge */}
              <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    stroke={isCritical ? '#f97316' : isHigh ? '#eab308' : '#10b981'} 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * scoreNum) / 100}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <strong style={{ fontSize: '2rem', fontWeight: 800 }}>{caseData.score}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Riesgo</span>
                </div>
              </div>

              {/* Attributions breakdown */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>Similitud Narrativa NLP</span>
                    <strong>+{breakdown.narrative_similarity}%</strong>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#3b82f6', width: `${(breakdown.narrative_similarity / 30) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>Taller en Lista Restrictiva</span>
                    <strong>+{breakdown.restrictive_list}%</strong>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#ef4444', width: `${(breakdown.restrictive_list / 25) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>Cercanía al Inicio de Póliza</span>
                    <strong>+{breakdown.time_proximity}%</strong>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#fb923c', width: `${(breakdown.time_proximity / 20) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1' }}>Demora en Reporte de Siniestro</span>
                    <strong>+{breakdown.reporting_delay}%</strong>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#fb7185', width: `${(breakdown.reporting_delay / 10) * 100}%` }} />
                  </div>
                </div>
              </div>

            </div>
          </article>

          {/* EVENT NARRATIVE */}
          <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#3b82f6" /> Narrativa Declarada del Evento
            </h2>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.95rem', lineHeight: 1.6, color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
              "{caseData.narrative}"
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <div style={{ flex: 1, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)', padding: '12px', borderRadius: '10px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>NLP Cosine Similarity</span>
                <strong style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{caseData.score_breakdown?.narrative_similarity ? `${Math.round((caseData.score_breakdown.narrative_similarity/30)*100)}%` : '0%'}</strong>
              </div>
              <div style={{ flex: 1, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', padding: '12px', borderRadius: '10px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Soporte Documental</span>
                <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>{caseData.docs_completos === 'No' ? 'Incompleto' : 'Completo'}</strong>
              </div>
            </div>
          </article>

        </section>

        {/* COLUMN 2: TIMELINE & RECTIFIED ENTITIES */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* EVENT LIFECYCLE TIMELINE */}
          <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#3b82f6" /> Ciclo de Vida del Siniestro
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '12px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.06)' }} />
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '4px fill #090d16', zIndex: 2, marginTop: '5px', marginLeft: '12px' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Fecha de Emisión Póliza</span>
                  <strong style={{ fontSize: '0.9rem' }}>Póliza Activa desde {caseData.date_report || '26/05/2025'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: dias_inicio < 30 ? '#ef4444' : '#fb923c', zIndex: 2, marginTop: '5px', marginLeft: '12px' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Ocurrencia del Siniestro ({caseData.dias_desde_inicio_poliza} días de vigencia)</span>
                  <strong style={{ fontSize: '0.9rem' }}>Incidente Reportado el {caseData.date}</strong>
                  {dias_inicio < 30 && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#f87171', marginTop: '2px' }}>🚨 Alerta: Siniestro express cercano al inicio de cobertura.</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', zIndex: 2, marginTop: '5px', marginLeft: '12px' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Cómputo Forense IA</span>
                  <strong style={{ fontSize: '0.9rem' }}>Evaluación cognitiva en {caseData.date_report || '28/05/2025'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: isCritical ? '#ef4444' : '#eab308', zIndex: 2, marginTop: '5px', marginLeft: '12px' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Conclusión Auditoría</span>
                  <strong style={{ fontSize: '0.9rem', color: isCritical ? '#f87171' : '#facc15' }}>Prioridad de Revisión: {caseData.priority || 'Alta'}</strong>
                </div>
              </div>
            </div>
          </article>

          {/* CO-RELATED ENTITIES */}
          <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#3b82f6" /> Entidades y Vínculos Asociados
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Asegurado Recurrente</span>
                  <strong style={{ fontSize: '0.9rem' }}>{caseData.insured}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1' }}>Antigüedad: {caseData.insured_info?.antiguedad} años · Histórico: {caseData.insured_info?.reclamos_historicos} reclamos</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                  <CarSimple size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Vehículo Asegurado</span>
                  <strong style={{ fontSize: '0.9rem' }}>Placa {caseData.vehicle}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1' }}>Ubicación Siniestro: {caseData.city}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', background: caseData.provider?.en_lista === 'Sí' || caseData.provider?.en_lista === 'Si' ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.1)', color: caseData.provider?.en_lista === 'Sí' || caseData.provider?.en_lista === 'Si' ? '#ef4444' : '#a855f7' }}>
                  <Stethoscope size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Proveedor / Taller Asociado</span>
                  <strong style={{ fontSize: '0.9rem' }}>{caseData.provider?.nombre}</strong>
                  {caseData.provider?.en_lista === 'Sí' || caseData.provider?.en_lista === 'Si' ? (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#f87171' }}>⚠️ Alerta: Taller observado en Lista Restrictiva ({caseData.provider?.motivo})</span>
                  ) : (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1' }}>Siniestros asociados: {caseData.provider?.siniestros} · Costo prom: {caseData.provider?.promedio_monto}</span>
                  )}
                </div>
              </div>
            </div>
          </article>

        </section>

        {/* COLUMN 3: RECOMMENDATIONS & AUDIT ACTIONS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* AUDIT CHECKLIST */}
          <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={18} color="#3b82f6" /> Checklist de Verificación Forense
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: checklist.docs ? '#10b981' : '#cbd5e1' }} onClick={() => toggleCheck('docs')}>
                <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: checklist.docs ? '#10b981' : 'transparent' }}>
                  {checklist.docs && <Check size={14} color="#000" weight="bold" />}
                </div>
                <span>Validar toda la documentación adjunta</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: checklist.police ? '#10b981' : '#cbd5e1' }} onClick={() => toggleCheck('police')}>
                <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: checklist.police ? '#10b981' : 'transparent' }}>
                  {checklist.police && <Check size={14} color="#000" weight="bold" />}
                </div>
                <span>Confirmar el parte policial oficial</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: checklist.provider ? '#10b981' : '#cbd5e1' }} onClick={() => toggleCheck('provider')}>
                <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: checklist.provider ? '#10b981' : 'transparent' }}>
                  {checklist.provider && <Check size={14} color="#000" weight="bold" />}
                </div>
                <span>Auditar histórico del Taller</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: checklist.photos ? '#10b981' : '#cbd5e1' }} onClick={() => toggleCheck('photos')}>
                <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: checklist.photos ? '#10b981' : 'transparent' }}>
                  {checklist.photos && <Check size={14} color="#000" weight="bold" />}
                </div>
                <span>Inspección fotográfica forense</span>
              </label>

            </div>
          </article>

          {/* AI RECOMMENDATIONS */}
          <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PushPin size={18} color="#3b82f6" /> Recomendaciones IA
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {caseData.recommendations?.map((rec: string, index: number) => (
                <div key={index} style={{ padding: '12px', background: isCritical ? 'rgba(239,68,68,0.04)' : 'rgba(59,130,246,0.04)', borderLeft: `3px solid ${isCritical ? '#ef4444' : '#3b82f6'}`, borderRadius: '0 8px 8px 0', fontSize: '0.88rem', lineHeight: 1.5, color: '#e2e8f0' }}>
                  {rec}
                </div>
              ))}
            </div>
          </article>

          {/* AUDIT ACTION BOX */}
          <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#10b981" /> Acciones de Auditoría
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              
              <div>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Estado del Caso</span>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={auditState} 
                    onChange={(e) => setAuditState(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="Bajo revisión" style={{ background: '#090d16' }}>🔍 Bajo revisión</option>
                    <option value="Aprobado sin fraude" style={{ background: '#090d16' }}>✅ Aprobado sin fraude</option>
                    <option value="Sospechoso confirmado" style={{ background: '#090d16' }}>⚠️ Sospechoso confirmado</option>
                    <option value="Escalado a legal" style={{ background: '#090d16' }}>⚖️ Escalado a legal</option>
                  </select>
                  <CaretDown size={14} style={{ position: 'absolute', right: '14px', top: '15px', pointerEvents: 'none' }} />
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Prioridad de Revisión</span>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="Crítica" style={{ background: '#090d16' }}>🔴 Crítica</option>
                    <option value="Alta" style={{ background: '#090d16' }}>🟠 Alta</option>
                    <option value="Media" style={{ background: '#090d16' }}>🟡 Media</option>
                    <option value="Baja" style={{ background: '#090d16' }}>🟢 Baja</option>
                  </select>
                  <CaretDown size={14} style={{ position: 'absolute', right: '14px', top: '15px', pointerEvents: 'none' }} />
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>Observaciones del Analista</span>
                <textarea 
                  placeholder="Ingrese anotaciones del peritaje, observaciones del taller, sospechas de colusión..." 
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  style={{ width: '100%', height: '80px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'none' }}
                />
              </div>

            </div>

            <button 
              onClick={handleSaveAudit} 
              disabled={isSubmitting}
              className="btn btn-primary" 
              style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
            >
              {isSubmitting ? 'Guardando expediente...' : 'Guardar Expediente Forense'}
            </button>
          </article>

        </section>

      </div>

    </div>
  )
}
