import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "@/shared/components/Tooltip";

const meta = {
  title: "Shared/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  args: {
    content: "Helpful tooltip text",
    children: <button style={{ padding: "8px 16px" }}>Hover me</button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    content:
      "This is a very long tooltip that contains a lot of text to test how the browser " +
      "handles overflow for the native title attribute tooltip rendering behavior.",
  },
};
