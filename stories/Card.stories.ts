import type { Meta, StoryObj } from '@storybook/svelte';
import CardDemo from './demos/CardDemo.svelte';

const meta = {
	title: 'UI/Card',
	component: CardDemo,
	tags: ['autodocs'],
} satisfies Meta<CardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
