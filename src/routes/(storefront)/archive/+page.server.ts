import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	return {
		archivedProducts: [] as {
			id: string;
			title: string;
			handle: string;
			price: string;
			image: { url: string; alt: string };
			badge?: string;
		}[],
	};
};
