import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../init.js';
import { drops, dropEntries } from '$lib/server/db/schema.js';

export const dropsRouter = router({
	// Queue operations
	'queue.join': protectedProcedure
		.input(z.object({ dropId: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			// Check if drop exists and is live
			const drop = await ctx.db.query.drops.findFirst({
				where: eq(drops.id, input.dropId),
			});

			if (!drop) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Drop not found' });
			}

			if (drop.status !== 'live') {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Drop is not currently live' });
			}

			if (drop.type !== 'queue') {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'This drop does not use a queue' });
			}

			// Check for existing entry
			const existing = await ctx.db.query.dropEntries.findFirst({
				where: and(eq(dropEntries.dropId, input.dropId), eq(dropEntries.userId, ctx.userId)),
			});

			if (existing) {
				throw new TRPCError({ code: 'CONFLICT', message: 'Already in queue' });
			}

			// Create entry
			const [entry] = await ctx.db
				.insert(dropEntries)
				.values({
					dropId: input.dropId,
					userId: ctx.userId,
					status: 'queued',
				})
				.returning();

			return { entryId: entry.id, status: entry.status };
		}),

	'queue.status': protectedProcedure
		.input(z.object({ dropId: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			const entry = await ctx.db.query.dropEntries.findFirst({
				where: and(eq(dropEntries.dropId, input.dropId), eq(dropEntries.userId, ctx.userId)),
			});

			if (!entry) {
				return { inQueue: false, position: null, status: null };
			}

			return {
				inQueue: true,
				position: entry.queuePosition,
				status: entry.status,
				purchaseToken: entry.purchaseToken,
				purchaseTokenExpiresAt: entry.purchaseTokenExpiresAt,
			};
		}),

	'queue.leave': protectedProcedure
		.input(z.object({ dropId: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const entry = await ctx.db.query.dropEntries.findFirst({
				where: and(eq(dropEntries.dropId, input.dropId), eq(dropEntries.userId, ctx.userId)),
			});

			if (!entry) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Not in queue' });
			}

			if (entry.status === 'purchased') {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already purchased' });
			}

			await ctx.db
				.update(dropEntries)
				.set({ status: 'cancelled', updatedAt: new Date() })
				.where(eq(dropEntries.id, entry.id));

			return { success: true };
		}),

	// Raffle operations
	'raffle.enter': protectedProcedure
		.input(z.object({ dropId: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const drop = await ctx.db.query.drops.findFirst({
				where: eq(drops.id, input.dropId),
			});

			if (!drop) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Drop not found' });
			}

			if (drop.status !== 'live') {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Raffle is not currently open' });
			}

			if (drop.type !== 'raffle') {
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'This drop is not a raffle' });
			}

			// Check for duplicate entry
			const existing = await ctx.db.query.dropEntries.findFirst({
				where: and(eq(dropEntries.dropId, input.dropId), eq(dropEntries.userId, ctx.userId)),
			});

			if (existing) {
				throw new TRPCError({ code: 'CONFLICT', message: 'Already entered this raffle' });
			}

			// Check max entries
			if (drop.maxEntries) {
				const { count } = await ctx.db
					.select({ count: dropEntries.id })
					.from(dropEntries)
					.where(eq(dropEntries.dropId, input.dropId))
					.then((rows) => ({ count: rows.length }));

				if (count >= drop.maxEntries) {
					throw new TRPCError({ code: 'BAD_REQUEST', message: 'Raffle is full' });
				}
			}

			const [entry] = await ctx.db
				.insert(dropEntries)
				.values({
					dropId: input.dropId,
					userId: ctx.userId,
					status: 'pending',
					raffleStatus: 'entered',
				})
				.returning();

			return { entryId: entry.id, raffleStatus: entry.raffleStatus };
		}),

	'raffle.status': protectedProcedure
		.input(z.object({ dropId: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			const entry = await ctx.db.query.dropEntries.findFirst({
				where: and(eq(dropEntries.dropId, input.dropId), eq(dropEntries.userId, ctx.userId)),
			});

			if (!entry) {
				return { entered: false, raffleStatus: null };
			}

			return {
				entered: true,
				raffleStatus: entry.raffleStatus,
				purchaseToken: entry.purchaseToken,
				purchaseTokenExpiresAt: entry.purchaseTokenExpiresAt,
			};
		}),
});
