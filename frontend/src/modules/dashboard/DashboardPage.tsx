import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Bell, CaretDown, MagnifyingGlass, ShieldCheck, SlidersHorizontal, 
  MapTrifold, Network, UsersThree, Warning, Play, Info,
  Eye, FileText, ArrowRight, Brain, Sliders, CarSimple, Stethoscope, User
} from '@phosphor-icons/react'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import { API_BASE_URL } from '../../config/api'
import { toast } from 'sonner'

export function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // TABS STATE
  const [activeTab, setActiveTab] = useState<'siniestros' | 'relaciones' | 'mapa' | 'proveedores' | 'vehiculos' | 'asegurados' | 'calculadora' | 'calibracion'>('siniestros')

  // DATA STATE
  const [kpis, setKpis] = useState({
    siniestros_analizados: '0',
    alertas_generadas: '0',
    casos_criticos: '0',
    riesgo_promedio: '0%',
    monto_reclamado: '$0.00M',
    dinero_protegido: '$0.00M'
  })
  const [claims, setClaims] = useState<any[]>([])
  const [filteredClaims, setFilteredClaims] = useState<any[]>([])
  const [activeClaim, setActiveClaim] = useState<any>(null)
  
  // FILTERS
  const [searchTerm, setSearchTerm] = useState('')
  const [branchFilter, setBranchFilter] = useState('todos')
  const [riskFilter, setRiskFilter] = useState('todos')
  
  // MAP PINS
  const [mapPins, setMapPins] = useState<any[]>([])

  // ENTITIES
  const [providers, setProviders] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [insureds, setInsureds] = useState<any[]>([])

  // COGNITIVE CALCULATOR
  const [calcInput, setCalcInput] = useState({
    fecha_evento: new Date().toISOString().split('T')[0],
    ramo: 'Vehículos',
    placa: '',
    monto_reclamado: 12000,
    id_proveedor: ''
  })
  const [calcResult, setCalcResult] = useState<any>(null)
  const [calcLoading, setCalcLoading] = useState(false)

  // CALIBRATOR MODEL STATUS
  const [modelStatus, setModelStatus] = useState<any>(null)
  const [riskThreshold, setRiskThreshold] = useState(0.5)

  // DEMO TOUR INTERACTIVE TOUR
  const [showTour, setShowTour] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  useEffect(() => {
    // 1. Fetch KPIs
    fetch(`${API_BASE_URL}/api/kpis`)
      .then(res => res.json())
      .then(data => data && setKpis(data))
      .catch(err => console.log('KPIs fallback:', err))

    // 2. Fetch Claims
    fetch(`${API_BASE_URL}/api/cases?limit=25`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setClaims(data)
          setFilteredClaims(data)
          setActiveClaim(data[0])
        }
      })
      .catch(err => console.log('Claims fallback:', err))

    // 3. Fetch Map Pins
    fetch(`${API_BASE_URL}/api/map-claims`)
      .then(res => res.json())
      .then(data => data && setMapPins(data))
      .catch(err => console.log('Map pins fallback:', err))

    // 4. Fetch Providers
    fetch(`${API_BASE_URL}/api/providers`)
      .then(res => res.json())
      .then(data => data && setProviders(data))
      .catch(err => console.log('Providers fallback:', err))

    // 5. Fetch Vehicles
    fetch(`${API_BASE_URL}/api/vehicles`)
      .then(res => res.json())
      .then(data => data && setVehicles(data))
      .catch(err => console.log('Vehicles fallback:', err))

    // 6. Fetch Insureds
    fetch(`${API_BASE_URL}/api/insureds`)
      .then(res => res.json())
      .then(data => data && setInsureds(data))
      .catch(err => console.log('Insureds fallback:', err))

    // 7. Fetch Model Calibration Status
    fetch(`${API_BASE_URL}/api/model/status`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setModelStatus(data)
          setRiskThreshold(data.threshold_actual || 0.5)
        }
      })
      .catch(err => console.log('Model status fallback:', err))
  }, [])

  // SEARCH AND FILTER CLAIMS
  useEffect(() => {
    let result = claims
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase()
      result = result.filter(c => 
        c.id.toLowerCase().includes(q) || 
        c.insured.toLowerCase().includes(q) ||
        (c.branch && c.branch.toLowerCase().includes(q))
      )
    }
    if (branchFilter !== 'todos') {
      result = result.filter(c => c.branch === branchFilter)
    }
    if (riskFilter !== 'todos') {
      result = result.filter(c => c.level.toLowerCase() === riskFilter.toLowerCase())
    }
    setFilteredClaims(result)
  }, [searchTerm, branchFilter, riskFilter, claims])

  // TRIGGERS INTERACTIVE TOUR FROM SIDEBAR
  useEffect(() => {
    if (location.search.includes('demo=true')) {
      setShowTour(true)
      setTourStep(1)
      setActiveTab('siniestros')
    }
  }, [location])

  const handleRunCalculator = (e: React.FormEvent) => {
    e.preventDefault()
    setCalcLoading(true)
    fetch(`${API_BASE_URL}/api/calculator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(calcInput)
    })
      .then(res => res.json())
      .then(data => {
        setCalcResult(data)
        setCalcLoading(false)
        toast.success('Análisis cognitivo completado')
      })
      .catch(err => {
        console.error(err)
        setCalcLoading(false)
        toast.error('Error al invocar el motor de IA')
      })
  }

  const handleUpdateThreshold = (val: number) => {
    setRiskThreshold(val)
    fetch(`${API_BASE_URL}/api/model/threshold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threshold: val })
    })
      .then(res => res.json())
      .then(() => toast.success(`Umbral del modelo calibrado a ${val}`))
      .catch(() => toast.error('Error al guardar calibración'))
  }

  // STEP BY STEP HACKATHON TOUR TIMELINE
  const nextTourStep = () => {
    if (tourStep === 1) {
      // Step 2: Highlight Alerts
      setTourStep(2)
      toast.info('Se han analizado 1,247 siniestros e identificado atipicidades críticas')
    } else if (tourStep === 2) {
      // Step 3: Select critical case
      setTourStep(3)
      setActiveTab('siniestros')
      toast.success('El siniestro #FR-87291 ha activado alertas del 89% por colusión')
    } else if (tourStep === 3) {
      // Step 4: Show relations
      setActiveTab('relaciones')
      setTourStep(4)
    } else if (tourStep === 4) {
      // Step 5: Navigate to premium single case details
      setShowTour(false)
      setTourStep(0)
      navigate('/caso/FR-87291')
    }
  }

  return (
    <main className="page dashboard-page" style={{ background: '#090d16', color: '#f8fafc', minHeight: '100vh' }}>
      <div className="dashboard-layout" style={{ display: 'flex' }}>
        
        {/* SIDEBAR NAVIGATION */}
        <DashboardSidebar activeRoute="/dashboard" />

        {/* CENTRAL INVESTIGATION COCKPIT */}
        <section className="dashboard-main" style={{ flex: 1, padding: '24px', overflowY: 'auto', maxHeight: '100vh' }}>
          
          {/* SEARCH & AUDITOR PROFILE */}
          <header className="dashboard-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
            <label className="dashboard-search" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 16px', width: '380px' }}>
              <MagnifyingGlass size={18} color="#64748b" />
              <input 
                placeholder="Buscar caso, placa, asegurado o sucursal..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#f8fafc', outline: 'none', width: '100%', fontSize: '0.88rem' }}
              />
            </label>

            <div className="dashboard-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                <span className="live-dot" style={{ background: '#10b981' }} />
                Motor Cognitivo Activo
              </div>
            </div>
          </header>

          {/* MAIN KPIs STRIP */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px', marginBottom: '28px' }}>
            
            <article className="kpi-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', padding: '18px', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Analizados Hoy</p>
              <strong style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', display: 'block', marginTop: '6px' }}>{kpis.siniestros_analizados}</strong>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold' }}>+24% vs promedio diario</span>
            </article>

            <article className="kpi-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', padding: '18px', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Dinero Protegido</p>
              <strong style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10b981', display: 'block', marginTop: '6px' }}>{kpis.dinero_protegido}</strong>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Siniestros atípicos prevenidos</span>
            </article>

            <article className="kpi-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', padding: '18px', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Casos Críticos</p>
              <strong style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ef4444', display: 'block', marginTop: '6px' }}>{kpis.casos_criticos}</strong>
              <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 'bold' }}>Requieren atención inmediata</span>
            </article>

            <article className="kpi-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', padding: '18px', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Riesgo Promedio</p>
              <strong style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fb923c', display: 'block', marginTop: '6px' }}>{kpis.riesgo_promedio}</strong>
              <span style={{ fontSize: '0.72rem', color: '#fb923c', fontWeight: 'bold' }}>Nivel de Alerta Medio-Alto</span>
            </article>

            <article className="kpi-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', padding: '18px', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Total Reclamado</p>
              <strong style={{ fontSize: '1.65rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginTop: '6px' }}>{kpis.monto_reclamado}</strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Expediente total analizado</span>
            </article>

          </section>

          {/* UNIFIED NAVIGATION TABS */}
          <section className="critical-tabs" style={{ display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px', paddingBottom: '1px' }}>
            <button onClick={() => setActiveTab('siniestros')} className={`critical-tab ${activeTab === 'siniestros' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'siniestros' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'siniestros' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              🔍 Investigador Forense
            </button>
            <button onClick={() => setActiveTab('relaciones')} className={`critical-tab ${activeTab === 'relaciones' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'relaciones' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'relaciones' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              <Network size={16} style={{ marginRight: '6px' }} /> Red de Relaciones
            </button>
            <button onClick={() => setActiveTab('mapa')} className={`critical-tab ${activeTab === 'mapa' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'mapa' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'mapa' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              <MapTrifold size={16} style={{ marginRight: '6px' }} /> Concentración Geo
            </button>
            <button onClick={() => setActiveTab('proveedores')} className={`critical-tab ${activeTab === 'proveedores' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'proveedores' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'proveedores' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              <Stethoscope size={16} style={{ marginRight: '6px' }} /> Talleres & Proveedores
            </button>
            <button onClick={() => setActiveTab('vehiculos')} className={`critical-tab ${activeTab === 'vehiculos' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'vehiculos' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'vehiculos' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              <CarSimple size={16} style={{ marginRight: '6px' }} /> Vehículos
            </button>
            <button onClick={() => setActiveTab('asegurados')} className={`critical-tab ${activeTab === 'asegurados' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'asegurados' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'asegurados' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              <User size={16} style={{ marginRight: '6px' }} /> Asegurados
            </button>
            <button onClick={() => setActiveTab('calculadora')} className={`critical-tab ${activeTab === 'calculadora' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'calculadora' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'calculadora' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              <Brain size={16} style={{ marginRight: '6px' }} /> Calculadora IA
            </button>
            <button onClick={() => setActiveTab('calibracion')} className={`critical-tab ${activeTab === 'calibracion' ? 'is-active' : ''}`} style={{ border: 'none', background: 'transparent', color: activeTab === 'calibracion' ? '#3b82f6' : '#94a3b8', padding: '12px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: activeTab === 'calibracion' ? '2px solid #3b82f6' : '2px solid transparent' }}>
              <Sliders size={16} style={{ marginRight: '6px' }} /> Calibración & Modelos
            </button>
          </section>

          {/* TAB 1: INVESTIGADOR DE SINIESTROS */}
          {activeTab === 'siniestros' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
              
              {/* ADVANCED TABLE PANEL */}
              <article className="dashboard-panel" style={{ padding: '20px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                
                {/* Table Filters */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <select 
                      value={branchFilter} 
                      onChange={(e) => setBranchFilter(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.02)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 28px 6px 12px', borderRadius: '8px', appearance: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      <option value="todos" style={{ background: '#090d16' }}>Todos los ramos</option>
                      <option value="Vehículos" style={{ background: '#090d16' }}>Vehículos</option>
                      <option value="Salud" style={{ background: '#090d16' }}>Salud</option>
                      <option value="Hogar" style={{ background: '#090d16' }}>Hogar</option>
                    </select>
                    <CaretDown size={12} style={{ position: 'absolute', right: '10px', top: '11px', pointerEvents: 'none' }} />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <select 
                      value={riskFilter} 
                      onChange={(e) => setRiskFilter(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.02)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 28px 6px 12px', borderRadius: '8px', appearance: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      <option value="todos" style={{ background: '#090d16' }}>Todos los riesgos</option>
                      <option value="alto" style={{ background: '#090d16' }}>🔴 Riesgo Alto / Crítico</option>
                      <option value="medio" style={{ background: '#090d16' }}>🟡 Riesgo Medio</option>
                      <option value="bajo" style={{ background: '#090d16' }}>🟢 Riesgo Bajo</option>
                    </select>
                    <CaretDown size={12} style={{ position: 'absolute', right: '10px', top: '11px', pointerEvents: 'none' }} />
                  </div>

                  <button
                    onClick={() => {
                      fetch(`${API_BASE_URL}/api/cases/export`)
                        .then(res => res.blob())
                        .then(blob => {
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'siniestros_suspechosos.csv'
                          a.click()
                        })
                        .catch(() => toast.error('Error al exportar CSV'))
                    }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', marginLeft: 'auto' }}
                  >
                    ⬇ Exportar CSV
                  </button>
                </div>

                {/* Siniestros Table */}
                <div className="claims-table" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="claims-head" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr 1fr 1fr 1.2fr 1fr 1fr', padding: '10px 14px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    <span>Caso</span>
                    <span>Asegurado</span>
                    <span>Fecha</span>
                    <span>Ramo</span>
                    <span>Monto Reclamado</span>
                    <span>Riesgo</span>
                    <span>Acciones</span>
                  </div>

                  {filteredClaims.map((row) => (
                    <div 
                      key={row.id} 
                      className={`claims-row ${activeClaim && activeClaim.id === row.id ? 'is-active-row' : ''}`}
                      onClick={() => setActiveClaim(row)}
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '0.8fr 1.2fr 1fr 1fr 1.2fr 1fr 1fr', 
                        padding: '12px 14px', 
                        borderRadius: '10px', 
                        background: activeClaim && activeClaim.id === row.id ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)', 
                        border: activeClaim && activeClaim.id === row.id ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease',
                        fontSize: '0.9rem'
                      }}
                    >
                      <strong style={{ color: '#f8fafc' }}>{row.id}</strong>
                      <span>{row.insured}</span>
                      <span>{row.date}</span>
                      <span>{row.branch}</span>
                      <strong style={{ color: '#10b981' }}>{row.amount}</strong>
                      <span className={`claims-level level-${row.level.toLowerCase()}`} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', width: 'fit-content', fontWeight: 'bold' }}>
                        {row.score} {row.level}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/caso/${row.id.replace('#','')}`); }} 
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}
                        >
                          <Eye size={14} /> Exp.
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* ACTIVE CASE PANEL SIDEBAR */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <article className="dashboard-panel active-case-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                  <p className="panel-kicker" style={{ margin: 0, fontSize: '0.75rem', color: '#3b82f6', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '14px' }}>Caso Seleccionado</p>
                  {activeClaim ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <div>
                          <strong style={{ fontSize: '1.25rem', display: 'block' }}>{activeClaim.id}</strong>
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{activeClaim.insured}</span>
                        </div>
                        <span className={`risk-pill ${activeClaim.level === 'Alto' ? 'danger' : 'warning'}`} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                          RIESGO {activeClaim.level.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Score Ponderado</span>
                          <strong style={{ fontSize: '1.6rem', color: activeClaim.level === 'Alto' ? '#ef4444' : '#f59e0b' }}>{activeClaim.score}</strong>
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Monto Reclamado</span>
                          <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>{activeClaim.amount}</strong>
                        </div>
                      </div>

                      <dl className="case-details" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '16px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <dt style={{ color: '#94a3b8' }}>Fecha de evento</dt>
                          <dd style={{ fontWeight: 600 }}>{activeClaim.date}</dd>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <dt style={{ color: '#94a3b8' }}>Ramo</dt>
                          <dd style={{ fontWeight: 600 }}>{activeClaim.branch}</dd>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <dt style={{ color: '#94a3b8' }}>Auditado por</dt>
                          <dd style={{ color: '#3b82f6', fontWeight: 'bold' }}>Reglas + IA Ensamble</dd>
                        </div>
                      </dl>

                      <button 
                        onClick={() => navigate(`/caso/${activeClaim.id.replace('#','')}`)}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '42px', fontSize: '0.9rem' }}
                      >
                        Abrir Expediente Forense <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
                      <Info size={32} style={{ marginBottom: '8px' }} />
                      <p>Seleccione un siniestro del listado para inspeccionar sus detalles rápidos.</p>
                    </div>
                  )}
                </article>
              </aside>

            </div>
          )}

          {/* TAB 2: RED DE RELACIONES */}
          {activeTab === 'relaciones' && (
            <article className="dashboard-panel panel-network" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="panel-head" style={{ marginBottom: '24px' }}>
                <h2>Red Forense de Colusiones y Relaciones</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Muestra relaciones sospechosas identificadas entre asegurados recurrentes y talleres observados.</p>
              </div>

              <div className="relation-board" style={{ position: 'relative', height: '420px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden' }}>
                
                {/* SVG connection lines */}
                <svg viewBox="0 0 1000 420" className="relation-lines" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <path d="M 500 210 C 430 150, 290 110, 170 112" stroke="rgba(239,68,68,0.3)" strokeWidth="2" fill="none" />
                  <path d="M 500 210 C 410 120, 300 82, 248 70" stroke="rgba(239,68,68,0.3)" strokeWidth="2" fill="none" />
                  <path d="M 500 210 C 590 130, 668 104, 820 116" stroke="rgba(168,85,247,0.3)" strokeWidth="2" fill="none" />
                  <path d="M 500 210 C 610 230, 702 236, 836 250" stroke="rgba(59,130,246,0.3)" strokeWidth="2" fill="none" />
                  <path d="M 500 210 C 435 270, 330 310, 202 324" stroke="rgba(59,130,246,0.3)" strokeWidth="2" fill="none" />
                  <path d="M 500 210 C 556 286, 614 318, 700 338" stroke="rgba(16,185,129,0.3)" strokeWidth="2" fill="none" />
                </svg>

                <div className="relation-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: '#ef4444', color: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 20px rgba(239,68,68,0.4)', textAlign: 'center', zIndex: 10 }}>
                  <ShieldCheck size={24} weight="fill" style={{ marginBottom: '4px' }} />
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Taller Express</strong>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', opacity: 0.8 }}>Taller Observado</span>
                </div>

                {/* Nodes */}
                <div className="relation-node tone-orange" style={{ position: 'absolute', left: '14%', top: '22%', background: '#fb923c', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>AutoMecánica L&R (Taller)</strong>
                </div>
                <div className="relation-node tone-violet" style={{ position: 'absolute', left: '80%', top: '24%', background: '#c084fc', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>#FR-87291 (Siniestro)</strong>
                </div>
                <div className="relation-node tone-blue" style={{ position: 'absolute', left: '81%', top: '56%', background: '#60a5fa', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>Placa GBK-1234 (Vehículo)</strong>
                </div>
                <div className="relation-node tone-teal" style={{ position: 'absolute', left: '16%', top: '72%', background: '#2dd4bf', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>Carlos Méndez (Asegurado)</strong>
                </div>

                <div className="relation-legend" style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', gap: '16px', background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Taller Observado</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc' }} /> Reclamo Crítico</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }} /> Vehículo Frecuente</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2dd4bf' }} /> Asegurado Recurrente</div>
                </div>

              </div>
            </article>
          )}

          {/* TAB 3: CONCENTRACION GEO DE SINIESTROS */}
          {activeTab === 'mapa' && (
            <article className="dashboard-panel panel-map" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="panel-head" style={{ marginBottom: '24px' }}>
                <h2>Mapa de Concentración de Alertas Geoespaciales</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Muestra los focos territoriales activos y el número de siniestros auditados por sucursal.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {mapPins.map((p, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                      <span style={{ fontWeight: 'bold' }}>{p.sucursal}</span>
                      <span className={`critical-badge risk-${p.tone}`} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {p.label} Casos
                      </span>
                    </div>
                  ))}
                </div>

                {/* Simulated Visual Heatmap of claims */}
                <div style={{ position: 'relative', height: '360px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src="/assets/reports/map_background.png" 
                    alt="Mapa de Ecuador" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, position: 'absolute' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
                    <MapTrifold size={48} color="#3b82f6" style={{ marginBottom: '16px' }} />
                    <h3 style={{ margin: '0 0 8px 0' }}>Panel de Mapas Integrado</h3>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', maxWidth: '340px' }}>Pins interactivos geolocalizados por coordenadas y nivel de siniestralidad express.</p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* TAB 4: PROVEEDORES Y TALLERES */}
          {activeTab === 'proveedores' && (
            <article className="dashboard-panel" style={{ padding: '20px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="panel-head" style={{ marginBottom: '20px' }}>
                <h2>Ranking de Proveedores y Talleres en Lista Restrictiva</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Talleres asociados a sobrefacturaciones de reparación o clonación de relatos narrativos.</p>
              </div>

              <div className="claims-table" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="claims-head" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.2fr 1.2fr 1.2fr 1.8fr', padding: '10px 14px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  <span>ID Proveedor</span>
                  <span>Nombre taller</span>
                  <span>Ciudad</span>
                  <span>Siniestros</span>
                  <span>Lista Restrictiva</span>
                  <span>Motivo Observación</span>
                </div>

                {providers.map((p, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.2fr 1.2fr 1.2fr 1.8fr', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', alignItems: 'center', fontSize: '0.9rem' }}>
                    <strong>{p.id_proveedor}</strong>
                    <span>{p.nombre_proveedor}</span>
                    <span>{p.ciudad_proveedor}</span>
                    <span>{p.siniestros_asociados} siniestros</span>
                    <span className={`critical-badge risk-${p.alerta_nivel}`} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.78rem', width: 'fit-content' }}>
                      {p.lista_restrictiva}
                    </span>
                    <span style={{ color: p.alerta_nivel === 'rojo' ? '#f87171' : '#e2e8f0', fontSize: '0.85rem' }}>{p.motivo_restriccion}</span>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* TAB 5: VEHICULOS */}
          {activeTab === 'vehiculos' && (
            <article className="dashboard-panel" style={{ padding: '20px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="panel-head" style={{ marginBottom: '20px' }}>
                <h2>Monitoreo de Vehículos con Alta Siniestralidad</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Vehículos que registran frecuencia atípica de reclamos o relatos NLP duplicados.</p>
              </div>

              <div className="claims-table" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="claims-head" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.5fr 1.5fr 1fr', padding: '10px 14px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  <span>Placa</span>
                  <span>Siniestros Activos</span>
                  <span>Monto Total Reclamado</span>
                  <span>Coberturas Reclamadas</span>
                  <span>Alerta IA</span>
                </div>

                {vehicles.map((v, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.5fr 1.5fr 1fr', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', alignItems: 'center', fontSize: '0.9rem' }}>
                    <strong>{v.placa}</strong>
                    <span>{v.total_siniestros} incidentes</span>
                    <strong style={{ color: '#10b981' }}>${v.monto_total?.toLocaleString()}</strong>
                    <span style={{ fontSize: '0.85rem' }}>{v.coberturas}</span>
                    <span className={`critical-badge risk-${v.alerta ? 'rojo' : 'verde'}`} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.78rem', width: 'fit-content' }}>
                      {v.alerta ? '🔴 SOSPECHA' : '🟢 NORMAL'}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* TAB 6: ASEGURADOS */}
          {activeTab === 'asegurados' && (
            <article className="dashboard-panel" style={{ padding: '20px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="panel-head" style={{ marginBottom: '20px' }}>
                <h2>Auditoría de Asegurados Recurrentes</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Expediente de asegurados que muestran reclamos de alta frecuencia o riesgos atípicos en Medellín/Quito.</p>
              </div>

              <div className="claims-table" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="claims-head" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr', padding: '10px 14px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  <span>ID Asegurado</span>
                  <span>Nombres</span>
                  <span>Sucursal</span>
                  <span>Antigüedad</span>
                  <span>Reclamos 12m</span>
                  <span>Histórico Total</span>
                  <span>Riesgo IA</span>
                </div>

                {insureds.map((i, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', alignItems: 'center', fontSize: '0.9rem' }}>
                    <strong>{i.id_asegurado}</strong>
                    <span>{i.nombres_asegurado}</span>
                    <span>{i.ciudad}</span>
                    <span>{i.antiguedad_asegurado} años</span>
                    <span>{i.reclamos_ult_12m} en 12m</span>
                    <span>{i.reclamos_historico_total} total</span>
                    <span className={`critical-badge risk-${i.nivel_riesgo === 'alto' ? 'rojo' : i.nivel_riesgo === 'medio' ? 'amarillo' : 'verde'}`} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.78rem', width: 'fit-content' }}>
                      {i.nivel_riesgo.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          )}

          {/* TAB 7: CALCULADORA IA */}
          {activeTab === 'calculadora' && (
            <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="panel-head" style={{ marginBottom: '24px' }}>
                <h2>Calculadora IA - Motor Cognitivo de Predicción de Fraude</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Ingrese datos de un nuevo siniestro para computar su score y alertas de explicabilidad antes del registro.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Form calculator */}
                <form onSubmit={handleRunCalculator} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Ramo de Cobertura</span>
                      <select 
                        value={calcInput.ramo} 
                        onChange={(e) => setCalcInput(prev => ({ ...prev, ramo: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                      >
                        <option value="Vehículos" style={{ background: '#090d16' }}>Vehículos</option>
                        <option value="Salud" style={{ background: '#090d16' }}>Salud</option>
                        <option value="Hogar" style={{ background: '#090d16' }}>Hogar</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Fecha de Ocurrencia</span>
                      <input 
                        type="date"
                        value={calcInput.fecha_evento}
                        onChange={(e) => setCalcInput(prev => ({ ...prev, fecha_evento: e.target.value }))}
                        style={{ width: '100%', padding: '9px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Monto Reclamado ($)</span>
                      <input 
                        type="number"
                        value={calcInput.monto_reclamado}
                        onChange={(e) => setCalcInput(prev => ({ ...prev, monto_reclamado: parseFloat(e.target.value) || 0 }))}
                        style={{ width: '100%', padding: '9px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Placa Vehículo</span>
                      <input 
                        type="text"
                        placeholder="ej: GBK-1234"
                        value={calcInput.placa}
                        onChange={(e) => setCalcInput(prev => ({ ...prev, placa: e.target.value }))}
                        style={{ width: '100%', padding: '9px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>ID Proveedor / Taller Asociado</span>
                    <input 
                      type="text"
                      placeholder="ej: TALLER-001"
                      value={calcInput.id_proveedor}
                      onChange={(e) => setCalcInput(prev => ({ ...prev, id_proveedor: e.target.value }))}
                      style={{ width: '100%', padding: '9px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={calcLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', height: '42px', fontSize: '0.9rem', marginTop: '10px' }}
                  >
                    {calcLoading ? 'Analizando en motor de IA...' : 'Computar Riesgo con IA'}
                  </button>
                </form>

                {/* Calculator results */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', alignContent: 'center', minHeight: '300px' }}>
                  {calcResult ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', borderRadius: '50%', background: calcResult.level === 'Alto' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)', border: `3px solid ${calcResult.level === 'Alto' ? '#ef4444' : '#eab308'}`, marginBottom: '16px' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800 }}>{calcResult.score}</span>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#cbd5e1' }}>Riesgo</span>
                      </div>
                      
                      <h3 style={{ margin: '0 0 10px 0' }}>Riesgo {calcResult.level} Detectado</h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 auto 18px', maxWidth: '300px' }}>Modelo ejecutado: <strong>{calcResult.model.toUpperCase()}</strong></p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', maxWidth: '340px', margin: '0 auto' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Alertas SHAP asociadas</span>
                        {calcResult.alerts.map((al: string, index: number) => (
                          <div key={index} style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.03)', borderLeft: '3px solid #ef4444', borderRadius: '0 6px 6px 0', fontSize: '0.8rem' }}>
                            ⚠️ {al}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                      <Brain size={48} color="#3b82f6" style={{ marginBottom: '12px' }} />
                      <h3>Esperando Datos del Siniestro</h3>
                      <p style={{ margin: 0, fontSize: '0.88rem' }}>Rellene los campos a la izquierda para evaluar un siniestro cognitivamente.</p>
                    </div>
                  )}
                </div>

              </div>
            </article>
          )}

          {/* TAB 8: CALIBRACION & TRANSPARENCIA MODELO */}
          {activeTab === 'calibracion' && (
            <article className="dashboard-panel" style={{ padding: '24px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="panel-head" style={{ marginBottom: '24px' }}>
                <h2>Transparencia IA - Calibración de Umbral y Métricas del Modelo</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Ajuste el umbral de sensibilidad operativo del clasificador para controlar tasas de Falsos Positivos y Negativos.</p>
              </div>

              {modelStatus ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                  
                  {/* Calibrator Sliders and charts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 'bold' }}>Umbral Operativo de Decisión</span>
                        <strong style={{ color: '#3b82f6' }}>{Math.round(riskThreshold * 100)}%</strong>
                      </div>
                      <input 
                        type="range" 
                        min="0.0" 
                        max="1.0" 
                        step="0.05"
                        value={riskThreshold}
                        onChange={(e) => handleUpdateThreshold(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer', height: '6px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                        <span>Sensible (Max Recall)</span>
                        <span>Conservador (Max Precisión)</span>
                      </div>
                    </div>

                    {/* Features global importance */}
                    <div>
                      <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>Variables con Mayor Importancia Global (SHAP)</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                            <span>Similitud de narrativas (NLP)</span>
                            <strong>30%</strong>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: '#3b82f6', width: '30%' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                            <span>Taller en Lista Restrictiva</span>
                            <strong>25%</strong>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: '#3b82f6', width: '25%' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                            <span>Días desde emisión de póliza</span>
                            <strong>20%</strong>
                          </div>
                          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: '#3b82f6', width: '20%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Model statistics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>Modelo Entrenado</span>
                      <h3 style={{ margin: '4px 0 12px 0', color: '#10b981' }}>{modelStatus.best_model?.toUpperCase() || 'RANDOM FOREST'}</h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem' }}>
                        <div>
                          <span style={{ display: 'block', color: '#94a3b8' }}>ROC-AUC</span>
                          <strong style={{ fontSize: '1.1rem' }}>{modelStatus.roc_auc || '0.9858'}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', color: '#94a3b8' }}>Precisión</span>
                          <strong style={{ fontSize: '1.1rem' }}>{modelStatus.precision || '0.8824'}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', color: '#94a3b8' }}>Recall</span>
                          <strong style={{ fontSize: '1.1rem' }}>{modelStatus.recall || '0.8333'}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', color: '#94a3b8' }}>F1-Score</span>
                          <strong style={{ fontSize: '1.1rem' }}>{modelStatus.f1 || '0.8571'}</strong>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '16px', paddingTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                        Calibración generada en {modelStatus.fecha_entrenamiento || 'N/A'}
                      </div>
                    </div>

                    {/* PDF/PNG Report Downloader links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <a 
                        href={`${API_BASE_URL}/api/model/reports/feature_importance.png`}
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary" 
                        style={{ height: '38px', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ⬇ Descargar Reporte de Importancia (SHAP)
                      </a>
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
                  <SlidersHorizontal size={42} style={{ marginBottom: '12px' }} />
                  <p>Obteniendo información del calibrador del modelo...</p>
                </div>
              )}
            </article>
          )}

        </section>

      </div>

      {/* DYNAMIC HACKATHON INTERACTIVE TOUR MODAL OVERLAY */}
      {showTour && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '460px', background: '#0f172a', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 50px rgba(59,130,246,0.2)', position: 'relative' }}>
            
            {/* Tour steps */}
            {tourStep === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '12px' }}>
                  <Play size={20} weight="fill" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paso 1 de 5 · Ingesta forense</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 10px 0' }}>Ingesta y Limpieza de Siniestros</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  El sistema ha cargado y normalizado de forma autónoma la base de datos de siniestros, cruzando información de asegurados recurrentes y talleres mecánicos bajo investigación.
                </p>
              </div>
            )}

            {tourStep === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f97316', marginBottom: '12px' }}>
                  <Bell size={20} weight="fill" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paso 2 de 5 · Auditoría cognitiva</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 10px 0' }}>Detección en Tiempo Real</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  El motor antifraude evalúa de forma dinámica cada entrada cruzando reglas de negocio con predicciones de machine learning (Ensamble Random Forest + NLP Cosine Similarity).
                </p>
              </div>
            )}

            {tourStep === 3 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '12px' }}>
                  <Warning size={20} weight="fill" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paso 3 de 5 · Siniestro crítico</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 10px 0' }}>Aislamiento de Casos Críticos</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  El siniestro de mayor severidad detectado es el del asegurado **Carlos Méndez (#FR-87291)** con un score crítico del **89%** debido a múltiples factores sospechosos en Guayaquil.
                </p>
              </div>
            )}

            {tourStep === 4 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', marginBottom: '12px' }}>
                  <Network size={20} weight="fill" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paso 4 de 5 · Colusión</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 10px 0' }}>Red sospechosa identificada</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  Hemos aislado gráficamente un núcleo de colusión severa que asocia múltiples vehículos con placas sospechosas y el taller observado **Taller Express**.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyItems: 'flex-end', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => { setShowTour(false); setTourStep(0); navigate('/dashboard'); }} 
                className="btn btn-secondary" 
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                Omitir Tour
              </button>
              <button 
                onClick={nextTourStep} 
                className="btn btn-primary" 
                style={{ height: '38px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {tourStep === 4 ? 'Abrir Expediente' : 'Siguiente Paso'} <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  )
}
