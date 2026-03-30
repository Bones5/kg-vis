# KG-Vis — Knowledge Graph Visualizer

A React + TypeScript knowledge graph visualizer using **force-graph 2D canvas** with **Rive animated overlays**. Data is pre-positioned and server-prepared. Targets desktop, iPad, and mobile.

---

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Graph Rendering | react-force-graph-2d (2D canvas) |
| Animated Overlays | @rive-app/react-canvas |
| State Management | Zustand |
| Linting | ESLint |
| Unit Testing | Vitest |
| Component Explorer | Storybook |
| E2E Testing | Playwright |

---

## Quick Start

```bash
npm install
npm run dev      # starts dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build locally
```

---

## Development Tooling

```bash
npm run lint          # lint TypeScript/React source
npm run test          # run unit tests once (Vitest)
npm run test:watch    # run Vitest in watch mode
npm run storybook     # run Storybook at http://localhost:6006
npm run build-storybook
npm run test:e2e      # run Playwright end-to-end tests
```

---

## Project Structure

```
src/
  app/
    App.tsx             # Root component with loading/error states
    routes.tsx          # Future routing config (placeholder)
    store.ts            # Re-exports all Zustand stores
  features/
    graph/
      components/
        GraphCanvas.tsx         # react-force-graph-2d canvas, pre-positioned
        GraphOverlayRive.tsx    # Rive overlay layer (clusters + hovered/selected)
        RiveNode.tsx            # Single Rive instance with SM inputs
        RivePool.tsx            # Fixed pool (20) of Rive instances, recycled
        GraphControls.tsx       # Expand / Collapse / Reset buttons
        GraphView.tsx           # Composes canvas + overlay + controls + breadcrumbs
        Breadcrumbs.tsx         # Expansion path nav (All → Food → Fruit)
        GraphErrorBoundary.tsx  # Error boundary for canvas/overlay
      hooks/
        useGraphView.ts         # Zustand: level, expandedClusters, maxNodes
        useGraphUI.ts           # Zustand: hovered, selected nodes
        useGraphData.ts         # Loads graph payload (mock or server)
      lib/
        graphTransforms.ts      # buildView(level, maxNodes) — top-K + clusters
        clustering.ts           # expand(clusterId, payload, maxNodes)
      types.ts                  # Re-exports from shared/types/graph
    search/             # Milestone 5 (placeholder)
    filters/            # Milestone 6 (placeholder)
    progress/           # Milestone 7 (placeholder)
    clustering/         # Milestone 8 (placeholder)
    metrics/            # Milestone 9 (placeholder)
  shared/
    components/         # Button, Toggle, Slider, Tooltip, Modal (placeholders)
    hooks/
      useDevice.ts      # Reactive device-aware node budget
      useDebounce.ts    # Generic debounce hook
      useLocalStorage.ts # Typed localStorage hook
    lib/
      api.ts            # fetchGraphPayload utility
      device.ts         # getNodeBudget / getDeviceBudget
      colors.ts         # Node/edge color constants + importanceToColor
    types/
      graph.ts          # GraphNode, GraphEdge, GraphLevel, GraphPayload
      ui.ts             # DeviceBudget, DeviceClass
  styles/
    global.css          # Reset + app shell styles
    graph.css           # Graph view, overlay, breadcrumbs, controls, animations
  dev/
    mockGraph.ts        # generateMockGraph(options) — deterministic mock data
  main.tsx              # Entry point
tests/
  e2e/
    app.spec.ts         # Playwright smoke test
.storybook/
  main.ts               # Storybook config
  preview.ts            # Storybook preview globals
.github/
  workflows/ci.yml      # CI (lint, unit, build, storybook, e2e)
  copilot-instructions.md
```

---

## Data Schema

Graph data follows a multi-level schema. Level 0 shows cluster nodes only; level 1 adds top-importance word nodes; level 2 shows all nodes.

```json
{
  "meta": { "version": 1, "levels": 3 },
  "levels": {
    "0": {
      "nodes": [{ "id": "C1", "type": "cluster", "label": "Food", "x": 10.5, "y": -4.2 }],
      "edges": [{ "source": "C1", "target": "C2", "weight": 3 }]
    },
    "1": {
      "nodes": ["...clusters...", "...top words..."],
      "edges": ["..."]
    },
    "2": { "nodes": ["...all nodes..."], "edges": ["...all edges..."] }
  }
}
```

---

## Device-Aware Node Budgets

| Screen Width | Max Nodes | Max Edges |
|---|---|---|
| ≥ 1200 px (desktop) | 4 000 | 12 000 |
| ≥ 900 px (tablet landscape) | 2 500 | 7 500 |
| ≥ 600 px (tablet portrait) | 1 500 | 4 500 |
| < 600 px (mobile) | 800 | 2 400 |

---

## Rive Integration

Rive animations live in `public/rive/cluster.riv` (not bundled with source). The `.riv` file must define a **State Machine** named `nodeSM` with the following inputs:

| Input | Type | Description |
|---|---|---|
| `hovered` | Bool | Node is being hovered |
| `selected` | Bool | Node is selected |
| `size` | Number | Visual size of the node |
| `metric` | Number | Importance / metric value (0–1) |

### Overlay strategy
- **Cluster nodes** always get a Rive instance
- **Hovered / selected** word nodes also get Rive instances
- A fixed **pool of 20** instances is pre-created and recycled
- Nodes beyond the pool cap render as plain CSS circles (no perf cost)

---

## Milestones

| # | Status | Feature |
|---|---|---|
| 1 | ✅ | Mock data generator (`generateMockGraph`) |
| 2 | ✅ | Graph rendering + pre-positioned nodes |
| 3 | ✅ | Cluster expansion + Breadcrumbs + Controls |
| 4 | ✅ | Rive overlay + instance pool |
| 5 | 🔲 | Search (SearchBox, search index) |
| 6 | 🔲 | Filters (FilterPanel, FilterChips, filter logic) |
| 7 | 🔲 | Progress tracking (ProgressPanel, localStorage) |
| 8 | 🔲 | Clustering config panel |
| 9 | 🔲 | Metrics overlay (FPS, node/edge counts) |

---

## Key Design Decisions

- **Pre-positioned nodes**: `fx`/`fy` are set from `x`/`y` with `cooldownTicks={0}`, disabling the force simulation entirely for instant, stable layout.
- **Never mutate source data**: `buildView` and `expand` always create new objects.
- **Error boundaries**: `GraphErrorBoundary` wraps both the canvas and the Rive overlay layer.
- **Zustand stores**: `useGraphView` (level/expansion state) and `useGraphUI` (hover/select) are independent stores to minimize re-renders.
