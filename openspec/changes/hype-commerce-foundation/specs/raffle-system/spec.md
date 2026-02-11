## ADDED Requirements

### Requirement: Raffle entry
The system SHALL allow users to enter raffles for limited-quantity drops. Entry SHALL require email address and optional account linkage.

#### Scenario: Enter raffle
- **WHEN** user submits email for raffle entry
- **THEN** entry is recorded and confirmation email is sent

#### Scenario: Duplicate entry prevention
- **WHEN** same email attempts to enter same raffle twice
- **THEN** second entry is rejected with appropriate message

#### Scenario: Entry window
- **WHEN** raffle entry period closes (typically 72 hours before draw)
- **THEN** new entries are rejected

### Requirement: Provably random selection
The system SHALL use cryptographically secure random selection for raffle winners. Selection process SHALL be auditable.

#### Scenario: Winner selection
- **WHEN** draw time arrives
- **THEN** winners are selected using crypto.getRandomValues() or equivalent

#### Scenario: Selection audit trail
- **WHEN** raffle draw completes
- **THEN** seed and selection process are logged for verification

### Requirement: Winner notification
The system SHALL notify raffle winners via email with exclusive purchase link.

#### Scenario: Winner email
- **WHEN** user is selected as winner
- **THEN** email is sent with unique purchase link

#### Scenario: Loser notification
- **WHEN** user is not selected
- **THEN** email is sent with "added to waitlist" message

### Requirement: Time-limited purchase links
Winner purchase links SHALL be valid for 24 hours and single-use.

#### Scenario: Valid purchase link
- **WHEN** winner clicks purchase link within 24 hours
- **THEN** user can complete purchase of won item

#### Scenario: Expired link
- **WHEN** winner clicks link after 24 hours
- **THEN** link shows expired message and item goes to waitlist

#### Scenario: Link already used
- **WHEN** winner attempts to use link twice
- **THEN** second attempt is rejected

### Requirement: Raffle marketing dashboard
The system SHALL provide marketing team access to raffle metrics.

#### Scenario: View raffle entries
- **WHEN** marketing user views raffle dashboard
- **THEN** total entries and entry timeline are displayed

#### Scenario: Export winner list
- **WHEN** marketing user clicks export
- **THEN** CSV with winner emails and purchase status is downloaded

#### Scenario: Conversion tracking
- **WHEN** raffle completes
- **THEN** dashboard shows percentage of winners who purchased
