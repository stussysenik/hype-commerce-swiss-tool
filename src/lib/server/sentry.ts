import { env } from '$env/dynamic/private';

const SENTRY_DSN = env.SENTRY_DSN ?? '';
const SENTRY_ENV = env.SENTRY_ENVIRONMENT ?? 'development';

interface SentryEvent {
	level: 'error' | 'warning' | 'info';
	message: string;
	extra?: Record<string, unknown>;
	tags?: Record<string, string>;
	timestamp: number;
}

/**
 * Lightweight server-side error reporting to Sentry via HTTP API.
 * Avoids pulling in the full @sentry/sveltekit SDK for minimal overhead.
 */
export async function captureException(
	error: unknown,
	context?: { tags?: Record<string, string>; extra?: Record<string, unknown> }
): Promise<void> {
	if (!SENTRY_DSN) return;

	const message = error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : undefined;

	const event: SentryEvent = {
		level: 'error',
		message,
		extra: { ...context?.extra, stack },
		tags: { environment: SENTRY_ENV, ...context?.tags },
		timestamp: Date.now() / 1000,
	};

	try {
		const { host, pathname, username } = new URL(SENTRY_DSN);
		const projectId = pathname.replace('/', '');
		const publicKey = username;

		await fetch(`https://${host}/api/${projectId}/store/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=hype-commerce/0.1.0, sentry_key=${publicKey}`,
			},
			body: JSON.stringify(event),
		});
	} catch {
		// Silently fail - don't let error reporting cause errors
	}
}

export function captureMessage(
	message: string,
	level: 'warning' | 'info' = 'info',
	context?: { tags?: Record<string, string>; extra?: Record<string, unknown> }
): void {
	if (!SENTRY_DSN) return;

	captureException(new Error(message), context).catch(() => {});
}
