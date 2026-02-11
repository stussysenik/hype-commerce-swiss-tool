import { writable, derived } from 'svelte/store';
import type { ShopifyCart } from '$lib/shopify/types.js';
import * as cartApi from '$lib/shopify/queries/cart.js';
import { browser } from '$app/environment';

const CART_ID_KEY = 'hype-commerce-cart-id';

function getPersistedCartId(): string | null {
	if (!browser) return null;
	return localStorage.getItem(CART_ID_KEY);
}

function persistCartId(cartId: string): void {
	if (!browser) return;
	localStorage.setItem(CART_ID_KEY, cartId);
}

function clearPersistedCartId(): void {
	if (!browser) return;
	localStorage.removeItem(CART_ID_KEY);
}

function createCartStore() {
	const { subscribe, set, update } = writable<{
		cart: ShopifyCart | null;
		loading: boolean;
		error: string | null;
	}>({
		cart: null,
		loading: false,
		error: null,
	});

	async function initialize() {
		const cartId = getPersistedCartId();
		if (!cartId) return;

		update((s) => ({ ...s, loading: true }));
		try {
			const cart = await cartApi.getCart(cartId);
			if (cart) {
				set({ cart, loading: false, error: null });
			} else {
				clearPersistedCartId();
				set({ cart: null, loading: false, error: null });
			}
		} catch {
			clearPersistedCartId();
			set({ cart: null, loading: false, error: null });
		}
	}

	async function ensureCart(): Promise<string> {
		let cartId = getPersistedCartId();
		if (cartId) return cartId;

		const cart = await cartApi.createCart();
		cartId = cart.id;
		persistCartId(cartId);
		set({ cart, loading: false, error: null });
		return cartId;
	}

	async function addItem(variantId: string, quantity: number = 1) {
		update((s) => ({ ...s, loading: true, error: null }));
		try {
			const cartId = await ensureCart();
			const cart = await cartApi.addToCart(cartId, variantId, quantity);
			set({ cart, loading: false, error: null });
		} catch (e) {
			update((s) => ({
				...s,
				loading: false,
				error: e instanceof Error ? e.message : 'Failed to add item',
			}));
		}
	}

	async function updateItem(lineId: string, quantity: number) {
		update((s) => ({ ...s, loading: true, error: null }));
		try {
			const cartId = await ensureCart();
			const cart = await cartApi.updateCartLine(cartId, lineId, quantity);
			set({ cart, loading: false, error: null });
		} catch (e) {
			update((s) => ({
				...s,
				loading: false,
				error: e instanceof Error ? e.message : 'Failed to update item',
			}));
		}
	}

	async function removeItem(lineId: string) {
		update((s) => ({ ...s, loading: true, error: null }));
		try {
			const cartId = await ensureCart();
			const cart = await cartApi.removeCartLine(cartId, lineId);
			set({ cart, loading: false, error: null });
		} catch (e) {
			update((s) => ({
				...s,
				loading: false,
				error: e instanceof Error ? e.message : 'Failed to remove item',
			}));
		}
	}

	function getCheckoutUrl(): string | null {
		let checkoutUrl: string | null = null;
		subscribe((s) => {
			checkoutUrl = s.cart?.checkoutUrl ?? null;
		})();
		return checkoutUrl;
	}

	return {
		subscribe,
		initialize,
		addItem,
		updateItem,
		removeItem,
		getCheckoutUrl,
	};
}

export const cartStore = createCartStore();

export const cartItemCount = derived(cartStore, ($cart) => $cart.cart?.totalQuantity ?? 0);

export const cartItems = derived(
	cartStore,
	($cart) => $cart.cart?.lines?.edges?.map((e) => e.node) ?? [],
);

export const cartTotal = derived(
	cartStore,
	($cart) => $cart.cart?.cost?.totalAmount ?? { amount: '0.00', currencyCode: 'USD' },
);
