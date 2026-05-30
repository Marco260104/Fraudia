import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '../../config/api'

const PING_URL = `${API_BASE_URL}/api/kpis`

export function AppLoader() {
  const [waking, setWaking] = useState(false)
  const [dots, setDots] = useState('')
  const dotsRef = useRef<number | null>(null)

  useEffect(() => {
    let retryTimer: number | null = null

    const startDots = () => {
      dotsRef.current = window.setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.')
      }, 500)
    }

    const stopDots = () => {
      if (dotsRef.current !== null) {
        clearInterval(dotsRef.current)
        dotsRef.current = null
      }
    }

    const ping = async () => {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 4000)
      try {
        const res = await fetch(PING_URL, { signal: controller.signal })
        clearTimeout(timeout)
        if (!res.ok) throw new Error('not ok')
      } catch (_e) {
        clearTimeout(timeout)
        setWaking(true)
        startDots()
        const retry = async () => {
          try {
            const res = await fetch(PING_URL)
            if (res.ok) {
              stopDots()
              setWaking(false)
            } else {
              retryTimer = window.setTimeout(retry, 4000)
            }
          } catch (_err) {
            retryTimer = window.setTimeout(retry, 4000)
          }
        }
        retryTimer = window.setTimeout(retry, 4000)
      }
    }

    ping()

    return () => {
      stopDots()
      if (retryTimer !== null) clearTimeout(retryTimer)
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
        El servidor estuvo inactivo. Puede tardar hasta 60 segundos.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
