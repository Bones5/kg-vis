import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexPill } from "@/features/hex/components/HexPill";
import type { HexNode, RingNode } from "@/shared/types/hex";

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

export const HoveredAndSelected: Story = {
  args: {
    isHovered: true,
    isSelected: true,
  },
};

export const ZeroImportance: Story = {
  args: {
    node: { ...baseNode, importance: 0.0 },
  },
};

export const MaxImportance: Story = {
  args: {
    node: { ...baseNode, importance: 1.0 },
  },
};

export const LongLabel: Story = {
  args: {
    node: { ...baseNode, label: "Quantum Computing & Theoretical Physics Research" },
  },
};

export const NoChildren: Story = {
  args: {
    node: { ...baseNode, childCount: 0 },
  },
};

export const HighChildCount: Story = {
  args: {
    node: { ...baseNode, childCount: 999 },
  },
};

const ringNode: RingNode = {
  ...baseNode,
  id: "R1",
  label: "Deep Learning",
  strength: 3.2,
  tier: "inner",
  angle: 0,
};

export const WithStrength: Story = {
  args: {
    node: ringNode,
    tier: "inner",
  },
};
