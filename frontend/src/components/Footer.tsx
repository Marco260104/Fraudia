export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200 bg-white py-16 text-sm">
      <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-y-12">
          <div>
            <div className="flex items-center gap-x-3">
              <div className="font-semibold text-xl tracking-[-0.4px] text-stone-950">fraudIA</div>
            </div>
            <div className="text-stone-500 mt-2 max-w-[22ch]">Prototipo de IA para detección de fraude en siniestros de seguros.</div>
            <div className="text-xs text-stone-400 mt-8">© hackIAthon 2026</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-14 gap-y-9">
            <div>
              <div className="font-semibold text-stone-500 text-xs mb-3 tracking-[0.5px]">Stack tecnológico</div>
              <div className="space-y-1 text-stone-600 text-[13.5px]">
                <div>Python 3.12 + scikit-learn</div>
                <div>XGBoost • LightGBM</div>
                <div>Strategy Pattern</div>
                <div>Datos sintéticos</div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-stone-500 text-xs mb-3 tracking-[0.5px]">Equipo</div>
              <div className="text-stone-600 text-[13.5px]">fraudIA — Equipo de desarrollo<br />hackIAthon 2026</div>
            </div>
            <div>
              <div className="font-semibold text-stone-500 text-xs mb-3 tracking-[0.5px]">Recursos</div>
              <div className="space-y-1 text-[13.5px]">
                <a href="README.md" className="block text-stone-600 hover:text-stone-900">Documentación técnica</a>
                <a href="notebooks/03_evaluacion_modelo.ipynb" className="block text-stone-600 hover:text-stone-900">Notebook de evaluación</a>
                <a href="https://github.com" className="block text-stone-600 hover:text-stone-900">Repositorio</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
