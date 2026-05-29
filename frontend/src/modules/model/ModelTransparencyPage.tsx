import { useEffect, useState } from 'react'
import {
  Bell,
  CaretDown,
  MagnifyingGlass,
  Question,
  UserCircle,
  Brain,
  ChartLineUp,
  Target,
  CheckCircle,
  XCircle,
  WarningDiamond
} from '@phosphor-icons/react'
import { DashboardSidebar } from '../../shared/layout/DashboardSidebar'
import { API_BASE_URL } from '../../config/api'

export function ModelTransparencyPage() {
  const [status, setStatus] = useState<any>(null)
  const [comparison, setComparison] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/model/status`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/model/comparison`).then(res => res.json())
    ])
      .then(([statusData, comparisonData]) => {
        setStatus(statusData)
        setComparison(comparisonData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching model data", err)
        setError(true)
        setLoading(false)
        // Fallback
        setStatus({
          best_model: "random_forest", roc_auc: 0.9858, precision: 0.8824, recall: 0.8333,
          f1: 0.8571, accuracy: 0.95, casos_positivos: 91, casos_negativos: 409,
          fecha_entrenamiento: "2026-05-29 09:00", threshold_actual: 0.5, model_loaded: true
        })
      })
  }, [])

  return (
    <main className="page dashboard-page">
      <div className="dashboard-layout">
        <DashboardSidebar activeRoute="/modelo" />

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <label className="dashboard-search">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Buscar en transparencia..." />
              <kbd>⌘ K</kbd>
            </label>

            <div className="dashboard-topbar-actions">
              {error && <span className="demo-badge" style={{ background: '#f59e0b', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Modo demo</span>}
              <button type="button" className="icon-button">
                <Bell size={18} weight="bold" />
              </button>
              <button type="button" className="icon-button">
                <Question size={18} weight="bold" />
              </button>
              <button type="button" className="profile-chip">
                <UserCircle size={24} weight="bold" />
                <span>
                  <strong>Analista Senior</strong>
                  <small>Unidad Antifraude</small>
                </span>
              </button>
            </div>
          </header>

          <div className="dashboard-page-head" style={{ marginBottom: '24px' }}>
            <div>
              <h1>Transparencia de IA</h1>
              <p>Métricas, evaluación y explicabilidad del modelo de detección de fraude.</p>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
               <div className="skeleton-pulse" style={{ height: '120px', width: '200px', borderRadius: '8px' }}></div>
               <div className="skeleton-pulse" style={{ height: '120px', width: '200px', borderRadius: '8px' }}></div>
               <div className="skeleton-pulse" style={{ height: '120px', width: '200px', borderRadius: '8px' }}></div>
            </div>
          ) : (
            <>
              {/* Sección 1: Estado del Modelo */}
              <section className="dashboard-kpis" style={{ marginBottom: '32px' }}>
                <article className="kpi-card">
                  <p>Modelo Activo</p>
                  <strong style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
                    {status?.best_model?.replace('_', ' ')}
                  </strong>
                  <span className={`kpi-delta ${status?.model_loaded ? 'accent-green' : 'accent-red'}`}>
                    {status?.model_loaded ? 'Cargado en memoria' : 'No disponible (Usando Reglas)'}
                  </span>
                </article>
                <article className="kpi-card">
                  <p>Precisión (Precision)</p>
                  <strong>{(status?.precision * 100).toFixed(1)}%</strong>
                  <span className="kpi-delta accent-blue">Falsos positivos minimizados</span>
                </article>
                <article className="kpi-card">
                  <p>Captura (Recall)</p>
                  <strong>{(status?.recall * 100).toFixed(1)}%</strong>
                  <span className="kpi-delta accent-amber">Fraudes detectados</span>
                </article>
                <article className="kpi-card">
                  <p>F1-Score</p>
                  <strong>{(status?.f1 * 100).toFixed(1)}%</strong>
                  <span className="kpi-delta accent-teal">Balance de métricas</span>
                </article>
                <article className="kpi-card">
                  <p>Último Entrenamiento</p>
                  <strong style={{ fontSize: '1.2rem' }}>{status?.fecha_entrenamiento}</strong>
                  <span className="kpi-delta accent-violet">Umbral: {status?.threshold_actual}</span>
                </article>
              </section>

              {/* Sección 2: Comparación de Modelos */}
              <section className="dashboard-panel panel-table" style={{ marginBottom: '32px' }}>
                <div className="panel-head">
                  <div>
                    <h2>Comparación de Modelos (Test Set)</h2>
                    <p>Rendimiento de los algoritmos evaluados durante el entrenamiento.</p>
                  </div>
                </div>
                <div className="claims-table" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
                  <div className="claims-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
                    <span>Modelo</span>
                    <span>ROC-AUC</span>
                    <span>Accuracy</span>
                    <span>Precision</span>
                    <span>Recall</span>
                    <span>F1</span>
                  </div>
                  {comparison?.test && Object.entries(comparison.test).map(([name, metrics]: [string, any]) => (
                    <div key={name} className="claims-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>
                      <strong style={{ textTransform: 'capitalize' }}>
                        {name.replace('_', ' ')}
                        {status?.best_model === name && <span style={{ marginLeft: '8px', color: '#10b981', fontSize: '12px' }}>(Activo)</span>}
                      </strong>
                      <span>{metrics.roc_auc.toFixed(4)}</span>
                      <span>{metrics.accuracy.toFixed(4)}</span>
                      <span>{metrics.precision.toFixed(4)}</span>
                      <span>{metrics.recall.toFixed(4)}</span>
                      <span>{metrics.f1.toFixed(4)}</span>
                    </div>
                  ))}
                  {(!comparison || !comparison.test) && (
                    <div className="claims-row" style={{ gridTemplateColumns: '1fr' }}>
                      <span style={{ textAlign: 'center', color: '#888' }}>Datos de comparación no disponibles</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Sección 3: Reportes Visuales */}
              <section style={{ marginBottom: '32px' }}>
                <div className="panel-head" style={{ marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Reportes Visuales del Entrenamiento</h2>
                    <p style={{ color: '#8f9099' }}>Gráficas generadas durante la fase de validación y prueba del modelo.</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                  {[
                    { file: 'metrics_comparison.png', title: 'Comparación de Métricas' },
                    { file: 'roc_comparison.png', title: 'Curvas ROC (Todos los modelos)' },
                    { file: 'pr_comparison.png', title: 'Curvas Precision-Recall' },
                    { file: 'confusion_test_best.png', title: 'Matriz de Confusión (Test)' },
                    { file: 'feature_importance.png', title: 'Importancia de Variables (Random Forest)' },
                    { file: 'model_probability_distribution.png', title: 'Distribución de Probabilidades' },
                    { file: 'risk_rule_distribution.png', title: 'Distribución por Regla de Riesgo' }
                  ].map((img) => (
                    <div key={img.file} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
                      <h3 style={{ fontSize: '1rem', marginBottom: '12px', textAlign: 'center' }}>{img.title}</h3>
                      <img 
                        src={`${API_BASE_URL}/api/model/reports/${img.file}`} 
                        alt={img.title}
                        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23222"/><text x="50%" y="50%" fill="%23888" dominant-baseline="middle" text-anchor="middle">Imagen no disponible</text></svg>'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Sección 4: Distribución de Scores */}
              <section className="dashboard-panel" style={{ marginBottom: '32px' }}>
                <div className="panel-head">
                  <h2>Distribución de Scores</h2>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <div style={{ flex: 1, padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                    <h3 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle weight="fill" /> Riesgo Bajo (0-39%)</h3>
                    <p style={{ fontSize: '0.875rem', marginTop: '8px', color: '#c4c5cc' }}>Siniestros con comportamiento habitual. Procesamiento automático sugerido.</p>
                  </div>
                  <div style={{ flex: 1, padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                    <h3 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}><WarningDiamond weight="fill" /> Riesgo Medio (40-74%)</h3>
                    <p style={{ fontSize: '0.875rem', marginTop: '8px', color: '#c4c5cc' }}>Anomalías leves o coincidencias parciales. Requiere revisión de documentación.</p>
                  </div>
                  <div style={{ flex: 1, padding: '16px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '8px' }}>
                    <h3 style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '8px' }}><XCircle weight="fill" /> Riesgo Alto (75-100%)</h3>
                    <p style={{ fontSize: '0.875rem', marginTop: '8px', color: '#c4c5cc' }}>Patrones claros de fraude (narrativas clonadas, proveedores bloqueados). Escalado a investigación.</p>
                  </div>
                </div>
              </section>

              {/* Sección 5: Limitaciones y Transparencia */}
              <section className="dashboard-panel">
                <div className="panel-head">
                  <h2>Limitaciones y Transparencia (Disclaimer)</h2>
                </div>
                <div style={{ marginTop: '16px', color: '#c4c5cc', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  <p style={{ marginBottom: '8px' }}><strong>1. Datos de Entrenamiento:</strong> El dataset utilizado contiene 500 registros, gran parte de ellos generados de forma sintética para propósitos de demostración. Los patrones aprendidos reflejan este contexto y no provienen de un histórico real de aseguradora.</p>
                  <p style={{ marginBottom: '8px' }}><strong>2. Etiquetas Heurísticas:</strong> La etiqueta objetivo ("fraude_historico") fue generada mediante un modelo de heurísticas predefinidas, lo cual infla el rendimiento del modelo ML al aprender reglas determinísticas.</p>
                  <p style={{ marginBottom: '8px' }}><strong>3. Rendimiento Real:</strong> El recall y la precisión en un entorno de producción con casos de fraude real y no documentados podría diferir sustancialmente de las métricas de prueba aquí reportadas.</p>
                  <p><strong>4. Uso de la Herramienta:</strong> El sistema genera "alertas de revisión", no acusaciones legales de fraude. La decisión final siempre debe recaer en un ajustador o analista humano, quien evaluará el contexto y la documentación soporte del caso.</p>
                </div>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
