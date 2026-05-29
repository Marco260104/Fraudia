import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Bell, CirclesThree, House, MapTrifold, ShieldCheck,
  Stethoscope, UserCircle, UsersThree, WarningCircle, FileText,
  SlidersHorizontal, CarSimple, Brain
} from '@phosphor-icons/react'
import { API_BASE_URL } from '../../config/api'

const entityMenu = [
  { label: 'Vehículos', icon: CarSimple, href: '/vehiculos' },
  { label: 'Proveedores', icon: UsersThree, href: '/proveedores' },
  { label: 'Asegurados', icon: UserCircle, href: '/asegurados' },
  { label: 'Talleres', icon: Stethoscope, href: '/talleres' },
]

const toolMenu = [
  { label: 'Calculadora de riesgo', icon: ShieldCheck, href: '/calculadora' },
  { label: 'Transparencia IA', icon: Brain, href: '/modelo' },
  { label: 'Reportes Inteligentes', icon: FileText, href: '/reportes' },
  { label: 'Configuración', icon: SlidersHorizontal, href: '/configuracion' },
]

interface DashboardSidebarProps {
  activeRoute: string
}

export function DashboardSidebar({ activeRoute }: DashboardSidebarProps) {
  const [criticalCasesCount, setCriticalCasesCount] = useState<string>('–')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/kpis`)
      .then(res => res.json())
      .then(data => {
        if (data.casos_criticos) setCriticalCasesCount(data.casos_criticos.toString())
      })
      .catch(() => setCriticalCasesCount('–'))
  }, [])

  const mainMenu = [
    { label: 'Centro de inteligencia', icon: House, href: '/demo', badge: undefined as string | undefined },
    { label: 'Casos críticos', icon: WarningCircle, href: '/casos-criticos', badge: criticalCasesCount },
    { label: 'Alertas IA', icon: Bell, href: '/alertas-ia', badge: undefined },
    { label: 'Mapa de siniestros', icon: MapTrifold, href: '/mapa-siniestros', badge: undefined },
    { label: 'Narrativas similares', icon: CirclesThree, href: '/narrativas-similares', badge: undefined },
  ]

  return (
    <aside className="dashboard-sidebar">
      <button type="button" className="dashboard-brand">
        <img src="/assets/Logo.png" alt="Fraudia" />
        <span>fraudia</span>
      </button>

      <div className="dashboard-nav-group">
        <p className="dashboard-nav-label">Menú principal</p>
        <nav className="dashboard-nav">
          {mainMenu.map((item) => {
            const Icon = item.icon
            const isActive = activeRoute === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`dashboard-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={18} weight="bold" />
                <span>{item.label}</span>
                {item.badge ? <strong>{item.badge}</strong> : null}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="dashboard-nav-group">
        <p className="dashboard-nav-label">Entidades</p>
        <nav className="dashboard-nav">
          {entityMenu.map((item) => {
            const Icon = item.icon
            const isActive = activeRoute === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`dashboard-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={18} weight="bold" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="dashboard-nav-group">
        <p className="dashboard-nav-label">Herramientas</p>
        <nav className="dashboard-nav">
          {toolMenu.map((item) => {
            const Icon = item.icon
            const isActive = activeRoute === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`dashboard-nav-item ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={18} weight="bold" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <Link to="/asistente" className="sidebar-assistant-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
        <div className="sac-icon"><ShieldCheck size={24} weight="fill" /></div>
        <div className="sac-info">
          <h4>IA Assistant <span className="sac-badge">BETA</span></h4>
          <p>Asistente inteligente</p>
        </div>
      </Link>
    </aside>
  )
}
