import type { Handle, HandleServerError } from '@sveltejs/kit';
import { captureException } from '$lib/server/sentry';

export const handle: Handle = async ({ event, resolve }) => {
	// Add caching headers based on route type
	const response = await resolve(event);

	const pathname = event.url.pathname;

	// Static assets - long cache
	if (pathname.startsWith('/_app/')) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}
	// Product pages - short cache
	else if (pathname.startsWith('/products/')) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=300, s-maxage=600, stale-while-revalidate=60',
		);
	}
	// Collection pages - medium cache
	else if (pathname.startsWith('/collections/')) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=900, s-maxage=1800, stale-while-revalidate=60',
		);
	}
	// API routes - no cache
	else if (pathname.startsWith('/api/')) {
		response.headers.set('Cache-Control', 'no-store');
	}
	// Stories/editorial - medium cache
	else if (pathname.startsWith('/stories/')) {
		response.headers.set(
			'Cache-Control',
			'public, max-age=1800, s-maxage=3600, stale-while-revalidate=120',
		);
	}

	// Security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();

	await captureException(error, {
		tags: {
			url: event.url.pathname,
			method: event.request.method,
			status: String(status),
		},
		extra: {
			errorId,
			userAgent: event.request.headers.get('user-agent') ?? undefined,
		},
	});

	return {
		message: status === 404 ? 'Not Found' : 'Internal Error',
		errorId,
	};
};
