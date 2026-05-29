import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  House, SlidersHorizontal, Brain, FileText, 
  ShieldCheck, Play, Warning, MapTrifold, Network,
  CarSimple, Stethoscope, User, Gear, Bell, CaretRight
} from '@phosphor-icons/react'
import { API_BASE_URL } from '../../config/api'

interface DashboardSidebarProps {
  activeRoute: string
  activeTab?: string
  onTabChange?: (tab: any) => void
}

interface MenuItem {
  label: string
  icon: any
  tab?: string
  href: string
  badge?: string
}

export function DashboardSidebar({ activeRoute, activeTab, onTabChange }: DashboardSidebarProps) {
  const [criticalCasesCount, setCriticalCasesCount] = useState<string>('0')
  const navigate = useNavigate()
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

  const menuGroups: { label: string; items: MenuItem[] }[] = [
    {
      label: 'Menú Principal',
      items: [
        { label: 'Centro de inteligencia', icon: House, tab: 'siniestros', href: '/dashboard', badge: criticalCasesCount !== '0' ? criticalCasesCount : undefined },
        { label: 'Mapa de siniestros', icon: MapTrifold, tab: 'mapa', href: '/dashboard' },
      ]
    },
    {
      label: 'Entidades',
      items: [
        { label: 'Vehículos', icon: CarSimple, tab: 'vehiculos', href: '/dashboard' },
        { label: 'Proveedores y Talleres', icon: Stethoscope, tab: 'proveedores', href: '/dashboard' },
        { label: 'Asegurados', icon: User, tab: 'asegurados', href: '/dashboard' },
      ]
    },
    {
      label: 'Herramientas',
      items: [
        { label: 'Calculadora de riesgo', icon: Brain, tab: 'calculadora', href: '/dashboard' },
        { label: 'Transparencia IA', icon: ShieldCheck, tab: 'calibracion', href: '/dashboard' },
        { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes' },
      ]
    }
  ]

  const handleItemClick = (e: React.MouseEvent, item: any) => {
    if (item.href === '/dashboard' && onTabChange) {
      e.preventDefault()
      onTabChange(item.tab)
      navigate(`/dashboard?tab=${item.tab}`)
    } else if (item.href === '/dashboard' && !onTabChange) {
      e.preventDefault()
      navigate(`/dashboard?tab=${item.tab}`)
    }
  }

  return (
    <aside className="dashboard-sidebar">
      {/* Brand logo */}
      <Link to="/" className="dashboard-brand" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
        paddingBottom: '16px',
        width: '100%'
      }}>
        <img
          src="/assets/Logo.png"
          alt="fraudia"
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
          draggable={false}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Fraudia</span>
          <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' }}>Detección de fraude</span>
        </div>
        <span style={{ fontSize: '0.65rem', padding: '2px 5px', borderRadius: '4px', background: 'rgba(29, 78, 216, 0.08)', color: '#1d4ed8', fontWeight: 'bold', marginLeft: 'auto' }}>v3.0</span>
      </Link>

      {/* Navigation Groups */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px', paddingRight: '4px' }}>
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="dashboard-nav-group">
            <p className="dashboard-nav-label" style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              color: '#94a3b8',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '10px',
              paddingLeft: '8px'
            }}>
              {group.label}
            </p>
            <nav className="dashboard-nav" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon
                
                // Determine if active
                let isActive = false
                if (item.href === '/dashboard') {
                  isActive = activeRoute === '/dashboard' && activeTab === item.tab
                } else {
                  isActive = activeRoute === item.href
                }

                return (
                  <a
                    key={itemIdx}
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item)}
                    className={`dashboard-nav-item ${isActive ? 'is-active' : ''}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      color: isActive ? '#1d4ed8' : '#475569', 
                      background: isActive ? 'rgba(29, 78, 216, 0.05)' : 'transparent', 
                      border: isActive ? '1px solid rgba(29, 78, 216, 0.08)' : '1px solid transparent',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.15s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={18} weight={isActive ? "bold" : "regular"} color={isActive ? "#1d4ed8" : "#64748b"} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge ? (
                      <strong style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.72rem', padding: '1px 6px', borderRadius: '6px', fontWeight: 'bold' }}>
                        {item.badge}
                      </strong>
                    ) : null}
                  </a>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom section: IA Assistant Button */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <Link 
          to="/asistente" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            height: '42px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', 
            color: '#ffffff', 
            textDecoration: 'none', 
            fontSize: '0.88rem', 
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(29, 78, 216, 0.25)',
            textAlign: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Brain size={16} weight="fill" />
          IA Assistant (BETA)
          <CaretRight size={12} weight="bold" />
        </Link>
        
        {/* Analyst Profile card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 6px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(29, 78, 216, 0.06)', border: '1px solid rgba(29, 78, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontWeight: 'bold', fontSize: '0.85rem' }}>
            AS
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a' }}>Analista Forense</h4>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Unidad Antifraude</span>
          </div>
        </div>
      </div>

    </aside>
  )
}
