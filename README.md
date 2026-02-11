# The Hype Commerce Foundation

**Industrial-grade infrastructure for artisan e-commerce**

## What This Is

A complete e-commerce boilerplate designed for luxury streetwear, automotive configurators, and event-driven "hype drops." This foundation handles 80% of the systems engineering so you can focus on the remaining 20%: brand storytelling and soul-crafting.

Built for brands like Supreme, Stone Island, Ferrari, or Palace who need memorable, performant, one-of-one experiences.

## First Principles

### Why This Exists

Traditional e-commerce platforms force you to choose between:
1. **Speed** (templates) - Fast to launch but indistinguishable from competitors
2. **Customization** (custom builds) - Unique but expensive and slow

The Hype Commerce Foundation provides a third option: **Industrial-grade infrastructure with artisan sensibilities**. You get production-ready systems on day one, with full control to craft your brand's unique experience.

### Core Design Decisions

| Decision | Rationale |
|----------|-----------|
| **SvelteKit** | Minimal JS bundles, superior DX, ideal for high-impact visuals |
| **Tailwind CSS v4** | Utility-first for rapid iteration, CSS Grid for precision |
| **shadcn-svelte** | Copy-paste components you own - no black-box abstractions |
| **Shopify Storefront API** | Battle-tested checkout, inventory, payments infrastructure |
| **PostgreSQL + Drizzle** | Industrial-grade data with TypeScript-native ORM |
| **Redis + BullMQ** | High-concurrency queues for drop-day traffic spikes |
| **Sanity CMS** | Real-time collaboration, visual editing for marketing teams |
| **NixOS** | Reproducible builds, zero "works on my machine" issues |

## Quick Start

```bash
# Enter reproducible development environment
nix develop

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Shopify, Sanity, and database credentials

# Initialize database
pnpm db:push

# Start development (runs SvelteKit, Storybook, Sanity Studio)
pnpm dev
```

## Project Structure

```
hype-commerce-foundation/
├── src/
│   ├── lib/
│   │   ├── components/     # UI components (shadcn-svelte based)
│   │   ├── shopify/        # Shopify API client and queries
│   │   ├── sanity/         # Sanity CMS client and schemas
│   │   ├── server/         # tRPC routers, database, queue system
│   │   └── stores/         # Svelte stores for client state
│   └── routes/             # SvelteKit pages
│       ├── (storefront)/   # Public pages (products, collections, drops)
│       ├── (account)/      # Customer account pages
│       └── api/            # API endpoints
├── stories/                # Storybook component documentation
├── sanity/                 # Sanity Studio configuration
├── drizzle/                # Database migrations
├── openspec/               # Change management and specs
└── docs/                   # Additional documentation
```

## Key Features

### For Developers
- **Type-safe end-to-end**: TypeScript + Zod + tRPC + Drizzle
- **Component isolation**: Storybook 8 with visual regression testing
- **Reproducible env**: NixOS flake - same setup everywhere
- **Pre-commit quality**: ESLint, Prettier, Husky configured

### For Hype Drops
- **Queue system**: Redis-backed virtual queues with fair ordering
- **Raffle system**: Provably random selection for limited releases
- **Countdown components**: Server-synced timers, no client drift
- **Real-time updates**: WebSocket position updates, polling fallback

### For Marketing Teams
- **Visual CMS**: Sanity Studio - create drops, articles, update homepage
- **CSV exports**: One-click export of drop performance, signups
- **No SQL required**: Pre-built dashboards for common queries
- **Scheduled publishing**: Set it and forget it

## Documentation

- [Architecture Decisions](./ARCHITECTURE.md) - Why we chose each technology
- [Progress Log](./PROGRESS.md) - What's been built and when
- [PRD](./PRD.md) - Original product requirements

## Development

See individual documentation for:
- [Component Development](./docs/components.md) - Building UI components
- [API Development](./docs/api.md) - tRPC and Shopify integration
- [Drop System](./docs/drops.md) - Queue and raffle implementation
- [Deployment](./docs/deployment.md) - Vercel and Railway setup

## License

MIT
