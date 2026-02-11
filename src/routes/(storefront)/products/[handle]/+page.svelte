<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { cartStore } from '$lib/stores/cart.js';

	let { data } = $props();

	let selectedVariant = $state(data.product?.variants?.[0] ?? null);
	let selectedImage = $state(0);
	let addingToCart = $state(false);

	async function handleAddToCart() {
		if (!selectedVariant) return;
		addingToCart = true;
		await cartStore.addItem(selectedVariant.id);
		addingToCart = false;
	}
</script>

<svelte:head>
	<title>{data.product?.title ?? 'Product'} | Hype Commerce</title>
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
		<!-- Image Gallery -->
		<div>
			<div class="aspect-square overflow-hidden rounded-lg bg-muted">
				{#if data.product?.images?.[selectedImage]}
					<img
						src={data.product.images[selectedImage].url}
						alt={data.product.images[selectedImage].alt}
						class="h-full w-full object-cover"
					/>
				{:else}
					<div class="flex h-full items-center justify-center text-muted-foreground">
						No image available
					</div>
				{/if}
			</div>

			{#if data.product?.images && data.product.images.length > 1}
				<div class="mt-4 grid grid-cols-4 gap-2">
					{#each data.product.images as image, i}
						<button
							class="aspect-square overflow-hidden rounded-md border-2 transition-colors"
							class:border-primary={selectedImage === i}
							class:border-transparent={selectedImage !== i}
							onclick={() => (selectedImage = i)}
						>
							<img src={image.url} alt={image.alt} class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product Info -->
		<div>
			{#if data.product?.vendor}
				<p class="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
					{data.product.vendor}
				</p>
			{/if}

			<h1 class="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
				{data.product?.title ?? 'Product'}
			</h1>

			<div class="mt-4 flex items-center gap-3">
				<span class="text-2xl font-bold">
					{data.product?.price ?? '$0.00'}
				</span>
				{#if data.product?.compareAtPrice}
					<span class="text-lg text-muted-foreground line-through">
						{data.product.compareAtPrice}
					</span>
					<Badge variant="destructive">Sale</Badge>
				{/if}
			</div>

			{#if data.product?.variants && data.product.variants.length > 1}
				<div class="mt-6">
					<h3 class="mb-3 text-sm font-semibold">Size</h3>
					<div class="flex flex-wrap gap-2">
						{#each data.product.variants as variant}
							<button
								class="rounded-md border px-4 py-2 text-sm transition-colors"
								class:bg-primary={selectedVariant?.id === variant.id}
								class:text-primary-foreground={selectedVariant?.id === variant.id}
								class:opacity-50={!variant.available}
								disabled={!variant.available}
								onclick={() => (selectedVariant = variant)}
							>
								{variant.title}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="mt-8">
				<Button
					size="lg"
					class="w-full"
					disabled={!selectedVariant?.available || addingToCart}
					onclick={handleAddToCart}
				>
					{#if addingToCart}
						Adding...
					{:else if !selectedVariant?.available}
						Sold Out
					{:else}
						Add to Cart
					{/if}
				</Button>
			</div>

			<Tabs.Root value="description" class="mt-8">
				<Tabs.List>
					<Tabs.Trigger value="description">Description</Tabs.Trigger>
					<Tabs.Trigger value="size-chart">Size Chart</Tabs.Trigger>
					<Tabs.Trigger value="shipping">Shipping</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="description" class="prose mt-4">
					{@html data.product?.descriptionHtml ?? '<p>No description available.</p>'}
				</Tabs.Content>
				<Tabs.Content value="size-chart" class="mt-4">
					<p class="text-muted-foreground">Size chart coming soon.</p>
				</Tabs.Content>
				<Tabs.Content value="shipping" class="mt-4">
					<p class="text-muted-foreground">Free shipping on orders over $150. Standard delivery 3-5 business days.</p>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</section>
