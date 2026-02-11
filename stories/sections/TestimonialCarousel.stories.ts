import type { Meta, StoryObj } from '@storybook/svelte';
import TestimonialCarousel from '$lib/components/sections/TestimonialCarousel.svelte';

const meta = {
	title: 'Sections/TestimonialCarousel',
	component: TestimonialCarousel,
	tags: ['autodocs'],
} satisfies Meta<TestimonialCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'What people are saying',
		testimonials: [
			{
				quote: 'The queue system is insanely fair. First time I\'ve copped a hyped release without bots ruining it.',
				author: 'Alex Chen',
				role: 'Sneaker Collector',
			},
			{
				quote: 'Finally, a storefront that matches the energy of the brands we sell. Our conversion rate doubled.',
				author: 'Sarah Kim',
				role: 'Brand Director, KITH',
			},
			{
				quote: 'The drop calendar changed how our community engages with releases. Anticipation is everything.',
				author: 'Marcus Johnson',
				role: 'Community Manager',
			},
		],
	},
};
