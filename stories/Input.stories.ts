import type { Meta, StoryObj } from '@storybook/svelte';
import { Input } from '$lib/components/ui/input/index.js';

const meta = {
	title: 'UI/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
		},
		placeholder: { control: 'text' },
		disabled: { control: 'boolean' },
	},
} satisfies Meta<Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: 'Enter text...',
	},
};

export const Email: Story = {
	args: {
		type: 'email',
		placeholder: 'you@example.com',
	},
};

export const Password: Story = {
	args: {
		type: 'password',
		placeholder: 'Enter password',
	},
};

export const Disabled: Story = {
	args: {
		placeholder: 'Disabled input',
		disabled: true,
	},
};
