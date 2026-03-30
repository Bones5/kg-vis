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
