## ADDED Requirements

### Requirement: PostgreSQL database with Drizzle ORM
The system SHALL use PostgreSQL as primary database with Drizzle ORM for TypeScript-native database operations.

#### Scenario: Database connection
- **WHEN** application starts
- **THEN** Drizzle client connects to PostgreSQL using DATABASE_URL

#### Scenario: Type-safe queries
- **WHEN** developer writes database query
- **THEN** TypeScript provides autocomplete and type checking

### Requirement: Users table
The system SHALL maintain users table with:
- `id` (UUID, primary key)
- `shopify_customer_id` (string, nullable, unique)
- `email` (string, unique)
- `tier` (enum: 'standard', 'vip')
- `created_at`, `updated_at` timestamps

#### Scenario: User creation
- **WHEN** new user registers or is synced from Shopify
- **THEN** user record is created with standard tier

#### Scenario: VIP tier
- **WHEN** user is marked as VIP
- **THEN** tier field updates to 'vip'

### Requirement: Drops table
The system SHALL maintain drops table with:
- `id` (UUID, primary key)
- `title` (string)
- `slug` (string, unique)
- `release_date` (timestamp)
- `stock_total` (integer)
- `stock_remaining` (integer)
- `queue_enabled` (boolean)
- `raffle_enabled` (boolean)

#### Scenario: Create drop
- **WHEN** new drop is created
- **THEN** stock_remaining equals stock_total initially

#### Scenario: Stock decrement
- **WHEN** purchase completes
- **THEN** stock_remaining decrements by quantity

### Requirement: Drop entries table
The system SHALL maintain drop_entries table with:
- `id` (UUID, primary key)
- `user_id` (foreign key to users)
- `drop_id` (foreign key to drops)
- `entry_type` (enum: 'queue', 'raffle')
- `entry_time` (timestamp)
- `status` (enum: 'pending', 'confirmed', 'lost', 'purchased')
- Unique constraint on (user_id, drop_id)

#### Scenario: Queue entry
- **WHEN** user joins drop queue
- **THEN** entry created with type 'queue' and status 'pending'

#### Scenario: Raffle win
- **WHEN** user wins raffle
- **THEN** status updates to 'confirmed'

### Requirement: Wishlists table
The system SHALL maintain wishlists table with:
- `id` (UUID, primary key)
- `user_id` (foreign key to users)
- `shopify_product_id` (string)
- `added_at` (timestamp)
- Unique constraint on (user_id, shopify_product_id)

#### Scenario: Add to wishlist
- **WHEN** user saves product
- **THEN** wishlist entry is created

#### Scenario: Duplicate prevention
- **WHEN** user tries to save same product twice
- **THEN** operation is idempotent (no duplicate)

### Requirement: Analytics events table
The system SHALL maintain analytics_events table with:
- `id` (UUID, primary key)
- `event_type` (string)
- `user_id` (foreign key, nullable)
- `metadata` (JSONB)
- `created_at` (timestamp)

#### Scenario: Track event
- **WHEN** analytics event fires
- **THEN** event is recorded with type and metadata

#### Scenario: Anonymous events
- **WHEN** event fires without logged-in user
- **THEN** event is recorded with null user_id

### Requirement: Marketing export views
The system SHALL provide pre-built database views for marketing exports:
- `marketing_drop_performance` - entries, conversion rate per drop
- `marketing_user_signups` - daily signup counts

#### Scenario: Export drop performance
- **WHEN** marketing queries drop performance view
- **THEN** aggregated metrics are returned without complex joins
