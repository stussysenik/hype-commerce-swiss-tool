import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

function getDb() {
	if (_db) return _db;

	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL environment variable is required');
	}

	const client = postgres(env.DATABASE_URL);
	_db = drizzle(client, { schema });
	return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
	get(_, prop) {
		if (building) {
			throw new Error('Cannot access database during build');
		}
		return Reflect.get(getDb(), prop);
	},
});
