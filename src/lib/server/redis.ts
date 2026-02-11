import Redis from 'ioredis';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

let _redis: Redis | undefined;

export function getRedis(): Redis {
	if (_redis) return _redis;

	if (building) {
		throw new Error('Cannot access Redis during build');
	}

	if (!env.REDIS_URL) {
		throw new Error('REDIS_URL environment variable is required');
	}

	_redis = new Redis(env.REDIS_URL, {
		maxRetriesPerRequest: null,
		enableReadyCheck: false,
		retryStrategy(times) {
			const delay = Math.min(times * 50, 2000);
			return delay;
		},
	});

	_redis.on('error', (err) => {
		console.error('Redis connection error:', err);
	});

	return _redis;
}

export function getRedisConnection() {
	return getRedis().duplicate();
}
