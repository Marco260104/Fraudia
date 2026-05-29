import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowRight, CaretDown } from '@phosphor-icons/react'

const navItems = [
  { href: '/#solucion', label: 'Producto' },
  { href: '/#como-funciona', label: 'Soluciones' },
  { href: '/#evidencia', label: 'Tecnologia' },
  { href: '/#evidencia', label: 'Recursos' },
  { href: '/#solucion', label: 'Empresa' },
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
                <CaretDown size={12} weight="bold" />
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <NavLink to="/demo" className="btn btn-secondary header-login">
              Iniciar sesion
            </NavLink>
            <NavLink to="/demo" className="btn btn-primary">
              Solicitar demo
              <ArrowRight size={16} weight="bold" />
            </NavLink>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}
