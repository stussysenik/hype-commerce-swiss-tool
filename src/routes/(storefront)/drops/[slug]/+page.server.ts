import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	// In production: fetch from drops table + Sanity for story content
	return {
		drop: {
			id: '',
			title: params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			slug: params.slug,
			description: 'Drop details will appear here when connected to the database.',
			type: 'queue' as 'queue' | 'raffle' | 'fcfs',
			status: 'upcoming' as 'upcoming' | 'live' | 'ended',
			startsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
			image: null as string | null,
		},
	};
};
