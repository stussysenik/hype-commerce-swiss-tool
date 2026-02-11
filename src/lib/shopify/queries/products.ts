import { shopifyClient } from '../client.js';
import type { ShopifyProduct, PageInfo } from '../types.js';

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
  }
`;

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
	const { data } = await shopifyClient.request(
		`
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
        metafields(identifiers: [
          { namespace: "custom", key: "size_chart" },
          { namespace: "custom", key: "care_instructions" },
          { namespace: "custom", key: "release_date" }
        ]) {
          key
          value
          namespace
          type
        }
      }
    }
    ${PRODUCT_FRAGMENT}
    `,
		{ variables: { handle } },
	);

	return data?.product ?? null;
}

export async function getProducts(
	first: number = 12,
	after?: string,
): Promise<{ products: ShopifyProduct[]; pageInfo: PageInfo }> {
	const { data } = await shopifyClient.request(
		`
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    ${PRODUCT_FRAGMENT}
    `,
		{ variables: { first, after } },
	);

	return {
		products: data?.products?.edges?.map((e: { node: ShopifyProduct }) => e.node) ?? [],
		pageInfo: data?.products?.pageInfo ?? { hasNextPage: false, endCursor: null },
	};
}

export async function searchProducts(
	query: string,
	first: number = 12,
): Promise<{ products: ShopifyProduct[]; pageInfo: PageInfo }> {
	const { data } = await shopifyClient.request(
		`
    query SearchProducts($query: String!, $first: Int!) {
      search(query: $query, first: $first, types: PRODUCT) {
        edges {
          node {
            ... on Product {
              ...ProductFields
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    ${PRODUCT_FRAGMENT}
    `,
		{ variables: { query, first } },
	);

	return {
		products: data?.search?.edges?.map((e: { node: ShopifyProduct }) => e.node) ?? [],
		pageInfo: data?.search?.pageInfo ?? { hasNextPage: false, endCursor: null },
	};
}
