import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLoader } from './shared/layout/AppLoader'
import { SiteShell } from './shared/layout/SiteShell'
import { AlertsPage } from './modules/alerts/AlertsPage'
import { CriticalCasesPage } from './modules/critical/CriticalCasesPage'
import { DemoPage } from './modules/demo/DemoPage'
import { HomePage } from './modules/home/HomePage'
import NarrativasSimilaresPage from './modules/narratives/NarrativesPage'
import MapaSiniestrosPage from './modules/map/MapSiniestrosPage'
import VehiclesPage from './modules/vehicles/VehiclesPage'
import { ProvidersPage } from './modules/providers/ProvidersPage'

function App() {
  const location = useLocation()

  return (
    <SiteShell>
      <AppLoader key={location.pathname} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/casos-criticos" element={<CriticalCasesPage />} />
        <Route path="/alertas-ia" element={<AlertsPage />} />
        <Route path="/mapa-siniestros" element={<MapaSiniestrosPage />} />
        <Route path="/narrativas-similares" element={<NarrativasSimilaresPage />} />
        <Route path="/vehiculos" element={<VehiclesPage />} />
        <Route path="/proveedores" element={<ProvidersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  )
}

export default App
