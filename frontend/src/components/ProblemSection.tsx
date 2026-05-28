export function ProblemSection() {
  return (
    <section id="problema" className="w-full border-t border-stone-200 bg-white py-20 md:py-24">
      <div className="w-full max-w-[1480px] mx-auto px-8 md:px-12">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-14">
          {/* Left column */}
          <div>
            <div className="text-xs font-semibold text-[#D97706] mb-3 italic tracking-[0.3px]">El contexto actual</div>
            <h2 className="text-stone-950 tracking-[-2.4px] leading-none text-[52px] md:text-[58px]">Los desafíos del<br />analista hoy.</h2>
            
            <div className="mt-10 space-y-8 text-[15.5px] text-stone-600 leading-relaxed max-w-[38ch]">
              <p>Revisión manual de cientos de siniestros con reglas dispersas y conocimiento tribal que no escala.</p>
              <p>Señales de fraude ocultas en cruces de datos entre pólizas, proveedores, documentos y narrativas textuales.</p>
              <p>Decisiones lentas que permiten que fraudes de alto impacto pasen antes de ser detectados.</p>
              <p>Falta de explicabilidad: cuando se marca un caso, el analista no siempre entiende el porqué con claridad.</p>
            </div>
          </div>

          {/* Right column */}
          <div className="md:pt-8">
            <div className="text-xs font-semibold text-[#D97706] mb-3 italic tracking-[0.3px]">Lo que fraudIA cambia</div>
            <h2 className="text-stone-950 tracking-[-2.4px] leading-none text-[52px] md:text-[58px]">Inteligencia<br />aumentada.</h2>

            <div className="mt-10 space-y-5">
              {[
                { num: '01', title: 'Score híbrido explicable', desc: 'Reglas de negocio validadas + modelos ML (0.987 AUC) con pesos configurables y salida interpretable.' },
                { num: '02', title: 'Semáforo de acción inmediata', desc: 'Clasificación automática en tres niveles con recomendaciones claras para el flujo operativo del analista.' },
                { num: '03', title: 'Patrones + trazabilidad total', desc: 'Cada alerta incluye las reglas activadas, contribución del modelo y contexto completo del siniestro.' },
              ].map((item, i) => (
                <div key={i} className="card card-lg flex gap-6 p-7">
                  <div className="font-mono text-2xl text-[#D97706] tabular-nums w-8">{item.num}</div>
                  <div>
                    <div className="font-semibold text-stone-950 text-[17px] tracking-[-0.2px]">{item.title}</div>
                    <p className="text-[14.5px] text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
