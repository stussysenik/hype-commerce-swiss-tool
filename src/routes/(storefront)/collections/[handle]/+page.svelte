<script lang="ts">
	import { ProductGrid } from '$lib/components/sections/index.js';

	let { data } = $props();

	let activeFilter = $state('all');
	let sortBy = $state('newest');

	const filters = [
		{ label: 'All', value: 'all' },
		{ label: 'Available', value: 'available' },
		{ label: 'Under $100', value: 'under-100' },
		{ label: 'Under $250', value: 'under-250' },
	];
</script>

<svelte:head>
	<title>{data.collection?.title ?? 'Collection'} | Hype Commerce</title>
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8">
			<h1 class="font-display text-4xl font-bold tracking-tight sm:text-5xl">
				{data.collection?.title ?? 'Collection'}
			</h1>
			{#if data.collection?.description}
				<p class="mt-4 max-w-2xl text-lg text-muted-foreground">{data.collection.description}</p>
			{/if}
		</div>

		<div class="mb-6 flex items-center justify-between">
			<div class="flex gap-2">
				{#each filters as filter}
					<button
						class="rounded-full border px-4 py-1.5 text-sm transition-colors"
						class:bg-primary={activeFilter === filter.value}
						class:text-primary-foreground={activeFilter === filter.value}
						onclick={() => (activeFilter = filter.value)}
					>
						{filter.label}
					</button>
				{/each}
			</div>

			<select
				bind:value={sortBy}
				class="rounded-md border bg-background px-3 py-1.5 text-sm"
			>
				<option value="newest">Newest</option>
				<option value="price-asc">Price: Low to High</option>
				<option value="price-desc">Price: High to Low</option>
				<option value="title">Alphabetical</option>
			</select>
		</div>

		<ProductGrid
			products={data.products}
			columns={4}
			showSidebar={true}
			{filters}
			{activeFilter}
			hasMore={data.pageInfo.hasNextPage}
		/>
	</div>
</section>
