import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  House, SlidersHorizontal, Brain, FileText, 
  ShieldCheck, Play
} from '@phosphor-icons/react'
import { API_BASE_URL } from '../../config/api'

interface DashboardSidebarProps {
  activeRoute: string
}

export function DashboardSidebar({ activeRoute }: DashboardSidebarProps) {
  const [criticalCasesCount, setCriticalCasesCount] = useState<string>('0')
  const location = useLocation()

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/kpis`)
      .then(res => res.json())
      .then(data => {
        if (data && data.casos_criticos) {
          setCriticalCasesCount(data.casos_criticos.toString())
        }
      })
      .catch(() => setCriticalCasesCount('0'))
  }, [])

  const mainMenu = [
    { label: 'Inicio', icon: House, href: '/' },
    { label: 'Centro de Control', icon: SlidersHorizontal, href: '/dashboard', badge: criticalCasesCount !== '0' ? criticalCasesCount : undefined },
    { label: 'Asistente IA', icon: Brain, href: '/asistente' },
    { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes' },
  ]

  return (
    <aside className="dashboard-sidebar" style={{ background: '#090d16', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px 18px', width: '280px', flexShrink: 0, position: 'sticky', top: 0 }}>
      
      {/* Brand logo */}
      <Link to="/" className="dashboard-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>
          F
        </div>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em' }}>fraudia</span>
        <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 'bold' }}>v3.0</span>
      </Link>

      {/* Main Menu Navigation */}
      <div className="dashboard-nav-group" style={{ flex: 1 }}>
        <p className="dashboard-nav-label" style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '14px', paddingLeft: '8px' }}>Menú Principal</p>
        <nav className="dashboard-nav" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {mainMenu.map((item) => {
            const Icon = item.icon
            const isActive = activeRoute === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`dashboard-nav-item ${isActive ? 'is-active' : ''}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  color: isActive ? '#f8fafc' : '#94a3b8', 
                  background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent', 
                  border: isActive ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} weight={isActive ? "bold" : "regular"} color={isActive ? "#3b82f6" : "#94a3b8"} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? (
                  <strong style={{ background: '#ef4444', color: '#fff', fontSize: '0.72rem', padding: '1px 6px', borderRadius: '6px', fontWeight: 'bold' }}>
                    {item.badge}
                  </strong>
                ) : null}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* GLOWING HACKATHON DEMO BUTTON */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        
        <Link 
          to="/dashboard?demo=true" 
          className="demo-glowing-btn"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            height: '42px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #f97316, #ea580c)', 
            color: '#fff', 
            textDecoration: 'none', 
            fontSize: '0.88rem', 
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(249,115,22,0.3)',
            animation: 'pulseGlow 2s infinite',
            textAlign: 'center'
          }}
        >
          <Play size={16} weight="fill" />
          Ejecutar Demo Inteligente
        </Link>
        
        {/* Analyst Profile card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 6px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', alignContent: 'center', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.85rem' }}>
            AS
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: '#f8fafc' }}>Analista Forense</h4>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Unidad Antifraude</span>
          </div>
        </div>

      </div>

    </aside>
  )
}
