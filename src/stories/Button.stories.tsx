import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/Button";

const meta = {
  title: "Shared/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Click me",
    onClick: () => undefined,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LongLabel: Story = {
  args: {
    label: "This is a button with an extremely long label that should test overflow behavior",
  },
};
