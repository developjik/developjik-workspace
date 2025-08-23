import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from '@repo/ui/modal';
import { Button } from '@repo/ui/button';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal component with backdrop, keyboard navigation, and focus management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWithTrigger = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false);

  return (
    <>
      <Button appName="Storybook" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const Default: Story = {
  render: ModalWithTrigger,
  args: {
    children: (
      <div>
        <p>This is a basic modal with some content.</p>
        <p>Press Escape or click outside to close.</p>
      </div>
    ),
  },
};

export const WithTitle: Story = {
  render: ModalWithTrigger,
  args: {
    title: 'Confirmation',
    children: (
      <div>
        <p>Are you sure you want to perform this action?</p>
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    ),
  },
};

export const LargeContent: Story = {
  render: ModalWithTrigger,
  args: {
    title: 'Large Modal',
    className: 'max-w-2xl',
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-4">Terms of Service</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
            in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
            sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Accept
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Decline
          </button>
        </div>
      </div>
    ),
  },
};

export const FormModal: Story = {
  render: ModalWithTrigger,
  args: {
    title: 'Add New User',
    children: (
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Admin</option>
            <option>User</option>
            <option>Guest</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create User
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    ),
  },
};