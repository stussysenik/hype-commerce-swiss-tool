import type { Meta, StoryObj } from '@storybook/svelte';
import Hero from '$lib/components/sections/Hero.svelte';

const meta = {
	title: 'Sections/Hero',
	component: Hero,
	tags: ['autodocs'],
	argTypes: {
		overlay: { control: 'boolean' },
	},
} satisfies Meta<Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Supreme x Nike',
		subtitle: 'SB Dunk Low - Limited Edition Drop',
		ctaText: 'Enter Queue',
		ctaHref: '/drops/supreme-nike-sb',
		secondaryCtaText: 'Learn More',
		secondaryCtaHref: '/stories/supreme-nike',
		imageSrc: 'https://placehold.co/1920x1080/111/333?text=Hero+Image',
		imageAlt: 'Supreme x Nike collaboration',
		overlay: true,
	},
};

export const WithCountdown: Story = {
	args: {
		title: 'Drop in',
		subtitle: 'Palace x Reebok Classic - Queue opens soon',
		ctaText: 'Set Reminder',
		imageSrc: 'https://placehold.co/1920x1080/111/333?text=Countdown+Hero',
		imageAlt: 'Palace x Reebok drop',
		countdown: {
			target: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
			label: 'Queue opens Friday 11:00 AM EST',
		},
	},
};

export const MinimalText: Story = {
	args: {
		title: 'The Vault',
		subtitle: 'Archive of past collections',
		imageSrc: 'https://placehold.co/1920x1080/000/222?text=Minimal+Hero',
		imageAlt: 'Archive vault',
	},
};
