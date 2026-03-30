import type { Meta, StoryObj } from "@storybook/react-vite";
import { Minimap } from "@/features/hex/components/Minimap";
import { layoutOverview } from "@/features/hex/lib/hexLayout";
import { generateMockGraph } from "@/dev/mockGraph";

const payload = generateMockGraph({ clusterCount: 8, nodesPerCluster: 20, edgeDensity: 0.2 });
const nodes = layoutOverview(payload).map((n) => ({ ...n, px: n.px + 450, py: n.py + 350 }));

const meta = {
  title: "Hex/Primitives/Minimap",
  component: Minimap,
  parameters: {
    layout: "centered",
  },
  args: {
    nodes,
    activeClusterId: nodes[0]?.id ?? null,
    onNavigate: () => undefined,
  },
} satisfies Meta<typeof Minimap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DifferentActiveCluster: Story = {
  args: {
    activeClusterId: nodes[2]?.id ?? null,
  },
};

export const Empty: Story = {
  args: {
    nodes: [],
    activeClusterId: null,
  },
};
