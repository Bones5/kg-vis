import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@/shared/components/Slider";

const meta = {
  title: "Shared/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  args: {
    min: 0,
    max: 100,
    value: 50,
    onChange: () => undefined,
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MinValue: Story = {
  args: {
    value: 0,
  },
};

export const MaxValue: Story = {
  args: {
    value: 100,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Edge density",
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
  },
};
