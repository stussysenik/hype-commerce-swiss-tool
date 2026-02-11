# **The Hype Commerce Foundation™**
## Product Requirements Document (PRD)
**Version 1.0 | February 2026**

***

## Executive Vision

Build an **industrial-grade, artisan-first e-commerce boilerplate** that handles 80% of systems engineering for luxury streetwear, automotive configurators, and event-driven "hype drops." The remaining 20% is pure brand storytelling and soul-crafting. This foundation enables you to collaborate with Supreme, Stone Island, Ferrari, or Palace and deliver a memorable, performant, one-of-one experience in days—not months.

***

## Design Philosophy

### Core Principles
1. **Industrial-Grade Performance** - Sub-2s page loads, handles 10K+ concurrent users during drops [countvalentine](https://countvalentine.com/blogs/fashion/rise-of-limited-edition-drops-luxury-fashion)
2. **Evidence-Based Stack** - Every tool chosen for proven production performance, not hype
3. **Artisan DX** - Developer joy matters; if it feels clunky, it's wrong
4. **Storytelling-First** - Components designed for editorial layouts, not generic grids
5. **Marketing-Friendly** - PR teams get CSV exports, visual dashboards, no SQL required
6. **NixOS Native** - Reproducible builds, declarative dependencies

***

## Technical Architecture

### The Stack (Non-Negotiable Foundations)

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend Framework** | SvelteKit | Minimal JS bundles, superior DX, ideal for artisan sites  [blog.logrocket](https://blog.logrocket.com/build-ecommerce-site-sveltekit-shopify-apis/) |
| **Styling System** | Tailwind CSS v4 + CSS Grid | Utility-first rapid prototyping meets precision layout control |
| **Design System** | shadcn-svelte + Bits UI | Copy-paste components you own; no black-box abstractions  [shadcn-svelte](https://www.shadcn-svelte.com/docs) |
| **Type Safety** | TypeScript + Zod | Runtime validation meets compile-time safety |
| **API Layer (Shopify)** | GraphQL via @shopify/storefront-api-client | Official SDK, optimized for Shopify Storefront API  [shopify](https://www.shopify.com/hk-en/enterprise/blog/ecommerce-api) |
| **API Layer (Internal)** | tRPC | End-to-end type safety for custom features (queues, raffles)  [cleancommit](https://cleancommit.io/blog/trpc-vs-graphql-how-to-choose-the-best-option-for-your-next-project/) |
| **State Management** | TanStack Query (Svelte Query) + Svelte Stores | Server state vs. client state separation; no Zustand needed  [tanstack](https://tanstack.com/query/latest) |
| **Database** | PostgreSQL + Drizzle ORM | Industrial-grade relational data with TypeScript-native ORM |
| **CMS** | Sanity CMS | Real-time collaboration, visual editing, image CDN included  [somethingsblog](https://www.somethingsblog.com/2024/10/20/sveltekit-shopify-how-to-build-a-lightning-fast-ecommerce-site/) |
| **Component Dev** | Storybook 8 + Svelte CSF | Isolated component development, visual regression testing |
| **Image Optimization** | Cloudinary | Global CDN, on-the-fly transformations for product photography |
| **Payments** | Shopify Checkout + Stripe (for custom flows) | Don't reinvent; use battle-tested infrastructure |
| **Queue System (Drops)** | Redis + BullMQ | High-concurrency job queues for waitlists and timed releases |
| **Real-Time (Optional)** | Phoenix LiveView + LiveSvelte | WebSocket-powered queues for Supreme-level traffic  [github](https://github.com/woutdp/live_svelte) |
| **Analytics** | Mixpanel + Shopify Analytics | User behavior tracking meets commerce metrics |
| **Hosting** | Vercel (SvelteKit) + Railway (Phoenix/PostgreSQL) | Edge deployment for frontend, containerized backend |

***

## Developer Experience (CLI-First Setup)

### Initial Project Bootstrap

```bash
# NixOS environment setup
nix develop

# Initialize project (custom CLI template)
npx degit your-username/hype-commerce-foundation my-project
cd my-project

# Install dependencies
pnpm install

# Setup Shopify connection
shopify hydrogen env pull

# Initialize database
pnpm db:push

# Start dev environment (runs SvelteKit, Storybook, Sanity Studio)
pnpm dev

# Optional: Start Phoenix drop engine
cd elixir_engine && mix phx.server
```

### Tooling & Automation (Pre-Configured)

#### ESLint Configuration
- `@sveltejs/eslint-config` - Official Svelte standards
- `eslint-plugin-tailwindcss` - Enforce utility class conventions
- `eslint-plugin-drizzle` - Prevent ORM anti-patterns
- **Custom Rules:**
  - Max function length: 50 lines
  - Enforce descriptive variable names (no `x`, `data`, `temp`)
  - Require Zod validation at API boundaries

#### Prettier Configuration
- `prettier-plugin-svelte` - Svelte syntax formatting
- `prettier-plugin-tailwindcss` - Auto-sort utility classes [stackoverflow](https://stackoverflow.com/questions/75228527/how-to-get-the-tailwindcss-prettier-plugin-to-work-with-svelte)
- Tab width: 2 spaces
- Single quotes, trailing commas

#### Husky + lint-staged
```json
{
  "pre-commit": "lint-staged",
  "pre-push": "pnpm test && pnpm build"
}
```
**lint-staged rules:**
- `*.{js,ts,svelte}`: ESLint auto-fix, Prettier format
- `*.{css,scss}`: Prettier format
- Type-check all staged files [dev](https://dev.to/ibrahimalanshor/how-to-set-up-eslint-prettier-husky-and-lint-staged-in-a-typescript-project-180o)

#### Git Hooks Philosophy
- **Pre-commit**: Fast checks (linting, formatting)
- **Pre-push**: Expensive checks (tests, build verification)
- Never block flow; fail gracefully with clear messages

***

## Frontend Architecture

### Design System Structure

#### Component Library (shadcn-svelte Base)
**Unstyled Foundation (Bits UI primitives):**
- Accordion, Alert, Avatar, Badge, Button
- Card, Carousel, Checkbox, Combobox, Dialog
- Drawer, Dropdown Menu, Form, Input, Label
- Popover, Progress, Radio Group, Select, Slider
- Switch, Table, Tabs, Textarea, Toast, Tooltip

**Styled Variants (Brand-Ready):**
- **Luxury Minimalist** - Aime Leon Dore, The Row aesthetic
- **Hype Bold** - Supreme, Palace energy
- **Tech Premium** - Nike ACG, Stone Island industrial
- **Automotive** - Ferrari, Porsche configurator style

#### Layout System
**CSS Grid Foundations:**
- 12-column responsive grid (breakpoints: sm/md/lg/xl/2xl)
- Editorial layouts: 50/50 split, asymmetric hero, mosaic grids
- Product grids: 2/3/4 column adaptive
- **No framework lock-in** - Pure CSS Grid + Tailwind utilities

**Pre-Built Sections:**
- Hero (video background, countdown overlay, CTA)
- Product Grid (filter sidebar, infinite scroll)
- Editorial Split (image/text 50/50 with parallax)
- Timeline (drop calendar, brand history)
- Testimonial Carousel (customer quotes, video embeds)
- Newsletter (email capture, Klaviyo integration)

### Page Structure (`/routes`)

```
/                          → Homepage (dynamic hero, featured drops)
/collections/[handle]      → Collection listing (filters, sort)
/products/[handle]         → Product detail (gallery, size chart, reviews)
/drops                     → Drop calendar (upcoming releases)
/drops/[slug]              → Drop detail (countdown, queue entry)
/archive                   → Past collections (seasonal archives)
/stories                   → Editorial content (CMS-powered)
/stories/[slug]            → Article detail (full-bleed images, video)
/account                   → Customer portal (orders, wishlist)
/cart                      → Cart page (upsells, discount codes)
/checkout                  → Shopify-hosted checkout redirect
```

### Storybook Integration

**Setup:**
- Storybook 8 with Svelte CSF (Component Story Format)
- Chromatic visual regression testing
- Accessibility checks via @storybook/addon-a11y

**Story Organization:**
```
/stories
  /foundations     → Colors, typography, spacing, icons
  /components      → Buttons, inputs, cards (all variants)
  /sections        → Hero, product grid, editorial blocks
  /pages           → Full page compositions
  /commerce        → Cart drawer, product quick-add, filters
```

**Developer Workflow:**
1. Build component in Storybook isolation
2. Visual review + accessibility audit
3. Export to `/lib/components`
4. Integration test in actual routes

***

## Backend Architecture

### Database Schema (PostgreSQL + Drizzle)

**Core Tables:**
```
users                → Customer profiles (synced from Shopify)
  - id, shopify_customer_id, email, tier (standard/vip)
  
drops                → Limited releases
  - id, title, slug, release_date, stock_total, stock_remaining
  
drop_entries         → Queue/raffle participants
  - id, user_id, drop_id, entry_time, status (pending/confirmed/lost)
  
wishlists            → User-saved products
  - id, user_id, shopify_product_id, added_at
  
analytics_events     → Custom event tracking
  - id, event_type, user_id, metadata (JSONB), created_at
```

**Marketing Export Views:**
```sql
-- Pre-built views for CSV exports
CREATE VIEW marketing_drop_performance AS
  SELECT drops.title, COUNT(entries) as total_entries, 
         stock_total, conversion_rate
  FROM drops JOIN drop_entries ...
```

### tRPC API Routes

**Internal API (Custom Features):**
```
/api/drops
  - queue.join({ dropId, userId })           → Enter drop queue
  - queue.status({ dropId, userId })         → Check queue position
  - raffle.enter({ dropId, email })          → Raffle entry
  
/api/user
  - wishlist.add({ productId })
  - wishlist.get()
  - tier.check({ userId })                   → VIP status
  
/api/analytics
  - track.event({ eventType, metadata })
  - export.csv({ startDate, endDate })       → Marketing dashboard
```

### Shopify GraphQL Integration

**Optimized Queries (Pre-Built):**
- `getProduct(handle)` - Product detail with variants, metafields
- `getCollection(handle)` - Products with filtering support
- `searchProducts(query)` - Semantic search
- `getCart(cartId)` - Cart contents with line items
- `createCart()` - Initialize cart
- `addToCart(cartId, variantId, quantity)` - Cart mutations

**Caching Strategy:**
- TanStack Query with 5-minute stale time for products
- Aggressive caching for collections (15 minutes)
- Real-time updates for cart (no cache)
- CDN edge caching for static content

***

## CMS Architecture (Sanity)

### Content Models

**Drop Story:**
- Title, slug, release_date
- Hero image/video
- Story blocks (rich text, image galleries, video embeds)
- Related products (Shopify product references)

**Editorial Article:**
- Title, slug, category
- Featured image
- Content blocks (modular: text, image, quote, video, product grid)
- Author, publish_date

**Global Settings:**
- Site metadata (SEO defaults)
- Navigation menus (header/footer)
- Announcement bar
- Social links

### Marketing Team Access

**Sanity Studio Features:**
- Visual editor (WYSIWYG-like)
- Image drag-drop with automatic optimization
- Preview mode (see changes before publish)
- Scheduling (publish at specific time)

**Export Capabilities:**
- Drop performance → CSV (entries, conversion rate)
- Newsletter signups → CSV (Klaviyo import format)
- Analytics events → CSV (custom date ranges)
- All via `/api/analytics/export` tRPC endpoint

***

## Industrial-Grade Features

### Performance Optimizations

**Image Handling:**
- Cloudinary auto-format (WebP/AVIF)
- Responsive srcsets (6 breakpoint sizes)
- Lazy loading with blur-up placeholders
- Priority loading for above-fold images

**Code Splitting:**
- Route-based splitting (automatic in SvelteKit)
- Component-level lazy loading for heavy modules (video players, carousels)
- Critical CSS inlined, rest deferred

**Caching Strategy:**
- Static assets: 1 year cache
- Product data: 5 minutes (TanStack Query)
- Collection data: 15 minutes
- Drop countdowns: 1 second polling
- Edge CDN for all static routes

### Security & Bot Protection

**Rate Limiting:**
- 100 requests/minute per IP (general)
- 10 requests/minute for drop queue entry
- Cloudflare WAF rules

**Anti-Bot Measures:**
- Turnstile CAPTCHA on drop entries
- Device fingerprinting
- Honeypot fields on forms
- Session tokens with 15-minute expiry

### Monitoring & Observability

**Error Tracking:**
- Sentry for runtime errors (frontend + backend)
- Source maps for debugging production issues

**Performance Monitoring:**
- Vercel Analytics (Web Vitals)
- Custom RUM (Real User Monitoring) via Mixpanel

**Uptime Monitoring:**
- Better Uptime for critical endpoints
- Slack alerts for 5xx errors

***

## Hype-Specific Features

### Drop Queue System

**User Flow:**
1. User lands on `/drops/supreme-box-logo` 10 minutes before release
2. Countdown displayed (synced via server time, not client)
3. At T-0, "Join Queue" button appears
4. User clicks → enters Redis-backed virtual queue
5. Queue position displayed (e.g., "You are #284 in line")
6. When their turn arrives (FIFO), "Shop Now" unlocks for 10 minutes
7. If they don't purchase, spot released back to queue

**Technical Implementation:**
- BullMQ for job processing
- Redis for queue state
- WebSocket updates for position changes
- Fallback to polling if WebSocket unavailable

### Raffle System

**User Flow:**
1. Limited drop (e.g., Ferrari collaboration, 50 units)
2. User enters raffle 72 hours before draw
3. Email confirmation sent
4. At draw time, algorithm selects winners (provably random)
5. Winners get exclusive purchase link (24-hour expiry)
6. Losers notified, added to waitlist

**Marketing Dashboard:**
- Total entries
- Winner list (exportable CSV)
- Conversion rate (winners who purchased)

### Archive/Vault

**Purpose:** Show brand heritage, drive resale legitimacy [countvalentine](https://countvalentine.com/blogs/fashion/rise-of-limited-edition-drops-luxury-fashion)

**Features:**
- Filterable by season/year/category
- "Originally $X, now worth $Y on StockX" badges
- "Notify me if restocked" waitlist
- Editorial stories per collection

***

## Collaboration & Handoff Tools

### Marketing Team Tools

**Sanity Studio Dashboard:**
- `/studio` → Visual CMS (accessible to non-technical users)
- Create drops, articles, update homepage hero
- Schedule content publication

**Analytics Dashboard (`/admin/analytics`):**
- Drop performance charts
- Top-selling products
- Traffic sources
- Email capture rate
- Export all as CSV with one click

### Developer Maintenance

**Documentation (Auto-Generated):**
- Storybook component docs
- tRPC API docs (auto from TypeScript types)
- Database schema diagrams (via Drizzle Kit)

**Health Checks:**
- `/api/health` endpoint (database, Redis, Shopify API status)
- Automated tests (Playwright for E2E, Vitest for unit)
- Pre-deploy smoke tests in CI/CD

***

## NixOS Integration

### Reproducible Environment

**`flake.nix` Includes:**
- Node.js 20 LTS
- pnpm 9
- PostgreSQL 16
- Redis 7
- Elixir 1.16 + Erlang/OTP 26 (if using Phoenix)
- Shopify CLI

**Benefits:**
- `nix develop` gives identical environment on any machine
- Lock file pins all versions
- Zero "works on my machine" issues

### Deployment

**Build Process:**
```bash
nix build .#hype-commerce-frontend  → SvelteKit production build
nix build .#hype-commerce-backend   → Phoenix release (optional)
```

**Docker Alternative:**
- Nix can generate Docker images
- Deploy to Railway/Fly.io via containerized build

***

## Visual Identity System

### Typography Scale
- **Headings:** 10/12/14/16/20/24/32/48/64/96px (Tailwind defaults)
- **Primary Font:** Inter Variable (system fallback: -apple-system)
- **Luxury Variant:** Suisse Intl (licensed font for high-end brands)
- **Monospace:** JetBrains Mono (for technical specs, SKU numbers)

### Color System (Adaptive)
Each brand gets custom palette generated from:
- Primary (brand accent)
- Neutral (50-950 scale)
- Semantic (success/error/warning)
- **Mode:** Dark mode mandatory (OLED-optimized blacks)

### Motion Design
- Page transitions: 150ms ease-out
- Micro-interactions: 100ms (hover states)
- Heavy animations: 300ms (modals, drawers)
- **Principle:** Intentional, never gratuitous

***

## Success Metrics (Built-In Tracking)

### Commerce KPIs
- Conversion rate (overall + per drop)
- Average order value
- Cart abandonment rate
- Time to checkout

### Technical KPIs
- Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- Error rate (<0.1%)
- API response time (p95 <200ms)
- Uptime (99.9% SLA)

### Marketing KPIs
- Email capture rate
- Social shares per drop
- Returning customer rate
- Queue-to-purchase conversion

***

## Out-of-Scope (Intentionally)

- **Admin CMS beyond Sanity** - Use Shopify admin for inventory management
- **Custom payment processing** - Stripe/Shopify only, never build from scratch
- **Native mobile apps** - PWA-first; native only if client funds separately
- **AR try-on** - Optional module, not in core boilerplate

***

## Build Timeline (Starting Today)

**Week 1: Foundation**
- NixOS flake setup
- SvelteKit + Tailwind scaffold
- ESLint/Prettier/Husky config
- Storybook initialization
- shadcn-svelte component library

**Week 2: Commerce Core**
- Shopify Storefront API integration
- Product/collection pages
- Cart functionality
- TanStack Query setup
- Drizzle + PostgreSQL schema

**Week 3: Hype Features**
- Drop countdown components
- Queue system (Redis + BullMQ)
- Raffle logic
- tRPC API routes

**Week 4: CMS & Storytelling**
- Sanity integration
- Editorial layouts
- Archive/vault pages
- Dynamic homepage

**Week 5: Polish & Deploy**
- Performance optimization
- Accessibility audit
- Vercel deployment
- Monitoring setup (Sentry, Better Uptime)

**Week 6: Documentation**
- Developer README
- Marketing team guide
- Component library docs
- Handoff package

***

## The End Goal

A **single CLI command** to generate a production-ready, artisan-quality e-commerce site that handles Supreme-level drops, tells Ferrari-level stories, and gives you 80% completion on day one. The remaining 20% is pure brand soul—photography, copywriting, and the intangible magic only you can craft.

This is not a template. **This is industrial-grade infrastructure with artisan sensibilities.** The foundation breathes, scales, and gets out of your way so you can focus on what matters: creating 1:1 experiences that luxury brands will pay premium rates to own.
