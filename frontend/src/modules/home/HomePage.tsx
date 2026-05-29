import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { ArrowRight, ChartLineUp, ShieldCheck, Sparkle, Target } from '@phosphor-icons/react'
import { gsap } from 'gsap'

const trustLogos = ['Oracle', 'AWS', 'Microsoft Azure', 'NVIDIA', 'OpenAI', 'Databricks']

const heroStats = [
  { value: '-42%', label: 'Tiempo de revision manual' },
  { value: '+27%', label: 'Deteccion temprana' },
  { value: '$2.45M', label: 'Ahorro estimado' },
  { value: '+300%', label: 'Capacidad en paralelo' },
]

const insightCards = [
  {
    icon: ShieldCheck,
    title: 'Conexiones invisibles',
    description: 'Detectamos relaciones entre asegurados, proveedores, vehiculos y eventos.',
  },
  {
    icon: Sparkle,
    title: 'Patrones ocultos',
    description: 'Identificamos comportamientos atipicos que la revision manual suele perder.',
  },
  {
    icon: Target,
    title: 'Explicabilidad total',
    description: 'Cada alerta incluye el motivo y los factores que la empujaron al score.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Ingesta de datos',
    description: 'Datos del siniestro, poliza, documentos y señales de terceros.',
    icon: ChartLineUp,
  },
  {
    step: '02',
    title: 'Motor de IA',
    description: 'Modelos de texto y reglas operativas para sumar evidencia.',
    icon: Sparkle,
  },
  {
    step: '03',
    title: 'Deteccion de riesgo',
    description: 'Score priorizado con nivel de confianza y trazabilidad.',
    icon: Target,
  },
  {
    step: '04',
    title: 'Analisis y accion',
    description: 'Alertas claras para decidir rapido sin perder contexto.',
    icon: ShieldCheck,
  },
  {
    step: '05',
    title: 'Mejora continua',
    description: 'Feedback del analista para afinar reglas y entrenamiento.',
    icon: ChartLineUp,
  },
]

const evidenceImages = [
  { src: '/assets/reports/roc_comparison.png', title: 'Curva ROC (Comparativa)', desc: 'Relación entre tasa de verdaderos y falsos positivos de los modelos.' },
  { src: '/assets/reports/pr_comparison.png', title: 'Curva Precision-Recall', desc: 'Evaluación del balance entre precisión y exhaustividad para clasificar fraude.' },
  { src: '/assets/reports/feature_importance.png', title: 'Importancia de Variables (SHAP)', desc: 'Identificación de variables críticas que mayor influencia tienen en el score.' },
  { src: '/assets/reports/confusion_test_best.png', title: 'Matriz de Confusión (Mejor Modelo)', desc: 'Visualización de aciertos, falsos positivos y falsos negativos en test.' },
  { src: '/assets/reports/metrics_comparison.png', title: 'Comparativa de Métricas', desc: 'Accuracy, Precision, Recall y F1-score comparados entre algoritmos.' },
]


export function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null)
  const visualRef = useRef<HTMLDivElement | null>(null)

  const motionTargets = useMemo(
    () => [
      '.hero-eyebrow',
      '.hero-title',
      '.hero-copy p',
      '.hero-actions',
      '.hero-pills',
      '.trust-title',
      '.trust-logo',
      '.section-heading',
      '.insight-card',
      '.stat-card',
      '.process-card',
      '.dashboard-panel',
      '.footer-column',
    ],
    [],
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(motionTargets, { autoAlpha: 0, y: 24 })

      const timeline = gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })

      timeline
        .to('.hero-eyebrow', { autoAlpha: 1, y: 0 })
        .to('.hero-title', { autoAlpha: 1, y: 0 }, '-=0.65')
        .to('.hero-copy p', { autoAlpha: 1, y: 0, stagger: 0.12 }, '-=0.6')
        .to('.hero-actions', { autoAlpha: 1, y: 0 }, '-=0.55')
        .to('.hero-pills', { autoAlpha: 1, y: 0 }, '-=0.55')
        .to('.hero-visual', { autoAlpha: 1, y: 0 }, '-=0.55')
        .to('.trust-title', { autoAlpha: 1, y: 0 }, '-=0.2')
        .to('.trust-logo', { autoAlpha: 1, y: 0, stagger: 0.05 }, '-=0.45')
        .to('.section-heading', { autoAlpha: 1, y: 0, stagger: 0.06 }, '-=0.2')
        .to('.insight-card', { autoAlpha: 1, y: 0, stagger: 0.08 }, '-=0.5')
        .to('.stat-card', { autoAlpha: 1, y: 0, stagger: 0.06 }, '-=0.5')
        .to('.process-card', { autoAlpha: 1, y: 0, stagger: 0.06 }, '-=0.35')
        .to('.dashboard-panel', { autoAlpha: 1, y: 0 }, '-=0.45')
        .to('.footer-column', { autoAlpha: 1, y: 0, stagger: 0.05 }, '-=0.25')

      gsap.to('.hero-orb', {
        y: -18,
        duration: 5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      })

      gsap.to('.hero-gif-shell', {
        y: -8,
        duration: 4.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [motionTargets])

  useEffect(() => {
    const root = visualRef.current
    if (!root) return

    const handleMove = (event: MouseEvent) => {
      const bounds = root.getBoundingClientRect()
      const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2

      gsap.to(root.querySelectorAll<HTMLElement>('[data-parallax]'), {
        x: (_, target) => Number(target.dataset.parallax ?? 0) * offsetX,
        y: (_, target) => Number(target.dataset.parallax ?? 0) * offsetY * 0.7,
        duration: 0.45,
        ease: 'power3.out',
      })
    }

    const reset = () => {
      gsap.to(root.querySelectorAll<HTMLElement>('[data-parallax]'), {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      })
    }

    root.addEventListener('mousemove', handleMove)
    root.addEventListener('mouseleave', reset)

    return () => {
      root.removeEventListener('mousemove', handleMove)
      root.removeEventListener('mouseleave', reset)
    }
  }, [])

  return (
    <main className="page home-page" ref={heroRef}>
      <section className="hero-section">
        <div className="hero-backdrop" aria-hidden="true">
          <span className="hero-orb hero-orb-a" />
          <span className="hero-orb hero-orb-b" />
          <span className="hero-orb hero-orb-c" />
          <span className="hero-grid" />
        </div>

        <div className="container hero-grid-layout">
          <div className="hero-copy">
            <p className="hero-eyebrow">Inteligencia que protege tu negocio</p>
            <h1 className="hero-title">
              Detectamos fraude <span>antes de que cueste millones.</span>
            </h1>
            <p>
              Fraudia utiliza inteligencia artificial, analisis avanzado y reglas de negocio para identificar
              patrones ocultos y prevenir perdidas en siniestros.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="#solucion">
                Explorar plataforma <ArrowRight size={16} weight="bold" />
              </a>
              <a className="btn btn-secondary" href="#como-funciona">
                Ver como funciona
              </a>
            </div>

            <div className="hero-pills">
              <span>Analsis en tiempo real</span>
              <span>Alertas explicables</span>
              <span>Decisiones mas rapidas</span>
            </div>
          </div>

          <div className="hero-visual" ref={visualRef}>
            <div className="hero-figure hero-gif-frame">
              <div className="hero-gif-shell" data-parallax="18">
                <img
                  src={encodeURI('/fraudia_bot.gif')}
                  alt="Asistente animado de Fraudia"
                  className="hero-gif"
                  draggable={false}
                />
              </div>
              <div className="hero-gif-halo" aria-hidden="true" />
              <div className="hero-gif-caption" data-parallax="10">
                <span>Asistente activo</span>
                <strong>En bucle continuo</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-inner">
          <p className="trust-title">Tecnologia confiable. Resultados reales.</p>
          <div className="trust-logos">
            {trustLogos.map((logo) => (
              <span key={logo} className="trust-logo">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="solucion" className="section section-light">
        <div className="container insight-grid">
          <div className="section-heading">
            <p className="section-eyebrow">Miramos mas alla de los datos</p>
            <h2>
              Cada siniestro es una historia.
              <span>Nosotros encontramos lo que otros no ven.</span>
            </h2>
            <p>
              Combinamos multiples fuentes de informacion, modelos de machine learning, procesamiento de lenguaje
              natural y reglas de negocio para descubrir conexiones ocultas.
            </p>

            <div className="insight-list">
              {insightCards.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="insight-card">
                    <span className="insight-icon">
                      <Icon size={18} weight="bold" />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="insight-visual">
            <div className="insight-network" aria-hidden="true">
              <span className="insight-glow insight-glow-blue" />
              <span className="insight-glow insight-glow-red" />
              {Array.from({ length: 84 }).map((_, index) => (
                <span
                  key={index}
                  className={`insight-dot insight-dot-${(index % 5) + 1}`}
                  style={
                    {
                      '--dot-x': `${8 + ((index * 13) % 80)}%`,
                      '--dot-y': `${6 + ((index * 17) % 80)}%`,
                      '--dot-delay': `${index * 0.03}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            <article className="insight-floating-card card-top">
              <span>Asegurado</span>
              <strong>12 siniestros</strong>
            </article>
            <article className="insight-floating-card card-left">
              <span>Vehiculo</span>
              <strong>5 eventos similares</strong>
            </article>
            <article className="insight-floating-card card-right">
              <span>Proveedor</span>
              <strong>Coincidencias en 7 casos</strong>
            </article>
          </div>
        </div>

        <div className="container stats-band">
          {heroStats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="section">
        <div className="container">
          <div className="section-heading section-heading-wide">
            <p className="section-eyebrow">Un proceso inteligente</p>
            <h2>Asi funciona Fraudia</h2>
          </div>

          <div className="process-grid">
            {processSteps.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.step} className="process-card">
                  <span className="process-step">{item.step}</span>
                  <span className="process-icon">
                    <Icon size={20} weight="bold" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container dashboard-grid">
          <div className="dashboard-copy">
            <p className="section-eyebrow">Control total en un solo lugar</p>
            <h2>Un centro de inteligencia disenado para actuar.</h2>
            <p>
              Visualiza, analiza y gestiona los casos de mayor riesgo con dashboards intuitivos, filtros avanzados y
              metricas en tiempo real.
            </p>
            <a className="text-link" href="#evidencia">
              Ver dashboard en vivo <ArrowRight size={16} weight="bold" />
            </a>
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-topbar">
              <span>Panel de analisis</span>
              <strong>Fraudia Control Center</strong>
            </div>
            <div className="dashboard-grid-mini">
              <article>
                <span>24,562</span>
                <p>Eventos analizados</p>
              </article>
              <article>
                <span>1,389</span>
                <p>Alertas generadas</p>
              </article>
              <article>
                <span>87%</span>
                <p>Score promedio</p>
              </article>
              <article>
                <span>$2.45M</span>
                <p>Ahorro estimado</p>
              </article>
            </div>
            <div className="dashboard-graph">
              <span className="dashboard-pulse" />
              <span className="dashboard-pulse dashboard-pulse-alt" />
            </div>
          </div>
        </div>
      </section>

      <section id="evidencia" className="section">
        <div className="container">
          <div className="section-heading section-heading-wide">
            <p className="section-eyebrow">Evidencia visual</p>
            <h2>Modelos, metricas y señales listos para presentar.</h2>
          </div>

          <div className="evidence-grid">
            {evidenceImages.map((image) => (
              <figure key={image.title} className="evidence-card">
                <img src={image.src} alt={image.title} />
                <figcaption>
                  <strong>{image.title}</strong>
                  <span>{image.desc}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-column footer-brand">
            <img src="/assets/Logo.png" alt="Fraudia" />
            <p>
              Inteligencia que previene. Confianza que protege. Una plataforma para priorizar siniestros y apoyar la
              revision humana.
            </p>
          </div>

          <div className="footer-column">
            <h3>Producto</h3>
            <a href="#solucion">Plataforma</a>
            <a href="#como-funciona">Funcionalidades</a>
            <a href="#evidencia">Metricas</a>
          </div>

          <div className="footer-column">
            <h3>Recursos</h3>
            <a href="#evidencia">Documentacion</a>
            <a href="#solucion">Blog</a>
            <a href="#como-funciona">Casos de uso</a>
          </div>

          <div className="footer-column">
            <h3>Empresa</h3>
            <a href="#solucion">Nosotros</a>
            <a href="#como-funciona">Contacto</a>
            <a href="#evidencia">Webinars</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Fraudia. Todos los derechos reservados.</span>
          <span>Politica de privacidad · Terminos de uso</span>
        </div>
      </footer>
    </main>
  )
}
