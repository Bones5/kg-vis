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
