import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { env } from '$env/dynamic/public';

export const sanityClient = createClient({
	projectId: env.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
	dataset: env.PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2025-01-01',
	useCdn: true,
});

export const previewClient = createClient({
	projectId: env.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
	dataset: env.PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2025-01-01',
	useCdn: false,
	perspective: 'previewDrafts',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: { asset: { _ref: string } }) {
	return builder.image(source);
}

export function getClient(preview: boolean = false) {
	return preview ? previewClient : sanityClient;
}
