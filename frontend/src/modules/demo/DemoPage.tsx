import { ChartLineUp, Files, ListChecks, ShieldCheck, SquaresFour, UsersThree } from '@phosphor-icons/react'

const sections = [
  { id: 'overview', label: 'Resumen', icon: SquaresFour },
  { id: 'claims', label: 'Siniestros', icon: Files },
  { id: 'scoring', label: 'Scoring', icon: ChartLineUp },
  { id: 'alerts', label: 'Alertas', icon: ListChecks },
  { id: 'providers', label: 'Proveedores', icon: UsersThree },
  { id: 'architecture', label: 'Arquitectura', icon: ShieldCheck },
]

export function DemoPage() {
  return (
    <main className="page demo-page">
      <div className="container demo-shell">
        <aside className="demo-sidebar">
          <div className="demo-sidebar-brand">
            <div>
              <strong>Demo operativa</strong>
              <span>Base para desarrollo modular</span>
            </div>
          </div>

          <nav className="demo-nav" aria-label="Secciones de la demo">
            {sections.map((section) => {
              const Icon = section.icon

              return (
                <a key={section.id} href={`#${section.id}`} className="demo-nav-item">
                  <Icon size={17} weight="bold" />
                  <span>{section.label}</span>
                </a>
              )
            })}
          </nav>
        </aside>

        <section className="demo-content">
          <div id="overview" className="demo-block">
            <div className="demo-block-head">
              <div>
                <p className="section-eyebrow">Vista general</p>
                <h1>Espacio en blanco listo para el módulo operativo.</h1>
              </div>
              <span className="demo-badge">Próxima implementación</span>
            </div>

            <div className="blank-grid">
              <article className="blank-panel">
                <span>Resumen ejecutivo</span>
                <strong>KPIs, riesgo total y evolución semanal.</strong>
              </article>
              <article className="blank-panel">
                <span>Trabajo en curso</span>
                <strong>Conectar datos, reglas y resultados del modelo.</strong>
              </article>
              <article className="blank-panel">
                <span>Estado</span>
                <strong>UI base preparada para desarrollar por módulos.</strong>
              </article>
            </div>
          </div>

          <div id="claims" className="demo-section">
            <div className="demo-section-head">
              <h2>Siniestros</h2>
              <p>Listado, filtros, detalle y priorización de revisión.</p>
            </div>
            <div className="placeholder-surface" />
          </div>

          <div id="scoring" className="demo-section">
            <div className="demo-section-head">
              <h2>Scoring</h2>
              <p>Reglas, variables, score y semáforo por caso.</p>
            </div>
            <div className="placeholder-surface placeholder-large" />
          </div>

          <div id="alerts" className="demo-section">
            <div className="demo-section-head">
              <h2>Alertas</h2>
              <p>Explicaciones, motivos y seguimiento de revisión humana.</p>
            </div>
            <div className="placeholder-surface" />
          </div>

          <div id="providers" className="demo-section">
            <div className="demo-section-head">
              <h2>Proveedores</h2>
              <p>Reincidencias, asociaciones y concentraciones de riesgo.</p>
            </div>
            <div className="placeholder-surface" />
          </div>

          <div id="architecture" className="demo-section">
            <div className="demo-section-head">
              <h2>Arquitectura</h2>
              <p>Secciones técnicas para ampliar el producto sin rehacer la base.</p>
            </div>
            <div className="placeholder-surface placeholder-large" />
          </div>
        </section>
      </div>
    </main>
  )
}
