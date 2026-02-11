import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// In production: const articles = await getArticles();
	return {
		articles: [] as {
			title: string;
			slug: string;
			excerpt: string;
			coverImage: string | null;
			category: string;
			publishedAt: string;
		}[],
	};
};
