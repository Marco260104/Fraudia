import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ProblemSection } from './components/ProblemSection'
import { StatsSection } from './components/StatsSection'
import { ArchitectureSection } from './components/ArchitectureSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { ModelResultsSection } from './components/ModelResultsSection'
import { RiskSemaphore } from './components/RiskSemaphore'
import { EvidenceCode } from './components/EvidenceCode'
import { LiveRiskDemo } from './components/LiveRiskDemo'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-white text-stone-700">
      <div className="grain-overlay" />
      <Navbar />

      <main id="main-content">
        <Hero />
        <ProblemSection />
        <StatsSection />
        <ArchitectureSection />
        <HowItWorksSection />
        <ModelResultsSection />
        <RiskSemaphore />
        <EvidenceCode />
        <LiveRiskDemo />
      </main>

      <Footer />
    </div>
  )
}

export default App
