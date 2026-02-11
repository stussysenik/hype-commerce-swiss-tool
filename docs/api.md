# API Reference

## tRPC API

The API uses [tRPC v11](https://trpc.io/) with SvelteKit's fetch adapter. All endpoints are available at `/api/trpc/*`.

### Authentication

Protected procedures require a valid session cookie. The auth middleware (`protectedProcedure`) extracts the user ID from an HMAC-signed session token.

### Drops Router

#### `drops.queue.join`
Join a drop queue (FIFO ordering).

```typescript
// Input
{ dropId: string }

// Response
{ position: number, estimatedWaitMinutes: number }
```

#### `drops.queue.status`
Check your position in the queue.

```typescript
// Input
{ dropId: string }

// Response
{ position: number, total: number, estimatedWaitMinutes: number }
```

#### `drops.queue.leave`
Leave a drop queue.

```typescript
// Input
{ dropId: string }
```

#### `drops.raffle.enter`
Enter a raffle draw.

```typescript
// Input
{ dropId: string, email: string }
```

#### `drops.raffle.status`
Check raffle status and whether you've been selected.

```typescript
// Input
{ dropId: string }

// Response
{ status: 'pending' | 'won' | 'lost', purchaseLink?: string, expiresAt?: string }
```

### User Router

#### `user.wishlist.list`
List all wishlist items. Requires authentication.

#### `user.wishlist.add`
Add a product to wishlist.

```typescript
// Input
{ productId: string }
```

#### `user.wishlist.remove`
Remove a product from wishlist.

```typescript
// Input
{ productId: string }
```

#### `user.wishlist.check`
Check if a product is in wishlist.

```typescript
// Input
{ productId: string }

// Response
{ inWishlist: boolean }
```

#### `user.tier.get`
Get the current user's tier and stats.

```typescript
// Response
{ tier: 'standard' | 'silver' | 'gold' | 'platinum', totalDrops: number, totalWins: number }
```

### Analytics Router

#### `analytics.track.event`
Track an analytics event.

```typescript
// Input
{ event: string, metadata?: Record<string, unknown> }
```

#### `analytics.export.csv`
Export analytics as CSV. Returns a CSV string.

```typescript
// Input
{ dropId?: string, startDate?: string, endDate?: string }
```

#### `analytics.drop.performance`
Get marketing drop performance metrics.

```typescript
// Input
{ dropId: string }
```

## Shopify Storefront API

The Shopify client (`src/lib/shopify/client.ts`) wraps the `@shopify/storefront-api-client`.

### Products

```typescript
import { getProduct, getProducts, searchProducts } from '$lib/shopify/queries/products';

// Single product with variants and metafields
const product = await getProduct(handle);

// Paginated products
const { products, pageInfo } = await getProducts({ first: 12, after: cursor });

// Search
const results = await searchProducts(query, { first: 10 });
```

### Collections

```typescript
import { getCollection, getCollections } from '$lib/shopify/queries/collections';

// Collection with products
const collection = await getCollection(handle, { first: 24 });

// All collections
const collections = await getCollections({ first: 20 });
```

### Cart

```typescript
import { createCart, getCart, addToCart, updateCartLine, removeCartLine } from '$lib/shopify/queries/cart';

const cart = await createCart([{ merchandiseId, quantity: 1 }]);
const updated = await addToCart(cartId, [{ merchandiseId, quantity: 1 }]);
```

### Cart Store

The client-side cart store (`src/lib/stores/cart.ts`) persists to localStorage:

```typescript
import { cart, cartItemCount, cartTotal } from '$lib/stores/cart';
```

## Health Check

`GET /api/health` returns system status:

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "uptime": 3600,
  "memory": { "rss": 128 }
}
```

## Queue Polling

`GET /api/drops/queue?dropId=<id>` returns real-time queue position:

```json
{
  "position": 42,
  "queueSize": 1500,
  "estimatedWaitMinutes": 7
}
```
