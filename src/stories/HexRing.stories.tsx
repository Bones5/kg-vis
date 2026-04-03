import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexRing } from "@/features/hex/components/HexRing";
import { generateMockGraph } from "@/dev/mockGraph";

const basePayload = generateMockGraph({ clusterCount: 8, nodesPerCluster: 40, edgeDensity: 0.25 });
const centerId = basePayload.levels["0"].nodes[0]?.id ?? "C1";

const meta = {
  title: "Hex/Composed/HexRing",
  component: HexRing,
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
    centerId,
    payload: basePayload,
    onClusterClick: () => undefined,
  },
} satisfies Meta<typeof HexRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OverflowStubs: Story = {
  args: {
    payload: generateMockGraph({ clusterCount: 50, nodesPerCluster: 20, edgeDensity: 0.2 }),
  },
};

const singleNeighborPayload = generateMockGraph({ clusterCount: 3, nodesPerCluster: 10, edgeDensity: 0.2, interClusterDensity: 0.3 });

export const SingleNeighbor: Story = {
  args: {
    payload: singleNeighborPayload,
    centerId: singleNeighborPayload.levels["0"].nodes[0]?.id ?? "C1",
  },
};

const fewPayload = generateMockGraph({ clusterCount: 5, nodesPerCluster: 15, edgeDensity: 0.2, interClusterDensity: 0.5 });

export const FewNeighbors: Story = {
  args: {
    payload: fewPayload,
    centerId: fewPayload.levels["0"].nodes[0]?.id ?? "C1",
  },
};

const noOverflowPayload = generateMockGraph({ clusterCount: 12, nodesPerCluster: 20, edgeDensity: 0.25, interClusterDensity: 0.6 });

export const NoOverflow: Story = {
  args: {
    payload: noOverflowPayload,
    centerId: noOverflowPayload.levels["0"].nodes[0]?.id ?? "C1",
  },
};
