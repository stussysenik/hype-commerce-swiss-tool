import {
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	integer,
	boolean,
	jsonb,
	pgEnum,
	index,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ============================================
// Enums
// ============================================

export const dropTypeEnum = pgEnum('drop_type', ['queue', 'raffle', 'fcfs']);
export const dropStatusEnum = pgEnum('drop_status', ['draft', 'scheduled', 'live', 'ended', 'cancelled']);
export const entryStatusEnum = pgEnum('entry_status', [
	'pending',
	'queued',
	'purchase_window',
	'purchased',
	'expired',
	'cancelled',
]);
export const raffleStatusEnum = pgEnum('raffle_status', [
	'entered',
	'won',
	'lost',
	'waitlisted',
	'claimed',
	'expired',
]);
export const userTierEnum = pgEnum('user_tier', ['standard', 'vip', 'platinum']);

// ============================================
// Users
// ============================================

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		email: varchar('email', { length: 255 }).notNull(),
		shopifyCustomerId: varchar('shopify_customer_id', { length: 255 }),
		displayName: varchar('display_name', { length: 255 }),
		tier: userTierEnum('tier').default('standard').notNull(),
		totalDropsEntered: integer('total_drops_entered').default(0).notNull(),
		totalDropsWon: integer('total_drops_won').default(0).notNull(),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('users_email_idx').on(table.email),
		index('users_shopify_id_idx').on(table.shopifyCustomerId),
		index('users_tier_idx').on(table.tier),
	],
);

// ============================================
// Drops
// ============================================

export const drops = pgTable(
	'drops',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		title: varchar('title', { length: 500 }).notNull(),
		slug: varchar('slug', { length: 255 }).notNull(),
		description: text('description'),
		type: dropTypeEnum('type').notNull(),
		status: dropStatusEnum('status').default('draft').notNull(),
		shopifyProductId: varchar('shopify_product_id', { length: 255 }),
		shopifyCollectionId: varchar('shopify_collection_id', { length: 255 }),
		maxEntries: integer('max_entries'),
		maxWinners: integer('max_winners'),
		startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
		endsAt: timestamp('ends_at', { withTimezone: true }),
		purchaseWindowMinutes: integer('purchase_window_minutes').default(10).notNull(),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('drops_slug_idx').on(table.slug),
		index('drops_status_idx').on(table.status),
		index('drops_starts_at_idx').on(table.startsAt),
	],
);

// ============================================
// Drop Entries (Queue + Raffle)
// ============================================

export const dropEntries = pgTable(
	'drop_entries',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dropId: uuid('drop_id')
			.notNull()
			.references(() => drops.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		status: entryStatusEnum('status').default('pending').notNull(),
		raffleStatus: raffleStatusEnum('raffle_status'),
		queuePosition: integer('queue_position'),
		purchaseToken: varchar('purchase_token', { length: 255 }),
		purchaseTokenExpiresAt: timestamp('purchase_token_expires_at', { withTimezone: true }),
		purchasedAt: timestamp('purchased_at', { withTimezone: true }),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('drop_entries_user_drop_idx').on(table.dropId, table.userId),
		index('drop_entries_drop_id_idx').on(table.dropId),
		index('drop_entries_user_id_idx').on(table.userId),
		index('drop_entries_status_idx').on(table.status),
		index('drop_entries_raffle_status_idx').on(table.raffleStatus),
	],
);

// ============================================
// Wishlists
// ============================================

export const wishlists = pgTable(
	'wishlists',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		shopifyProductId: varchar('shopify_product_id', { length: 255 }).notNull(),
		productTitle: varchar('product_title', { length: 500 }),
		productImage: text('product_image'),
		productHandle: varchar('product_handle', { length: 255 }),
		notifyOnDrop: boolean('notify_on_drop').default(true).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex('wishlists_user_product_idx').on(table.userId, table.shopifyProductId),
		index('wishlists_user_id_idx').on(table.userId),
	],
);

// ============================================
// Analytics Events
// ============================================

export const analyticsEvents = pgTable(
	'analytics_events',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		eventName: varchar('event_name', { length: 255 }).notNull(),
		userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
		sessionId: varchar('session_id', { length: 255 }),
		dropId: uuid('drop_id').references(() => drops.id, { onDelete: 'set null' }),
		metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index('analytics_event_name_idx').on(table.eventName),
		index('analytics_user_id_idx').on(table.userId),
		index('analytics_drop_id_idx').on(table.dropId),
		index('analytics_created_at_idx').on(table.createdAt),
	],
);

// ============================================
// Types (inferred from schema)
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Drop = typeof drops.$inferSelect;
export type NewDrop = typeof drops.$inferInsert;
export type DropEntry = typeof dropEntries.$inferSelect;
export type NewDropEntry = typeof dropEntries.$inferInsert;
export type Wishlist = typeof wishlists.$inferSelect;
export type NewWishlist = typeof wishlists.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;

// ============================================
// Marketing View: Drop Performance
// ============================================

/**
 * This SQL view can be created via migration:
 *
 * CREATE OR REPLACE VIEW marketing_drop_performance AS
 * SELECT
 *   d.id as drop_id,
 *   d.title,
 *   d.slug,
 *   d.type,
 *   d.status,
 *   d.starts_at,
 *   d.ends_at,
 *   COUNT(de.id) as total_entries,
 *   COUNT(de.id) FILTER (WHERE de.status = 'purchased') as total_purchases,
 *   COUNT(de.id) FILTER (WHERE de.raffle_status = 'won') as total_winners,
 *   COUNT(de.id) FILTER (WHERE de.raffle_status = 'lost') as total_losers,
 *   ROUND(
 *     COUNT(de.id) FILTER (WHERE de.status = 'purchased')::numeric /
 *     NULLIF(COUNT(de.id), 0) * 100, 2
 *   ) as conversion_rate
 * FROM drops d
 * LEFT JOIN drop_entries de ON de.drop_id = d.id
 * GROUP BY d.id;
 */

export const marketingDropPerformanceQuery = sql`
	SELECT
		d.id as drop_id,
		d.title,
		d.slug,
		d.type,
		d.status,
		d.starts_at,
		d.ends_at,
		COUNT(de.id) as total_entries,
		COUNT(de.id) FILTER (WHERE de.status = 'purchased') as total_purchases,
		COUNT(de.id) FILTER (WHERE de.raffle_status = 'won') as total_winners,
		COUNT(de.id) FILTER (WHERE de.raffle_status = 'lost') as total_losers,
		ROUND(
			COUNT(de.id) FILTER (WHERE de.status = 'purchased')::numeric /
			NULLIF(COUNT(de.id), 0) * 100, 2
		) as conversion_rate
	FROM drops d
	LEFT JOIN drop_entries de ON de.drop_id = d.id
	GROUP BY d.id
`;
