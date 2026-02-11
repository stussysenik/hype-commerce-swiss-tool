# Deployment Guide

## Vercel

The project is configured for [Vercel](https://vercel.com/) using `@sveltejs/adapter-vercel`.

### Setup

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect SvelteKit and use the configuration from `vercel.json`
3. Set all environment variables from `.env.example` in the Vercel dashboard

### Configuration

`svelte.config.js`:
- Runtime: Node.js 20.x
- Region: `iad1` (US East)
- Split routing enabled for optimal cold start times

`vercel.json`:
- Build command: `pnpm build`
- Security headers applied globally
- Health check cron: every 5 minutes at `/api/health`

### Environment Variables

Set these in the Vercel dashboard under Settings > Environment Variables:

| Variable | Required | Description |
| --- | --- | --- |
| `PUBLIC_SHOPIFY_STORE_DOMAIN` | Yes | Shopify store domain |
| `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes | Storefront API token |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `PUBLIC_SANITY_DATASET` | Yes | Sanity dataset |
| `SANITY_API_TOKEN` | Yes | Sanity server token |
| `SENTRY_DSN` | No | Sentry error tracking DSN |
| `SENTRY_ENVIRONMENT` | No | Sentry environment name |
| `SESSION_SECRET` | Yes | 32+ char secret for session tokens |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile secret |
| `PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name for images |

### Preview Deployments

Every pull request gets an automatic preview deployment. Preview deployments:
- Use the same build configuration
- Can have separate environment variables (set via Vercel dashboard)
- Are accessible at `<branch>-<project>.vercel.app`

## Database (PostgreSQL)

### Recommended Providers

- [Neon](https://neon.tech/) - Serverless PostgreSQL, generous free tier
- [Supabase](https://supabase.com/) - PostgreSQL with realtime
- [Railway](https://railway.app/) - Managed PostgreSQL

### Setup

```bash
# Push schema to database
pnpm db:push

# Or generate and run migrations
pnpm db:generate
pnpm db:migrate
```

## Redis

### Recommended Providers

- [Upstash](https://upstash.com/) - Serverless Redis, pay-per-request
- [Railway](https://railway.app/) - Managed Redis

### Requirements

- Redis 7+
- Persistence enabled (for queue data durability)
- At least 256MB memory for production workloads

## Monitoring

### Sentry Error Tracking

The project uses a lightweight Sentry integration via HTTP API (no SDK required). Set `SENTRY_DSN` to enable.

Errors are automatically captured in `hooks.server.ts` via `handleError`. Each error includes:
- Error ID for user-facing reference
- URL and HTTP method
- User agent
- Stack trace

### Vercel Analytics

Web Vitals (LCP, FID, CLS, TTFB) are automatically tracked via `@vercel/analytics` and `@vercel/speed-insights`. These load only in production and are dynamically imported to avoid impacting bundle size.

### Health Check

`GET /api/health` returns:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "uptime": 3600,
  "memory": { "rss": 128 }
}
```

Vercel cron is configured to ping this every 5 minutes. Connect to an uptime monitoring service (e.g., BetterUptime, Pingdom) for alerting.

## Caching Strategy

Defined in `src/hooks.server.ts`:

| Route Type | Cache-Control |
| --- | --- |
| Static assets (`/_app/`) | `public, max-age=31536000, immutable` |
| Product pages | `public, max-age=300, s-maxage=600, stale-while-revalidate=60` |
| Collection pages | `public, max-age=900, s-maxage=1800, stale-while-revalidate=60` |
| Stories/editorial | `public, max-age=1800, s-maxage=3600, stale-while-revalidate=120` |
| API routes | `no-store` |
