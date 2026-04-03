import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexOverview } from "@/features/hex/components/HexOverview";
import { generateMockGraph } from "@/dev/mockGraph";

const payload = generateMockGraph({ clusterCount: 8, nodesPerCluster: 40, edgeDensity: 0.25 });

const meta = {
  title: "Hex/Composed/HexOverview",
  component: HexOverview,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#0f172a", padding: 8 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    payload,
    onClusterClick: () => undefined,
  },
} satisfies Meta<typeof HexOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DenseEdges: Story = {
  args: {
    payload: generateMockGraph({ clusterCount: 10, nodesPerCluster: 35, edgeDensity: 0.4 }),
  },
};

export const SingleCluster: Story = {
  args: {
    payload: generateMockGraph({ clusterCount: 1, nodesPerCluster: 20, edgeDensity: 0.3 }),
  },
};

export const SparseEdges: Story = {
  args: {
    payload: generateMockGraph({ clusterCount: 8, nodesPerCluster: 30, edgeDensity: 0.05, interClusterDensity: 0.1 }),
  },
};

export const ManyClusters: Story = {
  args: {
    payload: generateMockGraph({ clusterCount: 20, nodesPerCluster: 10, edgeDensity: 0.2 }),
  },
};
