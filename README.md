# New Relic Autopilot - Autonomous Operations Demo

**Live Demo:** https://aanakr.github.io/autopilot-sre-demo/

## Overview

This interactive prototype demonstrates New Relic's **Autopilot** - an autonomous SRE agent powered by **Substrate**, New Relic's intelligence layer for autonomous operations. Built on 18 years of cross-customer telemetry and operational knowledge, Substrate represents a fundamental shift in how organizations manage production incidents.

## Core Value Proposition

**"Models Commoditize, Context Compounds"**

While AI models become increasingly commoditized, New Relic's Substrate provides unique, compounding competitive advantage through:
- 18+ years of cross-customer telemetry data
- Millions of resolved incidents across 17,000+ customers
- Production-hardened causal relationships and failure patterns
- Continuous reinforcement learning from verified outcomes

## The Four Pillars of Substrate

### 1. Entity Topology Graph
- **What:** Real-time map of all services, databases, hosts, and their dependencies
- **Why:** Provides structural understanding of your entire system architecture
- **Demo Feature:** Visualized as interactive DAG (Directed Acyclic Graph) showing service relationships

### 2. Causal Graph
- **What:** Mathematical representation of deterministic failure propagation patterns
- **Why:** Distinguishes between correlation and causation - shows how failures actually propagate
- **Key Difference:** Unlike observability platforms that show correlations, Substrate understands causation
- **Demo Feature:** Shows "inventory-db → checkout-api" causal relationship in incident analysis

### 3. Incident Knowledge Base
- **What:** Structured repository of 30M+ resolved incidents with outcomes and remediation patterns
- **Why:** Enables pattern matching against historical incidents (92%+ structural similarity detection)
- **Demo Feature:** References "RETRO-INC-4512" - identical N+1 query pattern from 6 months ago

### 4. Cross-Customer Pattern Corpus
- **What:** Anonymized patterns from 17,000+ New Relic customers
- **Why:** Learns from collective operational experience across industries
- **Example:** Database connection pool exhaustion patterns seen across e-commerce, fintech, and SaaS

## Key Substrate Capabilities

### Data Dictionary (Schema Translation Layer)
- **Problem:** External AI agents query APIs thousands of times due to schema drift ("MCP Token Blitz")
- **Solution:** Semantic translation layer that maps telemetry concepts across time and schema changes
- **Example:** Translates `txn_id` → `trace.id` automatically, preventing agent confusion
- **Demo Feature:** Shows "Translated txn_id to canonical trace.id via Substrate Dictionary"

### RLHF (Reinforcement Learning from Human Feedback)
- **What:** 30-day verification loop that validates every autonomous action
- **How:**
  1. Autopilot executes remediation
  2. Monitors SLOs for 30 days
  3. If successful: increases causal edge weight (+mathematical reward)
  4. If failed: decreases weight and flags for human review
- **Impact:** Self-improving system that gets smarter with every incident
- **Demo Feature:** Shows "+0.03 reward" and "causal edge weight upgraded to 0.91 confidence"

### Guardrails Gateway
- **What:** Policy engine that validates every autonomous action against safety constraints
- **Why:** Ensures AI actions are authorized, reversible, and within blast radius limits
- **Demo Feature:** Shows "[AUTHORIZED]" after validating target constraints

### Action Handoffs (Temporal Integration)
- **What:** Durable execution layer for remediation workflows
- **Why:** Ensures actions complete even if agent crashes, with full audit trail
- **Demo Feature:** Shows "Submitting execution trace to Action Handoffs..."

## Demo Flow: P95 Latency Incident Resolution

### Step 1: Alert Detection (Home Screen)
**Scenario:** P95 latency spike on checkout-api service
- **Impact:** 1.2M users affected
- **Duration:** 4m 12s and growing
- **Symptom:** P95 latency jumped from 120ms to 4.2s

**Substrate Insight:** Topological analysis immediately identifies upstream DB dependency

### Step 2: Root Cause Investigation (Triage)
**Autopilot Actions:**
1. Queries Entity Topology Graph to map checkout-api dependencies
2. Queries Causal Graph to identify latency source: `inventory-db`
3. Cross-references Incident Knowledge Base
4. Finds 92% structural match: RETRO-INC-4512 (December 15, 2025)
5. Identifies N+1 query pattern on sessions table
6. Validates missing database index as root cause

**Proof Chain Delivered:**
- Historical incident evidence
- Causal relationship visualization
- Recommended remediation: CREATE INDEX CONCURRENTLY

### Step 3: Human-in-the-Loop Approval (Coach UI)
**Why This Matters:**
- Autopilot provides evidence-backed recommendations
- Human retains decision authority for production changes
- Coach UI shows full context: proof, risks, rollback plan

**User Decision:** Authorize & Execute

### Step 4: Autonomous Execution
**Actions Performed:**
1. Submit to Action Handoffs for durable execution
2. Validate through Guardrails Gateway
3. Execute: `CREATE INDEX CONCURRENTLY` (non-blocking)
4. Monitor: Real-time validation of P95 latency recovery
5. Result: P95 drops from 4.2s → 120ms

### Step 5: RLHF Verification Loop
**30-Day Validation Window:**
- Continuously monitors checkout-api P95 latency
- Validates sustained recovery (no regression)
- Upon success: Issues mathematical reward (+0.03)
- Updates Causal Graph: Edge weight → 0.91 confidence
- Logs verified outcome to Incident Knowledge Base

**Impact:** Future incidents with similar patterns are resolved faster and with higher confidence

## Competitive Differentiation

### vs. Datadog / Dynatrace
- **Their Approach:** Correlation-based incident detection
- **Substrate Advantage:** Causal understanding + 18 years of cross-customer patterns
- **Example:** Competitors show "database slow AND API slow" (correlation). Substrate proves "database CAUSES API slowness" (causation)

### vs. AI Startups (Observe.ai, etc.)
- **Their Approach:** LLM-powered analysis of logs/metrics
- **Substrate Advantage:**
  - Structured causal knowledge vs. statistical inference
  - Verified outcomes database vs. speculative analysis
  - Data Dictionary prevents MCP Token Blitz
  - Production-hardened remediation patterns vs. generated suggestions

### vs. BYOA (Bring Your Own Agent)
- **Challenge:** External agents query APIs 1000s of times, lack domain context
- **Substrate Solution:** Ground Truth API product provides:
  - Semantic layer (Data Dictionary)
  - Pre-computed causal relationships
  - Structured incident knowledge
  - Reduces token costs by 95%+

## Business Impact & ROI

### For a 500-Person SRE Organization:
- **Current State:**
  - 8,760 incidents/year (1/hour average)
  - 2.5 hours MTTR per incident
  - 156 hours/week of toil (monitoring, investigation, manual fixes)

- **With Autopilot:**
  - 70% incidents fully automated (6,132 incidents)
  - 2.5 hours → 15 minutes MTTR (90% reduction)
  - 156 hours/week → 47 hours/week toil (70% reduction)

- **Annual Value:**
  - **$38.5M** in recovered SRE productivity
  - **$12.3M** in reduced downtime costs
  - **$50.8M total annual value**

### Moat Metrics
- **Data Moat:** 18+ years of telemetry (barrier to entry: ~$2B+ investment)
- **Network Effects:** Every customer incident improves Substrate for all customers
- **Compounding Knowledge:** RLHF loop creates self-improving system
- **Time to Parity:** Competitors need 5-10 years + massive customer base

## Technical Architecture

### Frontend
- Single-page React application
- Real-time animations for state transitions
- Interactive DAG visualization
- Responsive 3-pane layout (Alert → Coach UI → Execution)

### State Management
- Phase-based state machine: `alert` → `investigation` → `approval` → `execution` → `countdown` → `success`
- Reducer pattern for complex state transitions
- Ref-based interval management to prevent memory leaks

### Key UI Components
1. **AlertBanner:** Critical incident details with impact metrics
2. **TriagePanel:** Investigation results with Substrate insights
3. **CoachUI:** Human-in-the-loop approval interface with proof chain
4. **ExecutionTerminal:** Real-time command execution logs
5. **SuccessCountdown:** 30-day SLO validation visualization
6. **SuccessBanner:** RLHF reward confirmation

### Substrate Integrations (Conceptual)
- Entity Topology API
- Causal Graph Query Engine
- Incident Knowledge Base Search
- Data Dictionary Translation
- Guardrails Policy Engine
- Action Handoffs Workflow Engine
- RLHF Feedback Loop

## Product Roadmap

### H1 FY27 (Current Demo State)
- ✅ Data Dictionary v1 (schema translation)
- ✅ Causal Graph v1 (deterministic relationships)
- ✅ Incident Knowledge Base (pattern matching)
- ✅ Autopilot v1 (autonomous remediation)
- ✅ Coach UI (human-in-the-loop)

### H2 FY27 (Next)
- RLHF Engine (mathematical reward system)
- Ground Truth API (BYOA support)
- World Model v1 (predictive incident prevention)
- Advanced Guardrails (multi-policy validation)

### FY28+
- Autonomous Change Management
- Predictive Capacity Planning
- Cross-Service Optimization
- Self-Healing Infrastructure

## Key Terminology

- **Substrate:** New Relic's intelligence layer for autonomous operations
- **Autopilot:** Opinionated SRE agent for incident resolution
- **Ground Truth:** Commercial API product for external agent integration
- **MOAT Metrics:** Defensibility indicators (data moat, network effects, time to parity)
- **MCP Token Blitz:** Problem where agents query APIs thousands of times due to schema drift
- **Coach UI:** Human-in-the-loop approval interface
- **Proof Chain:** Evidence-backed reasoning trail for recommendations
- **Action Handoffs:** Durable execution layer via Temporal workflows
- **Guardrails Gateway:** Safety policy validation for autonomous actions

## Demo Usage

### Running Locally
This is a static HTML file - simply open `index.html` in a modern browser.

### Demo Script (5 Minutes)

**[0:00-1:00] Introduction & Context**
- Introduce Substrate: 18 years of cross-customer telemetry
- Key insight: "Models Commoditize, Context Compounds"
- Show home screen with P95 latency alert

**[1:00-2:30] Investigation & Causal Analysis**
- Click "Investigate Root Cause"
- Highlight Substrate querying Entity Topology + Causal Graph
- Show identification of `inventory-db` as root cause
- Demonstrate 92% match to historical incident RETRO-INC-4512
- Emphasize: Not correlation, but proven causation

**[2:30-3:30] Coach UI & Human Decision**
- Show Coach UI proof chain
- Highlight recommended remediation
- Explain Data Dictionary translation (txn_id → trace.id)
- Click "Authorize & Execute"

**[3:30-4:30] Autonomous Execution**
- Watch real-time execution logs
- Point out Guardrails Gateway authorization
- Show CREATE INDEX CONCURRENTLY (non-blocking)
- Highlight Action Handoffs integration
- Show progress bar advancing to 100%

**[4:30-5:00] RLHF & Success**
- Show 30-day validation countdown
- Explain RLHF loop: +0.03 reward
- Highlight causal edge weight upgrade: 0.91 confidence
- Emphasize: System gets smarter with every incident

## References

All technical and business details sourced from:
- `[Draft] Autonomous ops_substrate PR FAQ.pdf`
- `Autonomous operations __ Substrate roadmap.pdf`
- `Autopilot UX Doc.pdf`
- `Data dictionary and Reinforcement learning_decision trees - research.pdf`
- `AI SRE UX Strategy for New Relic.pdf`
- `Substrate_autonomous ops.pdf`

## Repository Structure

```
autopilot-sre-demo/
├── index.html          # Single-page demo application
└── README.md           # This file
```

## License

Proprietary - New Relic Internal Demo

## Contact

For questions about Substrate or Autopilot, contact the New Relic AI Group.

---

**Built with:** React 18, Tailwind CSS, Inline Babel transpilation
**Last Updated:** June 2026
**Version:** v2026.09-MVP
