## 1. Development Environment Setup

- [x] 1.1 Create flake.nix with Node.js 20, pnpm 9, PostgreSQL 16, Redis 7
- [x] 1.2 Create .env.example with all required environment variables
- [x] 1.3 Initialize SvelteKit project with TypeScript
- [x] 1.4 Configure Tailwind CSS v4 with custom design tokens
- [x] 1.5 Set up ESLint with svelte, tailwindcss, and drizzle plugins
- [x] 1.6 Configure Prettier with svelte and tailwindcss plugins
- [x] 1.7 Set up Husky with pre-commit (lint-staged) and pre-push hooks
- [x] 1.8 Create package.json scripts (dev, build, lint, format, db:*)

## 2. Component Library Foundation

- [ ] 2.1 Install and configure shadcn-svelte with Bits UI
- [ ] 2.2 Add base components: Button, Input, Label, Card, Badge
- [ ] 2.3 Add form components: Checkbox, Select, Textarea, Form
- [ ] 2.4 Add overlay components: Dialog, Drawer, Popover, Toast
- [ ] 2.5 Add navigation components: Tabs, Accordion, Dropdown Menu
- [ ] 2.6 Initialize Storybook 8 with Svelte CSF
- [ ] 2.7 Create stories for all base components
- [ ] 2.8 Configure Storybook accessibility addon

## 3. Section Components

- [ ] 3.1 Create Hero section component with video background support
- [ ] 3.2 Create Product Grid section with filter sidebar
- [ ] 3.3 Create Editorial Split section (50/50 image/text)
- [ ] 3.4 Create Timeline section for drop calendar
- [ ] 3.5 Create Newsletter section with email capture
- [ ] 3.6 Create Testimonial Carousel section
- [ ] 3.7 Add Storybook stories for all section components

## 4. Database Layer

- [ ] 4.1 Set up Drizzle ORM with PostgreSQL driver
- [ ] 4.2 Create users table schema
- [ ] 4.3 Create drops table schema
- [ ] 4.4 Create drop_entries table schema with status enum
- [ ] 4.5 Create wishlists table schema
- [ ] 4.6 Create analytics_events table with JSONB metadata
- [ ] 4.7 Create marketing_drop_performance view
- [ ] 4.8 Configure Drizzle Kit for migrations
- [ ] 4.9 Generate initial migration and test db:push

## 5. Shopify Integration

- [ ] 5.1 Install @shopify/storefront-api-client
- [ ] 5.2 Create Shopify client with environment configuration
- [ ] 5.3 Implement getProduct query with variants and metafields
- [ ] 5.4 Implement getProducts query with pagination
- [ ] 5.5 Implement getCollection query with product filtering
- [ ] 5.6 Implement searchProducts query
- [ ] 5.7 Implement cart operations (create, get, add, update, remove)
- [ ] 5.8 Set up TanStack Query with configured cache times
- [ ] 5.9 Create cart store with persistence

## 6. tRPC API Layer

- [ ] 6.1 Set up tRPC with SvelteKit adapter
- [ ] 6.2 Create drops router with queue.join, queue.status, queue.leave
- [ ] 6.3 Create drops router with raffle.enter, raffle.status
- [ ] 6.4 Create user router with wishlist operations
- [ ] 6.5 Create user router with tier.get
- [ ] 6.6 Create analytics router with track.event
- [ ] 6.7 Create analytics router with export.csv
- [ ] 6.8 Implement authentication middleware
- [ ] 6.9 Create /api/health endpoint

## 7. Redis Queue System

- [ ] 7.1 Set up Redis client with connection pooling
- [ ] 7.2 Install and configure BullMQ
- [ ] 7.3 Create drop queue with FIFO ordering
- [ ] 7.4 Implement queue position lookup
- [ ] 7.5 Implement purchase window timer (10 minutes)
- [ ] 7.6 Create WebSocket endpoint for position updates
- [ ] 7.7 Implement polling fallback for position updates
- [ ] 7.8 Add rate limiting (10 req/min for queue entry)

## 8. Raffle System

- [ ] 8.1 Create raffle entry endpoint with email validation
- [ ] 8.2 Implement duplicate entry prevention
- [ ] 8.3 Create provably random winner selection using crypto
- [ ] 8.4 Generate time-limited purchase links (24-hour expiry)
- [ ] 8.5 Implement winner notification email
- [ ] 8.6 Implement loser notification with waitlist
- [ ] 8.7 Create raffle dashboard queries for marketing

## 9. Sanity CMS Integration

- [ ] 9.1 Create Sanity project and configure client
- [ ] 9.2 Define Drop Story content model
- [ ] 9.3 Define Editorial Article content model
- [ ] 9.4 Define Global Settings content model
- [ ] 9.5 Set up Sanity Studio at /studio route
- [ ] 9.6 Create GROQ queries for content fetching
- [ ] 9.7 Implement preview mode for draft content

## 10. Page Routes

- [ ] 10.1 Create homepage with dynamic hero and featured drops
- [ ] 10.2 Create /collections/[handle] with filters and sorting
- [ ] 10.3 Create /products/[handle] with gallery and size chart
- [ ] 10.4 Create /drops calendar page
- [ ] 10.5 Create /drops/[slug] with countdown and queue entry
- [ ] 10.6 Create /archive vault with filtering
- [ ] 10.7 Create /stories editorial listing
- [ ] 10.8 Create /stories/[slug] article detail
- [ ] 10.9 Create /account customer portal
- [ ] 10.10 Create /cart page with upsells

## 11. Performance & Security

- [ ] 11.1 Configure image optimization with Cloudinary
- [ ] 11.2 Implement lazy loading with blur-up placeholders
- [ ] 11.3 Set up route-based code splitting
- [ ] 11.4 Configure caching headers (static, product, collection)
- [ ] 11.5 Implement rate limiting middleware (100 req/min general)
- [ ] 11.6 Add Turnstile CAPTCHA for drop entries
- [ ] 11.7 Implement honeypot fields on forms
- [ ] 11.8 Configure session tokens with 15-minute expiry

## 12. Deployment & Monitoring

- [ ] 12.1 Configure adapter-vercel for SvelteKit
- [ ] 12.2 Set up Vercel project with environment variables
- [ ] 12.3 Configure preview deployments for PRs
- [ ] 12.4 Set up Sentry error tracking with source maps
- [ ] 12.5 Create error boundary components
- [ ] 12.6 Enable Vercel Analytics for Web Vitals
- [ ] 12.7 Configure health check for uptime monitoring

## 13. Documentation

- [ ] 13.1 Update README with complete setup instructions
- [ ] 13.2 Create docs/components.md for component development guide
- [ ] 13.3 Create docs/api.md for tRPC and Shopify integration
- [ ] 13.4 Create docs/drops.md for queue and raffle system
- [ ] 13.5 Create docs/deployment.md for Vercel and Railway setup
- [ ] 13.6 Update PROGRESS.md with all completed work
