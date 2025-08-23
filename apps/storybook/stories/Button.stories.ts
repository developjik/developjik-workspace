import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '@repo/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with customizable styling and behavior.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    appName: {
      control: 'text',
      description: 'The name of the app for the alert message',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    appName: 'Storybook',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Click me',
    className: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    className: 'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    className: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg transition-colors',
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    className: 'bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm transition-colors',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    className: 'bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed',
    disabled: true,
  },
};