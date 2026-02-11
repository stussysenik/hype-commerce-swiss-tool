import type { Meta, StoryObj } from '@storybook/svelte';
import LabelDemo from './demos/LabelDemo.svelte';

const meta = {
	title: 'UI/Label',
	component: LabelDemo,
	tags: ['autodocs'],
} satisfies Meta<LabelDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
