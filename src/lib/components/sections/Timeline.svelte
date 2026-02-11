<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	interface TimelineEvent {
		date: string;
		title: string;
		description?: string;
		status?: 'upcoming' | 'live' | 'ended';
		href?: string;
		image?: { url: string; alt: string };
	}

	interface Props {
		title?: string;
		subtitle?: string;
		events: TimelineEvent[];
	}

	let { title, subtitle, events }: Props = $props();

	const statusStyles = {
		upcoming: 'bg-yellow-500',
		live: 'bg-red-500 animate-pulse',
		ended: 'bg-muted-foreground',
	};

	const statusLabels = {
		upcoming: 'Upcoming',
		live: 'Live Now',
		ended: 'Ended',
	};
</script>

<section class="px-6 py-16 md:py-24">
	<div class="mx-auto max-w-3xl">
		{#if title}
			<h2 class="font-display text-center text-3xl font-bold tracking-tight sm:text-4xl">
				{title}
			</h2>
		{/if}
		{#if subtitle}
			<p class="mt-4 text-center text-lg text-muted-foreground">{subtitle}</p>
		{/if}

		<div class="relative mt-12">
			<div class="absolute left-4 top-0 h-full w-px bg-border md:left-1/2"></div>

			{#each events as event, i}
				{@const isRight = i % 2 === 0}
				<div class="relative mb-12 flex items-start gap-6 md:gap-0">
					<div
						class="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background md:left-1/2 {statusStyles[event.status ?? 'upcoming']}"
					></div>

					<div
						class="ml-10 md:ml-0 md:w-1/2"
						class:md:pr-12={isRight}
						class:md:pl-12={!isRight}
						class:md:ml-auto={!isRight}
						class:md:text-right={isRight}
					>
						<a
							href={event.href}
							class="group block rounded-lg border p-4 transition-colors hover:bg-accent"
						>
							{#if event.image}
								<img
									src={event.image.url}
									alt={event.image.alt}
									class="mb-3 aspect-video w-full rounded-md object-cover"
									loading="lazy"
								/>
							{/if}
							<div class="flex items-center gap-2" class:justify-end={isRight}>
								<time class="text-sm text-muted-foreground">{event.date}</time>
								{#if event.status}
									<Badge
										variant={event.status === 'live' ? 'destructive' : 'secondary'}
									>
										{statusLabels[event.status]}
									</Badge>
								{/if}
							</div>
							<h3 class="mt-1 font-semibold group-hover:underline">{event.title}</h3>
							{#if event.description}
								<p class="mt-1 text-sm text-muted-foreground">{event.description}</p>
							{/if}
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
