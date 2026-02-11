import type { PageServerLoad } from './$types.js';
import { getProduct } from '$lib/shopify/queries/products.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProduct(params.handle).catch(() => null);

	if (!product) {
		error(404, { message: `Product "${params.handle}" not found` });
	}

	const variants = product.variants.edges.map(({ node: v }) => ({
		id: v.id,
		title: v.title,
		available: v.availableForSale,
		price: `$${parseFloat(v.price.amount).toFixed(2)}`,
		compareAtPrice: v.compareAtPrice ? `$${parseFloat(v.compareAtPrice.amount).toFixed(2)}` : null,
		selectedOptions: v.selectedOptions,
	}));

	const images = product.images.edges.map(({ node: img }) => ({
		url: img.url,
		alt: img.altText ?? product.title,
	}));

	return {
		product: {
			title: product.title,
			handle: product.handle,
			vendor: product.vendor,
			price: `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`,
			compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount
				? `$${parseFloat(product.compareAtPriceRange.minVariantPrice.amount).toFixed(2)}`
				: null,
			descriptionHtml: product.descriptionHtml,
			images,
			variants,
		},
	};
};
