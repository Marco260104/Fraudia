import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLoader } from './shared/layout/AppLoader'
import { SiteShell } from './shared/layout/SiteShell'
import { AlertsPage } from './modules/alerts/AlertsPage'
import { CriticalCasesPage } from './modules/critical/CriticalCasesPage'
import { DemoPage } from './modules/demo/DemoPage'
import { HomePage } from './modules/home/HomePage'
import NarrativasSimilaresPage from './modules/narratives/NarrativesPage'
import TalleresPage from './modules/talleres/TalleresPage'
import AseguradosPage from './modules/insureds/InsuredsPage'
import MapaSiniestrosPage from './modules/map/MapSiniestrosPage'
import VehiclesPage from './modules/vehicles/VehiclesPage'
import { ProvidersPage } from './modules/providers/ProvidersPage'
import { CalculatorPage } from './modules/calculator/CalculatorPage'
import { ReportsPage } from './modules/reports/ReportsPage'
import { ConfigPage } from './modules/config/ConfigPage'
import { AssistantPage } from './modules/assistant/AssistantPage'

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
        <Route path="/asegurados" element={<AseguradosPage />} />
        <Route path="/talleres" element={<TalleresPage />} />
        <Route path="/vehiculos" element={<VehiclesPage />} />
        <Route path="/proveedores" element={<ProvidersPage />} />
        <Route path="/calculadora" element={<CalculatorPage />} />
        <Route path="/reportes" element={<ReportsPage />} />
        <Route path="/configuracion" element={<ConfigPage />} />
        <Route path="/asistente" element={<AssistantPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  )
}

export default App
