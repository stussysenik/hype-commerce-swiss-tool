import { z } from 'zod';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { router, publicProcedure, protectedProcedure } from '../init.js';
import { analyticsEvents, drops, dropEntries } from '$lib/server/db/schema.js';

export const analyticsRouter = router({
	'track.event': publicProcedure
		.input(
			z.object({
				eventName: z.string().min(1).max(255),
				sessionId: z.string().optional(),
				dropId: z.string().uuid().optional(),
				metadata: z.record(z.unknown()).default({}),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(analyticsEvents).values({
				eventName: input.eventName,
				userId: ctx.userId,
				sessionId: input.sessionId,
				dropId: input.dropId,
				metadata: input.metadata,
			});

			return { success: true };
		}),

	'export.csv': protectedProcedure
		.input(
			z.object({
				dropId: z.string().uuid().optional(),
				startDate: z.string().datetime().optional(),
				endDate: z.string().datetime().optional(),
				eventName: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input.dropId) {
				conditions.push(eq(analyticsEvents.dropId, input.dropId));
			}
			if (input.startDate) {
				conditions.push(gte(analyticsEvents.createdAt, new Date(input.startDate)));
			}
			if (input.endDate) {
				conditions.push(lte(analyticsEvents.createdAt, new Date(input.endDate)));
			}
			if (input.eventName) {
				conditions.push(eq(analyticsEvents.eventName, input.eventName));
			}

			const events = await ctx.db
				.select()
				.from(analyticsEvents)
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(desc(analyticsEvents.createdAt))
				.limit(10000);

			// Convert to CSV
			const headers = ['id', 'event_name', 'user_id', 'session_id', 'drop_id', 'metadata', 'created_at'];
			const rows = events.map((e) =>
				[
					e.id,
					e.eventName,
					e.userId ?? '',
					e.sessionId ?? '',
					e.dropId ?? '',
					JSON.stringify(e.metadata),
					e.createdAt.toISOString(),
				].join(','),
			);

			return {
				csv: [headers.join(','), ...rows].join('\n'),
				totalRows: events.length,
			};
		}),

	'drop.performance': protectedProcedure
		.input(z.object({ dropId: z.string().uuid().optional() }))
		.query(async ({ ctx, input }) => {
			const conditions = input.dropId ? eq(drops.id, input.dropId) : undefined;

			const results = await ctx.db
				.select({
					dropId: drops.id,
					title: drops.title,
					slug: drops.slug,
					type: drops.type,
					status: drops.status,
					startsAt: drops.startsAt,
					endsAt: drops.endsAt,
					totalEntries: sql<number>`count(${dropEntries.id})`,
					totalPurchases: sql<number>`count(${dropEntries.id}) filter (where ${dropEntries.status} = 'purchased')`,
					totalWinners: sql<number>`count(${dropEntries.id}) filter (where ${dropEntries.raffleStatus} = 'won')`,
				})
				.from(drops)
				.leftJoin(dropEntries, eq(dropEntries.dropId, drops.id))
				.where(conditions)
				.groupBy(drops.id)
				.orderBy(desc(drops.startsAt));

			return results;
		}),
});
