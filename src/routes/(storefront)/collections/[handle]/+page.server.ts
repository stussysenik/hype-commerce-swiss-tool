import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	// In production: const collection = await getCollection(params.handle);
	return {
		collection: {
			title: params.handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			handle: params.handle,
			description: '',
		},
		products: [] as {
			id: string;
			title: string;
			handle: string;
			price: string;
			image: { url: string; alt: string };
			badge?: string;
		}[],
		pageInfo: { hasNextPage: false, endCursor: null as string | null },
	};
};
