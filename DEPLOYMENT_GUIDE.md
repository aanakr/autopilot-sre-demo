# Deployment Guide - New Relic Autopilot SRE Agent

This guide will walk you through deploying the application to GitHub Pages at `https://aanakr.github.io/autopilot-sre-demo/`.

---

## Prerequisites

- GitHub account (logged in)
- Git installed locally
- Node.js 18+ and npm 9+ installed

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `autopilot-sre-demo` (must match exactly)
3. Description: "New Relic Autopilot SRE Agent - September 2026 MVP"
4. Set to **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

---

## Step 2: Push Code to GitHub

The repository is already initialized with an initial commit. Now add the remote and push:

```bash
cd /Users/aananthakumar/autopilot-sre-demo

# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/aanakr/autopilot-sre-demo.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to GitHub Pages

```bash
# Install gh-pages if not already installed
npm install

# Build and deploy
npm run deploy
```

This command will:
1. Build the production bundle (`npm run build`)
2. Push the `dist` folder to the `gh-pages` branch
3. GitHub Pages will automatically serve from this branch

**Note**: The first deployment may take 2-3 minutes to propagate.

---

## Step 4: Enable GitHub Pages (If Not Auto-Enabled)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Source":
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 2-3 minutes for deployment

---

## Step 5: Verify Deployment

Visit: `https://aanakr.github.io/autopilot-sre-demo/`

You should see the Autopilot home page with:
- New Relic branding (green/cyan theme)
- 4 Substrate Pillar cards
- "Start Investigation" chat interface

---

## Step 6: Test Navigation Flows

Click through all the interactive elements:

1. **Home → Investigation**
   - Click "Payment Service Memory Crisis"
   - Verify timeline, summary, recommendations load
   - Check that Proof Chain tiles expand/collapse

2. **Investigation → Topology**
   - Click "Entity Topology Graph" button
   - Verify entity health visualization
   - Click different entities
   - Click "Back to Investigation" - should return

3. **Investigation → Causal Graph**
   - Click "Causal Graph" button
   - Verify RLHF confidence scores display
   - Check circular gauge visualizations

4. **Investigation → Runbook**
   - Click "Similar Incidents" button
   - Verify Living Runbook details
   - Click other incidents in the list

5. **Investigation → Global Corpus**
   - Click "Global Pattern Match" button
   - Verify global stats (1,247 incidents, 89 enterprises)
   - Check anonymized pattern visualization

6. **Direct Pillar Access from Home**
   - Go back to home (click "New Relic Autopilot" logo)
   - Click any of the 4 pillar cards
   - Verify direct navigation works

---

## Troubleshooting

### Issue: Blank Page After Deployment

**Cause**: Base path mismatch in `vite.config.js`

**Fix**:
```javascript
// vite.config.js
export default defineConfig({
  base: '/autopilot-sre-demo/', // MUST match repo name exactly
  // ...
});
```

Re-deploy:
```bash
npm run deploy
```

---

### Issue: CSS Not Loading

**Cause**: Asset paths not relative

**Fix**: Check that `vite.config.js` has correct `base` setting (see above)

---

### Issue: 404 on Page Refresh

**Cause**: Not using HashRouter

**Fix**: Verify `src/App.jsx` uses `HashRouter`:
```jsx
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      {/* ... */}
    </HashRouter>
  );
}
```

URLs should look like: `https://aanakr.github.io/autopilot-sre-demo/#/investigate/INC-8472`

---

### Issue: Infinite Loading Spinner

**Cause**: Timeout not enforced

**Check**: All async operations should use the 3-second timeout pattern:
```javascript
const { execute, loading } = useTimeoutFallback();

await execute(async () => {
  // Your async work
});
```

---

## Updating the Deployment

After making code changes:

```bash
# Make your changes
# ...

# Commit changes
git add .
git commit -m "Your commit message

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to GitHub
git push origin main

# Deploy updated version
npm run deploy
```

Wait 2-3 minutes for changes to propagate.

---

## Clearing Old Deployment (If Needed)

If you need to completely wipe the old deployment:

```bash
# Delete gh-pages branch locally
git branch -D gh-pages

# Delete gh-pages branch on GitHub
git push origin --delete gh-pages

# Re-deploy fresh
npm run deploy
```

---

## Local Development

To run the app locally before deploying:

```bash
# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

**Note**: Local dev uses the same HashRouter as production, so URLs will have `#` in them.

---

## Production Build Test

To test the production build locally before deploying:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Open `http://localhost:4173` in your browser.

---

## Repository Structure

```
autopilot-sre-demo/
├── README.md                    # Comprehensive documentation
├── DEPLOYMENT_GUIDE.md          # This file
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite config (base path!)
├── tailwind.config.js           # New Relic design tokens
├── src/
│   ├── App.jsx                  # HashRouter root
│   ├── main.jsx                 # Entry point
│   ├── context/
│   │   └── AgentStateContext.jsx
│   ├── components/
│   │   ├── layout/
│   │   ├── investigation/
│   │   └── substrate/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── InvestigationPage.jsx
│   │   ├── TopologyPage.jsx
│   │   ├── CausalGraphPage.jsx
│   │   ├── RunbookPage.jsx
│   │   └── CorpusMatchPage.jsx
│   ├── hooks/
│   │   └── useTimeoutFallback.js
│   └── utils/
│       ├── mockData.js
│       └── stateEnums.js
└── dist/                        # Production build (auto-generated)
```

---

## Key Files for Deployment

| File | Purpose |
|------|---------|
| `vite.config.js` | **CRITICAL**: Sets `base` path for GitHub Pages |
| `package.json` | Contains `deploy` script using `gh-pages` |
| `src/App.jsx` | Uses `HashRouter` for routing |
| `public/.nojekyll` | Prevents GitHub from processing with Jekyll |
| `.gitignore` | Excludes `node_modules` and `dist` from git |

---

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the main [README.md](./README.md) for architecture details
3. Verify all files match the structure in this guide

---

**Last Updated**: 2026-06-16
**Version**: 1.0.0
