# Technical Documentation

Detailed technical documentation for the Hype Commerce Swiss Tool.

## Table of Contents

- [Components](#components)
- [Shopify Integration](#shopify-integration)
- [Database Schema](#database-schema)
- [tRPC API](#trpc-api)
- [Drop Queue System](#drop-queue-system)
- [Raffle System](#raffle-system)
- [Sanity CMS](#sanity-cms)
- [Development Workflow](#development-workflow)

---

## Components

### UI Components (`src/lib/components/ui/`)

Base components from shadcn-svelte built on Bits UI:

| Component       | Description                                  |
| --------------- | -------------------------------------------- |
| `Button`        | Primary, secondary, outline, ghost variants  |
| `Input`         | Text input with validation states            |
| `Label`         | Form labels with required indicator          |
| `Card`          | Container with header, content, footer slots |
| `Badge`         | Status indicators and tags                   |
| `Dialog`        | Modal dialogs                                |
| `Drawer`        | Slide-out panels (vaul-svelte)               |
| `Popover`       | Floating content panels                      |
| `Toast`         | Notifications (svelte-sonner)                |
| `Tabs`          | Tabbed navigation                            |
| `Accordion`     | Expandable content sections                  |
| `Dropdown Menu` | Context menus                                |
| `Select`        | Custom select dropdowns                      |
| `Checkbox`      | Checkbox inputs                              |
| `Textarea`      | Multi-line text input                        |

### Section Components (`src/lib/components/sections/`)

Pre-built layout sections for hype commerce patterns:

| Component             | Description                                   |
| --------------------- | --------------------------------------------- |
| `Hero`                | Full-width hero with video background support |
| `ProductGrid`         | Responsive product grid with filter sidebar   |
| `EditorialSplit`      | 50/50 image and text layout                   |
| `Timeline`            | Drop calendar visualization                   |
| `Newsletter`          | Email capture with validation                 |
| `TestimonialCarousel` | Customer testimonials slider                  |

### Using Components

```svelte
<script>
  import { Button } from '$lib/components/ui/button';
  import { Hero } from '$lib/components/sections/hero';
</script>

<Hero
  title="Limited Drop"
  subtitle="Available Feb 15"
  videoUrl="/drops/ss25-teaser.mp4"
/>

<Button variant="primary" size="lg">
  Enter Raffle
</Button>
```

---

## Shopify Integration

### Client Setup (`src/lib/shopify/client.ts`)

```typescript
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopify = createStorefrontApiClient({
	storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN,
	apiVersion: '2024-01',
	publicAccessToken: PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});
```

### Available Queries (`src/lib/shopify/queries/`)

| Query                             | Description                              |
| --------------------------------- | ---------------------------------------- |
| `getProduct(handle)`              | Single product with variants, metafields |
| `getProducts(first, cursor)`      | Paginated product list                   |
| `getCollection(handle)`           | Collection with filtered products        |
| `searchProducts(query)`           | Full-text product search                 |
| `createCart()`                    | Initialize new cart                      |
| `getCart(id)`                     | Fetch cart by ID                         |
| `addToCart(cartId, lines)`        | Add line items                           |
| `updateCart(cartId, lines)`       | Update quantities                        |
| `removeFromCart(cartId, lineIds)` | Remove items                             |

### TanStack Query Integration

Queries are wrapped with TanStack Query for caching:

```typescript
import { createQuery } from '@tanstack/svelte-query';
import { getProduct } from '$lib/shopify';

const product = createQuery({
	queryKey: ['product', handle],
	queryFn: () => getProduct(handle),
	staleTime: 1000 * 60 * 5, // 5 minutes
});
```

---

## Database Schema

### Tables (`src/lib/server/db/schema.ts`)

#### `users`

```sql
id            UUID PRIMARY KEY
email         VARCHAR(255) UNIQUE NOT NULL
shopify_id    VARCHAR(255)
tier          ENUM('standard', 'vip', 'platinum')
created_at    TIMESTAMP DEFAULT NOW()
updated_at    TIMESTAMP
```

#### `drops`

```sql
id            UUID PRIMARY KEY
name          VARCHAR(255) NOT NULL
slug          VARCHAR(255) UNIQUE NOT NULL
type          ENUM('queue', 'raffle', 'fcfs')
starts_at     TIMESTAMP NOT NULL
ends_at       TIMESTAMP
max_entries   INTEGER
shopify_collection_id VARCHAR(255)
created_at    TIMESTAMP DEFAULT NOW()
```

#### `drop_entries`

```sql
id            UUID PRIMARY KEY
drop_id       UUID REFERENCES drops(id)
user_id       UUID REFERENCES users(id)
email         VARCHAR(255) NOT NULL
status        ENUM('pending', 'selected', 'purchased', 'expired')
position      INTEGER
purchase_link VARCHAR(255)
link_expires  TIMESTAMP
created_at    TIMESTAMP DEFAULT NOW()
```

#### `wishlists`

```sql
id            UUID PRIMARY KEY
user_id       UUID REFERENCES users(id)
shopify_product_id VARCHAR(255) NOT NULL
created_at    TIMESTAMP DEFAULT NOW()
```

#### `analytics_events`

```sql
id            UUID PRIMARY KEY
event_type    VARCHAR(100) NOT NULL
user_id       UUID REFERENCES users(id)
metadata      JSONB
created_at    TIMESTAMP DEFAULT NOW()
```

### Drizzle Commands

```bash
pnpm db:generate  # Generate migration from schema changes
pnpm db:push      # Push schema directly (dev)
pnpm db:migrate   # Run migrations (production)
pnpm db:studio    # Open Drizzle Studio GUI
```

---

## tRPC API

### Router Structure (`src/lib/server/trpc/`)

```
trpc/
├── router.ts      # Root router combining all sub-routers
├── context.ts     # Request context (user, db)
└── routers/
    ├── drops.ts     # Queue and raffle operations
    ├── user.ts      # User profile, wishlists
    └── analytics.ts # Event tracking, exports
```

### Drops Router

| Procedure       | Type     | Description           |
| --------------- | -------- | --------------------- |
| `queue.join`    | mutation | Join drop queue       |
| `queue.status`  | query    | Get position in queue |
| `queue.leave`   | mutation | Leave queue           |
| `raffle.enter`  | mutation | Enter raffle          |
| `raffle.status` | query    | Check entry status    |

### User Router

| Procedure         | Type     | Description          |
| ----------------- | -------- | -------------------- |
| `profile.get`     | query    | Get user profile     |
| `tier.get`        | query    | Get membership tier  |
| `wishlist.add`    | mutation | Add to wishlist      |
| `wishlist.remove` | mutation | Remove from wishlist |
| `wishlist.list`   | query    | Get wishlist items   |

### Analytics Router

| Procedure     | Type     | Description          |
| ------------- | -------- | -------------------- |
| `track.event` | mutation | Track custom event   |
| `export.csv`  | query    | Export events as CSV |

### Client Usage

```typescript
import { trpc } from '$lib/trpc/client';

// Join a queue
await trpc.drops.queue.join.mutate({ dropId: 'drop-123' });

// Check position
const status = await trpc.drops.queue.status.query({ dropId: 'drop-123' });
console.log(`Position: ${status.position}`);
```

---

## Drop Queue System

### Architecture

The queue system uses Redis + BullMQ for high-concurrency drop events:

```
User Request → tRPC → BullMQ Queue → Redis ZADD
                                        ↓
                            Sorted Set (timestamp ordering)
                                        ↓
                            Position Lookup (ZRANK)
```

### Queue Operations (`src/lib/server/queue/`)

**Join Queue**

```typescript
// Adds user to sorted set with timestamp score
await redis.zadd(`drop:${dropId}:queue`, {
	score: Date.now(),
	member: JSON.stringify({ userId, email }),
});
```

**Get Position**

```typescript
const position = await redis.zrank(`drop:${dropId}:queue`, member);
```

**Process Purchase Window**

```typescript
// BullMQ job grants 10-minute purchase window
await dropQueue.add('grant-window', {
	dropId,
	userId,
	expiresAt: Date.now() + 10 * 60 * 1000,
});
```

### Real-time Updates

Position updates via WebSocket with polling fallback:

```typescript
// WebSocket connection
const ws = new WebSocket('/api/queue/ws');
ws.onmessage = (event) => {
	const { position } = JSON.parse(event.data);
	updatePosition(position);
};

// Polling fallback (5s interval)
setInterval(async () => {
	const status = await trpc.drops.queue.status.query({ dropId });
	updatePosition(status.position);
}, 5000);
```

---

## Raffle System

### Flow

1. **Entry Period** - Users submit email to enter raffle
2. **Selection** - Provably random winner selection using `crypto.randomBytes`
3. **Notification** - Winners receive time-limited purchase links (24h)
4. **Purchase** - Winners complete checkout via special link
5. **Expiry** - Unclaimed slots go to waitlist

### Winner Selection (`src/lib/server/raffle/`)

```typescript
import { randomBytes } from 'crypto';

function selectWinners(entries: Entry[], count: number): Entry[] {
	// Fisher-Yates shuffle with crypto-secure randomness
	const shuffled = [...entries];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = randomBytes(4).readUInt32BE() % (i + 1);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, count);
}
```

### Purchase Links

```typescript
// Generate unique, time-limited link
const purchaseLink = await generatePurchaseLink({
	dropId,
	userId,
	expiresIn: 24 * 60 * 60 * 1000, // 24 hours
});

// Link format: /checkout/{token}
// Token contains encrypted dropId, userId, expiry
```

---

## Sanity CMS

### Content Models (`src/lib/sanity/`)

#### Drop Story

```javascript
{
  name: 'dropStory',
  title: 'Drop Story',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'dropDate', type: 'datetime' },
    { name: 'hero', type: 'image' },
    { name: 'content', type: 'portableText' },
    { name: 'products', type: 'array', of: ['shopifyProduct'] },
  ]
}
```

#### Editorial Article

```javascript
{
  name: 'editorial',
  title: 'Editorial',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'excerpt', type: 'text' },
    { name: 'featuredImage', type: 'image' },
    { name: 'content', type: 'portableText' },
    { name: 'author', type: 'reference', to: 'author' },
    { name: 'publishedAt', type: 'datetime' },
  ]
}
```

#### Global Settings

```javascript
{
  name: 'settings',
  title: 'Site Settings',
  fields: [
    { name: 'siteName', type: 'string' },
    { name: 'logo', type: 'image' },
    { name: 'announcement', type: 'string' },
    { name: 'socialLinks', type: 'array', of: ['socialLink'] },
  ]
}
```

### GROQ Queries (`src/lib/sanity/queries.ts`)

```typescript
// Fetch upcoming drops
export const upcomingDropsQuery = groq`
  *[_type == "dropStory" && dropDate > now()] | order(dropDate asc) {
    _id,
    title,
    "slug": slug.current,
    dropDate,
    "heroUrl": hero.asset->url
  }
`;

// Fetch single editorial
export const editorialQuery = groq`
  *[_type == "editorial" && slug.current == $slug][0] {
    title,
    excerpt,
    content,
    "featuredImage": featuredImage.asset->url,
    "author": author->{ name, "avatar": avatar.asset->url },
    publishedAt
  }
`;
```

### Sanity Studio

Access at `/studio` in development. Requires authentication with Sanity project.

---

## Development Workflow

### Git Hooks (Husky)

**Pre-commit**

- ESLint fix
- Prettier format
- Staged files only (lint-staged)

**Pre-push**

- Type check (`svelte-check`)
- Build verification

### Code Style

- ESLint with Svelte and TypeScript plugins
- Prettier with Svelte and Tailwind plugins
- Tabs for indentation

### Testing

```bash
pnpm test          # Run tests
pnpm test:watch    # Watch mode
pnpm test:coverage # Coverage report
```

### Storybook

```bash
pnpm storybook       # Start dev server on :6006
pnpm build-storybook # Build static storybook
```

---

## Deployment

### Vercel

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Environment Variables for Production

All variables from `.env.example` must be set in your deployment platform.

### Infrastructure Requirements

| Service    | Provider Options              |
| ---------- | ----------------------------- |
| Frontend   | Vercel, Cloudflare Pages      |
| PostgreSQL | Railway, Supabase, Neon       |
| Redis      | Railway, Upstash, Redis Cloud |
| Sanity     | Sanity.io (managed)           |
| Shopify    | Shopify (managed)             |
