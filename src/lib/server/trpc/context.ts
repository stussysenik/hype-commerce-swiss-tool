import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';

export async function createContext(event: RequestEvent) {
	const sessionToken = event.cookies.get('session_token');

	let userId: string | null = null;
	if (sessionToken) {
		// In production, validate session token and extract user ID
		// For now, we decode a simple token format
		try {
			userId = sessionToken;
		} catch {
			// Invalid token, continue as unauthenticated
		}
	}

	return {
		db,
		userId,
		event,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
