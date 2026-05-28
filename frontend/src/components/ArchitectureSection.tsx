import { useEffect, useRef, useState } from 'react'

export function ArchitectureSection() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [networkError, setNetworkError] = useState(false)

  // Animate pipeline arrows when section enters viewport
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const paths = svg.querySelectorAll('.pipeline-flow')
          paths.forEach((path, i) => {
            path.setAttribute('stroke', '#D97706')
            ;(path as SVGPathElement).style.animation = `flow 1.65s linear ${i * 140}ms infinite`
          })
          observer.disconnect()
        }
      },
      { threshold: 0.55 }
    )
    observer.observe(svg)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="arquitectura" className="w-full py-20 md:py-24 border-t border-stone-200 bg-white">
      <div className="w-full max-w-[1480px] mx-auto px-8 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="lg:w-5/12">
            <div className="text-xs font-semibold text-[#D97706] mb-3 italic tracking-[0.3px]">Diseño modular</div>
            <h2 className="text-stone-950 tracking-[-2.6px] leading-none text-[58px]">Arquitectura del<br />sistema.</h2>
            <p className="mt-6 text-lg text-stone-600 max-w-[38ch]">
              Pipeline completamente modular implementado con el patrón Strategy. Cada etapa es intercambiable y testable de forma aislada.
            </p>
            <div className="mt-8 text-sm font-medium text-emerald-600 tracking-widest">100% PYTHON • ESTRATEGIA POR ETAPA</div>
          </div>

          <div className="lg:w-7/12">
            <div className="bg-white border border-stone-200 rounded-3xl p-9 lg:p-10 shadow-sm">
              <svg ref={svgRef} width="100%" height="162" viewBox="0 0 920 162" fill="none" className="w-full">
                {/* Flow paths */}
                {[
                  'M142 81 L 188 81',
                  'M282 81 L 328 81',
                  'M422 81 L 468 81',
                  'M562 81 L 608 81',
                  'M702 81 L 748 81',
                ].map((d, i) => (
                  <path key={i} d={d} stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" className="pipeline-flow" />
                ))}

                {/* Nodes */}
                {[
                  { x: 84, label: 'INGESTA' },
                  { x: 294, label: 'FEATURES' },
                  { x: 434, label: 'REGLAS' },
                  { x: 574, label: 'MODELOS ML' },
                  { x: 714, label: 'SCORING' },
                  { x: 854, label: 'ALERTA' },
                ].map((node, i) => (
                  <g key={i} className="cursor-default">
                    <circle cx={node.x} cy={81} r={38} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                    <circle cx={node.x} cy={81} r={28} fill={i === 5 ? '#16A34A' : '#D97706'} />
                    <text x={node.x} y={85} textAnchor="middle" fill="white" fontSize="10.5" fontWeight="700" letterSpacing="0.6">{node.label}</text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="text-xs text-stone-500 mt-4 max-w-prose px-1">
              El flujo completo puede ejecutarse con <span className="font-mono bg-stone-100 px-1.5 py-px rounded text-[10px]">python -m src.pipeline.run_all</span>
            </p>
          </div>
        </div>

        {/* Network video as decorative element (full width treatment) */}
        <div className="mt-16 relative rounded-3xl overflow-hidden border border-stone-200 bg-[#0c0a09] h-[340px] md:h-[400px] flex items-center justify-center">
          {networkError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 to-stone-800" />
          ) : (
            <video 
              src="/assets/fraudia-network-loop.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline 
              onError={() => setNetworkError(true)}
              className="absolute inset-0 w-full h-full object-cover opacity-75"
              style={{ filter: 'saturate(0.85) contrast(1.1)' }}
            />
          )}
          <div className="relative z-10 text-center px-6">
            <div className="inline-flex items-center gap-x-2 bg-black/60 text-white text-xs tracking-[2px] font-medium px-5 py-2 rounded-full backdrop-blur border border-white/15">
              RED DE NODOS DE RIESGO EN TIEMPO REAL
            </div>
            <p className="text-white/70 text-sm mt-4 max-w-xs mx-auto">Visualización del grafo de relaciones entre siniestros, asegurados y proveedores con alertas activas.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
