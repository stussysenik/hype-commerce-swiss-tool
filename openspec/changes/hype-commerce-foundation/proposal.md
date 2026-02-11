## Why

Building custom e-commerce for luxury/hype brands currently requires choosing between generic templates (fast but forgettable) or custom builds (unique but expensive and slow). The Hype Commerce Foundation provides industrial-grade infrastructure with artisan sensibilities—80% of systems engineering ready on day one, so teams can focus on brand storytelling.

## What Changes

- **New SvelteKit application** with Tailwind CSS v4, shadcn-svelte components, and TypeScript
- **Shopify Storefront API integration** for products, collections, cart, and checkout
- **Custom drop system** with Redis-backed queues and raffle functionality for limited releases
- **Sanity CMS integration** for editorial content, drop stories, and marketing team self-service
- **PostgreSQL database** with Drizzle ORM for user data, drop entries, wishlists, and analytics
- **tRPC API layer** for type-safe internal endpoints (queue management, raffles, analytics exports)
- **Storybook component library** with pre-built sections for hype commerce patterns
- **NixOS development environment** for reproducible builds across all machines
- **Vercel deployment configuration** with edge caching and performance optimization

## Capabilities

### New Capabilities

- `frontend-core`: SvelteKit application structure, routing, Tailwind CSS v4, shadcn-svelte component library, Storybook integration
- `shopify-commerce`: Shopify Storefront API client, product/collection queries, cart functionality, TanStack Query caching
- `drop-queue-system`: Redis + BullMQ queue for high-concurrency drops, real-time position updates, fair ordering
- `raffle-system`: Provably random raffle draws, winner notification, time-limited purchase links
- `cms-content`: Sanity CMS integration, drop stories, editorial articles, global settings, visual editing
- `database-layer`: PostgreSQL schema with Drizzle ORM, user profiles, drop entries, wishlists, analytics events
- `api-layer`: tRPC routers for drops, user data, analytics; CSV export endpoints for marketing
- `dev-environment`: NixOS flake, ESLint/Prettier/Husky configuration, git hooks
- `deployment`: Vercel configuration, environment variables, health checks, monitoring setup

### Modified Capabilities

*(None - this is a greenfield implementation)*

## Impact

- **New project structure**: Complete SvelteKit application with `src/lib/`, `src/routes/`, `stories/`, `sanity/`, `drizzle/` directories
- **External dependencies**: Shopify store (Storefront API access), Sanity project, PostgreSQL database, Redis instance
- **Environment configuration**: Multiple environment variables for Shopify, Sanity, database, Redis connections
- **Deployment infrastructure**: Vercel account for frontend, Railway or similar for PostgreSQL/Redis
- **Development tooling**: NixOS or Docker for reproducible environment, pnpm as package manager
