# Hype Commerce Swiss Tool

Industrial-grade e-commerce foundation for luxury streetwear and hype drops. Built with SvelteKit, Shopify Storefront API, and battle-tested queue systems.

## Features

- **SvelteKit + Tailwind CSS v4** - Modern frontend with shadcn-svelte components
- **Shopify Storefront API** - Products, collections, cart, and checkout
- **Drop Queue System** - Redis + BullMQ for high-concurrency limited releases
- **Raffle System** - Provably random draws with time-limited purchase links
- **Sanity CMS** - Self-service content management for marketing teams
- **tRPC API** - Type-safe internal endpoints with Zod validation
- **PostgreSQL + Drizzle** - User data, drop entries, wishlists, analytics

## Tech Stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Frontend   | SvelteKit 2, Svelte 5, Tailwind CSS v4 |
| Components | shadcn-svelte, Bits UI                 |
| Commerce   | Shopify Storefront API                 |
| CMS        | Sanity                                 |
| Database   | PostgreSQL + Drizzle ORM               |
| Queue      | Redis + BullMQ                         |
| API        | tRPC                                   |
| Tooling    | TypeScript, ESLint, Prettier, Husky    |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis 7+

Or use Nix:

```bash
nix develop
```

### Installation

```bash
# Clone the repository
git clone https://github.com/stussysenik/hype-commerce-swiss-tool.git
cd hype-commerce-swiss-tool

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

See `.env.example` for all required variables:

| Variable                                 | Description                         |
| ---------------------------------------- | ----------------------------------- |
| `PUBLIC_SHOPIFY_STORE_DOMAIN`            | Your Shopify store domain           |
| `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API token                |
| `DATABASE_URL`                           | PostgreSQL connection string        |
| `REDIS_URL`                              | Redis connection string             |
| `PUBLIC_SANITY_PROJECT_ID`               | Sanity project ID                   |
| `PUBLIC_SANITY_DATASET`                  | Sanity dataset (e.g., `production`) |
| `SANITY_API_TOKEN`                       | Sanity API token for server-side    |

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           # shadcn-svelte base components
│   │   └── sections/     # Hero, ProductGrid, Editorial, etc.
│   ├── shopify/          # Storefront API client & queries
│   ├── sanity/           # CMS client & GROQ queries
│   ├── server/
│   │   ├── db/           # Drizzle schema & migrations
│   │   ├── queue/        # BullMQ queue definitions
│   │   ├── raffle/       # Raffle logic
│   │   └── trpc/         # API routers
│   └── stores/           # Svelte stores (cart, user)
└── routes/
    ├── (storefront)/     # Public pages
    ├── (account)/        # Customer portal
    ├── studio/           # Sanity Studio
    └── api/              # API endpoints
```

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Type check
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format with Prettier
pnpm db:generate  # Generate migrations
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Drizzle Studio
pnpm storybook    # Start Storybook
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Vercel Edge Network                         │
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
└─────────────────┘ └─────────────────┘
          │
          ├──────────────────┬──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │     Redis       │ │  Shopify API    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Documentation

- [DOCS.md](./DOCS.md) - Detailed technical documentation
- [openspec/](./openspec/) - Architecture decisions and specifications

## Implementation Progress

### Completed (Phases 1-9)

- [x] Development environment (Nix, ESLint, Prettier, Husky)
- [x] Component library (shadcn-svelte, Storybook)
- [x] Section components (Hero, ProductGrid, Editorial, Timeline)
- [x] Database layer (Drizzle ORM, PostgreSQL schema)
- [x] Shopify integration (Storefront API, TanStack Query)
- [x] tRPC API layer (drops, user, analytics routers)
- [x] Redis queue system (BullMQ, position updates)
- [x] Raffle system (random selection, purchase links)
- [x] Sanity CMS integration (content models, GROQ queries)

### In Progress (Phases 10-13)

- [ ] Page routes (homepage, collections, products, drops)
- [ ] Performance & security (caching, rate limiting, CAPTCHA)
- [ ] Deployment (Vercel, monitoring, error tracking)
- [ ] Documentation updates

## License

MIT
