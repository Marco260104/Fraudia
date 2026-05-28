import { useState } from 'react'
import { calculateRiskScore } from '../lib/scoring'
import { ArrowRight } from 'lucide-react'

export function LiveRiskDemo() {
  const [rulesScore, setRulesScore] = useState(22)
  const [mlProb, setMlProb] = useState(0.68)

  const result = calculateRiskScore({ rulesScore, mlProbability: mlProb })

  const levelColor = result.level === 'Bajo' ? 'emerald' : result.level === 'Medio' ? 'amber' : 'red'

  return (
    <section id="demo" className="w-full py-20 md:py-24 bg-stone-950 text-white border-t border-white/10">
      <div className="w-full max-w-[1480px] mx-auto px-8 md:px-12">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-amber-300 italic tracking-[0.3px]">Herramienta interactiva</div>
          <h2 className="text-white tracking-[-2.6px] leading-none text-[58px] mt-2">Prueba el scoring<br />en vivo.</h2>
          <p className="mt-4 text-lg text-stone-400">Ajusta los valores y observa cómo el motor híbrido calcula el score y nivel de riesgo en tiempo real. Lógica 100% fiel al código de producción.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-9">
            <div className="space-y-9">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <div>Score de reglas (0-70)</div>
                  <div className="font-mono text-white/70">{rulesScore}</div>
                </div>
                <input 
                  type="range" min={0} max={70} step={1}
                  value={rulesScore} 
                  onChange={e => setRulesScore(parseInt(e.target.value))}
                  className="w-full accent-[#D97706]"
                />
                <div className="text-xs text-white/50 mt-1.5">Reglas activadas: BorderProximity, LateReporting, ClaimFrequency, etc.</div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-3">
                  <div>Probabilidad ML (0-1)</div>
                  <div className="font-mono text-white/70">{mlProb.toFixed(2)}</div>
                </div>
                <input 
                  type="range" min={0} max={1} step={0.01}
                  value={mlProb} 
                  onChange={e => setMlProb(parseFloat(e.target.value))}
                  className="w-full accent-[#D97706]"
                />
                <div className="text-xs text-white/50 mt-1.5">Salida del mejor modelo (LightGBM) sobre features del siniestro.</div>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-9 flex flex-col">
            <div className="text-xs tracking-widest text-white/60 mb-2">RESULTADO EN TIEMPO REAL</div>
            
            <div className="mt-auto">
              <div className="font-mono text-[92px] font-semibold tracking-[-6px] leading-none text-white tabular-nums">
                {result.score}
              </div>
              <div className="text-2xl font-medium tracking-[-0.6px] mt-1">SCORE FINAL</div>
            </div>

            <div className={`mt-8 inline-flex self-start px-5 py-1.5 rounded-full text-sm font-semibold border ${levelColor === 'emerald' ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-400' : levelColor === 'amber' ? 'bg-amber-500/10 border-amber-400/30 text-amber-400' : 'bg-red-500/10 border-red-400/30 text-red-400'}`}>
              NIVEL {result.level.toUpperCase()}
            </div>

            <p className="text-sm text-white/75 mt-6 leading-relaxed">{result.explanation}</p>

            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              Ver el semáforo completo <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
