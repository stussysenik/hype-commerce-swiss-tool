## ADDED Requirements

### Requirement: Sanity CMS integration
The system SHALL integrate Sanity CMS for content management. Sanity client SHALL be configured with project ID and dataset from environment variables.

#### Scenario: Content fetch
- **WHEN** page requests CMS content
- **THEN** data is fetched from Sanity API

#### Scenario: Preview mode
- **WHEN** editor enables preview in Sanity Studio
- **THEN** draft content is visible on frontend

### Requirement: Drop story content model
The system SHALL support Drop Story content type with:
- Title and slug
- Release date
- Hero image/video
- Story blocks (rich text, galleries, video embeds)
- Related Shopify products

#### Scenario: Create drop story
- **WHEN** editor creates new drop story in Sanity
- **THEN** content appears on `/drops/[slug]` page

#### Scenario: Related products
- **WHEN** drop story references Shopify products
- **THEN** product cards display on drop page

### Requirement: Editorial article content model
The system SHALL support Editorial Article content type with:
- Title, slug, category
- Featured image
- Modular content blocks (text, image, quote, video, product grid)
- Author and publish date

#### Scenario: Create article
- **WHEN** editor publishes article in Sanity
- **THEN** article appears on `/stories/[slug]`

#### Scenario: Modular blocks
- **WHEN** article contains mixed block types
- **THEN** each block type renders appropriately

### Requirement: Global settings
The system SHALL support Global Settings content type with:
- Site metadata (SEO defaults)
- Navigation menus (header/footer)
- Announcement bar content
- Social media links

#### Scenario: Update navigation
- **WHEN** editor updates header menu in Sanity
- **THEN** site navigation reflects changes

#### Scenario: Announcement bar
- **WHEN** announcement bar is enabled with content
- **THEN** banner displays at top of all pages

### Requirement: Sanity Studio access
The system SHALL provide Sanity Studio at `/studio` route for content editors.

#### Scenario: Studio access
- **WHEN** editor navigates to `/studio`
- **THEN** Sanity Studio interface loads with all content types

#### Scenario: Visual editing
- **WHEN** editor uses WYSIWYG-style editing
- **THEN** changes are saved to Sanity in real-time

### Requirement: Scheduled publishing
The system SHALL support scheduled content publishing through Sanity's built-in scheduling.

#### Scenario: Schedule article
- **WHEN** editor sets future publish date
- **THEN** content becomes visible at scheduled time
