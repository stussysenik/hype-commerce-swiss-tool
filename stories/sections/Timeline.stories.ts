import type { Meta, StoryObj } from '@storybook/svelte';
import Timeline from '$lib/components/sections/Timeline.svelte';

const meta = {
	title: 'Sections/Timeline',
	component: Timeline,
	tags: ['autodocs'],
} satisfies Meta<Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DropCalendar: Story = {
	args: {
		title: 'Drop Calendar',
		subtitle: 'Upcoming and recent releases',
		events: [
			{
				date: 'Feb 14, 2026',
				title: 'Supreme x Nike SB Dunk Low',
				description: 'Limited to 500 pairs worldwide',
				status: 'upcoming' as const,
				href: '/drops/supreme-nike-sb',
			},
			{
				date: 'Feb 12, 2026',
				title: 'Palace x Reebok Classic',
				description: 'Online raffle now open',
				status: 'live' as const,
				href: '/drops/palace-reebok',
			},
			{
				date: 'Feb 10, 2026',
				title: 'Stone Island Ghost Piece',
				description: 'Sold out in 3 minutes',
				status: 'ended' as const,
				href: '/drops/stone-island-ghost',
			},
			{
				date: 'Feb 7, 2026',
				title: 'Ferrari x Puma Collab',
				description: 'Exclusive capsule collection',
				status: 'ended' as const,
				href: '/drops/ferrari-puma',
			},
		],
	},
};
