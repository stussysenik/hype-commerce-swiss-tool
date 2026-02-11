<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		title: string;
		body: string;
		imageSrc: string;
		imageAlt: string;
		ctaText?: string;
		ctaHref?: string;
		reverse?: boolean;
	}

	let {
		title,
		body,
		imageSrc,
		imageAlt,
		ctaText,
		ctaHref = '/',
		reverse = false,
	}: Props = $props();
</script>

<section class="overflow-hidden">
	<div
		class="flex min-h-[60vh] flex-col md:flex-row"
		class:md:flex-row-reverse={reverse}
	>
		<div class="relative flex-1">
			<img
				src={imageSrc}
				alt={imageAlt}
				class="h-full w-full object-cover"
				loading="lazy"
			/>
		</div>

		<div class="flex flex-1 items-center px-8 py-16 md:px-16">
			<div class="max-w-lg">
				<h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
					{title}
				</h2>
				<p class="mt-6 text-lg leading-relaxed text-muted-foreground">
					{body}
				</p>
				{#if ctaText}
					<div class="mt-8">
						<Button href={ctaHref} size="lg">{ctaText}</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
