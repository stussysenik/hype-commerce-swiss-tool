import { randomBytes } from 'crypto';
import { eq, and } from 'drizzle-orm';
import { dropEntries, drops, users } from '$lib/server/db/schema.js';
import type { db as DbType } from '$lib/server/db/index.js';
import { getRedis } from '$lib/server/redis.js';

const PURCHASE_LINK_EXPIRY_HOURS = 24;

export interface RaffleDrawResult {
	dropId: string;
	totalEntries: number;
	winnersCount: number;
	losersCount: number;
	winners: { userId: string; entryId: string; purchaseToken: string }[];
	seed: string;
}

/**
 * Provably random winner selection using crypto.
 * The seed is stored so results can be independently verified.
 */
export async function drawWinners(
	db: typeof DbType,
	dropId: string,
	maxWinners?: number,
): Promise<RaffleDrawResult> {
	// Get the drop
	const drop = await db.query.drops.findFirst({
		where: eq(drops.id, dropId),
	});

	if (!drop) {
		throw new Error('Drop not found');
	}

	const winnersCount = maxWinners ?? drop.maxWinners ?? 1;

	// Get all entries with 'entered' raffle status
	const entries = await db.query.dropEntries.findMany({
		where: and(eq(dropEntries.dropId, dropId), eq(dropEntries.raffleStatus, 'entered')),
	});

	if (entries.length === 0) {
		return {
			dropId,
			totalEntries: 0,
			winnersCount: 0,
			losersCount: 0,
			winners: [],
			seed: '',
		};
	}

	// Generate cryptographically random seed
	const seed = randomBytes(32).toString('hex');

	// Fisher-Yates shuffle using the seed for deterministic but random ordering
	const shuffled = [...entries];
	let seedIndex = 0;

	for (let i = shuffled.length - 1; i > 0; i--) {
		// Use bytes from seed to generate swap indices
		const byte1 = parseInt(seed.substring(seedIndex * 2, seedIndex * 2 + 2), 16);
		const byte2 = parseInt(seed.substring((seedIndex + 1) * 2, (seedIndex + 1) * 2 + 2), 16);
		const randomValue = (byte1 * 256 + byte2) / 65536;
		const j = Math.floor(randomValue * (i + 1));

		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		seedIndex = (seedIndex + 2) % 32;
	}

	// Select winners
	const actualWinnersCount = Math.min(winnersCount, shuffled.length);
	const winnerEntries = shuffled.slice(0, actualWinnersCount);
	const loserEntries = shuffled.slice(actualWinnersCount);

	// Generate purchase tokens and update winners
	const winners: RaffleDrawResult['winners'] = [];
	const redis = getRedis();

	for (const entry of winnerEntries) {
		const { token, expiresAt } = generatePurchaseLink(dropId, entry.userId);

		await db
			.update(dropEntries)
			.set({
				raffleStatus: 'won',
				status: 'purchase_window',
				purchaseToken: token,
				purchaseTokenExpiresAt: expiresAt,
				updatedAt: new Date(),
			})
			.where(eq(dropEntries.id, entry.id));

		// Store token in Redis with TTL
		await redis.setex(
			`purchase:${dropId}:${entry.userId}`,
			PURCHASE_LINK_EXPIRY_HOURS * 60 * 60,
			token,
		);

		winners.push({ userId: entry.userId, entryId: entry.id, purchaseToken: token });
	}

	// Update losers
	for (const entry of loserEntries) {
		await db
			.update(dropEntries)
			.set({
				raffleStatus: 'lost',
				updatedAt: new Date(),
			})
			.where(eq(dropEntries.id, entry.id));
	}

	// Store draw result for verification
	await redis.set(
		`raffle:${dropId}:result`,
		JSON.stringify({
			seed,
			winnersCount: actualWinnersCount,
			totalEntries: entries.length,
			drawnAt: new Date().toISOString(),
		}),
	);

	// Update user stats
	for (const winner of winners) {
		await db
			.update(users)
			.set({
				totalDropsWon: users.totalDropsWon,
				updatedAt: new Date(),
			})
			.where(eq(users.id, winner.userId));
	}

	return {
		dropId,
		totalEntries: entries.length,
		winnersCount: actualWinnersCount,
		losersCount: loserEntries.length,
		winners,
		seed,
	};
}

export function generatePurchaseLink(
	dropId: string,
	userId: string,
): { token: string; expiresAt: Date; url: string } {
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + PURCHASE_LINK_EXPIRY_HOURS * 60 * 60 * 1000);
	const url = `/drops/${dropId}/purchase?token=${token}`;

	return { token, expiresAt, url };
}
