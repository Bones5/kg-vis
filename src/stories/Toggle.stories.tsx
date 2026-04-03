import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "@/shared/components/Toggle";

const meta = {
  title: "Shared/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  args: {
    checked: false,
    onChange: () => undefined,
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Show edges",
  },
};
