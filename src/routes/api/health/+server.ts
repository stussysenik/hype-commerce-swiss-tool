import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
	const uptime = process.uptime();

	return json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		version: '0.1.0',
		uptime: Math.floor(uptime),
		memory: {
			rss: Math.floor(process.memoryUsage().rss / 1024 / 1024),
		},
	});
};
