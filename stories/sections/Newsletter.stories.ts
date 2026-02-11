import type { Meta, StoryObj } from '@storybook/svelte';
import Newsletter from '$lib/components/sections/Newsletter.svelte';

const meta = {
	title: 'Sections/Newsletter',
	component: Newsletter,
	tags: ['autodocs'],
} satisfies Meta<Newsletter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Stay in the loop',
		subtitle: 'Get notified about upcoming drops and exclusive releases.',
	},
};

export const Custom: Story = {
	args: {
		title: 'VIP Access',
		subtitle: 'Join the inner circle for early queue access and exclusive drops.',
		placeholder: 'your@email.com',
		buttonText: 'Join VIP',
	},
};
