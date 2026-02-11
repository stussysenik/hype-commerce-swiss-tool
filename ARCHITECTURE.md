# Architecture Decisions

Technical overview of the Hype Commerce Foundation stack, with rationale for each choice.

## Guiding Principles

1. **Industrial-Grade Performance** - Sub-2s page loads, handles 10K+ concurrent users during drops
2. **Evidence-Based Stack** - Every tool chosen for proven production performance
3. **Artisan DX** - Developer joy matters; if it feels clunky, it's wrong
4. **Type Safety End-to-End** - Runtime validation meets compile-time safety
5. **No Black Boxes** - Own your components, understand your dependencies

---

## Frontend Layer

### SvelteKit (Framework)
**Why**: Minimal JavaScript bundles, excellent developer experience, native SSR/SSG support.

**Considered alternatives**:
- Next.js: Heavier bundle size, React paradigm adds complexity for visual-first sites
- Astro: Great for static, but SvelteKit handles dynamic commerce needs better
- Remix: Solid choice, but Svelte's reactivity model is simpler for UI-heavy work

**Production evidence**: Svelte compiles to vanilla JS, resulting in 30-40% smaller bundles than React equivalents.

### Tailwind CSS v4
**Why**: Utility-first CSS enables rapid prototyping while maintaining precision control.

**Key configurations**:
- Custom design tokens for brand consistency
- CSS Grid utilities for editorial layouts
- Dark mode as default (OLED-optimized)

### shadcn-svelte + Bits UI
**Why**: Copy-paste components you own completely. No version lock-in, no black-box styling.

**Alternative considered**: Component libraries like Skeleton or Flowbite - rejected due to abstraction overhead and limited customization.

---

## Data Layer

### PostgreSQL + Drizzle ORM
**Why**: Industrial-grade relational database with TypeScript-native ORM.

**Schema approach**:
- Core tables: users, drops, drop_entries, wishlists, analytics_events
- Pre-built marketing views for CSV exports
- Soft deletes for audit trail

**Why Drizzle over Prisma**:
- Drizzle generates SQL that runs as-is (no query engine runtime)
- TypeScript-first with compile-time safety
- Smaller bundle, faster queries

### Redis + BullMQ (Queue System)
**Why**: High-concurrency job queues for waitlists and timed releases.

**Use cases**:
- Drop queue management (FIFO ordering)
- Raffle entry processing
- Email notification batching
- Analytics event buffering

---

## API Layer

### Shopify Storefront API (GraphQL)
**Why**: Don't reinvent payments, inventory, or checkout.

**Integration approach**:
- Official `@shopify/storefront-api-client` SDK
- Pre-built queries for products, collections, cart
- TanStack Query for caching and state management

### tRPC (Internal API)
**Why**: End-to-end type safety for custom features.

**Routes**:
- `/api/drops/*` - Queue and raffle management
- `/api/user/*` - Wishlists, VIP status
- `/api/analytics/*` - Event tracking, CSV exports

---

## CMS Layer

### Sanity CMS
**Why**: Real-time collaboration, visual editing, included image CDN.

**Content models**:
- Drop stories (hero media, story blocks, related products)
- Editorial articles (modular content blocks)
- Global settings (navigation, SEO, social)

**Marketing team features**:
- Visual WYSIWYG editing
- Image drag-drop with auto-optimization
- Preview mode before publish
- Scheduled publishing

---

## Infrastructure

### NixOS (Development Environment)
**Why**: Reproducible builds, declarative dependencies.

**flake.nix provides**:
- Node.js 20 LTS
- pnpm 9
- PostgreSQL 16
- Redis 7
- Elixir 1.16 (optional, for Phoenix drop engine)

### Vercel (Frontend Hosting)
**Why**: Edge deployment, automatic previews, SvelteKit adapter.

### Railway (Backend Services)
**Why**: Containerized PostgreSQL and Redis with simple scaling.

---

## Observability

### Sentry (Error Tracking)
**Why**: Runtime error capture with source maps for production debugging.

### Vercel Analytics (Performance)
**Why**: Web Vitals monitoring integrated with deployment platform.

### Mixpanel (User Behavior)
**Why**: Custom event tracking for commerce-specific metrics.

---

## Security

### Rate Limiting
- 100 req/min general traffic
- 10 req/min for drop queue entry
- Cloudflare WAF rules

### Bot Protection
- Turnstile CAPTCHA on drop entries
- Device fingerprinting
- Honeypot form fields
- Session tokens (15-min expiry)

---

## Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Edge (Vercel)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   SvelteKit  │  │   Storybook  │  │ Sanity Studio│          │
│  │   Frontend   │  │   Dev Docs   │  │   CMS UI     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    tRPC      │  │   Shopify    │  │    Sanity    │          │
│  │  Internal    │  │  Storefront  │  │  Content API │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer (Railway)                          │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  PostgreSQL  │  │    Redis     │                             │
│  │   Drizzle    │  │   BullMQ     │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Future Considerations

### Phoenix LiveView (Optional)
For Supreme-level traffic, consider adding Phoenix/Elixir backend:
- WebSocket-powered real-time queues
- LiveSvelte integration for hybrid UX
- Proven to handle 10K+ concurrent connections

### AR Try-On
Not in core boilerplate, but architecture supports:
- WebGL components in Svelte
- Model viewer integration
- Cloudinary 3D asset CDN
