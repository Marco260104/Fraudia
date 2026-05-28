import { useEffect, useState } from 'react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 30)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const navHeight = 72
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all ${isScrolled ? 'border-stone-200/70 bg-white/97' : 'border-stone-200/50 bg-white/92'} backdrop-blur-2xl`}>
      <div className="w-full px-8 flex items-center justify-between h-[72px]">
        {/* Logo grande y prominente - usa el asset real del proyecto */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img 
            src="/assets/Logo.png" 
            alt="fraudIA" 
            className="h-9 w-auto" 
            draggable={false}
          />
          <div className="hidden sm:block">
            <div className="font-semibold text-[21px] tracking-[-0.6px] text-stone-950 leading-none">fraudIA</div>
            <div className="text-[9.5px] text-stone-500 tracking-[1.5px] -mt-px">HACKIATHON 2026</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-9 text-sm font-medium">
          <button onClick={() => scrollTo('problema')} className="text-stone-600 hover:text-stone-950 transition-colors">El problema</button>
          <button onClick={() => scrollTo('estadisticas')} className="text-stone-600 hover:text-stone-950 transition-colors">Impacto</button>
          <button onClick={() => scrollTo('arquitectura')} className="text-stone-600 hover:text-stone-950 transition-colors">Arquitectura</button>
          <button onClick={() => scrollTo('como-funciona')} className="text-stone-600 hover:text-stone-950 transition-colors">Proceso</button>
          <button onClick={() => scrollTo('demo')} className="text-stone-600 hover:text-stone-950 transition-colors">Demo en vivo</button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/marco/Documents/GitHub/Hackaton/Fraudia"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center px-5 h-10 rounded-full border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 active:scale-[0.985] transition-all"
          >
            Ver código
          </a>
          <button
            onClick={() => scrollTo('demo')}
            className="inline-flex items-center px-6 h-10 rounded-full bg-[#D97706] hover:bg-[#92400e] text-white text-sm font-semibold active:scale-[0.985] transition-all"
          >
            Probar demo
          </button>
        </div>
      </div>
    </nav>
  )
}
