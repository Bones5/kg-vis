# KG-Vis — Knowledge Graph Visualizer

KG-Vis is a React + TypeScript prototype for exploring a knowledge graph as a hex-based cluster map. The current experience has moved away from the original force-graph-first concept and now centers on:

- a deterministic mock graph data source
- a hex overview that lays clusters out on a honeycomb grid
- routed cluster-to-cluster edges
- drill-in ring views for a selected cluster
- a minimap and breadcrumb navigation
- a Rive-driven animated center node in the ring view

## Current stack

| Layer | Technology |
| --- | --- |
| UI | React 18 + TypeScript |
| Bundler | Vite |
| State/data loading | React hooks + deterministic mock data |
| Animation | `@rive-app/react-canvas` |
| Styling | Plain CSS loaded from `src/styles/*.css` |
| Component docs | Storybook |
| E2E testing | Playwright |

## Current scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run storybook
npm run build-storybook
npm run test:e2e
```

## What is implemented now

### Graph experience

- `App` loads graph data through `useGraphData`
- `useGraphData` currently serves deterministic mock data from `src/dev/mockGraph.ts`
- `HexGraphView` switches between:
  - **overview** mode for all clusters
  - **cluster-ring** mode for a selected cluster
- `HexOverview` lays out clusters in hex rings and renders routed edges
- `HexRing` shows the selected cluster at the center, surrounding neighbor clusters in tiers, and off-map stub navigation for overflow
- `Minimap` supports quick navigation while drilled in
- `GraphErrorBoundary` protects the main visualization shell

### Storybook coverage

Storybook stories are included for stable primitives and composed graph states:

- Primitives:
  - `HexPill`
  - `Minimap`
  - `RoutedEdges`
  - `GraphErrorBoundary`
- Composed:
  - `HexOverview`
  - `HexRing`
  - `HexGraphView`

Stories reuse `generateMockGraph()` so they remain deterministic.

### Playwright coverage

Playwright end-to-end tests cover the current user journey:

- app load
- cluster drill-in
- breadcrumb return
- minimap navigation
- keyboard activation on overflow stubs

Tests run in desktop and tablet viewport projects.

### Data model

The graph payload is still multi-level:

- level `0`: cluster-to-cluster overview
- level `1`: clusters plus top words
- level `2`: full graph payload

That structure lets the current UI use level `0` for navigation while preserving room for deeper milestone work.

## Project structure

```text
src/
  app/
    App.tsx
    routes.tsx
    store.ts
  dev/
    mockGraph.ts
  features/
    graph/
      components/
        GraphErrorBoundary.tsx
        RiveNode.tsx
        RivePool.tsx
      hooks/
        useGraphData.ts
        useGraphUI.ts
    hex/
      components/
        HexGraphView.tsx
        HexOverview.tsx
        HexRing.tsx
        HexPill.tsx
        Minimap.tsx
        RoutedEdges.tsx
      lib/
        edgeRouter.ts
        hexLayout.ts
        hexMath.ts
    search/
    filters/
    progress/
    clustering/
    metrics/
  stories/
    *.stories.tsx
  shared/
    components/
    hooks/
    lib/
    types/
  styles/
    global.css
    hex.css
e2e/
  graph-navigation.spec.ts
.storybook/
  main.ts
  preview.ts
playwright.config.ts
```

## Milestone snapshot

| Milestone | Status | Notes |
| --- | --- | --- |
| Mock graph generation | ✅ | Deterministic demo payload is in place |
| Hex overview layout | ✅ | Cluster overview and routed edges are implemented |
| Drill-in navigation | ✅ | Breadcrumbs, ring layout, minimap, and overflow stubs are in place |
| Rive integration | ✅ | Center-node animation is wired into the ring view |
| Storybook | 🟡 | 7 files / 18 stories — needs data-variation and shared-component coverage |
| Playwright | 🟡 | 1 spec / 3 scenarios — needs data-variation and error-path journeys |
| **Graph state coverage** | 🟡 | **Next priority** — some dense/overflow coverage exists; still need sparse, single-cluster, empty, and other data-shape scenarios |
| Search | ⏸ | Deferred — stub files exist |
| Filters | ⏸ | Deferred — stub files exist |
| Progress tracking | ⏸ | Deferred — stub files exist |
| Clustering controls | ⏸ | Deferred — stub files exist |
| Metrics overlay | ⏸ | Deferred — stub files exist |

## Suggested hosted dev setup

For the next phase, the cleanest hosted workflow is:

- **Vercel** for the main app preview environment
- **Chromatic** for hosted Storybook publishing, review links, and visual regression baselines
- **GitHub Actions** for build/test automation including Storybook build and Playwright checks

Why this combination:

- Vercel gives fast preview deploys for the app shell with minimal setup.
- Chromatic is purpose-built for Storybook hosting and review workflows.
- GitHub Actions can run the same Storybook build and Playwright checks before merges.

If you want a single-platform fallback, Netlify can host both the app preview and static Storybook build, but Chromatic remains the better Storybook-specific review experience.

## Notes for contributors

- Use the `@/` alias for imports from `src/`.
- Keep feature work inside the existing feature-first structure.
- Treat the mock graph generator as the default deterministic fixture source until a real backend contract is introduced.
