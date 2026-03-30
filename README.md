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

## Current scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

At the moment the repository does **not** yet ship dedicated lint, unit test, Storybook, or Playwright scripts. Those are part of the next phase documented in [`MILESTONES.md`](./MILESTONES.md).

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
  shared/
    components/
    hooks/
    lib/
    types/
  styles/
    global.css
    hex.css
```

## Milestone snapshot

| Milestone | Status | Notes |
| --- | --- | --- |
| Mock graph generation | ✅ | Deterministic demo payload is in place |
| Hex overview layout | ✅ | Cluster overview and routed edges are implemented |
| Drill-in navigation | ✅ | Breadcrumbs, ring layout, minimap, and overflow stubs are in place |
| Rive integration | ✅ | Center-node animation is wired into the ring view |
| Search | 🟡 | Stub hook/component files exist, but no UI behavior yet |
| Filters | 🟡 | Stub hook/component files exist, but no filter logic yet |
| Progress tracking | 🟡 | Stub APIs exist, but no persistence or panel yet |
| Clustering controls | 🟡 | Placeholder hook/panel exist, but no behavior yet |
| Metrics overlay | 🟡 | Placeholder hook/panel exist, but no behavior yet |
| Storybook | ⚪ | Not started |
| Playwright | ⚪ | Not started |

## Plan to flesh out Storybook and Playwright

### Storybook

1. Add Storybook for Vite and expose it through `npm` scripts.
2. Start with stories for the stable UI primitives:
   - `HexPill`
   - `Minimap`
   - `RoutedEdges`
   - `GraphErrorBoundary`
3. Add composite stories for:
   - `HexOverview`
   - `HexRing`
   - `HexGraphView`
4. Use the existing deterministic mock graph so stories stay reproducible.
5. Add stories for hover, active, overflow, and empty/error states.

### Playwright

1. Add a smoke test for first load of the mock graph.
2. Add interaction coverage for:
   - drilling into a cluster
   - returning via breadcrumbs
   - minimap navigation
   - keyboard activation on overflow stubs
3. Add viewport coverage for desktop and tablet layouts.
4. Keep tests deterministic by relying on mock data rather than a live backend.
5. Once Storybook exists, consider component-level Playwright checks against Storybook stories for stable visual and interaction coverage.

## Suggested hosted dev setup

For the next phase, the cleanest hosted workflow is:

- **Vercel** for the main app preview environment
- **Chromatic** for hosted Storybook publishing, review links, and visual regression baselines
- **GitHub Actions** for build/test automation once Storybook and Playwright are added

Why this combination:

- Vercel gives fast preview deploys for the app shell with minimal setup.
- Chromatic is purpose-built for Storybook hosting and review workflows.
- GitHub Actions can run the same Storybook build and Playwright checks before merges.

If you want a single-platform fallback, Netlify can host both the app preview and static Storybook build, but Chromatic remains the better Storybook-specific review experience.

## Notes for contributors

- Use the `@/` alias for imports from `src/`.
- Keep feature work inside the existing feature-first structure.
- Treat the mock graph generator as the default deterministic fixture source until a real backend contract is introduced.
- Do not document Storybook or Playwright as available until the scripts and config are actually added.
