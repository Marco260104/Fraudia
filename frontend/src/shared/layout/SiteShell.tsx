import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowRight, List } from '@phosphor-icons/react'

const navItems = [
  { href: '/#problema', label: 'Problema' },
  { href: '/#solucion', label: 'Solución' },
  { href: '/#datos', label: 'Datos' },
  { href: '/#arquitectura', label: 'Arquitectura' },
]

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <button type="button" className="brand" onClick={() => navigate('/')}>
            <img
              src="/assets/Logo.png"
              alt="fraudia"
              className="brand-mark"
              draggable={false}
            />
            <span className="brand-copy">
              <strong>Fraudia</strong>
              <span>Detección de fraude en siniestros</span>
            </span>
          </button>

          <nav className="desktop-nav" aria-label="Navegación principal">
            {navItems.map((item) => (
              <Link key={item.label} to={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button type="button" className="btn btn-ghost header-menu">
              <List size={18} weight="bold" />
              Menú
            </button>
            <NavLink to="/demo" className="btn btn-primary">
              Probar demo
              <ArrowRight size={16} weight="bold" />
            </NavLink>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}
