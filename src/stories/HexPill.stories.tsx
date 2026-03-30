import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexPill } from "@/features/hex/components/HexPill";
import type { HexNode } from "@/shared/types/hex";

const baseNode: HexNode = {
  id: "C1",
  label: "Technology",
  type: "cluster",
  importance: 0.8,
  childCount: 12,
  px: 120,
  py: 80,
  hex: { q: 0, r: 0 },
};

const meta = {
  title: "Hex/Primitives/HexPill",
  component: HexPill,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", width: 300, height: 200, background: "#0f172a" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    node: baseNode,
    onHover: () => undefined,
    onClick: () => undefined,
  },
} satisfies Meta<typeof HexPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hovered: Story = {
  args: {
    isHovered: true,
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const Dimmed: Story = {
  args: {
    dimmed: true,
  },
};

export const TierOuter: Story = {
  args: {
    tier: "outer",
    node: { ...baseNode, id: "C2", label: "Art", importance: 0.45, childCount: 4 },
  },
};
