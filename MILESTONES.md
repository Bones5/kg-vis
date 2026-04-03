# KG-Vis milestones

## Priority

Expand visual coverage of the graph across a wide range of data shapes and UI states before adding new features.

## Current status

| Area | Status | Current state |
| --- | --- | --- |
| Mock data generator | ✅ Done | `generateMockGraph()` produces deterministic multi-level graph data |
| Data loading shell | ✅ Done | `useGraphData()` loads mock data; returns `payload`, `loading`, `error` |
| Hex overview | ✅ Done | Cluster overview, routed edges, and hover dimming |
| Cluster drill-in | ✅ Done | Ring layout, breadcrumbs, minimap, and overflow stubs |
| Rive integration | ✅ Done | Center node uses `RiveNode` in the ring view |
| Storybook | 🟡 Partial | 7 story files, 18 stories — missing data-variation and shared-component coverage |
| Playwright | 🟡 Partial | 1 spec file, 3 test scenarios — missing data-variation and error-path journeys |
| Graph state coverage | 🔴 Not started | No stories or tests exercise sparse, dense, single-cluster, empty, or large-graph scenarios |
| Search | ⏸ Deferred | Stub files exist — not the current priority |
| Filters | ⏸ Deferred | Stub files exist — not the current priority |
| Progress tracking | ⏸ Deferred | Stub files exist — not the current priority |
| Clustering controls | ⏸ Deferred | Stub files exist — not the current priority |
| Metrics overlay | ⏸ Deferred | Stub files exist — not the current priority |

## Next priority: graph state coverage

The most important work is making the existing visualization presentable across a wide range of inputs. Feature scaffolds (search, filters, etc.) remain deferred until the graph itself renders well in every realistic scenario.

### Stories to add

| Story | What it demonstrates |
| --- | --- |
| Single cluster | Overview with `clusterCount: 1` — ensures layout works at minimum |
| Two clusters | Smallest multi-cluster graph; tests edge routing with minimal data |
| Many clusters | `clusterCount: 20+` — stress-tests hex layout and minimap |
| Large ring | `nodesPerCluster: 100+` — confirms ring overflow and RivePool fallback |
| Small ring | `nodesPerCluster: 3` — ensures ring layout works with few members |
| Sparse edges | `edgeDensity: 0.05` — near-empty edge canvas |
| Dense edges | `edgeDensity: 0.8` — heavily connected view |
| High inter-cluster density | `interClusterDensity: 0.6` — many cross-cluster edges in overview |
| Loading state | App-level spinner (currently only in `App.tsx`) |
| Empty graph | `clusterCount: 0` — verifies graceful empty state |
| Error state (data) | Simulated `useGraphData` error — confirms error boundary fallback |

### Playwright scenarios to add

| Scenario | What it validates |
| --- | --- |
| Sparse graph navigation | Drill-in and breadcrumb return with 2 clusters, low density |
| Dense graph navigation | Drill-in with 15+ clusters, high density |
| Single cluster app | App renders and does not crash with only 1 cluster |
| Empty graph app | App shows a meaningful empty state when 0 clusters are generated |
| Error recovery | Force a data error; confirm fallback renders and no crash |

### Unit tests to add

| Test | What it validates |
| --- | --- |
| Hex layout edge cases | Layout with 0, 1, 2, 20+ clusters |
| Edge router edge cases | Routing with 0 edges, all-self-loop edges, fully connected graph |
| Mock graph extremes | `nodesPerCluster: 0`, `edgeDensity: 0`, `edgeDensity: 1` |

## What is already implemented

### Storybook (7 files, 18 stories)

Foundation:

- Storybook is configured in `.storybook/main.ts` and `.storybook/preview.ts`.
- `storybook` and `build-storybook` scripts are available in `package.json`.
- Shared CSS and the `@/` alias are configured.

Primitive stories:

- `HexPill` — Default, Hovered, Selected, Dimmed, TierOuter (5 stories)
- `Minimap` — Default, DifferentActiveCluster, Empty (3 stories)
- `RoutedEdges` — Default, HoverConnected (2 stories)
- `GraphErrorBoundary` — HealthyChild, ErrorFallback (2 stories)

Composed stories:

- `HexOverview` — Default, DenseEdges (2 stories)
- `HexRing` — Default, OverflowStubs (2 stories)
- `HexGraphView` — OverviewToRingInteractive, ErrorState (2 stories)

All stories use deterministic `generateMockGraph()`.

Gaps: no shared-component stories (Button, Modal, Toggle, Tooltip, Slider are stubs without stories), no loading-state or empty-graph stories, limited data-variation stories.

### Playwright (1 spec file, 3 test scenarios)

Harness:

- Playwright config in `playwright.config.ts`.
- `test:e2e` script in `package.json`.
- Tests run against a local Vite server with deterministic mock data.

Scenarios in `e2e/graph-navigation.spec.ts`:

1. App loads and shows overview
2. Cluster drill-in, breadcrumb return, and minimap navigation
3. Overflow stub keyboard activation

Viewports: desktop `1280×800`, tablet `1024×768`.

Gaps: no data-variation journeys (sparse, dense, single-cluster, empty), no error-path E2E test.

### Unit tests (4 files, 46 tests)

- `mockGraph.test.ts` — 17 tests (determinism, structure, edge properties, cluster metadata, edge cases)
- `hexLayout.test.ts` — 12 tests (layout positions, tiers)
- `hexMath.test.ts` — 11 tests (hex coordinate math)
- `edgeRouter.test.ts` — 6 tests (path routing)

Gaps: no tests for layout with 0 or 1 cluster, no edge-router tests with 0 edges or fully connected graphs.

## Hosted development recommendation

1. **Vercel** for app preview deployments
2. **Chromatic** for hosted Storybook publishing and visual review
3. **GitHub Actions** for build and Playwright automation
