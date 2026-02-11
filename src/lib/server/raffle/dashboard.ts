import { eq, sql, and } from 'drizzle-orm';
import { drops, dropEntries, users } from '$lib/server/db/schema.js';
import type { db as DbType } from '$lib/server/db/index.js';

export interface RaffleStats {
	dropId: string;
	dropTitle: string;
	totalEntries: number;
	uniqueEntrants: number;
	winners: number;
	losers: number;
	waitlisted: number;
	claimed: number;
	expired: number;
	conversionRate: number;
	tierBreakdown: {
		standard: number;
		vip: number;
		platinum: number;
	};
}

export async function getRaffleStats(db: typeof DbType, dropId: string): Promise<RaffleStats | null> {
	const drop = await db.query.drops.findFirst({
		where: eq(drops.id, dropId),
	});

	if (!drop) return null;

	const entries = await db.query.dropEntries.findMany({
		where: eq(dropEntries.dropId, dropId),
	});

	const entrantUserIds = [...new Set(entries.map((e) => e.userId))];

	// Get tier breakdown
	let tierBreakdown = { standard: 0, vip: 0, platinum: 0 };
	if (entrantUserIds.length > 0) {
		const entrantUsers = await db.query.users.findMany({
			where: sql`${users.id} = ANY(${entrantUserIds})`,
		});

		for (const user of entrantUsers) {
			tierBreakdown[user.tier]++;
		}
	}

	const winners = entries.filter((e) => e.raffleStatus === 'won').length;
	const losers = entries.filter((e) => e.raffleStatus === 'lost').length;
	const waitlisted = entries.filter((e) => e.raffleStatus === 'waitlisted').length;
	const claimed = entries.filter((e) => e.raffleStatus === 'claimed').length;
	const expired = entries.filter((e) => e.raffleStatus === 'expired').length;
	const purchased = entries.filter((e) => e.status === 'purchased').length;

	return {
		dropId,
		dropTitle: drop.title,
		totalEntries: entries.length,
		uniqueEntrants: entrantUserIds.length,
		winners,
		losers,
		waitlisted,
		claimed,
		expired,
		conversionRate: entries.length > 0 ? (purchased / entries.length) * 100 : 0,
		tierBreakdown,
	};
}
