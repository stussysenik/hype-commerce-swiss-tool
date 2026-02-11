<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	interface Product {
		id: string;
		title: string;
		handle: string;
		price: string;
		compareAtPrice?: string;
		image: { url: string; alt: string };
		badge?: string;
	}

	interface Filter {
		label: string;
		value: string;
	}

	interface Props {
		title?: string;
		products: Product[];
		filters?: Filter[];
		activeFilter?: string;
		columns?: 2 | 3 | 4;
		showSidebar?: boolean;
		onFilterChange?: (value: string) => void;
		onLoadMore?: () => void;
		hasMore?: boolean;
	}

	let {
		title,
		products,
		filters = [],
		activeFilter = 'all',
		columns = 3,
		showSidebar = false,
		onFilterChange,
		onLoadMore,
		hasMore = false,
	}: Props = $props();

	const gridCols = {
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
	};
</script>

<section class="px-6 py-16 md:py-24">
	{#if title}
		<h2 class="font-display mb-8 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
	{/if}

	<div class="flex gap-8" class:flex-row={showSidebar}>
		{#if showSidebar && filters.length > 0}
			<aside class="hidden w-56 shrink-0 lg:block">
				<h3 class="mb-4 text-sm font-semibold uppercase tracking-widest">Filter</h3>
				<nav class="flex flex-col gap-1">
					{#each filters as filter}
						<button
							class="rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
							class:bg-accent={activeFilter === filter.value}
							class:font-medium={activeFilter === filter.value}
							onclick={() => onFilterChange?.(filter.value)}
						>
							{filter.label}
						</button>
					{/each}
				</nav>
			</aside>
		{/if}

		<div class="flex-1">
			{#if filters.length > 0 && !showSidebar}
				<div class="mb-6 flex flex-wrap gap-2">
					{#each filters as filter}
						<button
							class="rounded-full border px-4 py-1.5 text-sm transition-colors"
							class:bg-primary={activeFilter === filter.value}
							class:text-primary-foreground={activeFilter === filter.value}
							onclick={() => onFilterChange?.(filter.value)}
						>
							{filter.label}
						</button>
					{/each}
				</div>
			{/if}

			<div class="grid gap-6 {gridCols[columns]}">
				{#each products as product}
					<a
						href="/products/{product.handle}"
						class="group block"
					>
						<div class="relative aspect-square overflow-hidden rounded-lg bg-muted">
							<img
								src={product.image.url}
								alt={product.image.alt}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							{#if product.badge}
								<Badge
									class="absolute left-3 top-3"
									variant="destructive"
								>
									{product.badge}
								</Badge>
							{/if}
						</div>
						<div class="mt-3">
							<h3 class="text-sm font-medium">{product.title}</h3>
							<div class="mt-1 flex items-center gap-2">
								<span class="text-sm font-semibold">{product.price}</span>
								{#if product.compareAtPrice}
									<span class="text-sm text-muted-foreground line-through">
										{product.compareAtPrice}
									</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>

			{#if hasMore}
				<div class="mt-12 text-center">
					<Button variant="outline" onclick={onLoadMore}>Load More</Button>
				</div>
			{/if}
		</div>
	</div>
</section>
