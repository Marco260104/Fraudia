import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

const codeSnippet = `class HybridScoringStrategy(ScoringStrategy):
    name = "Híbrido (Reglas + ML)"

    def __init__(self, rules_weight=0.4, ml_weight=0.6,
                 threshold_low=40, threshold_high=75):
        self.rules_weight = rules_weight
        self.ml_weight = ml_weight
        self.threshold_low = threshold_low
        self.threshold_high = threshold_high

    def calculate(self, df):
        rules_score = df.get("risk_score_rules", 0)
        ml_proba = df.get("ml_fraude_probabilidad", 0.5)
        
        rules_normalized = (rules_score / 70.0) * 100
        ml_normalized = ml_proba * 100

        df["score_final"] = (
            rules_normalized * self.rules_weight + 
            ml_normalized * self.ml_weight
        ).clip(0, 100).astype(int)
        df["nivel_riesgo"] = df["score_final"].apply(self.get_risk_level)
        return df

    def get_risk_level(self, score):
        if score <= self.threshold_low: return "Bajo"
        elif score <= self.threshold_high: return "Medio"
        else: return "Alto"`

export function EvidenceCode() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    toast.success('Código copiado al portapapeles')
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section id="evidencia" className="w-full py-20 md:py-24 border-t border-stone-200 bg-white">
      <div className="w-full max-w-[1480px] mx-auto px-8 md:px-12">
        <div className="grid lg:grid-cols-12 gap-x-16 gap-y-10">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold text-[#D97706] italic tracking-[0.3px]">Transparencia total</div>
            <h2 className="text-stone-950 tracking-[-2.6px] leading-none text-[58px] mt-3">Evidencia<br />técnica real.</h2>
            <p className="mt-6 text-lg text-stone-600">Fragmento del motor de scoring híbrido que combina reglas de negocio con probabilidad del modelo. Código de producción, no demo.</p>
            <div className="mt-8 text-sm">
              <div className="font-medium text-stone-900">Archivo fuente</div>
              <div className="font-mono text-xs text-stone-500 mt-1">src/scoring/scoring_strategies.py</div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-[#292524]">
              <div className="flex items-center justify-between px-5 h-12 text-white/90 text-xs font-medium bg-[#1F2937]">
                <div className="flex items-center gap-x-3">
                  <div className="flex gap-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                  </div>
                  <span className="font-mono text-white/70">scoring_strategies.py</span>
                </div>
                <button onClick={handleCopy} className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/90 hover:text-white text-[10px] tracking-widest font-medium active:scale-[0.985] transition-all">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'COPIADO' : 'COPIAR'}</span>
                </button>
              </div>

              <pre className="code-block p-6 text-[#E2E8F0] overflow-x-auto"><code>{codeSnippet}</code></pre>
            </div>
            <div className="text-[10px] text-stone-500 mt-3 tracking-widest px-1">26 líneas • Production-ready • Totalmente testable</div>
          </div>
        </div>
      </div>
    </section>
  )
}
