import type { Meta, StoryObj } from "@storybook/react-vite";
import { GraphErrorBoundary } from "@/features/graph/components/GraphErrorBoundary";

function ErrorThrower(): JSX.Element {
  throw new Error("Storybook forced render failure");
}

const meta = {
  title: "Graph/GraphErrorBoundary",
  component: GraphErrorBoundary,
  parameters: {
    layout: "centered",
  },
  args: {
    children: <div />,
  },
} satisfies Meta<typeof GraphErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HealthyChild: Story = {
  render: () => (
    <GraphErrorBoundary>
      <div style={{ color: "#e2e8f0", background: "#0f172a", padding: 16 }}>Graph content</div>
    </GraphErrorBoundary>
  ),
};

export const ErrorFallback: Story = {
  render: () => (
    <GraphErrorBoundary>
      <ErrorThrower />
    </GraphErrorBoundary>
  ),
};
