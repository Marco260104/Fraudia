import { ArrowRight } from 'lucide-react'

const steps = [
  { num: '01', title: 'Ingesta', desc: 'Carga y validación de siniestros, pólizas, asegurados, proveedores y documentos desde múltiples fuentes.' },
  { num: '02', title: 'Features', desc: 'Ingeniería de 42 variables de riesgo: frecuencia, proximidad temporal, anomalías de monto, similitud textual y más.' },
  { num: '03', title: 'Reglas + ML', desc: 'Motor híbrido: 10 reglas de negocio configurables + ensemble RandomForest, XGBoost y LightGBM calibrado.' },
  { num: '04', title: 'Score final', desc: 'Score híbrido (0-100) con nivel de riesgo, reglas activadas y explicación automática para el analista.' },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="w-full py-20 md:py-24 bg-stone-50 border-y border-stone-200">
      <div className="w-full max-w-[1480px] mx-auto px-8 md:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold text-[#D97706] italic tracking-[0.3px]">Cómo funciona</div>
            <h2 className="text-stone-950 tracking-[-2.6px] leading-none text-[60px] mt-2">Pipeline<br />modular.</h2>
            <p className="text-stone-600 text-[15px] mt-6 leading-relaxed">
              Cuatro etapas secuenciales diseñadas con el patrón Strategy. 
              Cada etapa es intercambiable, testable de forma aislada y 
              puede ejecutarse por separado.
            </p>
            <div className="mt-10 flex items-center gap-2 text-xs font-medium text-stone-400 tracking-wider">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D97706]" />
              IMPLEMENTACIÓN EN PRODUCCIÓN
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {steps.map((step, i) => (
              <div key={i} className="card card-lg group bg-white p-7 flex items-start gap-6 transition-all hover:border-[#D97706]/30">
                <div className="font-mono text-4xl font-semibold text-[#D97706] tabular-nums w-10 shrink-0">
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xl tracking-[-0.3px] text-stone-950">{step.title}</div>
                  <p className="text-[14px] text-stone-600 mt-2 leading-relaxed">{step.desc}</p>
                </div>
                <ArrowRight size={18} className="text-stone-300 group-hover:text-[#D97706] transition-colors shrink-0 mt-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
