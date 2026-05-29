import type { ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const navigate = useNavigate()
  const showHeader = location.pathname === '/'

  return (
    <div className="app-shell">
      {showHeader ? (
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
                <span>DetecciÃ³n de fraude en siniestros</span>
              </span>
            </button>

            <nav className="desktop-nav" aria-label="NavegaciÃ³n principal">
              {navItems.map((item) => (
                <Link key={item.label} to={item.href} className="nav-link">
                  {item.label}
                  <CaretDown size={12} weight="bold" />
                </Link>
              ))}
            </nav>

            <div className="header-actions">
              <NavLink to="/dashboard" className="btn btn-secondary header-login">
                Iniciar sesion
              </NavLink>
              <NavLink to="/dashboard" className="btn btn-primary">
                Demo
                <ArrowRight size={16} weight="bold" />
              </NavLink>
            </div>
          </div>
        </header>
      ) : null}

      {children}
    </div>
  )
}
