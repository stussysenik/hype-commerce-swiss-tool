import type { Meta, StoryObj } from '@storybook/svelte';
import { Button } from '$lib/components/ui/button/index.js';

const meta = {
	title: 'UI/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon'],
		},
	},
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: 'default',
		size: 'default',
	},
	render: (args) => ({
		Component: Button,
		props: { ...args, children: createTextSnippet('Button') },
	}),
};

export const Destructive: Story = {
	args: { variant: 'destructive' },
};

export const Outline: Story = {
	args: { variant: 'outline' },
};

export const Secondary: Story = {
	args: { variant: 'secondary' },
};

export const Ghost: Story = {
	args: { variant: 'ghost' },
};

export const Link: Story = {
	args: { variant: 'link' },
};

export const Small: Story = {
	args: { size: 'sm' },
};

export const Large: Story = {
	args: { size: 'lg' },
};

function createTextSnippet(text: string) {
	return (() => {
		const el = document.createTextNode(text);
		return el;
	}) as unknown as typeof Button.prototype.$$prop_def.children;
}
