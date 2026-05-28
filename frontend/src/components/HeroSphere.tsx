import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  z: number
}

export function HeroSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let rotation = 0

    const points: Point[] = []
    const numPoints = 120
    const radius = 120

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(2 * Math.random() - 1)
      const phi = Math.random() * Math.PI * 2
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
      })
    }

    const particles: { x: number; y: number; z: number; speed: number; offset: number }[] = []
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: 0,
        y: 0,
        z: 0,
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
      })
    }

    function draw() {
      if (!canvas || !ctx) return
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)

      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x * 12
      const my = mouseRef.current.y * 10

      rotation += 0.004
      const rotY = rotation + mx * 0.0003
      const rotX = Math.sin(rotation * 0.3) * 0.1 + my * 0.0003

      ctx.translate(w / 2, h / 2)

      const sorted = points
        .map((p) => {
          const cosY = Math.cos(rotY)
          const sinY = Math.sin(rotY)
          const cosX = Math.cos(rotX)
          const sinX = Math.sin(rotX)

          let x1 = p.x * cosY - p.z * sinY
          let z1 = p.x * sinY + p.z * cosY
          let y1 = p.y

          let x2 = x1
          let y2 = y1 * cosX - z1 * sinX
          let z2 = y1 * sinX + z1 * cosX

          return { x: x2, y: y2, z: z2 }
        })
        .sort((a, b) => a.z - b.z)

      for (let i = 0; i < 8; i++) {
        const ring: Point[] = []
        const phi = (i / 8) * Math.PI
        for (let j = 0; j < 24; j++) {
          const theta = (j / 24) * Math.PI * 2
          ring.push({
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: radius * Math.sin(phi) * Math.sin(theta),
            z: radius * Math.cos(phi),
          })
        }
        const rotatedRing = ring.map((p) => {
          const cosY = Math.cos(rotY)
          const sinY = Math.sin(rotY)
          const cosX = Math.cos(rotX)
          const sinX = Math.sin(rotX)

          let x1 = p.x * cosY - p.z * sinY
          let z1 = p.x * sinY + p.z * cosY
          let y1 = p.y

          let x2 = x1
          let y2 = y1 * cosX - z1 * sinX
          let z2 = y1 * sinX + z1 * cosX

          return { x: x2, y: y2, z: z2, ox: x2, oy: y2 }
        })

        ctx.beginPath()
        for (let j = 0; j < rotatedRing.length; j++) {
          const r = rotatedRing[j]
          const next = rotatedRing[(j + 1) % rotatedRing.length]
          const alpha = Math.max(0, Math.min(1, (r.z + radius) / (radius * 2)))
          ctx.strokeStyle = `rgba(217, 119, 6, ${0.06 + alpha * 0.1})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(r.x, r.y)
          ctx.lineTo(next.x, next.y)
          ctx.stroke()
        }
      }

      for (let j = 0; j < 16; j++) {
        ctx.beginPath()
        const theta = (j / 16) * Math.PI * 2
        for (let i = 0; i < 20; i++) {
          const phi = (i / 20) * Math.PI
          const x = radius * Math.sin(phi) * Math.cos(theta)
          const y = radius * Math.sin(phi) * Math.sin(theta)
          const z = radius * Math.cos(phi)

          const cosY = Math.cos(rotY)
          const sinY = Math.sin(rotY)
          const cosX = Math.cos(rotX)
          const sinX = Math.sin(rotX)

          let x1 = x * cosY - z * sinY
          let z1 = x * sinY + z * cosY
          let y1 = y

          let x2 = x1
          let y2 = y1 * cosX - z1 * sinX
          let z2 = y1 * sinX + z1 * cosX

          const alpha = Math.max(0, Math.min(1, (z2 + radius) / (radius * 2)))
          ctx.strokeStyle = `rgba(217, 119, 6, ${0.04 + alpha * 0.08})`
          ctx.lineWidth = 0.5

          if (i === 0) ctx.moveTo(x2, y2)
          else ctx.lineTo(x2, y2)
        }
        ctx.stroke()
      }

      sorted.forEach((p) => {
        const alpha = Math.max(0, Math.min(1, (p.z + radius) / (radius * 2)))
        const size = 1.5 + alpha * 2
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217, 119, 6, ${0.15 + alpha * 0.35})`
        ctx.fill()
      })

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.6)
      gradient.addColorStop(0, 'rgba(217, 119, 6, 0.03)')
      gradient.addColorStop(0.5, 'rgba(217, 119, 6, 0.015)')
      gradient.addColorStop(1, 'rgba(217, 119, 6, 0)')
      ctx.beginPath()
      ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      particles.forEach((p) => {
        const angle = p.offset + rotation * p.speed * 2
        const tilt = p.offset * 0.5
        const dist = radius * 1.6 + Math.sin(rotation * p.speed + p.offset) * 30

        const px = Math.cos(angle) * Math.sin(tilt) * dist
        const py = Math.sin(angle) * dist
        const pz = Math.cos(angle) * Math.cos(tilt) * dist

        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)

        let x1 = px * cosY - pz * sinY
        let z1 = px * sinY + pz * cosY
        let y1 = py

        let x2 = x1
        let y2 = y1 * cosX - z1 * sinX
        let z2 = y1 * sinX + z1 * cosX

        const alpha = Math.max(0.1, Math.min(0.6, (z2 + radius * 2) / (radius * 4)))
        const size = 1 + alpha * 2

        ctx.beginPath()
        ctx.arc(x2, y2, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217, 119, 6, ${alpha * 0.4})`
        ctx.fill()
      })

      ctx.resetTransform()
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    const handleMouse = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      mouseRef.current = { x: Math.max(-0.5, Math.min(0.5, x)), y: Math.max(-0.5, Math.min(0.5, y)) }
    }

    const handleLeave = () => {
      mouseRef.current = { x: 0, y: 0 }
    }

    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleLeave)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
