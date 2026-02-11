<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();

	let timeLeft = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	let joining = $state(false);

	$effect(() => {
		if (!data.drop?.startsAt) return;

		const interval = setInterval(() => {
			const now = Date.now();
			const target = new Date(data.drop!.startsAt).getTime();
			const diff = target - now;

			if (diff <= 0) {
				timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
				clearInterval(interval);
				return;
			}

			timeLeft = {
				days: Math.floor(diff / (1000 * 60 * 60 * 24)),
				hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
				minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
				seconds: Math.floor((diff % (1000 * 60)) / 1000),
			};
		}, 1000);

		return () => clearInterval(interval);
	});

	const statusVariant = {
		live: 'destructive' as const,
		upcoming: 'secondary' as const,
		ended: 'outline' as const,
	};
</script>

<svelte:head>
	<title>{data.drop?.title ?? 'Drop'} | Hype Commerce</title>
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto max-w-4xl">
		{#if data.drop?.image}
			<div class="aspect-video overflow-hidden rounded-xl">
				<img
					src={data.drop.image}
					alt={data.drop.title}
					class="h-full w-full object-cover"
				/>
			</div>
		{/if}

		<div class="mt-8">
			<div class="flex items-center gap-3">
				<Badge variant={statusVariant[data.drop?.status ?? 'upcoming']}>
					{data.drop?.status ?? 'upcoming'}
				</Badge>
				<Badge variant="outline">{data.drop?.type ?? 'queue'}</Badge>
			</div>

			<h1 class="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
				{data.drop?.title ?? 'Drop'}
			</h1>

			{#if data.drop?.description}
				<p class="mt-4 text-lg text-muted-foreground">{data.drop.description}</p>
			{/if}
		</div>

		{#if data.drop?.status === 'upcoming'}
			<Card.Root class="mt-8">
				<Card.Header>
					<Card.Title>Countdown</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex justify-center gap-6">
						{#each [
							{ value: timeLeft.days, label: 'Days' },
							{ value: timeLeft.hours, label: 'Hours' },
							{ value: timeLeft.minutes, label: 'Min' },
							{ value: timeLeft.seconds, label: 'Sec' },
						] as unit}
							<div class="text-center">
								<span class="font-mono text-4xl font-bold tabular-nums">
									{String(unit.value).padStart(2, '0')}
								</span>
								<p class="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
									{unit.label}
								</p>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		{/if}

		{#if data.drop?.status === 'live'}
			<Card.Root class="mt-8">
				<Card.Header>
					<Card.Title>
						{data.drop.type === 'raffle' ? 'Enter Raffle' : 'Join Queue'}
					</Card.Title>
					<Card.Description>
						{data.drop.type === 'raffle'
							? 'Winners will be selected randomly and notified via email.'
							: 'You will be placed in a fair queue. No bots, no backdoors.'}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button
						size="lg"
						class="w-full"
						disabled={joining}
						onclick={() => {
							joining = true;
							// In production: call tRPC endpoint
							setTimeout(() => (joining = false), 1000);
						}}
					>
						{#if joining}
							Joining...
						{:else}
							{data.drop.type === 'raffle' ? 'Enter Raffle' : 'Join Queue'}
						{/if}
					</Button>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
</section>
