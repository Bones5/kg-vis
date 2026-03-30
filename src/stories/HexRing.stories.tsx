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
