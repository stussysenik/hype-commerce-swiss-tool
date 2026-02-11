import type { Meta, StoryObj } from '@storybook/svelte';
import EditorialSplit from '$lib/components/sections/EditorialSplit.svelte';

const meta = {
	title: 'Sections/EditorialSplit',
	component: EditorialSplit,
	tags: ['autodocs'],
} satisfies Meta<EditorialSplit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'The Art of the Drop',
		body: 'Behind every limited release is a story of craftsmanship, collaboration, and culture. We explore the creative process that makes each piece a collector\'s item.',
		imageSrc: 'https://placehold.co/800x800/222/444?text=Editorial',
		imageAlt: 'Editorial content',
		ctaText: 'Read the Story',
		ctaHref: '/stories/art-of-the-drop',
	},
};

export const Reversed: Story = {
	args: {
		title: 'Stone Island AW26',
		body: 'Functional research meets Italian craft. The Autumn/Winter collection pushes textile innovation to its limits.',
		imageSrc: 'https://placehold.co/800x800/333/555?text=Stone+Island',
		imageAlt: 'Stone Island collection',
		ctaText: 'Shop Collection',
		ctaHref: '/collections/stone-island-aw26',
		reverse: true,
	},
};
