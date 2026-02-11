<script lang="ts">
	import { Timeline } from '$lib/components/sections/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { data } = $props();

	let filterStatus = $state('all');

	let filteredDrops = $derived(
		filterStatus === 'all'
			? data.drops
			: data.drops.filter((d) => d.status === filterStatus),
	);
</script>

<svelte:head>
	<title>Drop Calendar | Hype Commerce</title>
	<meta name="description" content="Upcoming drops, raffles, and limited releases. Set reminders and join queues." />
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto max-w-4xl">
		<h1 class="font-display text-center text-4xl font-bold tracking-tight sm:text-5xl">
			Drop Calendar
		</h1>
		<p class="mt-4 text-center text-lg text-muted-foreground">
			Upcoming releases and limited drops
		</p>

		<div class="mt-8 flex justify-center gap-2">
			{#each ['all', 'upcoming', 'live', 'ended'] as status}
				<button
					class="rounded-full border px-4 py-1.5 text-sm capitalize transition-colors"
					class:bg-primary={filterStatus === status}
					class:text-primary-foreground={filterStatus === status}
					onclick={() => (filterStatus = status)}
				>
					{status}
					{#if status === 'live'}
						<Badge variant="destructive" class="ml-1">
							{data.drops.filter((d) => d.status === 'live').length}
						</Badge>
					{/if}
				</button>
			{/each}
		</div>

		<Timeline
			events={filteredDrops.map((d) => ({
				date: d.date,
				title: d.title,
				description: d.description,
				status: d.status,
				href: `/drops/${d.slug}`,
			}))}
		/>

		{#if filteredDrops.length === 0}
			<p class="mt-12 text-center text-muted-foreground">No drops matching this filter.</p>
		{/if}
	</div>
</section>
