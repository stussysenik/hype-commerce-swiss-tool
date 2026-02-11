import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { env } from '$env/dynamic/public';

if (!env.PUBLIC_SHOPIFY_STORE_DOMAIN) {
	throw new Error('PUBLIC_SHOPIFY_STORE_DOMAIN environment variable is required');
}

if (!env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
	throw new Error('PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable is required');
}

export const shopifyClient = createStorefrontApiClient({
	storeDomain: env.PUBLIC_SHOPIFY_STORE_DOMAIN,
	apiVersion: '2025-01',
	publicAccessToken: env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});
