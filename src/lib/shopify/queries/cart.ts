import { shopifyClient } from '../client.js';
import type { ShopifyCart } from '../types.js';

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
              price { amount currencyCode }
              selectedOptions { name value }
              image {
                url
                altText
                width
                height
              }
            }
          }
          cost {
            totalAmount { amount currencyCode }
            amountPerQuantity { amount currencyCode }
          }
        }
      }
    }
  }
`;

export async function createCart(): Promise<ShopifyCart> {
	const { data } = await shopifyClient.request(
		`
    mutation CreateCart {
      cartCreate {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
    `,
	);

	return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
	const { data } = await shopifyClient.request(
		`
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
    ${CART_FRAGMENT}
    `,
		{ variables: { cartId } },
	);

	return data?.cart ?? null;
}

export async function addToCart(
	cartId: string,
	variantId: string,
	quantity: number = 1,
): Promise<ShopifyCart> {
	const { data } = await shopifyClient.request(
		`
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
    `,
		{
			variables: {
				cartId,
				lines: [{ merchandiseId: variantId, quantity }],
			},
		},
	);

	return data.cartLinesAdd.cart;
}

export async function updateCartLine(
	cartId: string,
	lineId: string,
	quantity: number,
): Promise<ShopifyCart> {
	const { data } = await shopifyClient.request(
		`
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
    `,
		{
			variables: {
				cartId,
				lines: [{ id: lineId, quantity }],
			},
		},
	);

	return data.cartLinesUpdate.cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
	const { data } = await shopifyClient.request(
		`
    mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
    `,
		{
			variables: {
				cartId,
				lineIds: [lineId],
			},
		},
	);

	return data.cartLinesRemove.cart;
}
