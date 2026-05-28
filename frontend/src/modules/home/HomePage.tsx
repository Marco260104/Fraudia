import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { AssetFigure } from '../../shared/ui/AssetFigure'
import { InfoCard } from '../../shared/ui/InfoCard'
import { MetricCard } from '../../shared/ui/MetricCard'
import { Reveal } from '../../shared/ui/Reveal'
import { SectionHeading } from '../../shared/ui/SectionHeading'
import {
  evidenceAssets,
  footerGroups,
  problemPoints,
  solutionFlow,
  siteHighlights,
  stats,
} from './homeContent'
const Spline = lazy(() => import('@splinetool/react-spline'))

export function HomePage() {
  const navigate = useNavigate()
  const splineRef = useRef<HTMLDivElement | null>(null)
  const [sceneReady, setSceneReady] = useState(false)

  const dispatchSplineMouse = useCallback((clientX: number, clientY: number) => {
    const root = splineRef.current
    if (!root) return

    const canvas = root.querySelector('canvas') ?? root.querySelector('iframe')
    if (!canvas) return

    canvas.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
        view: window,
      }),
    )
  }, [])

  return (
    <main className="page home-page">
      <section
        className="hero-section"
        onMouseMove={(event) => dispatchSplineMouse(event.clientX, event.clientY)}
        onTouchMove={(event) => {
          const touch = event.touches[0]
          if (touch) {
            dispatchSplineMouse(touch.clientX, touch.clientY)
          }
        }}
      >
        <div className="hero-background" aria-hidden="true">
          <span className="hero-backdrop hero-backdrop-a" />
          <span className="hero-backdrop hero-backdrop-b" />
        </div>

        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Plataforma corporativa antifraude</p>
            <h1>Fraudia prioriza siniestros con claridad, control y criterio humano.</h1>
            <p className="hero-description">
              Una interfaz limpia para explicar riesgos, resumir el negocio y guiar la revisión sin saturar la
              primera pantalla.
            </p>

            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={() => navigate('/demo')}>
                Probar demo <ArrowRight size={16} />
              </button>
              <a className="btn btn-secondary" href="#solucion">
                Ver el flujo
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="corner-card corner-card-top-left">
              <span>Modelo</span>
              <strong>Híbrido</strong>
              <p>Reglas + IA + explicación</p>
            </div>
            <div className="corner-card corner-card-top-right">
              <span>Datos</span>
              <strong>2021–2025</strong>
              <p>Base de entrenamiento y validación</p>
            </div>
            <div className="corner-card corner-card-bottom-left">
              <span>Score</span>
              <strong>87%</strong>
              <p>Prioridad alta</p>
            </div>
            <div className="corner-card corner-card-bottom-right">
              <span>Acción</span>
              <strong>Revisar</strong>
              <p>Ruta de análisis humano</p>
            </div>

            <div className={`hero-stage ${sceneReady ? 'is-ready' : ''}`}>
              <div className="hero-spline-frame">
                <div className="hero-spline-overlay" />
                <Suspense fallback={<div className="hero-spline hero-spline-fallback" />}>
                  <div className="hero-spline" ref={splineRef}>
                    <Spline
                      scene="https://prod.spline.design/p10SBeJMwqghZCQ7/scene.splinecode"
                      onLoad={() => setSceneReady(true)}
                    />
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-flush">
        <div className="container">
          <div className="stats-grid">
            {stats.map((item) => (
              <Reveal key={item.label}>
                <MetricCard value={item.value} label={item.label} detail="Validado en la fase de entrenamiento." />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="problema" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Qué resuelve"
            title="Una lectura corporativa del problema, no una demo de hackatón."
            description="Fraudia reúne los datos mínimos del siniestro para priorizar revisión, reducir ruido y mostrar por qué un caso merece atención."
          />

          <div className="card-grid four-up">
            {problemPoints.map((point, index) => (
              <Reveal key={point.title} delay={index * 80}>
                <InfoCard
                  title={point.title}
                  description={point.description}
                  icon={<point.icon size={18} />}
                  tone={point.tone}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="solucion" className="section section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="Lo que usamos"
            title="Componentes del sitio y del producto, revelados al desplazarse."
            description="Cada bloque entra con un movimiento suave y consistente para mantener una sensación fluida mientras bajas por la página."
          />

          <div className="feature-grid">
            {siteHighlights.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 60}>
                <InfoCard
                  title={feature.title}
                  description={feature.description}
                  icon={<feature.icon size={18} />}
                  tone={feature.tone}
                />
              </Reveal>
            ))}
          </div>

          <div className="solution-band">
            {solutionFlow.map((step, index) => (
              <Reveal key={step.title} delay={index * 50}>
                <article className={`solution-step tone-${step.tone ?? 'blue'}`}>
                  <step.icon size={20} />
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="training" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Estadísticas del entrenamiento"
            title="Resultados listos para presentar con consistencia visual."
            description="Estas cifras sostienen el relato del modelo y dejan clara la calidad del entrenamiento y la validación."
          />

          <div className="training-stats">
            {stats.map((item, index) => (
              <Reveal key={item.label} delay={index * 60}>
                <article className="training-stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="evidencia" className="section section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="Fotos del entrenamiento"
            title="Las imágenes de activos viven aquí, no escondidas en el backend."
            description="Reutilizamos las imágenes del entrenamiento para reforzar la credibilidad del sistema y apoyar la narrativa visual."
          />

          <div className="asset-grid">
            {evidenceAssets.map((asset, index) => (
              <Reveal key={asset.title} delay={index * 70}>
                <AssetFigure src={asset.src} title={asset.title} description={asset.description} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="arquitectura" className="section">
        <div className="container architecture-grid">
          <div className="architecture-copy">
            <SectionHeading
              eyebrow="Gobierno"
              title="Arquitectura limpia, por módulos, para crecimiento real."
              description="La demo y el futuro del producto quedan ordenados para que cada módulo tenga su propia sección, su propia lógica y su propio desarrollo."
            />

            <div className="risk-signals">
              {siteHighlights.map((signal, index) => (
                <Reveal key={signal.title} delay={index * 60}>
                  <div className="signal-chip">
                    <span>{signal.title}</span>
                    <strong>{signal.description}</strong>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="architecture-panel">
            <div className="architecture-frame">
              <p className="frame-label">Ruta de entrega</p>
              <h3>Home → demo → módulos funcionales</h3>
              <ul>
                <li>Home corporativa con narrativa del negocio y evidencia.</li>
                <li>Demo con menú lateral preparado para módulos internos.</li>
                <li>GIF de carga y logo integrados sin cortes visuales.</li>
                <li>Fondo blanco, limpio y con transición suave entre secciones.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <p>
              Fraudia presenta una plataforma corporativa para priorizar siniestros, explicar riesgos y apoyar la
              revisión humana.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title} className="footer-group">
              <h3>{group.title}</h3>
              <div className="footer-links">
                {group.links.map((link) => (
                  link.href.startsWith('/') ? (
                    <Link key={link.label} to={link.href}>
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href}>
                      {link.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="container footer-bottom">
          <span>Fraudia · Sistema corporativo antifraude</span>
          <span>Diseño limpio · Animación suave · Base modular</span>
        </div>
      </footer>
    </main>
  )
}
