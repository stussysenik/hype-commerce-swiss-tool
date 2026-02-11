import { getRedis } from '$lib/server/redis.js';

interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetAt: Date;
}

/**
 * Redis-based sliding window rate limiter
 */
export async function checkRateLimit(
	key: string,
	maxRequests: number,
	windowSeconds: number,
): Promise<RateLimitResult> {
	const redis = getRedis();
	const now = Date.now();
	const windowStart = now - windowSeconds * 1000;
	const redisKey = `ratelimit:${key}`;

	const multi = redis.multi();

	// Remove old entries outside the window
	multi.zremrangebyscore(redisKey, 0, windowStart);
	// Add current request
	multi.zadd(redisKey, now, `${now}:${Math.random()}`);
	// Count requests in window
	multi.zcard(redisKey);
	// Set TTL on key
	multi.expire(redisKey, windowSeconds);

	const results = await multi.exec();
	const count = (results?.[2]?.[1] as number) ?? 0;

	const allowed = count <= maxRequests;
	const remaining = Math.max(0, maxRequests - count);
	const resetAt = new Date(now + windowSeconds * 1000);

	return { allowed, remaining, resetAt };
}

/**
 * Rate limit for queue entry: 10 requests per minute
 */
export async function checkQueueEntryRateLimit(userId: string): Promise<RateLimitResult> {
	return checkRateLimit(`queue-entry:${userId}`, 10, 60);
}

/**
 * General API rate limit: 100 requests per minute
 */
export async function checkGeneralRateLimit(ip: string): Promise<RateLimitResult> {
	return checkRateLimit(`api:${ip}`, 100, 60);
}
