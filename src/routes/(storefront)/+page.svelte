<script lang="ts">
	import { Hero, ProductGrid, EditorialSplit, Timeline, Newsletter } from '$lib/components/sections/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Hype Commerce | Premium Drops & Limited Releases</title>
	<meta name="description" content="Exclusive drops, limited releases, and premium streetwear. Fair queue system. No bots." />
</svelte:head>

<Hero
	title={data.hero?.title ?? 'The Drop is Everything'}
	subtitle={data.hero?.subtitle ?? 'Exclusive releases. Fair access. No bots.'}
	ctaText="Shop Drops"
	ctaHref="/drops"
	secondaryCtaText="Explore Collections"
	secondaryCtaHref="/collections/all"
	imageSrc={data.hero?.imageSrc ?? 'https://placehold.co/1920x1080/111/333?text=Hero'}
	imageAlt="Featured drop"
	countdown={data.nextDrop ? { target: new Date(data.nextDrop.startsAt), label: data.nextDrop.title } : undefined}
/>

{#if data.featuredProducts.length > 0}
	<ProductGrid
		title="Featured Drops"
		products={data.featuredProducts}
		columns={4}
	/>
{/if}

{#if data.editorial}
	<EditorialSplit
		title={data.editorial.title}
		body={data.editorial.body}
		imageSrc={data.editorial.imageSrc}
		imageAlt={data.editorial.imageAlt}
		ctaText="Read More"
		ctaHref={data.editorial.href}
	/>
{/if}

{#if data.upcomingDrops.length > 0}
	<Timeline
		title="Drop Calendar"
		subtitle="Upcoming and recent releases"
		events={data.upcomingDrops}
	/>
{/if}

<Newsletter />
