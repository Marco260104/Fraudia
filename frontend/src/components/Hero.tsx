import { ArrowRight } from 'lucide-react'
import { HeroSphere } from './HeroSphere'

export function Hero() {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center pt-20 pb-12 overflow-hidden bg-white">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-10"
        style={{
          backgroundImage: `url('/assets/fraudia-dot-grid-texture.png')`,
          backgroundSize: '420px 420px'
        }}
      />

      <div className="w-full grid md:grid-cols-12 gap-x-6 px-8 md:px-10 lg:px-12 items-center relative z-20">
        <div className="md:col-span-6 lg:col-span-5 xl:col-span-4 2xl:col-span-4 pb-12 md:pb-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-1 text-xs font-semibold tracking-[1.5px] text-stone-600 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            hackiathon 2026 · prototipo funcional
          </div>

          <h1 className="text-stone-950 tracking-[-3.2px] leading-[0.92] text-[72px] md:text-[84px] lg:text-[96px] font-semibold">
            Detectamos fraude<br />antes de que<br />cueste millones.
          </h1>

          <p className="mt-6 max-w-[42ch] text-[17px] text-stone-600 leading-relaxed">
            Prototipo de inteligencia artificial que identifica patrones de posible fraude 
            en siniestros de seguros con explicabilidad total y score accionable.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-9">
            <button 
              onClick={scrollToDemo}
              className="group inline-flex items-center justify-center h-12 pl-7 pr-6 rounded-full bg-[#D97706] hover:bg-[#92400e] text-white font-semibold text-sm tracking-[-0.1px] active:scale-[0.985] transition-all"
            >
              Probar el scoring en vivo
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button 
              onClick={() => document.getElementById('arquitectura')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-stone-300 hover:bg-stone-50 font-semibold text-sm text-stone-700 active:scale-[0.985] transition-all"
            >
              Ver arquitectura
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {['Hybrid ML + Rules', 'ROC-AUC 0.987', 'Explicabilidad nativa', '12.500 siniestros'].map((chip, i) => (
              <div key={i} className="inline-flex items-center rounded-full bg-white border border-stone-200 px-4 py-1 text-xs font-medium text-stone-600">
                {chip}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-7 xl:col-span-8 2xl:col-span-8 relative flex items-center justify-center min-h-[400px] md:min-h-0">
          <div className="w-full max-w-[700px] aspect-square">
            <HeroSphere />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block text-[10px] tracking-[2.5px] text-stone-400 font-medium">
        SCROLL PARA EXPLORAR
      </div>
    </section>
  )
}
