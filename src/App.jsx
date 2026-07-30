import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ThreadPage from './pages/ThreadPage'
import WorkspacePage from './pages/WorkspacePage'
import ExecutionPage from './pages/ExecutionPage'
import KnowledgePage from './pages/KnowledgePage'
import MemoryPage from './pages/MemoryPage'
import Header from './components/layout/Header'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-obsidian-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/autopilot/home" replace />} />
            <Route path="/autopilot/home" element={<HomePage />} />
            <Route path="/autopilot/thread/:incidentId" element={<ThreadPage />} />
            <Route path="/autopilot/workspace/:incidentId" element={<WorkspacePage />} />
            <Route path="/autopilot/workspace/:incidentId/execution" element={<ExecutionPage />} />
            <Route path="/autopilot/knowledge" element={<KnowledgePage />} />
            <Route path="/autopilot/memory/:entityId" element={<MemoryPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
