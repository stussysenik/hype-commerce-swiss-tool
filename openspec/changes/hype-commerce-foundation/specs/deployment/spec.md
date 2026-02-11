## ADDED Requirements

### Requirement: Vercel deployment configuration
The system SHALL include Vercel configuration for edge deployment with:
- SvelteKit adapter-vercel
- Edge runtime for dynamic routes
- Static generation for content pages

#### Scenario: Deploy to Vercel
- **WHEN** code is pushed to main branch
- **THEN** Vercel builds and deploys automatically

#### Scenario: Preview deployments
- **WHEN** pull request is opened
- **THEN** preview URL is generated for review

### Requirement: Environment variable configuration
The system SHALL define required environment variables for production:
- `SHOPIFY_STORE_DOMAIN` - Shopify store URL
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Public API token
- `SANITY_PROJECT_ID` - Sanity project identifier
- `SANITY_DATASET` - Sanity dataset (production/development)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SENTRY_DSN` - Error tracking (optional)

#### Scenario: Production build
- **WHEN** all required env vars are set
- **THEN** production build completes successfully

#### Scenario: Missing production env
- **WHEN** required env var is missing in production
- **THEN** build fails with clear error

### Requirement: Edge caching configuration
The system SHALL configure caching headers:
- Static assets: 1 year (`max-age=31536000, immutable`)
- Product pages: 5 minutes (`s-maxage=300, stale-while-revalidate`)
- Collection pages: 15 minutes (`s-maxage=900`)
- Cart/checkout: No cache

#### Scenario: Static asset caching
- **WHEN** browser requests JS/CSS file
- **THEN** response includes 1-year cache header

#### Scenario: Product page caching
- **WHEN** edge receives product page request
- **THEN** cached response served if within 5 minutes

### Requirement: Sentry error monitoring
The system SHALL integrate Sentry for error tracking with:
- Source map upload for production builds
- Error boundary components for graceful failures
- Release tracking for deployment correlation

#### Scenario: Runtime error
- **WHEN** unhandled error occurs in production
- **THEN** error is reported to Sentry with stack trace

#### Scenario: Error boundary
- **WHEN** component throws error
- **THEN** error boundary renders fallback UI

### Requirement: Health monitoring
The system SHALL expose health check endpoints compatible with uptime monitoring services.

#### Scenario: Uptime check
- **WHEN** monitoring service pings `/api/health`
- **THEN** 200 response indicates healthy system

#### Scenario: Alert on failure
- **WHEN** health check returns 5xx
- **THEN** monitoring service triggers alert

### Requirement: Performance monitoring
The system SHALL track Core Web Vitals via Vercel Analytics:
- LCP (Largest Contentful Paint) < 2.5s target
- FID (First Input Delay) < 100ms target
- CLS (Cumulative Layout Shift) < 0.1 target

#### Scenario: Performance dashboard
- **WHEN** admin views Vercel dashboard
- **THEN** Web Vitals metrics are displayed with trends

#### Scenario: Performance regression
- **WHEN** LCP exceeds 2.5s threshold
- **THEN** alert is generated for investigation
