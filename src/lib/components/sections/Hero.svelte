<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		title: string;
		subtitle?: string;
		ctaText?: string;
		ctaHref?: string;
		secondaryCtaText?: string;
		secondaryCtaHref?: string;
		videoSrc?: string;
		imageSrc?: string;
		imageAlt?: string;
		overlay?: boolean;
		countdown?: {
			target: Date;
			label?: string;
		};
	}

	let {
		title,
		subtitle,
		ctaText,
		ctaHref = '/',
		secondaryCtaText,
		secondaryCtaHref,
		videoSrc,
		imageSrc,
		imageAlt = '',
		overlay = true,
		countdown,
	}: Props = $props();

	let timeLeft = $state({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	$effect(() => {
		if (!countdown) return;

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const target = new Date(countdown.target).getTime();
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
</script>

<section class="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
	{#if videoSrc}
		<video
			class="absolute inset-0 h-full w-full object-cover"
			autoplay
			muted
			loop
			playsinline
			aria-hidden="true"
		>
			<source src={videoSrc} type="video/mp4" />
		</video>
	{:else if imageSrc}
		<img
			class="absolute inset-0 h-full w-full object-cover"
			src={imageSrc}
			alt={imageAlt}
		/>
	{/if}

	{#if overlay}
		<div class="absolute inset-0 bg-black/50"></div>
	{/if}

	<div class="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
		<h1 class="font-display text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl">
			{title}
		</h1>

		{#if subtitle}
			<p class="mt-6 text-lg text-white/80 sm:text-xl">{subtitle}</p>
		{/if}

		{#if countdown}
			<div class="mt-8 flex justify-center gap-4">
				{#each [
					{ value: timeLeft.days, label: 'Days' },
					{ value: timeLeft.hours, label: 'Hours' },
					{ value: timeLeft.minutes, label: 'Min' },
					{ value: timeLeft.seconds, label: 'Sec' },
				] as unit}
					<div class="flex flex-col items-center">
						<span class="font-mono text-4xl font-bold tabular-nums sm:text-5xl">
							{String(unit.value).padStart(2, '0')}
						</span>
						<span class="mt-1 text-xs uppercase tracking-widest text-white/60">
							{unit.label}
						</span>
					</div>
				{/each}
			</div>
			{#if countdown.label}
				<p class="mt-3 text-sm text-white/60">{countdown.label}</p>
			{/if}
		{/if}

		{#if ctaText || secondaryCtaText}
			<div class="mt-10 flex flex-wrap justify-center gap-4">
				{#if ctaText}
					<Button href={ctaHref} size="lg" class="bg-white text-black hover:bg-white/90">
						{ctaText}
					</Button>
				{/if}
				{#if secondaryCtaText}
					<Button
						href={secondaryCtaHref}
						variant="outline"
						size="lg"
						class="border-white text-white hover:bg-white/10"
					>
						{secondaryCtaText}
					</Button>
				{/if}
			</div>
		{/if}
	</div>
</section>
