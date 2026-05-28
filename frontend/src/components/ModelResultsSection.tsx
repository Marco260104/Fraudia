import { useState } from 'react'
import { X } from 'lucide-react'

const graphs = [
  { src: '/assets/reports/confusion_matrices.png', title: 'Matrices de confusión', caption: 'Comparativa de los tres modelos en validación' },
  { src: '/assets/reports/confusion_test_best.png', title: 'Matriz de confusión — Test', caption: 'Modelo ganador (LightGBM) sobre datos no vistos' },
  { src: '/assets/reports/feature_importance.png', title: 'Importancia de variables', caption: 'Top features que más influyen en el score final' },
  { src: '/assets/reports/metrics_comparison.png', title: 'Comparativa de métricas', caption: 'Precision, Recall, F1 y ROC-AUC por modelo' },
  { src: '/assets/reports/pr_comparison.png', title: 'Curvas Precision-Recall', caption: 'Comportamiento en clases desbalanceadas (8% fraude)' },
  { src: '/assets/reports/roc_comparison.png', title: 'Curvas ROC', caption: '0.987 AUC-ROC del modelo seleccionado en test' },
]

export function ModelResultsSection() {
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null)

  return (
    <section id="modelo" className="w-full py-20 md:py-24 border-t border-stone-200 bg-white">
      <div className="w-full max-w-[1480px] mx-auto px-8 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-y-4 mb-11">
          <div>
            <div className="text-xs font-semibold text-[#D97706] italic tracking-[0.3px]">Evaluación rigurosa</div>
            <h2 className="text-stone-950 tracking-[-2.6px] leading-none text-[58px] mt-2">Resultados del<br />modelo.</h2>
          </div>
          <p className="text-stone-600 max-w-md text-[15px]">Todos los gráficos generados directamente desde la evaluación del mejor modelo sobre el conjunto de prueba.</p>
        </div>

        {/* Real metrics bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-9">
          {[
            { label: 'AUC-ROC', value: '0.9874' },
            { label: 'F1-SCORE (FRAUDE)', value: '0.8971' },
            { label: 'PRECISIÓN', value: '0.9444' },
            { label: 'RECALL', value: '0.8543' },
          ].map((m, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-2xl px-6 py-4">
              <div className="text-xs font-medium text-stone-500 tracking-widest">{m.label}</div>
              <div className="font-mono text-4xl font-semibold tracking-[-1.5px] text-emerald-600 mt-1">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {graphs.map((g, i) => (
            <button
              key={i}
              onClick={() => setLightbox({ src: g.src, caption: `${g.title} — ${g.caption}` })}
              className="card card-lg group text-left bg-white border border-stone-200 rounded-3xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] active:scale-[0.995] transition-all"
            >
              <div className="aspect-[16/10] bg-stone-100 relative">
                <img src={g.src} alt={g.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-5 text-sm">
                <div className="font-semibold text-stone-950">{g.title}</div>
                <div className="text-xs text-stone-500 mt-0.5">{g.caption}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4 md:p-8 lightbox-modal"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-[94%] max-h-[92%] relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setLightbox(null)} 
              className="absolute -top-4 -right-4 md:-top-5 md:-right-5 w-11 h-11 rounded-full bg-white text-stone-950 flex items-center justify-center text-3xl leading-none shadow-xl z-10 hover:bg-stone-100 active:scale-95"
            >
              <X size={22} />
            </button>
            <img src={lightbox.src} className="max-h-[82vh] rounded-2xl shadow-2xl object-contain bg-white" alt="" />
            <div className="mt-4 text-center text-white/70 text-sm tracking-wide">{lightbox.caption}</div>
          </div>
        </div>
      )}
    </section>
  )
}
