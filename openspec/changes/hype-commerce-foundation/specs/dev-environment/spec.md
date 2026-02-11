## ADDED Requirements

### Requirement: NixOS flake configuration
The system SHALL provide `flake.nix` for reproducible development environment including:
- Node.js 20 LTS
- pnpm 9
- PostgreSQL 16 (development)
- Redis 7 (development)

#### Scenario: Enter dev environment
- **WHEN** developer runs `nix develop`
- **THEN** all required tools are available at specified versions

#### Scenario: Version consistency
- **WHEN** different developers enter nix shell
- **THEN** all have identical tool versions

### Requirement: ESLint configuration
The system SHALL configure ESLint with:
- `@sveltejs/eslint-config` for Svelte standards
- `eslint-plugin-tailwindcss` for utility class conventions
- `eslint-plugin-drizzle` for ORM best practices
- Max function length: 50 lines
- Descriptive variable name enforcement

#### Scenario: Lint check
- **WHEN** developer runs `pnpm lint`
- **THEN** ESLint checks all source files

#### Scenario: Lint violation
- **WHEN** code violates lint rules
- **THEN** descriptive error with rule name is shown

### Requirement: Prettier configuration
The system SHALL configure Prettier with:
- `prettier-plugin-svelte` for Svelte formatting
- `prettier-plugin-tailwindcss` for class sorting
- 2-space indentation
- Single quotes
- Trailing commas

#### Scenario: Format check
- **WHEN** developer runs `pnpm format:check`
- **THEN** Prettier reports unformatted files

#### Scenario: Auto-format
- **WHEN** developer runs `pnpm format`
- **THEN** all files are formatted according to config

### Requirement: Husky git hooks
The system SHALL configure Husky with:
- Pre-commit: lint-staged (ESLint fix, Prettier format)
- Pre-push: type check, test, build

#### Scenario: Pre-commit hook
- **WHEN** developer commits code
- **THEN** staged files are auto-formatted and linted

#### Scenario: Pre-push hook
- **WHEN** developer pushes code
- **THEN** full test suite and build must pass

#### Scenario: Hook bypass
- **WHEN** developer uses `--no-verify` flag
- **THEN** hooks are skipped (for emergencies only)

### Requirement: Environment variable management
The system SHALL use `.env.local` for local development with `.env.example` template including all required variables.

#### Scenario: Missing env var
- **WHEN** required environment variable is missing
- **THEN** application fails fast with clear error message

#### Scenario: Env example sync
- **WHEN** new env var is added to codebase
- **THEN** `.env.example` is updated with placeholder

### Requirement: Database migrations
The system SHALL use Drizzle Kit for database migrations with commands:
- `pnpm db:generate` - Generate migration from schema changes
- `pnpm db:push` - Apply migrations to database
- `pnpm db:studio` - Open Drizzle Studio UI

#### Scenario: Schema change
- **WHEN** developer modifies Drizzle schema
- **THEN** `db:generate` creates timestamped migration file

#### Scenario: Apply migration
- **WHEN** developer runs `db:push`
- **THEN** database schema is updated to match code
