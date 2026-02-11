import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// In production: fetch from drops table
	return {
		drops: [] as {
			id: string;
			title: string;
			slug: string;
			description: string;
			date: string;
			status: 'upcoming' | 'live' | 'ended';
			type: 'queue' | 'raffle' | 'fcfs';
		}[],
	};
};
