# Copilot instructions for kg-vis

## Current product shape

- The active UI is a hex-based graph explorer, not the older force-graph canvas described in the original README.
- `src/app/App.tsx` loads data through `useGraphData()` and renders `HexGraphView`.
- `useGraphData()` currently uses deterministic mock data from `src/dev/mockGraph.ts`.
- The implemented user flow is:
  - overview of clusters
  - click into a cluster ring
  - navigate back with breadcrumbs
  - switch clusters from the minimap or overflow stubs

## Architecture and conventions

- Use the `@/` path alias for imports from `src/`.
- Keep code in the existing feature-first layout:
  - `features/graph` for shared graph loading/error/Rive pieces
  - `features/hex` for the current graph visualization
  - `features/search`, `filters`, `progress`, `clustering`, and `metrics` are planned but mostly placeholders
- Prefer deterministic mock data for local development and tests until an API contract is introduced.
- Preserve keyboard accessibility on interactive non-button elements such as minimap dots and overflow stubs.
- Keep visualization math in `features/hex/lib` and UI rendering in `features/hex/components`.

## Documentation expectations

- Do not reintroduce claims that the app currently depends on `react-force-graph-2d`; the present implementation is hex-layout based.
- Do not claim Storybook, Playwright, lint, or unit-test scripts exist unless they have actually been added to `package.json`.
- Keep milestone docs aligned with the real state of implemented vs placeholder features.

## Guidance for upcoming Storybook work

- Start Storybook coverage with stable, isolated components:
  - `HexPill`
  - `Minimap`
  - `RoutedEdges`
  - `GraphErrorBoundary`
- Then add composed stories for:
  - `HexOverview`
  - `HexRing`
  - `HexGraphView`
- Reuse `generateMockGraph()` so stories stay deterministic.
- Include stories for hover, selected, overflow, loading, and error states where relevant.

## Guidance for upcoming Playwright work

- Favor end-to-end flows that reflect the current user journey:
  - app load
  - cluster drill-in
  - breadcrumb return
  - minimap navigation
  - keyboard navigation on stub links
- Use deterministic fixtures and avoid live-network dependencies.
- Add responsive checks for at least desktop and tablet breakpoints.

## Hosted dev recommendation

- Main app previews: Vercel
- Hosted Storybook and visual review: Chromatic
- CI orchestration: GitHub Actions
