import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	// In production: const article = await getArticle(params.slug);
	return {
		article: {
			title: params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			slug: params.slug,
			excerpt: '',
			coverImage: null as string | null,
			category: '',
			publishedAt: new Date().toISOString(),
			bodyHtml: '<p>Article content will appear here when connected to Sanity CMS.</p>',
			author: null as { name: string; avatar: string | null } | null,
			tags: [] as string[],
		},
	};
};
