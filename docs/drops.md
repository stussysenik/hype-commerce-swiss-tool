# Drop System Guide

## Overview

The platform supports two drop mechanisms for limited-release products:

1. **Queue-based drops** - First-come, first-served with real-time position tracking
2. **Raffle-based drops** - Random selection with provably fair drawing

## Queue System

### Architecture

The queue uses Redis sorted sets (ZADD) for FIFO ordering, backed by BullMQ for job processing.

```
User joins queue
  → ZADD drop:{id}:queue {timestamp} {userId}
  → Position = ZRANK drop:{id}:queue {userId}
  → Poll /api/drops/queue?dropId={id} for updates
```

### Flow

1. User clicks "Enter Queue" on a drop page
2. Server calls `drops.queue.join` tRPC procedure
3. User ID is added to Redis sorted set with current timestamp as score
4. Client polls `/api/drops/queue` for position updates
5. When user reaches the front, they get a **10-minute purchase window**
6. Purchase window is stored as a Redis key with TTL: `SETEX drop:{id}:window:{userId} 600 1`

### Rate Limiting

Queue entry is rate-limited to 10 requests per minute per IP using a sliding window algorithm (Redis ZSET).

### Configuration

Key files:
- `src/lib/server/queue/drop-queue.ts` - Queue logic and BullMQ worker
- `src/lib/server/queue/rate-limiter.ts` - Sliding window rate limiter
- `src/routes/api/drops/queue/+server.ts` - Polling endpoint

## Raffle System

### Architecture

Raffles use `crypto.randomBytes` for provably random winner selection with a Fisher-Yates shuffle.

### Flow

1. User enters raffle via `drops.raffle.enter` with email
2. Entries stored in `drop_entries` table with status `pending`
3. Admin triggers the draw
4. System generates a random seed via `crypto.randomBytes(32)`
5. Entries are shuffled using Fisher-Yates with the seed
6. Top N entries are selected as winners
7. Seed is stored in Redis for verification: `SET raffle:{id}:seed {hex}`
8. Winners get time-limited purchase links (24-hour expiry)
9. Email notifications sent to winners and losers

### Purchase Links

Winner purchase links are HMAC-signed tokens containing:
- Drop ID
- User ID  
- Expiration timestamp (24 hours from draw)

### Verification

The raffle is provably fair:
1. The seed used for shuffling is stored and can be revealed
2. Anyone can replay the Fisher-Yates shuffle with the same seed
3. The same seed always produces the same winner order

### Dashboard

Marketing teams can view raffle performance via `analytics.drop.performance`:
- Total entries by tier (standard/silver/gold/platinum)
- Conversion rates
- Winner demographics

### Configuration

Key files:
- `src/lib/server/raffle/draw.ts` - Fisher-Yates shuffle and winner selection
- `src/lib/server/raffle/notifications.ts` - Email notification stubs
- `src/lib/server/raffle/dashboard.ts` - Stats and analytics queries

## Security

### Bot Prevention

Multiple layers of bot prevention:

1. **Cloudflare Turnstile** - CAPTCHA verification on queue/raffle entry
2. **Honeypot fields** - Hidden form fields that bots fill out
3. **Rate limiting** - Sliding window per IP (10/min queue, 100/min general)
4. **Session tokens** - HMAC-signed, 15-minute expiry

### Implementation

```typescript
// Turnstile verification (server-side)
import { verifyTurnstileToken } from '$lib/server/security/turnstile';
const valid = await verifyTurnstileToken(token);

// Honeypot check
import { isHoneypotFilled } from '$lib/server/security/honeypot';
if (isHoneypotFilled(formData)) return error(400);

// Session tokens
import { createSessionToken, verifySessionToken } from '$lib/server/security/session';
const token = createSessionToken(userId);
const payload = verifySessionToken(token);
```
