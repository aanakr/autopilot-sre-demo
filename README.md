# New Relic Autopilot SRE Agent - September 2026 MVP

**Definitive, Production-Ready Prototype**

A single-page application demonstrating New Relic's Substrate-powered autonomous SRE agent. This prototype proves that AI-driven incident response is **not hallucination** but grounded in four deterministic pillars of observability intelligence.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [The 4 Substrate Pillars](#the-4-substrate-pillars)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [State Management Strategy](#state-management-strategy)
7. [Design System](#design-system)
8. [Local Development](#local-development)
9. [GitHub Pages Deployment](#github-pages-deployment)
10. [Component Guidelines](#component-guidelines)
11. [Troubleshooting](#troubleshooting)

---

## Product Overview

### Mission Statement

Demonstrate to expert SREs that New Relic's Autopilot agent operates on **deterministic substrate intelligence**, not LLM hallucinations. The UI must intuitively expose the "physics of failure" through interactive, auditable proof chains.

### Core Value Proposition

- **Transparency**: Every recommendation shows its evidence trail
- **Auditability**: Click any node to see the underlying data and reasoning
- **Safety**: Human-in-the-loop approval gates before production changes
- **Intelligence**: Global pattern matching across anonymized customer data

---

## The 4 Substrate Pillars

### 1. Entity Topology Graph (Blast Radius)

**Definition**: A live, multi-layered dependency map showing physical infrastructure, container orchestration, and logical services.

**UI Implementation**:
- Interactive force-directed graph
- Clickable nodes reveal upstream/downstream impact
- Color-coded health states (healthy, degraded, critical)
- Drill-down shows entity metrics, recent deployments, alert history

**Example**: `payment-service` depends on `postgres-primary`, which runs on `k8s-node-03`

---

### 2. Causal Graph (Physics of Failure)

**Definition**: A directed acyclic graph (DAG) showing the step-by-step propagation of a failure through the system, with RLHF-derived confidence scores.

**UI Implementation**:
- Linear "Proof Chain": Symptom → Change → Root Cause → Fix
- Each step displays:
  - What happened (e.g., "Database connection pool exhausted")
  - When it happened (precise timestamp)
  - Confidence score (e.g., 0.88 from Reinforcement Learning)
  - Supporting evidence (traces, logs, metrics)
- Arrows show directional causality

**Example**:
```
Deployment (v2.14.0) → Slow SQL Query Loop → Connection Pool Saturation → Checkout Service OOM → 404 Errors
Confidence: 0.88 (based on 47 historical similar incidents)
```

---

### 3. Incident Knowledge Base (Local RAG)

**Definition**: A vector database of past incidents, runbooks, and retrospectives specific to the customer's environment.

**UI Implementation**:
- "Living Runbook" citation cards
- Similarity score (e.g., "92% Match to RETRO-INC-4512")
- Clickable citations open full retrospective
- Shows:
  - Original incident summary
  - What worked / didn't work
  - Time to resolution
  - Remediation steps taken

**Example**:
```
📘 Similar Incident Found
RETRO-INC-4512 | 2026-07-14
"Postgres connection pool exhaustion during peak traffic"
Match: 92% | Resolution: Increase max_connections from 100 → 200
```

---

### 4. Cross-Customer Pattern Corpus (Global Moat)

**Definition**: Anonymized, mathematically abstracted failure signatures from across New Relic's entire customer base (opt-in).

**UI Implementation**:
- Subtle context chip: "🌐 Global Pattern Match: 98%"
- Drill-down explains:
  - This failure signature has been seen 1,247 times across 89 enterprises
  - Anonymized pattern: "DB_Stateful_Storage → Connection_Pool → Memory_Saturation"
  - Most effective remediation: Scale connection pool (success rate: 94%)
- Privacy-preserving: No customer names, IPs, or proprietary identifiers

**Example**:
```
🌐 Global Intelligence
This failure pattern matched 1,247 similar incidents across 89 opted-in enterprises.
Recommended fix has a 94% historical success rate.
Pattern: [Abstract_Stateful_Storage → Resource_Exhaustion → Cascade_Failure]
```

---

## Architecture

### State Machine Safety

**Problem**: Previous builds suffered from infinite loading spinners due to unhandled promise rejections.

**Solution**: All asynchronous operations use explicit state enums with mandatory 3-second timeout fallbacks.

```javascript
const AgentStates = {
  IDLE: 'IDLE',           // No operation in progress
  LOADING: 'LOADING',     // Agent is "thinking" (max 3s)
  SUCCESS: 'SUCCESS',     // Operation completed
  ERROR: 'ERROR'          // Operation failed or timed out
};
```

**Timeout Enforcement**:
```javascript
const simulateAgentAction = async (action) => {
  return new Promise((resolve, reject) => {
    // Hard timeout after 3 seconds
    const timeout = setTimeout(() => {
      reject(new Error('Agent action timed out'));
    }, 3000);

    // Simulate LLM work (1-2 seconds)
    setTimeout(() => {
      clearTimeout(timeout);
      resolve({ status: 'SUCCESS', data: mockResult });
    }, 1500);
  });
};
```

---

### Routing Strategy (HashRouter)

**Problem**: GitHub Pages does not support HTML5 pushState routing without custom server config.

**Solution**: Use React Router's `HashRouter` for all navigation.

```javascript
// ✅ Correct (works on GitHub Pages)
<HashRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/investigate/:id" element={<InvestigationPage />} />
  </Routes>
</HashRouter>

// ❌ Wrong (404 on refresh)
<BrowserRouter> ... </BrowserRouter>
```

**URL Format**: `https://aanakr.github.io/autopilot-sre-demo/#/investigate/INC-8472`

---

### Asset Pathing

All assets use relative paths for GitHub Pages subdirectory deployment:

```javascript
// vite.config.js
export default defineConfig({
  base: '/autopilot-sre-demo/', // GitHub repo name
  // ...
});
```

---

## Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | React 18 + Vite | Fast HMR, modern JSX transform |
| **Styling** | Tailwind CSS | Rapid prototyping, New Relic design tokens |
| **Routing** | React Router v6 (HashRouter) | GitHub Pages compatibility |
| **State** | React Context API | No Redux overhead for MVP |
| **Graphs** | React Flow | Interactive topology/causal graphs |
| **Charts** | Recharts | Timelines, metric visualizations |
| **Deployment** | GitHub Pages | Zero-cost hosting, CI/CD via Actions |

---

## Project Structure

```
autopilot-sre-demo/
├── README.md                        # This file (source of truth)
├── package.json
├── vite.config.js                   # Base path for GitHub Pages
├── tailwind.config.js               # New Relic design tokens
├── index.html
└── src/
    ├── main.jsx                     # App entry point
    ├── App.jsx                      # HashRouter root
    │
    ├── context/
    │   └── AgentStateContext.jsx    # Global state machine
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx           # Persistent nav with breadcrumbs (<100 lines)
    │   │   └── BackButton.jsx       # Safe navigation component (<50 lines)
    │   │
    │   ├── chat/
    │   │   ├── ChatInterface.jsx    # Main chat UI (<150 lines)
    │   │   └── MessageBubble.jsx    # Individual message rendering (<80 lines)
    │   │
    │   ├── investigation/
    │   │   ├── IncidentTimeline.jsx # Horizontal timeline strip (<100 lines)
    │   │   ├── SummaryCard.jsx      # Bullet-point summary (<80 lines)
    │   │   ├── RecommendationsCard.jsx # Actions with confidence (<120 lines)
    │   │   └── ProofChain.jsx       # 4-tile Evidence section (<150 lines)
    │   │
    │   ├── substrate/
    │   │   ├── EntityTopologyGraph.jsx  # Interactive topology (<150 lines)
    │   │   ├── CausalGraph.jsx          # Failure propagation graph (<150 lines)
    │   │   ├── RunbookCitation.jsx      # Knowledge base card (<100 lines)
    │   │   └── GlobalCorpusChip.jsx     # Global pattern indicator (<60 lines)
    │   │
    │   └── drilldowns/
    │       ├── EntityDetail.jsx         # Topology node deep-dive (<150 lines)
    │       ├── CausalLinkDetail.jsx     # Failure propagation detail (<150 lines)
    │       └── RunbookViewer.jsx        # Full Living Runbook (<120 lines)
    │
    ├── pages/
    │   ├── HomePage.jsx                 # Chat home with capability cards (<150 lines)
    │   ├── InvestigationPage.jsx       # RCA response UI (<150 lines)
    │   ├── TopologyPage.jsx             # Drill-down: Entity Graph (<150 lines)
    │   ├── CausalGraphPage.jsx          # Drill-down: Proof Chain (<150 lines)
    │   ├── RunbookPage.jsx              # Drill-down: Knowledge Base (<150 lines)
    │   └── CorpusMatchPage.jsx          # Drill-down: Global patterns (<150 lines)
    │
    ├── hooks/
    │   └── useTimeoutFallback.js        # 3-second timeout hook (<40 lines)
    │
    ├── utils/
    │   ├── mockData.js                  # Realistic incident data
    │   └── stateEnums.js                # State machine constants
    │
    └── index.css                        # Tailwind imports + custom styles
```

---

## State Management Strategy

### AgentStateContext Structure

```javascript
const AgentStateContext = createContext();

export const AgentStateProvider = ({ children }) => {
  const [agentState, setAgentState] = useState('IDLE');
  const [currentIncident, setCurrentIncident] = useState(null);
  const [error, setError] = useState(null);

  const investigateIncident = async (incidentId) => {
    setAgentState('LOADING');
    setError(null);

    try {
      const result = await simulateAgentInvestigation(incidentId);
      setCurrentIncident(result);
      setAgentState('SUCCESS');
    } catch (err) {
      setError(err.message);
      setAgentState('ERROR');
    }
  };

  return (
    <AgentStateContext.Provider
      value={{
        agentState,
        currentIncident,
        error,
        investigateIncident,
      }}
    >
      {children}
    </AgentStateContext.Provider>
  );
};
```

---

## Design System

### Color Palette (New Relic Dark Theme)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#0A0A0A', // Deep black background
          800: '#121212', // Card backgrounds
          700: '#1A1A1A', // Elevated surfaces
          600: '#2A2A2A', // Borders
        },
        electric: {
          green: '#00DC82', // Primary accent (CTAs, success)
          cyan: '#00B4D8',  // Secondary accent (links, highlights)
        },
        danger: '#FF4558',  // Critical alerts
        warning: '#F59E0B', // Warning states
        muted: '#6B7280',   // Secondary text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
};
```

### Typography

- **Headings**: `font-sans font-semibold`
- **Body**: `font-sans text-gray-300`
- **Code/Metrics**: `font-mono text-sm`
- **Confidence Scores**: `font-mono text-electric-green font-bold`

### Component Patterns

**Card Component**:
```jsx
<div className="bg-obsidian-800 border border-obsidian-600 rounded-lg p-6 hover:border-electric-cyan transition-colors">
  {/* Content */}
</div>
```

**Button (Primary)**:
```jsx
<button className="bg-electric-green text-obsidian-900 px-4 py-2 rounded-md font-semibold hover:bg-electric-cyan transition-colors">
  Investigate
</button>
```

**Back Button**:
```jsx
<button className="text-electric-cyan hover:text-electric-green transition-colors flex items-center gap-2">
  ← Back
</button>
```

---

## Local Development

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/aanakr/autopilot-sre-demo.git
cd autopilot-sre-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Available Scripts

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run deploy       # Deploy to GitHub Pages (gh-pages branch)
```

---

## GitHub Pages Deployment

### Initial Setup

1. **Enable GitHub Pages** in repo settings:
   - Go to Settings → Pages
   - Source: Deploy from `gh-pages` branch
   - Wait 2-3 minutes for deployment

2. **Configure `vite.config.js`**:
```javascript
export default defineConfig({
  base: '/autopilot-sre-demo/', // Must match repo name
  // ...
});
```

3. **Install `gh-pages`**:
```bash
npm install --save-dev gh-pages
```

4. **Add deploy script to `package.json`**:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Deploying Updates

```bash
# Build and deploy
npm run deploy
```

Wait 2-3 minutes, then visit:
```
https://aanakr.github.io/autopilot-sre-demo/
```

### Troubleshooting Deployment

**Issue**: Blank page after deployment
- **Fix**: Check that `base` in `vite.config.js` matches your repo name exactly

**Issue**: CSS not loading
- **Fix**: Ensure all asset imports use relative paths

**Issue**: 404 on refresh
- **Fix**: Verify you're using `HashRouter`, not `BrowserRouter`

---

## Component Guidelines

### The 150-Line Rule

**Why**: Prevents context degradation when asking Claude to modify files.

**Enforcement**:
- Every component must be <150 lines (including imports)
- If a component grows beyond 150 lines, split it into sub-components
- Use composition over monolithic files

**Example Split**:
```
❌ InvestigationPage.jsx (450 lines)

✅ InvestigationPage.jsx (120 lines)
   ├── IncidentTimeline.jsx (80 lines)
   ├── SummaryCard.jsx (70 lines)
   ├── RecommendationsCard.jsx (110 lines)
   └── ProofChain.jsx (140 lines)
```

---

### State Machine Enforcement

Every async operation MUST use this pattern:

```javascript
import { useTimeoutFallback } from '../hooks/useTimeoutFallback';

const MyComponent = () => {
  const { execute, loading, error } = useTimeoutFallback();

  const handleAction = async () => {
    await execute(async () => {
      // Your async work here
      const result = await fetchData();
      return result;
    });
  };

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return <SuccessView />;
};
```

---

### Safe Navigation Pattern

Every drill-down page MUST include:

```jsx
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';

const DrillDownPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} />
      {/* Page content */}
    </div>
  );
};
```

---

## Troubleshooting

### Context Degradation Recovery

**Symptom**: Claude starts generating 500-line files or breaking existing code.

**Fix**:
1. Close the current chat session
2. Open a fresh Claude Code session
3. Attach **this README.md** and the specific broken file
4. Prompt: "Following the README.md architecture, fix [specific issue] in [file]. Use the diff method to show only changes."

---

### Infinite Loading Spinner

**Symptom**: UI stuck in LOADING state.

**Diagnosis**:
```javascript
// Check console for timeout errors
// Look for promises without catch blocks
```

**Fix**:
- Ensure all async functions use `useTimeoutFallback` hook
- Verify no raw `setTimeout` without timeout limits

---

### Graph Not Rendering

**Symptom**: Topology or Causal graph shows blank canvas.

**Diagnosis**:
- Check if mock data is properly structured
- Verify React Flow is installed: `npm list react-flow-renderer`

**Fix**:
```bash
npm install reactflow
```

---

### HashRouter Not Working

**Symptom**: Direct URL navigation returns 404.

**Fix**:
- Verify `index.html` has this meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- Ensure `App.jsx` uses `HashRouter`:
```javascript
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      {/* Routes */}
    </HashRouter>
  );
}
```

---

## Milestones

- ✅ **June 2026**: Foundation - README, architecture, base scaffolding
- 🔄 **July 2026**: Core UI - Chat interface, state management, mock data
- 🔄 **August 2026**: Substrate Pillars - Interactive graphs, drill-downs
- 🎯 **September 2026**: Production MVP - Full deployment to GitHub Pages

---

## References

### Source Documents

1. **Copy of Deep research - Observability Intelligence Substrate Design.pdf**
   - 4 Pillars definitions
   - UI design patterns
   - New Relic dark theme specifications

2. **Autopilot UX Doc.pdf**
   - RCA response structure
   - Human-in-the-loop approval gates
   - Cross-cutting features (NRQL actions, entity deep-links)

3. **Data dictionary and Reinforcement learning_decision trees - research.pdf**
   - Semantic normalization architecture
   - RL confidence scoring methodology
   - Decision tree playbook structure

---

## Contact

**Product Lead**: Oren Ben-Shaul
**Engineering Lead**: Siva Balakrishnan
**UX Squad**: Ground Truth UX Team

---

**Last Updated**: 2026-06-16
**Version**: 1.0.0 (September 2026 MVP)
