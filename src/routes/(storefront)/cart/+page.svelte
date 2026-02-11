<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cartStore, cartItems, cartTotal, cartItemCount } from '$lib/stores/cart.js';

	let items = $derived($cartItems);
	let total = $derived($cartTotal);
	let count = $derived($cartItemCount);
	let store = $derived($cartStore);

	function formatPrice(amount: string, currency: string) {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
			parseFloat(amount),
		);
	}
</script>

<svelte:head>
	<title>Cart ({count}) | Hype Commerce</title>
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto max-w-4xl">
		<h1 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">Cart</h1>

		{#if items.length === 0}
			<div class="mt-12 text-center">
				<p class="text-lg text-muted-foreground">Your cart is empty</p>
				<Button href="/" class="mt-6">Continue Shopping</Button>
			</div>
		{:else}
			<div class="mt-8 grid gap-8 lg:grid-cols-3">
				<div class="lg:col-span-2">
					<div class="space-y-4">
						{#each items as item}
							<Card.Root>
								<Card.Content class="flex gap-4 p-4">
									{#if item.merchandise.image}
										<img
											src={item.merchandise.image.url}
											alt={item.merchandise.product.title}
											class="h-24 w-24 rounded-md object-cover"
										/>
									{/if}
									<div class="flex flex-1 flex-col justify-between">
										<div>
											<h3 class="font-semibold">{item.merchandise.product.title}</h3>
											<p class="text-sm text-muted-foreground">
												{item.merchandise.title}
												{#if item.merchandise.selectedOptions?.length}
													- {item.merchandise.selectedOptions.map((o) => o.value).join(' / ')}
												{/if}
											</p>
										</div>
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<Button
													variant="outline"
													size="icon-sm"
													onclick={() => {
														if (item.quantity <= 1) {
															cartStore.removeItem(item.id);
														} else {
															cartStore.updateItem(item.id, item.quantity - 1);
														}
													}}
												>
													-
												</Button>
												<span class="w-8 text-center font-mono">{item.quantity}</span>
												<Button
													variant="outline"
													size="icon-sm"
													onclick={() => cartStore.updateItem(item.id, item.quantity + 1)}
												>
													+
												</Button>
											</div>
											<span class="font-semibold">
												{formatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode)}
											</span>
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						{/each}
					</div>
				</div>

				<div>
					<Card.Root>
						<Card.Header>
							<Card.Title>Order Summary</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-3">
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Subtotal</span>
								<span>{formatPrice(total.amount, total.currencyCode)}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Shipping</span>
								<span>Calculated at checkout</span>
							</div>
							<div class="border-t pt-3">
								<div class="flex justify-between font-semibold">
									<span>Total</span>
									<span>{formatPrice(total.amount, total.currencyCode)}</span>
								</div>
							</div>
						</Card.Content>
						<Card.Footer>
							<Button
								size="lg"
								class="w-full"
								onclick={() => {
									const url = cartStore.getCheckoutUrl();
									if (url) window.location.href = url;
								}}
							>
								Checkout
							</Button>
						</Card.Footer>
					</Card.Root>
				</div>
			</div>
		{/if}
	</div>
</section>
