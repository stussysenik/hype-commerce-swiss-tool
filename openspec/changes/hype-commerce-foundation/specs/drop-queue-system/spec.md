## ADDED Requirements

### Requirement: Drop countdown display
The system SHALL display server-synced countdowns for upcoming drops. Countdown SHALL use server time (not client) to prevent manipulation.

#### Scenario: Countdown before drop
- **WHEN** user views drop page before release time
- **THEN** countdown displays time remaining until release

#### Scenario: Countdown reaches zero
- **WHEN** countdown reaches zero
- **THEN** "Join Queue" button becomes active

#### Scenario: Server time sync
- **WHEN** client clock differs from server
- **THEN** countdown uses server-provided time reference

### Requirement: Virtual queue with Redis
The system SHALL implement a Redis-backed virtual queue using BullMQ for job processing. Queue SHALL use FIFO (first-in-first-out) ordering.

#### Scenario: User joins queue
- **WHEN** user clicks "Join Queue" at release time
- **THEN** user is added to Redis queue with timestamp

#### Scenario: Queue position tracking
- **WHEN** user is in queue
- **THEN** current position is displayed (e.g., "You are #284 in line")

#### Scenario: Queue deduplication
- **WHEN** same user attempts to join queue multiple times
- **THEN** only first entry is recorded

### Requirement: Queue position updates
The system SHALL provide real-time queue position updates via WebSocket with polling fallback.

#### Scenario: WebSocket position update
- **WHEN** users ahead in queue complete or abandon
- **THEN** position updates via WebSocket within 2 seconds

#### Scenario: Polling fallback
- **WHEN** WebSocket connection fails
- **THEN** system falls back to 5-second polling interval

### Requirement: Purchase window
The system SHALL grant 10-minute exclusive purchase windows when user reaches front of queue.

#### Scenario: Turn arrives
- **WHEN** user reaches front of queue
- **THEN** "Shop Now" button unlocks for 10 minutes

#### Scenario: Window expiration
- **WHEN** 10-minute window expires without purchase
- **THEN** spot is released back to queue

#### Scenario: Successful purchase
- **WHEN** user completes purchase within window
- **THEN** user is removed from queue permanently

### Requirement: Rate limiting for queue entry
The system SHALL limit queue entry attempts to 10 requests per minute per IP to prevent bot abuse.

#### Scenario: Rate limit exceeded
- **WHEN** IP exceeds 10 queue join attempts per minute
- **THEN** subsequent requests return 429 error with retry-after header

#### Scenario: Rate limit reset
- **WHEN** 60 seconds pass after rate limit hit
- **THEN** user can attempt queue entry again
