import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { drops } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const [drop] = await db
		.select()
		.from(drops)
		.where(eq(drops.slug, params.slug))
		.limit(1)
		.catch(() => []);

	if (!drop) {
		error(404, { message: `Drop "${params.slug}" not found` });
	}

	return {
		drop: {
			id: drop.id,
			title: drop.title,
			slug: drop.slug,
			description: drop.description ?? 'Drop details will be available soon.',
			type: drop.type,
			status: (drop.status === 'live'
				? 'live'
				: drop.status === 'ended' || drop.status === 'cancelled'
					? 'ended'
					: 'upcoming') as 'upcoming' | 'live' | 'ended',
			startsAt: drop.startsAt.toISOString(),
			image: null as string | null,
		},
	};
};
