## ADDED Requirements

### Requirement: Shopify Storefront API client
The system SHALL use the official `@shopify/storefront-api-client` SDK for all Shopify GraphQL operations. Client SHALL be configured with environment variables for store domain and access token.

#### Scenario: Client initialization
- **WHEN** application starts
- **THEN** Shopify client is initialized with valid credentials from environment

#### Scenario: Invalid credentials
- **WHEN** Shopify credentials are missing or invalid
- **THEN** application throws descriptive error at startup

### Requirement: Product queries
The system SHALL provide pre-built GraphQL queries:
- `getProduct(handle)` - Product detail with variants and metafields
- `getProducts(first, after)` - Paginated product list
- `searchProducts(query)` - Full-text product search

#### Scenario: Get product by handle
- **WHEN** `getProduct("test-product")` is called
- **THEN** returns product with title, description, variants, images, and metafields

#### Scenario: Product not found
- **WHEN** `getProduct("nonexistent")` is called
- **THEN** returns null without throwing error

### Requirement: Collection queries
The system SHALL provide collection queries:
- `getCollection(handle)` - Collection with products
- `getCollections()` - All collections list

#### Scenario: Get collection with products
- **WHEN** `getCollection("summer-2026")` is called
- **THEN** returns collection metadata and paginated products

#### Scenario: Collection filtering
- **WHEN** collection query includes filter parameters
- **THEN** only matching products are returned

### Requirement: Cart functionality
The system SHALL implement cart operations:
- `createCart()` - Initialize new cart
- `getCart(cartId)` - Retrieve cart contents
- `addToCart(cartId, variantId, quantity)` - Add line item
- `updateCartLine(cartId, lineId, quantity)` - Update quantity
- `removeCartLine(cartId, lineId)` - Remove item

#### Scenario: Create and add to cart
- **WHEN** user adds product variant to cart
- **THEN** cart is created (if new) and line item added

#### Scenario: Cart persistence
- **WHEN** user returns to site with cart cookie
- **THEN** previous cart contents are restored

#### Scenario: Checkout redirect
- **WHEN** user clicks checkout button
- **THEN** user is redirected to Shopify-hosted checkout URL

### Requirement: TanStack Query caching
The system SHALL use TanStack Query (Svelte Query) for server state management with configured cache times:
- Products: 5-minute stale time
- Collections: 15-minute stale time
- Cart: No cache (always fresh)

#### Scenario: Product cache hit
- **WHEN** same product is requested within 5 minutes
- **THEN** cached data is returned without API call

#### Scenario: Cart always fresh
- **WHEN** cart is requested
- **THEN** fresh data is fetched from Shopify API
