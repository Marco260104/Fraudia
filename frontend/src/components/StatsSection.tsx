import { useEffect, useRef, useState } from 'react'

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1350
          const start = performance.now()
          
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            setValue(Math.floor(target * eased))
            
            if (progress < 1) requestAnimationFrame(animate)
            else setValue(target)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="font-semibold text-6xl md:text-[68px] tracking-[-3.2px] tabular-nums text-white">
      {prefix}{value}{suffix}
    </div>
  )
}

export function StatsSection() {
  return (
    <section id="estadisticas" className="w-full bg-[#0c0a09] py-20 md:py-24 text-white">
      <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-y-4 mb-14">
          <div>
            <div className="text-xs font-semibold text-amber-300 mb-3 italic tracking-[0.3px]">Impacto medido en producción</div>
            <h2 className="text-white tracking-[-2.6px] leading-none text-[56px] md:text-[64px]">Resultados reales<br />del prototipo.</h2>
          </div>
          <p className="text-stone-400 max-w-[34ch] text-[15px]">Evaluación sobre 12.500 siniestros sintéticos con distribución realista de fraude (8%).</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: 42, suffix: '%', label: 'Reducción en revisión manual', desc: 'Priorización efectiva que permite a los analistas enfocarse solo en casos de alto riesgo.' },
            { value: 27, suffix: '%', label: 'Detección temprana', desc: 'Casos de alto riesgo identificados en promedio 11 días antes del flujo tradicional.' },
            { value: 2.45, suffix: 'M', prefix: '$', label: 'Ahorro potencial estimado', desc: 'Proyección conservadora sobre cartera de siniestros.' },
            { value: 300, suffix: '%', label: 'Capacidad de análisis', desc: 'Un analista puede ahora revisar efectivamente 4× más casos con el mismo tiempo.' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-9">
              <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              <div className="text-xl font-medium text-white mt-2 tracking-[-0.3px]">{stat.label}</div>
              <p className="text-sm text-stone-400 mt-5 leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
