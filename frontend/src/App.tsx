import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLoader } from './shared/layout/AppLoader'
import { SiteShell } from './shared/layout/SiteShell'
import { CriticalCasesPage } from './modules/critical/CriticalCasesPage'
import { DemoPage } from './modules/demo/DemoPage'
import { HomePage } from './modules/home/HomePage'

function App() {
  const location = useLocation()

  return (
    <SiteShell>
      <AppLoader key={location.pathname} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/casos-criticos" element={<CriticalCasesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  )
}

export default App
