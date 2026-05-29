import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLoader } from './shared/layout/AppLoader'
import { SiteShell } from './shared/layout/SiteShell'
import { HomePage } from './modules/home/HomePage'
import { DashboardPage } from './modules/dashboard/DashboardPage'
import { CaseDetailPage } from './modules/critical/CaseDetailPage'
import { AssistantPage } from './modules/assistant/AssistantPage'
import { ReportsPage } from './modules/reports/ReportsPage'

function App() {
  const location = useLocation()

  return (
    <SiteShell>
      <AppLoader key={location.pathname} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/caso/:id" element={<CaseDetailPage />} />
        <Route path="/asistente" element={<AssistantPage />} />
        <Route path="/reportes" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  )
}

export default App
