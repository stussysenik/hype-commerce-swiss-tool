<script lang="ts">
	import { ProductGrid } from '$lib/components/sections/index.js';

	let { data } = $props();

	let activeFilter = $state('all');

	const filters = [
		{ label: 'All', value: 'all' },
		{ label: '2026', value: '2026' },
		{ label: '2025', value: '2025' },
		{ label: '2024', value: '2024' },
	];
</script>

<svelte:head>
	<title>The Vault | Hype Commerce</title>
	<meta name="description" content="Browse our archive of past collections and sold-out drops." />
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto max-w-7xl">
		<h1 class="font-display text-center text-4xl font-bold tracking-tight sm:text-5xl">
			The Vault
		</h1>
		<p class="mt-4 text-center text-lg text-muted-foreground">
			Archive of past collections and legendary drops
		</p>

		<ProductGrid
			products={data.archivedProducts}
			columns={4}
			{filters}
			{activeFilter}
			onFilterChange={(v) => (activeFilter = v)}
		/>

		{#if data.archivedProducts.length === 0}
			<p class="mt-16 text-center text-muted-foreground">
				The vault is empty. Past drops will appear here.
			</p>
		{/if}
	</div>
</section>
