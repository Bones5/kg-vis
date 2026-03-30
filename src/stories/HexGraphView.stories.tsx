import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexGraphView } from "@/features/hex/components/HexGraphView";
import { GraphErrorBoundary } from "@/features/graph/components/GraphErrorBoundary";
import { generateMockGraph } from "@/dev/mockGraph";

const payload = generateMockGraph({ clusterCount: 8, nodesPerCluster: 40, edgeDensity: 0.25 });

const meta = {
  title: "Hex/Composed/HexGraphView",
  component: HexGraphView,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    payload,
  },
} satisfies Meta<typeof HexGraphView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverviewToRingInteractive: Story = {};

function BrokenGraph(): JSX.Element {
  throw new Error("Composed view failed");
}

export const ErrorState: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100vh", background: "#0f172a" }}>
      <GraphErrorBoundary>
        <BrokenGraph />
      </GraphErrorBoundary>
    </div>
  ),
};
