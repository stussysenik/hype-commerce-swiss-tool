import type { Meta, StoryObj } from '@storybook/svelte';
import { Badge } from '$lib/components/ui/badge/index.js';

const meta = {
	title: 'UI/Badge',
	component: Badge,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'secondary', 'destructive', 'outline'],
		},
	},
} satisfies Meta<Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { variant: 'default' },
};

export const Secondary: Story = {
	args: { variant: 'secondary' },
};

export const Destructive: Story = {
	args: { variant: 'destructive' },
};

export const Outline: Story = {
	args: { variant: 'outline' },
};
