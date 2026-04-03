import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "@/shared/components/Modal";

const meta = {
  title: "Shared/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: true,
    onClose: () => undefined,
    children: <p style={{ color: "#e2e8f0" }}>Modal body content</p>,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    title: "Example Modal",
  },
};

export const Closed: Story = {
  args: {
    open: false,
  },
};

export const WithTitle: Story = {
  args: {
    title: "Settings",
  },
};

export const WithoutTitle: Story = {};

export const LongContent: Story = {
  args: {
    title: "Long Content",
    children: (
      <div style={{ color: "#e2e8f0" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    ),
  },
};
