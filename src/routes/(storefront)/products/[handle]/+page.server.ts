import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	// In production: const product = await getProduct(params.handle);
	return {
		product: {
			title: params.handle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			handle: params.handle,
			vendor: 'Brand',
			price: '$0.00',
			compareAtPrice: null as string | null,
			descriptionHtml: '<p>Product description will appear here when connected to Shopify.</p>',
			images: [] as { url: string; alt: string }[],
			variants: [] as { id: string; title: string; available: boolean }[],
		},
	};
};
