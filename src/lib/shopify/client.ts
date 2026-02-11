import {
	createStorefrontApiClient,
	type StorefrontApiClient,
} from '@shopify/storefront-api-client';
import { env } from '$env/dynamic/public';
import { building } from '$app/environment';

let _client: StorefrontApiClient | undefined;

function getClient(): StorefrontApiClient {
	if (_client) return _client;

	if (!env.PUBLIC_SHOPIFY_STORE_DOMAIN) {
		throw new Error('PUBLIC_SHOPIFY_STORE_DOMAIN environment variable is required');
	}

	if (!env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
		throw new Error('PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable is required');
	}

	_client = createStorefrontApiClient({
		storeDomain: env.PUBLIC_SHOPIFY_STORE_DOMAIN,
		apiVersion: '2025-01',
		publicAccessToken: env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
	});

	return _client;
}

export const shopifyClient = new Proxy({} as StorefrontApiClient, {
	get(_, prop) {
		if (building) {
			throw new Error('Cannot access Shopify client during build');
		}
		return Reflect.get(getClient(), prop);
	},
});
