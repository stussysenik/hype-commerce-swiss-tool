import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { drops } from '$lib/server/db/schema.js';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allDrops = await db
		.select()
		.from(drops)
		.orderBy(desc(drops.startsAt))
		.limit(50)
		.catch(() => []);

	return {
		drops: allDrops.map((d) => ({
			id: d.id,
			title: d.title,
			slug: d.slug,
			description: d.description ?? '',
			date: d.startsAt.toISOString(),
			status: (d.status === 'live'
				? 'live'
				: d.status === 'ended' || d.status === 'cancelled'
					? 'ended'
					: 'upcoming') as 'upcoming' | 'live' | 'ended',
			type: d.type,
		})),
	};
};
