import type { PageServerLoad } from './$types.js';
import { getProducts } from '$lib/shopify/queries/products.js';
import { getGlobalSettings, getFeaturedDropStories } from '$lib/sanity/queries.js';
import { db } from '$lib/server/db/index.js';
import { drops } from '$lib/server/db/schema.js';
import { desc, eq, gte } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const [shopifyProducts, settings, stories, upcomingDropRows] = await Promise.all([
		getProducts(8).catch(() => ({
			products: [],
			pageInfo: { hasNextPage: false, endCursor: null },
		})),
		getGlobalSettings().catch(() => null),
		getFeaturedDropStories(1).catch(() => []),
		db
			.select()
			.from(drops)
			.where(gte(drops.startsAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
			.orderBy(desc(drops.startsAt))
			.limit(10)
			.catch(() => []),
	]);

	const nextDrop = upcomingDropRows.find((d) => d.status === 'scheduled' || d.status === 'live');

	const editorial = stories[0]
		? {
				title: stories[0].title,
				body: stories[0].excerpt ?? '',
				imageSrc: stories[0].coverImage ?? 'https://placehold.co/800x600/111/333?text=Editorial',
				imageAlt: stories[0].coverImageAlt ?? stories[0].title,
				href: `/stories/${stories[0].slug?.current ?? stories[0].slug}`,
			}
		: null;

	return {
		hero: {
			title: settings?.siteName ?? 'The Drop is Everything',
			subtitle: settings?.siteDescription ?? 'Exclusive releases. Fair access. No bots.',
			imageSrc: settings?.heroImage ?? 'https://placehold.co/1920x1080/111/333?text=Hero',
		},
		nextDrop: nextDrop
			? { title: nextDrop.title, startsAt: nextDrop.startsAt.toISOString() }
			: null,
		featuredProducts: shopifyProducts.products.map((p) => ({
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
		editorial,
		upcomingDrops: upcomingDropRows.map((d) => ({
			date: d.startsAt.toISOString(),
			title: d.title,
			description: d.description ?? undefined,
			status: (d.status === 'live' ? 'live' : d.status === 'ended' ? 'ended' : 'upcoming') as
				| 'upcoming'
				| 'live'
				| 'ended',
			href: `/drops/${d.slug}`,
		})),
	};
};
