<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { data } = $props();

	let activeCategory = $state('all');

	const categories = [
		{ label: 'All', value: 'all' },
		{ label: 'Culture', value: 'culture' },
		{ label: 'Style', value: 'style' },
		{ label: 'Behind the Scenes', value: 'behind-the-scenes' },
		{ label: 'Interviews', value: 'interview' },
	];

	let filteredArticles = $derived(
		activeCategory === 'all'
			? data.articles
			: data.articles.filter((a) => a.category === activeCategory),
	);
</script>

<svelte:head>
	<title>Stories | Hype Commerce</title>
	<meta name="description" content="Editorial content, brand stories, and behind-the-scenes features." />
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto max-w-7xl">
		<h1 class="font-display text-center text-4xl font-bold tracking-tight sm:text-5xl">
			Stories
		</h1>
		<p class="mt-4 text-center text-lg text-muted-foreground">
			Culture, style, and the stories behind the drops
		</p>

		<div class="mt-8 flex justify-center gap-2">
			{#each categories as cat}
				<button
					class="rounded-full border px-4 py-1.5 text-sm transition-colors"
					class:bg-primary={activeCategory === cat.value}
					class:text-primary-foreground={activeCategory === cat.value}
					onclick={() => (activeCategory = cat.value)}
				>
					{cat.label}
				</button>
			{/each}
		</div>

		<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredArticles as article}
				<a href="/stories/{article.slug}" class="group block">
					<div class="aspect-[3/2] overflow-hidden rounded-lg bg-muted">
						{#if article.coverImage}
							<img
								src={article.coverImage}
								alt={article.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
						{/if}
					</div>
					<div class="mt-4">
						{#if article.category}
							<Badge variant="secondary">{article.category}</Badge>
						{/if}
						<h2 class="mt-2 text-lg font-semibold group-hover:underline">{article.title}</h2>
						{#if article.excerpt}
							<p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
						{/if}
						{#if article.publishedAt}
							<time class="mt-2 block text-xs text-muted-foreground">
								{new Date(article.publishedAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</time>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		{#if filteredArticles.length === 0}
			<p class="mt-16 text-center text-muted-foreground">No stories yet. Check back soon.</p>
		{/if}
	</div>
</section>
