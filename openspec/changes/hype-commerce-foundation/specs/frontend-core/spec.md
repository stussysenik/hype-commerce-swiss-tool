## ADDED Requirements

### Requirement: SvelteKit application structure
The system SHALL use SvelteKit as the frontend framework with TypeScript for type safety. The application SHALL follow the standard SvelteKit directory structure with `src/routes/` for pages and `src/lib/` for shared code.

#### Scenario: Application initializes successfully
- **WHEN** developer runs `pnpm dev`
- **THEN** SvelteKit development server starts on localhost:5173

#### Scenario: TypeScript compilation
- **WHEN** TypeScript files contain type errors
- **THEN** build fails with descriptive error messages

### Requirement: Tailwind CSS v4 styling system
The system SHALL use Tailwind CSS v4 with utility-first classes for all styling. Custom design tokens SHALL be configurable for brand-specific theming.

#### Scenario: Tailwind classes applied
- **WHEN** developer uses Tailwind utility classes in Svelte components
- **THEN** styles are applied correctly in development and production builds

#### Scenario: Dark mode support
- **WHEN** user system preference is dark mode
- **THEN** application renders with OLED-optimized dark theme by default

### Requirement: shadcn-svelte component library
The system SHALL include shadcn-svelte components built on Bits UI primitives. Components SHALL be copy-paste owned (no black-box abstractions).

#### Scenario: Component availability
- **WHEN** developer imports a shadcn-svelte component
- **THEN** component source is available in `src/lib/components/ui/`

#### Scenario: Component customization
- **WHEN** developer modifies a component's source code
- **THEN** changes are reflected without breaking other components

### Requirement: Page routing structure
The system SHALL implement the following route structure:
- `/` - Homepage with dynamic hero and featured drops
- `/collections/[handle]` - Collection listing with filters
- `/products/[handle]` - Product detail page
- `/drops` - Drop calendar
- `/drops/[slug]` - Individual drop page with countdown
- `/archive` - Past collections vault
- `/stories` - Editorial content
- `/stories/[slug]` - Article detail
- `/account` - Customer portal
- `/cart` - Cart page

#### Scenario: Route navigation
- **WHEN** user navigates to `/products/test-product`
- **THEN** product detail page renders with correct product data

#### Scenario: Dynamic route params
- **WHEN** route contains dynamic segment like `[handle]`
- **THEN** param is accessible in page load function

### Requirement: Storybook component documentation
The system SHALL include Storybook 8 with Svelte CSF for isolated component development and documentation.

#### Scenario: Storybook server
- **WHEN** developer runs `pnpm storybook`
- **THEN** Storybook UI opens with all documented components

#### Scenario: Component stories
- **WHEN** component has associated `.stories.ts` file
- **THEN** component appears in Storybook with all variants

### Requirement: Pre-built section components
The system SHALL include pre-built section components:
- Hero (video background, countdown overlay, CTA)
- Product Grid (filter sidebar, infinite scroll)
- Editorial Split (image/text 50/50)
- Timeline (drop calendar, brand history)
- Newsletter (email capture)

#### Scenario: Section component rendering
- **WHEN** Hero section component is used with video prop
- **THEN** video background plays automatically on capable devices

#### Scenario: Responsive sections
- **WHEN** viewport width changes across breakpoints
- **THEN** section layouts adapt appropriately
