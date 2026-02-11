import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getQueuePosition, getQueueSize } from '$lib/server/queue/index.js';

/**
 * Polling fallback for queue position updates.
 * Clients poll this endpoint every 2-5 seconds for position updates.
 */
export const GET: RequestHandler = async ({ url }) => {
	const dropId = url.searchParams.get('dropId');
	const userId = url.searchParams.get('userId');

	if (!dropId || !userId) {
		throw error(400, 'dropId and userId are required');
	}

	const [position, queueSize] = await Promise.all([
		getQueuePosition(dropId, userId),
		getQueueSize(dropId),
	]);

	return json({
		position,
		queueSize,
		inQueue: position !== null,
		estimatedWaitMinutes: position ? Math.ceil(position * 0.5) : null,
		timestamp: new Date().toISOString(),
	});
};
