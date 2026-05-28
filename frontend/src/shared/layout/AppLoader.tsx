import { useEffect, useState } from 'react'

export function AppLoader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 540)

    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div className="route-loader" aria-hidden="true">
      <div className="route-loader-card">
        <img
          src={encodeURI('/LOGO Y CARGA.gif')}
          alt=""
          className="route-loader-gif"
          draggable={false}
        />
        <span>Cargando experiencia Fraudia…</span>
      </div>
    </div>
  )
}
