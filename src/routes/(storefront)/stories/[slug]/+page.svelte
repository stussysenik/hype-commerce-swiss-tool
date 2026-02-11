<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.article?.title ?? 'Story'} | Hype Commerce</title>
</svelte:head>

<article class="px-6 py-12">
	<div class="mx-auto max-w-3xl">
		{#if data.article?.coverImage}
			<div class="aspect-[2/1] overflow-hidden rounded-xl">
				<img
					src={data.article.coverImage}
					alt={data.article.title}
					class="h-full w-full object-cover"
				/>
			</div>
		{/if}

		<div class="mt-8">
			{#if data.article?.category}
				<Badge variant="secondary">{data.article.category}</Badge>
			{/if}

			<h1 class="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
				{data.article?.title ?? 'Story'}
			</h1>

			<div class="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
				{#if data.article?.author}
					<div class="flex items-center gap-2">
						{#if data.article.author.avatar}
							<img
								src={data.article.author.avatar}
								alt={data.article.author.name}
								class="h-6 w-6 rounded-full"
							/>
						{/if}
						<span>{data.article.author.name}</span>
					</div>
				{/if}
				{#if data.article?.publishedAt}
					<time>
						{new Date(data.article.publishedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</time>
				{/if}
			</div>
		</div>

		<div class="prose prose-lg mt-8 max-w-none">
			{@html data.article?.bodyHtml ?? '<p>Article content will appear here.</p>'}
		</div>

		{#if data.article?.tags?.length}
			<div class="mt-8 flex flex-wrap gap-2">
				{#each data.article.tags as tag}
					<Badge variant="outline">{tag}</Badge>
				{/each}
			</div>
		{/if}
	</div>
</article>
