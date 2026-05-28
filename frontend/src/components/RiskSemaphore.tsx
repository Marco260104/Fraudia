export function RiskSemaphore() {
  return (
    <section className="w-full py-20 md:py-24 border-t border-stone-200 bg-white">
      <div className="w-full max-w-[1480px] mx-auto px-8 md:px-12">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-[#D97706] italic tracking-[0.3px]">Accionable por diseño</div>
          <h2 className="text-stone-950 tracking-[-2.6px] leading-none text-[58px] mt-2">Semáforo de riesgo.</h2>
          <p className="mt-4 text-lg text-stone-600">Tres niveles claros con acciones recomendadas. El sistema nunca acusa: solo prioriza y explica.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { range: '0 — 40', level: 'BAJO RIESGO', color: 'emerald', action: 'flujo estándar', desc: 'Continuar flujo normal de procesamiento. No requiere revisión especializada. El caso presenta comportamiento estadísticamente normal.' },
            { range: '41 — 75', level: 'MEDIO RIESGO', color: 'yellow', action: 'revisión documental', desc: 'Escalar a Unidad Antifraude para revisión documental adicional. Recomendado análisis de proveedor y frecuencia histórica del asegurado.' },
            { range: '76 — 100', level: 'ALTO RIESGO', color: 'red', action: 'investigación de campo', desc: 'Revisión especializada de campo inmediata. Activar protocolo de investigación y retener pago hasta dictamen de la unidad antifraude.' },
          ].map((item, i) => (
            <div key={i} className="card card-lg bg-white border p-8 rounded-3xl">
              <div className="flex items-center gap-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-2xl ${item.color === 'emerald' ? 'bg-emerald-100' : item.color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                  {item.color === 'emerald' ? '🟢' : item.color === 'yellow' ? '🟡' : '🔴'}
                </div>
                <div>
                  <div className="font-semibold text-2xl tracking-tight text-stone-950">{item.range}</div>
                  <div className={`font-medium -mt-1 ${item.color === 'emerald' ? 'text-emerald-600' : item.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{item.level}</div>
                </div>
              </div>
              <div className="h-px bg-stone-100 my-7" />
              <p className="text-sm leading-relaxed text-stone-600">{item.desc}</p>
              <div className={`mt-6 text-xs font-medium ${item.color === 'emerald' ? 'text-emerald-600' : item.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{item.action}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
