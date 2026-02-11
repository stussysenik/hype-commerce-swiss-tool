import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../init.js';
import { users, wishlists } from '$lib/server/db/schema.js';

export const userRouter = router({
	// Wishlist operations
	'wishlist.list': protectedProcedure.query(async ({ ctx }) => {
		const items = await ctx.db.query.wishlists.findMany({
			where: eq(wishlists.userId, ctx.userId),
			orderBy: (w, { desc }) => [desc(w.createdAt)],
		});

		return items;
	}),

	'wishlist.add': protectedProcedure
		.input(
			z.object({
				shopifyProductId: z.string(),
				productTitle: z.string().optional(),
				productImage: z.string().url().optional(),
				productHandle: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check for duplicate
			const existing = await ctx.db.query.wishlists.findFirst({
				where: and(
					eq(wishlists.userId, ctx.userId),
					eq(wishlists.shopifyProductId, input.shopifyProductId),
				),
			});

			if (existing) {
				throw new TRPCError({ code: 'CONFLICT', message: 'Already in wishlist' });
			}

			const [item] = await ctx.db
				.insert(wishlists)
				.values({
					userId: ctx.userId,
					...input,
				})
				.returning();

			return item;
		}),

	'wishlist.remove': protectedProcedure
		.input(z.object({ shopifyProductId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(wishlists)
				.where(
					and(
						eq(wishlists.userId, ctx.userId),
						eq(wishlists.shopifyProductId, input.shopifyProductId),
					),
				);

			return { success: true };
		}),

	'wishlist.check': protectedProcedure
		.input(z.object({ shopifyProductId: z.string() }))
		.query(async ({ ctx, input }) => {
			const item = await ctx.db.query.wishlists.findFirst({
				where: and(
					eq(wishlists.userId, ctx.userId),
					eq(wishlists.shopifyProductId, input.shopifyProductId),
				),
			});

			return { inWishlist: !!item };
		}),

	// Tier operations
	'tier.get': protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.query.users.findFirst({
			where: eq(users.id, ctx.userId),
		});

		if (!user) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
		}

		return {
			tier: user.tier,
			totalDropsEntered: user.totalDropsEntered,
			totalDropsWon: user.totalDropsWon,
		};
	}),
});
