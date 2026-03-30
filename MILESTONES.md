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
| Storybook | ⚪ Not started | No config, scripts, or stories yet |
| Playwright | ⚪ Not started | No config, scripts, or tests yet |

## Storybook plan

### Phase 1: foundation

- Add Storybook for the Vite app.
- Add `storybook` and `build-storybook` scripts.
- Configure shared CSS and the `@/` alias inside Storybook.

### Phase 2: primitive coverage

- Add stories for:
  - `HexPill`
  - `Minimap`
  - `RoutedEdges`
  - `GraphErrorBoundary`
- Capture hover, active, dimmed, and keyboard-focus states where practical.

### Phase 3: composed graph states

- Add deterministic stories for:
  - overview mode
  - cluster ring mode
  - overflow stub state
  - error fallback state
- Reuse `generateMockGraph()` for reproducible story data.

### Definition of done

- Storybook runs locally.
- Static Storybook can be built in CI.
- Core graph UI states are visible without launching the whole app manually.

## Playwright plan

### Phase 1: harness

- Add Playwright config and scripts.
- Start the Vite app in test mode against the deterministic mock data flow.

### Phase 2: core journeys

- Verify the app loads successfully.
- Verify a cluster can be opened from the overview.
- Verify breadcrumbs return to the overview.
- Verify minimap navigation changes the active cluster.
- Verify overflow stubs are keyboard accessible.

### Phase 3: responsive and regression coverage

- Add desktop and tablet viewport coverage.
- Add assertions around the presence of breadcrumbs, minimap, and selected center node.
- If Storybook is adopted first, add a small set of component-driven Playwright checks against Storybook stories.

### Definition of done

- Core navigation journeys are covered in CI.
- Tests are deterministic and do not depend on live APIs.
- Failures clearly separate app-regression issues from fixture/setup issues.

## Hosted development recommendation

Recommended setup:

1. **Vercel** for app preview deployments
2. **Chromatic** for hosted Storybook publishing and visual review
3. **GitHub Actions** for build and Playwright automation

This gives the team fast preview URLs for the app, purpose-built Storybook review links, and a straightforward path to automated UI regression checks.
