# KG-Vis milestones

## Current status

| Area | Status | Current state |
| --- | --- | --- |
| Mock data generator | ✅ Done | `generateMockGraph()` produces deterministic multi-level graph data |
| Data loading shell | ✅ Done | `useGraphData()` loads mock data into the app shell |
| Hex overview | ✅ Done | Cluster overview, routed edges, and hover dimming are implemented |
| Cluster drill-in | ✅ Done | Ring layout, breadcrumbs, minimap, and overflow stubs are implemented |
| Rive integration | ✅ Done | The selected center node uses `RiveNode` |
| Search | 🟡 Scaffolded | Hook/component/type placeholders exist |
| Filters | 🟡 Scaffolded | Hook/component/type placeholders exist |
| Progress tracking | 🟡 Scaffolded | Hook/store/component placeholders exist |
| Clustering controls | 🟡 Scaffolded | Hook/panel/type placeholders exist |
| Metrics overlay | 🟡 Scaffolded | Hook/panel/type placeholders exist |
| Storybook | ✅ Done | Storybook config, scripts, primitive stories, and composed stories are implemented |
| Playwright | ✅ Done | Playwright config, scripts, desktop/tablet journeys, and keyboard accessibility checks are implemented |

## Storybook implementation

### Completed foundation

- Storybook is configured for the Vite app in `.storybook/main.ts` and `.storybook/preview.ts`.
- `storybook` and `build-storybook` scripts are available in `package.json`.
- Shared CSS and the `@/` alias are configured for Storybook usage.

### Completed primitive coverage

Stories are implemented for:

- `HexPill`
- `Minimap`
- `RoutedEdges`
- `GraphErrorBoundary`

State coverage includes hover/selected/dimmed and empty/error variants where relevant.

### Completed composed coverage

Deterministic stories are implemented for:

- `HexOverview`
- `HexRing` (including an overflow-stub scenario)
- `HexGraphView` (interactive overview→ring plus error state)

All stories reuse deterministic mock graph generation from `generateMockGraph()`.

## Playwright implementation

### Completed harness

- Playwright config is implemented in `playwright.config.ts`.
- `test:e2e` script is available in `package.json`.
- Tests run against a local Vite server with deterministic mock data flow.

### Completed core journeys

End-to-end coverage in `e2e/graph-navigation.spec.ts` includes:

- app load and overview render
- cluster drill-in from overview
- breadcrumb return to overview
- minimap navigation while drilled in
- keyboard activation path for overflow stubs (executed when overflow stubs are present)

### Completed responsive coverage

- Desktop project viewport: `1280x800`
- Tablet project viewport: `1024x768`

Assertions include breadcrumbs, minimap visibility in drill-in mode, and center Rive node presence.

## Definition of done check

### Storybook

- ✅ Storybook runs locally (`npm run storybook`)
- ✅ Static Storybook builds (`npm run build-storybook`)
- ✅ Core graph UI states are available as stories

### Playwright

- ✅ Core navigation journeys are automated (`npm run test:e2e`)
- ✅ Tests are deterministic and avoid live APIs
- ✅ Failures separate setup/config issues from journey regressions via explicit assertions

## Hosted development recommendation

Recommended setup:

1. **Vercel** for app preview deployments
2. **Chromatic** for hosted Storybook publishing and visual review
3. **GitHub Actions** for build and Playwright automation

This gives the team fast preview URLs for the app, purpose-built Storybook review links, and a straightforward path to automated UI regression checks.
