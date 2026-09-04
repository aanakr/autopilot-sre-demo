/**
 * Autopilot / Substrate MVP — E2E QA script.
 *
 * Not a `@playwright/test` suite (no local test-runner dependency in this
 * repo) — a standalone script driving headless Chromium via the `playwright`
 * package, per this repo's established verification convention. Run it
 * against a live dev/preview server:
 *
 *   npm run dev      &  BASE_URL=http://localhost:5173 node tests/e2e/mvp.spec.js
 *   npm run preview  &  BASE_URL=http://localhost:4173 node tests/e2e/mvp.spec.js
 *
 * Exits non-zero on any assertion failure or unexpected console/page error.
 */

import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = join(__dirname, 'screenshots');
mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function loadPlaywright() {
  let mod;
  try {
    mod = await import('playwright');
  } catch {
    const fallback = process.env.PLAYWRIGHT_MODULE_PATH
      ?? `${process.env.HOME}/.nvm/versions/node/v20.14.0/lib/node_modules/playwright/index.js`;
    mod = await import(fallback);
  }
  // The global install is CJS — under ESM dynamic import its named exports
  // land on `.default` instead of the module namespace itself.
  return mod.chromium ? mod : mod.default;
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173/autopilot-sre-demo/';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount += 1;
    console.log(`  ✓ ${message}`);
  } else {
    failCount += 1;
    console.error(`  ✗ FAILED: ${message}`);
  }
}

async function shot(page, name) {
  await page.screenshot({ path: join(SCREENSHOT_DIR, `${name}.png`), fullPage: true });
}

// The Presenter Control Bar loads collapsed (to avoid overlapping page
// content) — expand it once per fresh page load so scenario buttons are clickable.
async function expandPresenterBar(page) {
  await page.getByTitle('Expand presenter controls').click();
  await page.waitForSelector('text=Presenter Controls');
}

async function main() {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  console.log(`\nRunning against ${BASE_URL}\n`);

  // --- Screen 1: default Knowledge Gap Map -------------------------------
  console.log('Screen 1 — Knowledge Gap Map (default)');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await expandPresenterBar(page);
  await page.waitForSelector('text=Ground Truth Estate Readiness & Coverage Hub');
  assert(await page.getByText('Coverage Gaps').first().isVisible(), 'KPI tiles render (Coverage Gaps)');
  assert(await page.getByText('AI Self-Healing Success Rate').isVisible(), 'KPI tiles render (Self-Healing Rate)');
  assert(await page.getByText('Ground Truth Matrix').first().isVisible(), 'grid renders');
  await page.locator('#traversal-path-svg polyline').waitFor({ state: 'visible', timeout: 5000 });
  assert(true, 'agent traversal overlay renders for S1');
  assert(await page.getByText('Investigate Incident (SRE Coach UI)').isVisible(), 'S1 incident sidebar card renders by default');
  await shot(page, '01-knowledge-default');

  // --- Grid interaction: gap cell -> drawer -> supply context -----------
  console.log('Grid — gap cell interaction');
  await page.getByTitle(/Runbooks · gateway-ingress · gap/).click();
  await page.waitForSelector('text=Supply Context In-Place');
  assert(await page.getByText(/Impact: 8.5\/10/).isVisible(), 'gap drawer shows impact score');
  await page.getByPlaceholder(/Paste a runbook/).fill('Symptom: connection resets. Fix: scale ingress-controller.');
  await page.getByRole('button', { name: 'Supply Context' }).click();
  assert(await page.getByText(/Context received/).isVisible(), 'supplying context resolves the gap locally');
  await shot(page, '02-gap-drawer-resolved');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.waitForSelector('text=Supply Context In-Place', { state: 'hidden' });

  // --- Scenario switching via Presenter Control Bar ----------------------
  console.log('Presenter Control Bar — scenario switches');
  const scenarioButtons = [
    { id: 'S1', label: 'Happy Path', expectText: 'checkout-api P95 Latency Spike' },
    { id: 'S2', label: 'Novel Diagnosis', expectText: 'billing-service Memory Exhaustion' },
    { id: 'S3', label: 'Graduation', expectText: 'Recurring Pattern Detected' },
    { id: 'S4', label: 'SRE Veto', expectText: 'auth-service Latency Anomaly' },
    { id: 'S5', label: 'Knowledge Gap', expectText: 'gateway-ingress Critical Gateway Alert' },
  ];
  for (const s of scenarioButtons) {
    await page.getByRole('button', { name: new RegExp(`${s.id}.*${s.label}`) }).click();
    await page.waitForSelector(`text=${s.expectText}`);
    assert(true, `Scenario ${s.id} (${s.label}) reconfigures Screen 1`);
    await shot(page, `03-scenario-${s.id.toLowerCase()}-grid`);
  }

  // --- Scenario 3 graduation flow -----------------------------------------
  console.log('Scenario 3 — graduation flow');
  await page.getByRole('button', { name: /S3.*Graduation/ }).click();
  await page.waitForSelector('text=Recurring Pattern Detected');
  await page.getByRole('button', { name: 'Graduate to Workflow' }).click();
  await page.waitForSelector('text=Substrate Eligibility Rubric');
  assert(await page.getByText('High Toil').isVisible(), 'eligibility rubric renders');
  await shot(page, '04-graduation-rubric');
  await page.getByRole('button', { name: 'Confirm Graduation' }).click();
  await page.waitForSelector('text=Workflow Graduated');
  assert(await page.getByText(/graduated to a deterministic WIN Workflow/).isVisible(), 'confirming graduation shows success toast');
  await shot(page, '05-graduation-confirmed');

  // --- Scenario 1: full Workspace happy path ------------------------------
  console.log('Scenario 1 — Workspace happy path (Approve -> Execute -> Validate -> RLHF)');
  await page.getByRole('button', { name: /S1.*Happy Path/ }).click();
  await page.getByText('Investigate Incident (SRE Coach UI)').click();
  await page.waitForURL(/\/autopilot\/workspace\/INC-8472/);
  assert(await page.getByText('Investigation Tree').isVisible(), 'Pane A (Investigation Tree) renders');
  assert(await page.getByText('Causal Proof Canvas').isVisible(), 'Pane B (Causal Proof Canvas) renders');
  assert(await page.getByText('Substrate Confidence Scores').isVisible(), 'Pane C (Remediation) renders');
  await shot(page, '06-workspace-s1');

  await page.getByText('DB Connection Pool Saturated').click();
  await page.getByText('Telemetry Exemplars', { exact: true }).waitFor();
  assert(await page.getByText(/connections_active = 100\/100/).isVisible(), 'clicking a causal node opens its evidence drawer');
  await shot(page, '07-evidence-drawer');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByText('Telemetry Exemplars', { exact: true }).waitFor({ state: 'hidden' });

  await page.getByRole('button', { name: /Approve & Execute/ }).click();
  await page.waitForSelector('text=Action Executing via');
  assert(await page.getByText('Post-Remediation SLO Validation Timer').isVisible(), 'approving swaps in the execution terminal + validation ring');
  await shot(page, '08-execution-terminal');

  console.log('  (waiting ~30s of virtual-time for the SLO validation countdown to complete...)');
  await page.waitForSelector('text=Recursive Learning Success', { timeout: 45000 });
  assert(await page.getByText(/0.88 to 0.91/).first().isVisible(), 'RLHF banner shows the exact mic-drop reward math');
  await shot(page, '09-rlhf-banner');

  // --- Scenario 2: read-only diagnostics ----------------------------------
  console.log('Scenario 2 — read-only diagnostics');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await expandPresenterBar(page);
  await page.getByRole('button', { name: /S2.*Novel Diagnosis/ }).click();
  await page.getByText('Investigate Incident (SRE Coach UI)').click();
  await page.waitForURL(/\/autopilot\/workspace\/INC-9103/);
  assert(await page.getByText('Upstream Payload Spikes').isVisible(), 'decision-tree culprit node renders');
  assert(await page.getByText(/restricting operation to read-only diagnostics/i).isVisible(), 'no-workflow message renders');
  const approveDisabledS2 = await page.getByRole('button', { name: /Approve & Execute/ }).isDisabled();
  assert(approveDisabledS2, 'Approve & Execute is disabled with no matched workflow');
  await shot(page, '10-workspace-s2-readonly');

  // --- Scenario 4: SRE veto ------------------------------------------------
  console.log('Scenario 4 — SRE veto');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await expandPresenterBar(page);
  await page.getByRole('button', { name: /S4.*SRE Veto/ }).click();
  await page.getByText('Investigate Incident (SRE Coach UI)').click();
  await page.waitForURL(/\/autopilot\/workspace\/INC-7734/);
  await page.getByRole('button', { name: 'Reject Recommendation' }).click();
  await page.selectOption('select[aria-label="Veto Reason"]', 'Database under maintenance');
  await page.getByRole('button', { name: 'Submit Veto' }).click();
  assert(await page.getByText(/0.45/).isVisible(), 'veto decays the score to 0.45');
  assert(await page.getByText(/DECAYED/).isVisible(), 'decayed score is labeled DECAYED');
  assert(await page.getByText(/Veto recorded/).isVisible(), 'veto writes an audit-log line');
  await shot(page, '11-workspace-s4-vetoed');

  // --- Scenario 5: knowledge injection ------------------------------------
  console.log('Scenario 5 — knowledge-gap ingestion + recalculation');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await expandPresenterBar(page);
  await page.getByRole('button', { name: /S5.*Knowledge Gap/ }).click();
  await page.getByText('Investigate Incident (SRE Coach UI)').click();
  await page.waitForURL(/\/autopilot\/workspace\/INC-6650/);
  assert(await page.getByText(/Unable to match remediation/).isVisible(), 'knowledge-gap message renders pre-injection');
  await shot(page, '12-workspace-s5-gap');

  await page.getByPlaceholder(/Ingress Recovery/).fill('# Ingress Recovery\nSymptoms: Connection Reset\nFix: scale ingress-controller deployment');
  await page.getByRole('button', { name: 'Recalculate & Revise Analysis' }).click();
  await page.waitForSelector('text=Substrate Confidence Scores', { timeout: 10000 });
  assert(await page.getByText(/0.92/).first().isVisible(), 'recalculation resolves confidence to 0.92');
  const approveEnabledS5 = await page.getByRole('button', { name: /Approve & Execute/ }).isEnabled();
  assert(approveEnabledS5, 'Approve & Execute unlocks after recalculation');
  await shot(page, '13-workspace-s5-recalculated');

  // --- Console error assertion --------------------------------------------
  assert(consoleErrors.length === 0, `zero console/page errors across the run (saw ${consoleErrors.length})`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.error('    console error:', e));
  }

  await browser.close();

  console.log(`\n${passCount} passed, ${failCount} failed.\n`);
  if (failCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error('E2E script crashed:', err);
  process.exit(1);
});
