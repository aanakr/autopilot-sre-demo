import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InvestigationPage from './pages/InvestigationPage'
import TopologyPage from './pages/TopologyPage'
import CausalGraphPage from './pages/CausalGraphPage'
import RunbookPage from './pages/RunbookPage'
import CorpusMatchPage from './pages/CorpusMatchPage'
import Header from './components/layout/Header'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-obsidian-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/investigate/:incidentId" element={<InvestigationPage />} />
            <Route path="/topology/:entityId" element={<TopologyPage />} />
            <Route path="/causal/:linkId" element={<CausalGraphPage />} />
            <Route path="/runbook/:runbookId" element={<RunbookPage />} />
            <Route path="/corpus/:patternId" element={<CorpusMatchPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
