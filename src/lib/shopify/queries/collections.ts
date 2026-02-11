import { shopifyClient } from '../client.js';
import type { ShopifyCollection, ShopifyProduct, PageInfo } from '../types.js';

export async function getCollection(
	handle: string,
	first: number = 24,
	after?: string,
	filters?: { available?: boolean; priceRange?: { min: number; max: number } },
): Promise<ShopifyCollection | null> {
	const productFilters: Record<string, unknown>[] = [];

	if (filters?.available) {
		productFilters.push({ available: true });
	}
	if (filters?.priceRange) {
		productFilters.push({
			price: { min: filters.priceRange.min, max: filters.priceRange.max },
		});
	}

	const { data } = await shopifyClient.request(
		`
    query GetCollection($handle: String!, $first: Int!, $after: String, $filters: [ProductFilter!]) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
          width
          height
        }
        products(first: $first, after: $after, filters: $filters, sortKey: CREATED) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              featuredImage {
                url
                altText
                width
                height
              }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              compareAtPriceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price { amount currencyCode }
                    compareAtPrice { amount currencyCode }
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
    `,
		{ variables: { handle, first, after, filters: productFilters.length > 0 ? productFilters : undefined } },
	);

	return data?.collection ?? null;
}

export async function getCollections(): Promise<
	{ id: string; title: string; handle: string; image: ShopifyCollection['image'] }[]
> {
	const { data } = await shopifyClient.request(`
    query GetCollections {
      collections(first: 50, sortKey: TITLE) {
        edges {
          node {
            id
            title
            handle
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `);

	return data?.collections?.edges?.map((e: { node: ShopifyCollection }) => e.node) ?? [];
}
