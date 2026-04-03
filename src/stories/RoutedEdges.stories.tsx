import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoutedEdges } from "@/features/hex/components/RoutedEdges";
import { layoutOverview } from "@/features/hex/lib/hexLayout";
import { computeContactPairs, routeEdges } from "@/features/hex/lib/edgeRouter";
import { generateMockGraph } from "@/dev/mockGraph";

const payload = generateMockGraph({ clusterCount: 8, nodesPerCluster: 20, edgeDensity: 0.2 });
const nodes = layoutOverview(payload);
const level0 = payload.levels["0"];
const edges = routeEdges(nodes, level0.edges, computeContactPairs(nodes));

const meta = {
  title: "Hex/Primitives/RoutedEdges",
  component: RoutedEdges,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", width: 900, height: 700, background: "#0f172a" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    edges,
    hoveredId: null,
    width: 900,
    height: 700,
    offsetX: 450,
    offsetY: 350,
  },
} satisfies Meta<typeof RoutedEdges>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HoverConnected: Story = {
  args: {
    hoveredId: nodes[0]?.id ?? null,
  },
};

export const NoEdges: Story = {
  args: {
    edges: [],
    hoveredId: null,
  },
};

export const SingleEdge: Story = {
  args: {
    edges: edges.slice(0, 1),
    hoveredId: null,
  },
};

const densePayload = generateMockGraph({ clusterCount: 12, nodesPerCluster: 10, edgeDensity: 0.4, interClusterDensity: 0.8 });
const denseNodes = layoutOverview(densePayload);
const denseLevel0 = densePayload.levels["0"];
const denseEdges = routeEdges(denseNodes, denseLevel0.edges, computeContactPairs(denseNodes));

export const DenseEdges: Story = {
  args: {
    edges: denseEdges,
    hoveredId: null,
  },
};
