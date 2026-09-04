import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import KnowledgePage from './pages/KnowledgePage'
import WorkspacePage from './pages/WorkspacePage'
import Header from './components/layout/Header'
import BreadcrumbRibbon from './components/layout/BreadcrumbRibbon'
import PresenterControlBar from './components/layout/PresenterControlBar'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <BreadcrumbRibbon />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/autopilot/ground-truth" replace />} />
            <Route path="/autopilot/ground-truth" element={<KnowledgePage />} />
            <Route path="/autopilot/workspace/:incidentId" element={<WorkspacePage />} />
          </Routes>
        </main>
        <PresenterControlBar />
      </div>
    </HashRouter>
  )
}

export default App
