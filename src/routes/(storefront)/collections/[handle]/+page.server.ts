import type { PageServerLoad } from './$types.js';
import { getCollection } from '$lib/shopify/queries/collections.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const after = url.searchParams.get('after') ?? undefined;

	const collection = await getCollection(params.handle, 24, after).catch(() => null);

	if (!collection) {
		error(404, { message: `Collection "${params.handle}" not found` });
	}

	return {
		collection: {
			title: collection.title,
			handle: collection.handle,
			description: collection.description,
		},
		products: collection.products.edges.map(({ node: p }) => ({
			id: p.id,
			title: p.title,
			handle: p.handle,
			price: `$${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)}`,
			image: {
				url: p.featuredImage?.url ?? 'https://placehold.co/400x400/222/444?text=Product',
				alt: p.featuredImage?.altText ?? p.title,
			},
			badge: !p.availableForSale ? 'Sold Out' : undefined,
		})),
		pageInfo: collection.products.pageInfo,
	};
};
