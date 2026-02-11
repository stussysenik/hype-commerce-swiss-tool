import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// In production, these would fetch from Shopify + Sanity + DB
	// For now, return placeholder data structure
	return {
		hero: {
			title: 'The Drop is Everything',
			subtitle: 'Exclusive releases. Fair access. No bots.',
			imageSrc: 'https://placehold.co/1920x1080/111/333?text=Hero',
		},
		nextDrop: null as { title: string; startsAt: string } | null,
		featuredProducts: [] as {
			id: string;
			title: string;
			handle: string;
			price: string;
			image: { url: string; alt: string };
			badge?: string;
		}[],
		editorial: null as {
			title: string;
			body: string;
			imageSrc: string;
			imageAlt: string;
			href: string;
		} | null,
		upcomingDrops: [] as {
			date: string;
			title: string;
			description?: string;
			status?: 'upcoming' | 'live' | 'ended';
			href?: string;
		}[],
	};
};
