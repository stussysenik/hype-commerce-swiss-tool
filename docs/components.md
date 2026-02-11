# Component Development Guide

## Overview

This project uses [shadcn-svelte](https://www.shadcn-svelte.com/) built on [Bits UI](https://bits-ui.com/) primitives. Components follow the shadcn pattern: copied into `src/lib/components/ui/` for full customization.

## Base Components

Located in `src/lib/components/ui/`:

| Component       | Description                        | Source         |
| --------------- | ---------------------------------- | -------------- |
| Button          | Primary action trigger             | `ui/button/`   |
| Input           | Text input field                   | `ui/input/`    |
| Label           | Form label                         | `ui/label/`    |
| Card            | Content container                  | `ui/card/`     |
| Badge           | Status/category indicator          | `ui/badge/`    |
| Checkbox        | Toggle selection                   | `ui/checkbox/` |
| Select          | Dropdown selection                 | `ui/select/`   |
| Textarea        | Multi-line text input              | `ui/textarea/` |
| Dialog          | Modal overlay                      | `ui/dialog/`   |
| Drawer          | Slide-out panel                    | `ui/drawer/`   |
| Popover         | Floating content                   | `ui/popover/`  |
| Sonner          | Toast notifications                | `ui/sonner/`   |
| Tabs            | Tabbed content                     | `ui/tabs/`     |
| Accordion       | Collapsible sections               | `ui/accordion/`|
| Dropdown Menu   | Context menu                       | `ui/dropdown-menu/` |
| Separator       | Visual divider                     | `ui/separator/` |
| Form            | Form primitives with validation    | `ui/form/`     |

## Section Components

Located in `src/lib/components/sections/`:

### Hero
Full-width hero with optional video background, countdown timer, and CTAs.

```svelte
<Hero
  title="Summer Drop"
  subtitle="Limited edition collection"
  ctaPrimary={{ label: 'Shop Now', href: '/collections/summer' }}
  ctaSecondary={{ label: 'Learn More', href: '/stories/summer' }}
  countdown={new Date('2025-07-01')}
  videoSrc="/hero.mp4"
  imageSrc="/hero.jpg"
/>
```

### ProductGrid
Filterable product grid with badge support and column variants.

```svelte
<ProductGrid
  products={products}
  columns={3}
  showFilters={true}
/>
```

### EditorialSplit
50/50 image and text layout, reversible.

```svelte
<EditorialSplit
  title="Behind the Drop"
  body="The story behind our latest release."
  imageSrc="/editorial.jpg"
  reverse={true}
  cta={{ label: 'Read More', href: '/stories/behind-the-drop' }}
/>
```

### Timeline
Drop calendar with status badges (live, upcoming, ended).

```svelte
<Timeline events={drops} />
```

### Newsletter
Email capture form with success state.

```svelte
<Newsletter
  title="Stay in the Loop"
  description="Get notified about upcoming drops."
/>
```

### TestimonialCarousel
Carousel with navigation dots and prev/next buttons.

```svelte
<TestimonialCarousel testimonials={testimonials} />
```

## Adding New Components

### From shadcn-svelte

```bash
npx shadcn-svelte add <component-name> --yes
```

### Custom Components

1. Create in `src/lib/components/` (not in `ui/` unless it's a shadcn component)
2. Use Svelte 5 runes (`$props()`, `$state()`, `$derived()`, `$effect()`)
3. Use Tailwind CSS v4 classes and design tokens from `src/app.css`

## Storybook

```bash
pnpm storybook  # Start on port 6006
```

Stories are in `stories/` at the project root. Each component has a `.stories.ts` file.

### Writing Stories

```typescript
import type { Meta, StoryObj } from '@storybook/svelte';
import Button from '$lib/components/ui/button/button.svelte';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { },
};
```

## Design Tokens

Custom tokens are defined in `src/app.css` under `@theme`:

- **Colors**: `--color-brand-*`, `--color-surface-*`, `--color-accent-*`
- **Typography**: `--font-display`, `--font-body`
- **Spacing**: `--spacing-section`, `--spacing-gutter`
- **Z-index**: `--z-dropdown` through `--z-toast`
