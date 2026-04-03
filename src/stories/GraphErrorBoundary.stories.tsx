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

export const CustomFallback: Story = {
  render: () => (
    <GraphErrorBoundary
      fallback={
        <div style={{ color: "#f87171", background: "#0f172a", padding: 24, textAlign: "center" }}>
          <h2>⚠️ Custom error UI</h2>
          <p>Something went wrong. Please try refreshing the page.</p>
        </div>
      }
    >
      <ErrorThrower />
    </GraphErrorBoundary>
  ),
};

function LongErrorThrower(): JSX.Element {
  throw new Error(
    "A very long error message that tests how the error boundary handles overflow text: " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt " +
    "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
  );
}

export const LongErrorMessage: Story = {
  render: () => (
    <GraphErrorBoundary>
      <LongErrorThrower />
    </GraphErrorBoundary>
  ),
};
