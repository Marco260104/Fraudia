import { useState, useEffect } from 'react'
import {
  UsersThree, WarningCircle, FileText,
  Brain, ArrowRight, ArrowUpRight, ArrowDownRight, Target,
  DownloadSimple, Lightning, Lightbulb
} from '@phosphor-icons/react'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import { MarkdownRenderer } from '../../shared/ui/MarkdownRenderer'
import { API_BASE_URL } from '../../config/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './ReportsPage.css'

export function ReportsPage() {
  const [kpis, setKpis] = useState<any>({
    casos_criticos: '18',
    alertas_generadas: '124',
    monto_reclamado: '$4.8M',
    riesgo_promedio: '42%'
  })

  const [reportType, setReportType] = useState('Ejecutivo')
  const [period, setPeriod] = useState('Últimos 30 días')
  const [riskLevel, setRiskLevel] = useState('Solo Críticos')
  const [city, setCity] = useState('Nacional (Global)')
  const [loading, setLoading] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [lastFilters, setLastFilters] = useState<any>(null) // remember what was used for PDF
  const [aiSummary, setAiSummary] = useState(
    '### Resumen Analítico IA\n' +
    'La IA identificó un incremento del **18%** en patrones de narrativa similar durante los últimos 30 días, sugiriendo la actividad de una red coordinada.\n\n' +
    'Las ciudades con mayor concentración de alertas fueron **Quito** y **Guayaquil**.\n\n' +
    'Adicionalmente, **tres proveedores** concentran el 42% de los casos críticos observados, requiriendo revisión inmediata de contratos.'
  )

  useEffect(() => {
    fetch(API_BASE_URL + '/api/kpis')
      .then(res => res.json())
      .then(data => {
        if (data) setKpis(data)
      })
      .catch(console.error)
  }, [])

  // === PROPER PDF EXPORT WITH LOGO + DATA (fixes the "print sheet" bug) ===
  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Header bar
    doc.setFillColor(19, 35, 63) // #13233f dark navy
    doc.rect(0, 0, pageWidth, 28, 'F')

    // Project name + fake logo (shield + text)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('FRAUDIA', 15, 18)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Detector de Fraude en Siniestros • IA', 15, 24)

    // Date + filters on right
    doc.setFontSize(9)
    doc.text(new Date().toLocaleDateString('es-EC'), pageWidth - 15, 14, { align: 'right' })
    doc.text('Reporte generado automáticamente', pageWidth - 15, 19, { align: 'right' })

    // Title
    doc.setTextColor(19, 35, 63)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Reporte ${reportType} — ${city}`, 15, 40)

    // Filters used
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    const filterText = `Periodo: ${period}  |  Nivel de Riesgo: ${riskLevel}  |  Filtros aplicados al generar`
    doc.text(filterText, 15, 47)

    // KPIs box
    doc.setDrawColor(226, 232, 240)
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(15, 54, pageWidth - 30, 22, 3, 3, 'FD')

    doc.setTextColor(19, 35, 63)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('KPIs Clave', 20, 61)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Casos críticos: ${kpis.casos_criticos}    Alertas: ${kpis.alertas_generadas}    Monto activo: ${kpis.monto_reclamado}    Riesgo prom: ${kpis.riesgo_promedio}`, 20, 68)

    // AI Summary content (cleaned)
    doc.setTextColor(19, 35, 63)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Análisis Ejecutivo IA', 15, 84)

    // Use MarkdownRenderer content but strip markdown for PDF simplicity
    const cleanText = aiSummary
      .replace(/###\s*/g, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/•/g, '-')

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(30, 41, 59)

    const splitSummary = doc.splitTextToSize(cleanText, pageWidth - 32)
    doc.text(splitSummary, 15, 92, { maxWidth: pageWidth - 30 })

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 18
    doc.setFillColor(241, 245, 249)
    doc.rect(0, footerY - 4, pageWidth, 22, 'F')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(8)
    doc.text('FRAUDIA • Prototipo HackIAthon 2026 • Este documento es un análisis de apoyo, no una acusación formal de fraude.', 15, footerY + 6)
    doc.text('Generado con motor cognitivo de reglas + IA explicativa', pageWidth - 15, footerY + 6, { align: 'right' })

    // Save
    const filename = `Fraudia_Reporte_${reportType.replace(/\s+/g, '')}_${new Date().toISOString().slice(0,10)}.pdf`
    doc.save(filename)
  }

  const handleGenerateReport = () => {
    setLoading(true)
    setReportError(null)

    const filters = { reportType, period, riskLevel, city }

    fetch(API_BASE_URL + '/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report_type: reportType,
        period: period,
        risk_level: riskLevel,
        city: city
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error del servidor al generar reporte')
        return res.json()
      })
      .then(data => {
        if (data && data.report) {
          setAiSummary(data.report)
          setLastFilters(filters)
          // success toast could be added here
        } else {
          throw new Error('Respuesta incompleta del backend')
        }
      })
      .catch(err => {
        console.error('Error generating report:', err)
        setReportError('No se pudo generar el análisis IA. Usando datos de respaldo. Intente nuevamente.')
        // still show a decent fallback report
        const fallback = `### Reporte Analítico IA: ${reportType} (${city})\n\nEl análisis para el periodo '${period}' y nivel '${riskLevel}' muestra **${kpis.casos_criticos} casos críticos** con monto total de ${kpis.monto_reclamado}. Se detectaron patrones de riesgo operativo que requieren atención de la Unidad Antifraude.`
        setAiSummary(fallback)
        setLastFilters(filters)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="reports-page">
      <div className="reports-layout">
        
        {/* SIDEBAR */}
        <DashboardSidebar activeRoute="/reportes" />

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
                <button className="rep-btn-sec" onClick={exportToPDF}>
                  <DownloadSimple size={16} weight="bold" style={{ display: 'inline', marginRight: '6px' }} />
                  Exportar PDF
                </button>
                <button className="rep-btn-pri" onClick={handleGenerateReport} disabled={loading}>
                  {loading ? 'Analizando con IA...' : '+ Generar reporte'}
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
                <h2>{kpis.monto_reclamado}</h2>
                <p>Bajo Investigación Activa</p>
              </div>

              <div className="hero-secondary-metrics">
                <div className="hero-stat">
                  <span className="val">{kpis.casos_criticos}</span>
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
                  <span className="val">{kpis.alertas_generadas}</span>
                  <span className="lbl">Alertas Procesadas</span>
                </div>
              </div>
            </div>

            {/* KPI INTELLIGENCE ROW */}
            <div className="kpi-row">
              <div className="kpi-card kpi-red">
                <div className="kpi-title">Casos alto riesgo</div>
                <div className="kpi-value-row">
                  <span className="val">{kpis.casos_criticos}</span>
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
                  <span className="val">{kpis.alertas_generadas}</span>
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
                    <select className="gen-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                      <option value="Ejecutivo">Ejecutivo</option>
                      <option value="Auditoría">Auditoría</option>
                      <option value="Riesgo operativo">Riesgo operativo</option>
                      <option value="Red sospechosa">Red sospechosa</option>
                    </select>
                  </div>
                  <div className="gen-group">
                    <label>Periodo</label>
                    <select className="gen-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                      <option value="Últimos 30 días">Últimos 30 días</option>
                      <option value="Últimos 90 días">Últimos 90 días</option>
                      <option value="Este año">Este año</option>
                    </select>
                  </div>
                  <div className="gen-group">
                    <label>Nivel de Riesgo</label>
                    <select className="gen-select" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                      <option value="Solo Críticos">Solo Críticos</option>
                      <option value="Medios y Críticos">Medios y Críticos</option>
                      <option value="Todos">Todos</option>
                    </select>
                  </div>
                  <div className="gen-group">
                    <label>Ciudad</label>
                    <select className="gen-select" value={city} onChange={(e) => setCity(e.target.value)}>
                      <option value="Nacional (Global)">Nacional (Global)</option>
                      <option value="Quito">Quito</option>
                      <option value="Guayaquil">Guayaquil</option>
                    </select>
                  </div>
                </div>

                <button className="gen-btn" onClick={handleGenerateReport} disabled={loading}>
                  {loading ? 'Analizando en Base de Datos + IA...' : 'Generar Análisis IA'}
                </button>
                {reportError && (
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#c2410c', background: '#fef2f2', padding: '6px 10px', borderRadius: 6 }}>
                    {reportError}
                  </div>
                )}
              </div>

              {/* AI Live Summary */}
              <div className="ai-summary-panel">
                <div className="ai-scan-line"></div>
                <div className="panel-header" style={{ marginBottom: 0 }}>
                  <h3 style={{ color: 'white' }}><Brain size={20} weight="fill" color="#a78bfa" /> Resumen Analítico IA</h3>
                </div>
                <div className="ai-text" style={{ fontSize: '0.88rem', color: '#f1f5f9' }}>
                  <MarkdownRenderer content={aiSummary} />
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
