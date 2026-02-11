## ADDED Requirements

### Requirement: tRPC router setup
The system SHALL use tRPC for type-safe internal API endpoints. Router SHALL be configured with Zod validation for all inputs.

#### Scenario: API request
- **WHEN** frontend calls tRPC procedure
- **THEN** request is type-checked at compile time

#### Scenario: Input validation
- **WHEN** request contains invalid input
- **THEN** Zod validation error is returned with details

### Requirement: Drops API router
The system SHALL provide drops router with procedures:
- `drops.queue.join({ dropId })` - Enter queue
- `drops.queue.status({ dropId })` - Get queue position
- `drops.queue.leave({ dropId })` - Exit queue
- `drops.raffle.enter({ dropId, email })` - Enter raffle
- `drops.raffle.status({ dropId })` - Check raffle status

#### Scenario: Join queue
- **WHEN** authenticated user calls queue.join
- **THEN** user is added to Redis queue and position returned

#### Scenario: Queue status
- **WHEN** user calls queue.status
- **THEN** current position and estimated wait returned

### Requirement: User API router
The system SHALL provide user router with procedures:
- `user.wishlist.add({ productId })` - Save product
- `user.wishlist.remove({ productId })` - Remove product
- `user.wishlist.list()` - Get all saved products
- `user.tier.get()` - Get current tier

#### Scenario: Add to wishlist
- **WHEN** authenticated user calls wishlist.add
- **THEN** product is saved to user's wishlist

#### Scenario: List wishlist
- **WHEN** user calls wishlist.list
- **THEN** array of saved product IDs returned

### Requirement: Analytics API router
The system SHALL provide analytics router with procedures:
- `analytics.track({ eventType, metadata })` - Record event
- `analytics.export({ startDate, endDate, type })` - Generate CSV

#### Scenario: Track event
- **WHEN** frontend calls analytics.track
- **THEN** event is recorded to database

#### Scenario: Export CSV
- **WHEN** marketing user calls export with date range
- **THEN** CSV file URL is returned for download

### Requirement: Health check endpoint
The system SHALL provide `/api/health` endpoint returning status of:
- Database connection
- Redis connection
- Shopify API reachability

#### Scenario: All healthy
- **WHEN** all services are reachable
- **THEN** returns 200 with `{ status: "healthy" }`

#### Scenario: Service down
- **WHEN** database is unreachable
- **THEN** returns 503 with `{ status: "unhealthy", details: {...} }`

### Requirement: Authentication middleware
The system SHALL require authentication for user-specific endpoints. Session SHALL be managed via Shopify customer access tokens or custom JWT.

#### Scenario: Authenticated request
- **WHEN** request includes valid auth token
- **THEN** user context is available in procedure

#### Scenario: Unauthenticated request
- **WHEN** protected endpoint called without auth
- **THEN** returns 401 Unauthorized error
