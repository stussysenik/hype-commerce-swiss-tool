import { Queue, Worker, type Job } from 'bullmq';
import { getRedis } from '$lib/server/redis.js';
import { eq } from 'drizzle-orm';
import { dropEntries } from '$lib/server/db/schema.js';
import type { db as DbType } from '$lib/server/db/index.js';

const QUEUE_NAME = 'drop-queue';
const PURCHASE_WINDOW_MINUTES = 10;

interface DropQueueJob {
	dropId: string;
	userId: string;
	entryId: string;
}

let _queue: Queue | undefined;

export function getDropQueue(): Queue {
	if (_queue) return _queue;

	_queue = new Queue(QUEUE_NAME, {
		connection: getRedis(),
		defaultJobOptions: {
			removeOnComplete: { count: 1000 },
			removeOnFail: { count: 5000 },
			attempts: 3,
			backoff: {
				type: 'exponential',
				delay: 1000,
			},
		},
	});

	return _queue;
}

export async function addToDropQueue(dropId: string, userId: string, entryId: string) {
	const queue = getDropQueue();
	const timestamp = Date.now();

	// Use ZADD with timestamp for deterministic FIFO ordering
	const redis = getRedis();
	await redis.zadd(`drop:${dropId}:queue`, timestamp, userId);

	// Also add as BullMQ job for processing
	await queue.add(
		'process-entry',
		{ dropId, userId, entryId } satisfies DropQueueJob,
		{
			jobId: `${dropId}:${userId}`,
			priority: timestamp,
		},
	);

	return { position: await getQueuePosition(dropId, userId) };
}

export async function getQueuePosition(dropId: string, userId: string): Promise<number | null> {
	const redis = getRedis();
	const rank = await redis.zrank(`drop:${dropId}:queue`, userId);
	return rank !== null ? rank + 1 : null;
}

export async function getQueueSize(dropId: string): Promise<number> {
	const redis = getRedis();
	return redis.zcard(`drop:${dropId}:queue`);
}

export async function removeFromQueue(dropId: string, userId: string) {
	const redis = getRedis();
	await redis.zrem(`drop:${dropId}:queue`, userId);
}

export function createPurchaseWindow(
	dropId: string,
	userId: string,
): { token: string; expiresAt: Date } {
	const token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + PURCHASE_WINDOW_MINUTES * 60 * 1000);

	const redis = getRedis();
	const key = `purchase:${dropId}:${userId}`;

	// Store token with TTL
	redis.setex(key, PURCHASE_WINDOW_MINUTES * 60, token);

	return { token, expiresAt };
}

export async function validatePurchaseToken(
	dropId: string,
	userId: string,
	token: string,
): Promise<boolean> {
	const redis = getRedis();
	const key = `purchase:${dropId}:${userId}`;
	const storedToken = await redis.get(key);
	return storedToken === token;
}

export function createDropQueueWorker(db: typeof DbType) {
	return new Worker<DropQueueJob>(
		QUEUE_NAME,
		async (job: Job<DropQueueJob>) => {
			const { dropId, userId, entryId } = job.data;

			// Create purchase window for user
			const { token, expiresAt } = createPurchaseWindow(dropId, userId);

			// Update entry in database
			await db
				.update(dropEntries)
				.set({
					status: 'purchase_window',
					purchaseToken: token,
					purchaseTokenExpiresAt: expiresAt,
					updatedAt: new Date(),
				})
				.where(eq(dropEntries.id, entryId));

			return { token, expiresAt };
		},
		{
			connection: getRedis(),
			concurrency: 10,
			limiter: {
				max: 100,
				duration: 1000,
			},
		},
	);
}
