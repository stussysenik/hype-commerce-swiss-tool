## Context

We are building a greenfield e-commerce boilerplate designed for luxury streetwear and hype drops. The target users are development agencies working with brands like Supreme, Stone Island, Ferrari, or Palace who need high-performance, visually distinctive storefronts.

**Current state**: No existing codebase. This is the foundation implementation.

**Constraints**:
- Must handle 10K+ concurrent users during drop events
- Sub-2s page load times required
- Marketing teams need self-service content management
- Development environment must be reproducible across machines
- Shopify handles checkout/payments (don't reinvent)

**Stakeholders**:
- Developers using the boilerplate
- Marketing teams managing content
- End users (shoppers)
- Brand clients commissioning sites

## Goals / Non-Goals

**Goals:**
- Create production-ready SvelteKit application with full commerce functionality
- Implement queue and raffle systems for limited releases
- Provide self-service CMS for marketing teams
- Establish reproducible development environment
- Document all architectural decisions for future maintainers

**Non-Goals:**
- Custom payment processing (use Shopify/Stripe)
- Native mobile applications (PWA approach only)
- AR/VR try-on features (optional future module)
- Admin CMS beyond Sanity (use Shopify admin for inventory)
- Multi-tenant SaaS architecture (single-tenant deployments)

## Decisions

### 1. SvelteKit over Next.js/Remix

**Decision**: Use SvelteKit as the frontend framework.

**Rationale**:
- Svelte compiles to vanilla JS, producing 30-40% smaller bundles than React
- Reactivity model is simpler for UI-heavy visual sites
- Native SSR/SSG without additional configuration
- Superior DX for component-focused development

**Alternatives considered**:
- Next.js: More mature ecosystem but heavier runtime, React paradigm adds complexity
- Remix: Excellent data loading patterns but React-based, smaller community
- Astro: Great for static sites but less suited for dynamic commerce features

### 2. Shopify Storefront API (not custom backend)

**Decision**: Use Shopify Storefront API for all commerce operations (products, cart, checkout).

**Rationale**:
- Battle-tested checkout handling (PCI compliance, payment fraud)
- Inventory management, order processing, shipping already solved
- Official SDK with strong TypeScript support
- Client already has Shopify stores in most cases

**Alternatives considered**:
- Custom backend with Stripe: Full control but massive engineering effort for checkout
- Medusa.js: Open-source alternative but less mature ecosystem
- Saleor: GraphQL-native but requires significant infrastructure

### 3. PostgreSQL + Drizzle for custom data

**Decision**: Use PostgreSQL with Drizzle ORM for non-Shopify data (users, drops, queues, analytics).

**Rationale**:
- PostgreSQL is industrial-grade, handles concurrent writes well
- Drizzle provides TypeScript-native queries without runtime overhead (unlike Prisma)
- JSONB columns support flexible analytics metadata
- Proven scaling path (read replicas, connection pooling)

**Alternatives considered**:
- Prisma: Popular but adds query engine runtime, slower cold starts
- MongoDB: Flexible schema but relational data fits better for our use case
- Supabase: Good DX but adds vendor dependency for core data

### 4. Redis + BullMQ for queue system

**Decision**: Use Redis with BullMQ for drop queue management.

**Rationale**:
- Redis provides sub-millisecond operations for queue position lookups
- BullMQ handles job scheduling, retries, and dead letter queues
- Proven to handle Supreme-level traffic (100K+ concurrent)
- Simple horizontal scaling via Redis Cluster

**Alternatives considered**:
- PostgreSQL SKIP LOCKED: Simpler but slower under high concurrency
- RabbitMQ: More features than needed, adds operational complexity
- AWS SQS: Vendor lock-in, higher latency for position updates

### 5. Sanity CMS (not headless Shopify)

**Decision**: Use Sanity CMS for editorial content and drop stories.

**Rationale**:
- Real-time collaboration for marketing teams
- Visual editor (WYSIWYG-like) accessible to non-technical users
- Built-in image CDN with on-the-fly transformations
- Portable text format enables rich modular content

**Alternatives considered**:
- Shopify metafields: Limited to product data, poor editing UX
- Contentful: Similar capabilities but higher pricing, less flexible schema
- Strapi: Self-hosted adds operational burden

### 6. tRPC for internal API

**Decision**: Use tRPC for custom API endpoints (queue management, analytics, user data).

**Rationale**:
- End-to-end type safety between frontend and backend
- No code generation step (unlike GraphQL)
- Zod validation built-in
- Excellent error handling with typed responses

**Alternatives considered**:
- REST with OpenAPI: More familiar but requires code generation for type safety
- GraphQL: Overkill for internal APIs, adds complexity
- Server actions only: Limits API reuse, harder to test

### 7. Monorepo structure (single package)

**Decision**: Single package SvelteKit app (not turborepo/pnpm workspaces).

**Rationale**:
- Simpler mental model for boilerplate users
- No workspace coordination overhead
- SvelteKit handles frontend/backend in single project
- Easier deployment to Vercel

**Alternatives considered**:
- Turborepo: Adds complexity for minimal benefit in this use case
- Separate frontend/backend repos: Coordination overhead, deployment complexity

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Vercel Edge Network                          │
│                   (CDN + Edge Functions)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   SvelteKit     │ │  Sanity Studio  │ │   Storybook     │
│   Application   │ │    /studio      │ │   (dev only)    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │
          ▼                   ▼
┌─────────────────┐ ┌─────────────────┐
│   tRPC Router   │ │   Sanity API    │
│  /api/trpc/*    │ │  (managed)      │
└─────────────────┘ └─────────────────┘
          │
          ├──────────────────┬──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │     Redis       │ │  Shopify API    │
│   (Railway)     │ │   (Railway)     │ │  (managed)      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Directory Structure

```
hype-commerce-foundation/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn-svelte base components
│   │   │   └── sections/     # Hero, ProductGrid, Editorial, etc.
│   │   ├── shopify/
│   │   │   ├── client.ts     # Storefront API client
│   │   │   ├── queries/      # GraphQL query definitions
│   │   │   └── types.ts      # Generated/manual types
│   │   ├── sanity/
│   │   │   ├── client.ts     # Sanity client
│   │   │   └── queries.ts    # GROQ queries
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts # Drizzle schema
│   │   │   │   └── index.ts  # DB client
│   │   │   ├── redis.ts      # Redis client
│   │   │   ├── queue/        # BullMQ queue definitions
│   │   │   └── trpc/
│   │   │       ├── router.ts # Root router
│   │   │       └── routers/  # drops, user, analytics
│   │   └── stores/           # Svelte stores (cart, user)
│   └── routes/
│       ├── (storefront)/
│       │   ├── +page.svelte              # Homepage
│       │   ├── collections/[handle]/
│       │   ├── products/[handle]/
│       │   ├── drops/
│       │   │   ├── +page.svelte          # Drop calendar
│       │   │   └── [slug]/               # Drop detail
│       │   ├── stories/
│       │   ├── archive/
│       │   └── cart/
│       ├── (account)/
│       │   └── account/
│       ├── studio/[[...index]]/          # Sanity Studio
│       └── api/
│           ├── trpc/[...trpc]/           # tRPC handler
│           └── health/                   # Health check
├── stories/                              # Storybook stories
├── sanity/                               # Sanity schema
├── drizzle/                              # Migrations
├── static/                               # Static assets
├── flake.nix                             # NixOS dev env
└── package.json
```

## Risks / Trade-offs

### [Risk] Shopify API rate limits during drops
**Mitigation**: Aggressive caching with TanStack Query, pre-warm product data before drops, implement exponential backoff.

### [Risk] Redis single point of failure
**Mitigation**: Use Redis Cluster in production, implement polling fallback if Redis unavailable, queue state is recoverable from PostgreSQL.

### [Risk] Sanity vendor dependency
**Mitigation**: Portable text format is exportable, content can be migrated to other headless CMS. Consider self-hosted Sanity for enterprise clients.

### [Risk] NixOS adoption barrier
**Mitigation**: Provide Docker-based alternative for teams unfamiliar with Nix. Document both paths clearly.

### [Risk] Queue fairness under load
**Mitigation**: Use Redis ZADD with timestamps for deterministic ordering. Implement server-side time sync to prevent client manipulation.

### [Trade-off] Type safety vs. development speed
We chose maximum type safety (TypeScript strict, Zod validation, Drizzle) which increases initial development time but dramatically reduces runtime errors and makes refactoring safer.

### [Trade-off] Monorepo simplicity vs. flexibility
Single package is simpler but limits code sharing with other projects. Acceptable for boilerplate use case.

## Migration Plan

Not applicable for greenfield implementation.

## Open Questions

1. **Authentication strategy**: Use Shopify customer accounts or build custom auth?
   - Leaning toward Shopify customer accounts for simplicity
   - Custom auth would enable cross-platform identity but adds complexity

2. **Real-time technology**: WebSocket (native) vs. Phoenix LiveView?
   - Initial implementation uses native WebSocket with polling fallback
   - Phoenix LiveView is optional upgrade for extreme scale (10K+ concurrent per drop)

3. **Analytics provider**: Mixpanel vs. self-hosted?
   - Mixpanel provides better out-of-box marketing dashboards
   - Self-hosted (e.g., Plausible) reduces costs at scale
