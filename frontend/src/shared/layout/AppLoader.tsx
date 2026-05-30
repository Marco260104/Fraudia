import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../../config/api'

export function AppLoader() {
  const [waking, setWaking] = useState(false)
  const [dots, setDots] = useState('')

  useEffect(() => {
    let dotsInterval: ReturnType<typeof setInterval>
    let timeout: ReturnType<typeof setTimeout>

    const ping = async () => {
      // Intentar despertar el backend con un timeout corto
      const controller = new AbortController()
      timeout = setTimeout(() => controller.abort(), 3000)

      try {
        await fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
        clearTimeout(timeout)
        // Backend respondio rapido, no mostrar pantalla de carga
      } catch {
        clearTimeout(timeout)
        // Backend tarda (cold start), mostrar pantalla de espera
        setWaking(true)
        dotsInterval = setInterval(() => {
          setDots(d => d.length >= 3 ? '' : d + '.')
        }, 500)

        // Reintentar hasta que responda
        const retry = async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/health`)
            if (res.ok) {
              clearInterval(dotsInterval)
              setWaking(false)
            } else {
              setTimeout(retry, 3000)
            }
          } catch {
            setTimeout(retry, 3000)
          }
        }
        setTimeout(retry, 3000)
      }
    }

    ping()

    return () => {
      clearInterval(dotsInterval)
      clearTimeout(timeout)
    }
  }, [])

  if (!waking) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10, 15, 30, 0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '16px', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%',
        border: '4px solid rgba(99,102,241,0.2)',
        borderTopColor: '#6366f1',
        animation: 'spin 0.9s linear infinite'
      }} />
      <p style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: 500, margin: 0 }}>
        Despertando servidor{dots}
      </p>
      <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, textAlign: 'center', maxWidth: '280px' }}>
        El servidor estuvo inactivo. Esto puede tardar hasta 60 segundos.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
