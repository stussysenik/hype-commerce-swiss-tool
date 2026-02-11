<script lang="ts">
	interface Testimonial {
		quote: string;
		author: string;
		role?: string;
		avatar?: string;
	}

	interface Props {
		title?: string;
		testimonials: Testimonial[];
	}

	let { title, testimonials }: Props = $props();

	let currentIndex = $state(0);

	function next() {
		currentIndex = (currentIndex + 1) % testimonials.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
	}
</script>

<section class="px-6 py-16 md:py-24">
	<div class="mx-auto max-w-4xl text-center">
		{#if title}
			<h2 class="font-display mb-12 text-3xl font-bold tracking-tight sm:text-4xl">
				{title}
			</h2>
		{/if}

		<div class="relative">
			{#each testimonials as testimonial, i}
				<div
					class="transition-opacity duration-500"
					class:hidden={i !== currentIndex}
				>
					<blockquote class="text-xl leading-relaxed md:text-2xl">
						"{testimonial.quote}"
					</blockquote>
					<div class="mt-8 flex items-center justify-center gap-3">
						{#if testimonial.avatar}
							<img
								src={testimonial.avatar}
								alt={testimonial.author}
								class="h-10 w-10 rounded-full object-cover"
							/>
						{/if}
						<div class="text-left">
							<p class="font-semibold">{testimonial.author}</p>
							{#if testimonial.role}
								<p class="text-sm text-muted-foreground">{testimonial.role}</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}

			{#if testimonials.length > 1}
				<div class="mt-8 flex justify-center gap-4">
					<button
						onclick={prev}
						class="rounded-full border p-2 transition-colors hover:bg-accent"
						aria-label="Previous testimonial"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					<div class="flex items-center gap-2">
						{#each testimonials as _, i}
							<button
								class="h-2 w-2 rounded-full transition-colors"
								class:bg-primary={i === currentIndex}
								class:bg-muted-foreground/30={i !== currentIndex}
								onclick={() => (currentIndex = i)}
								aria-label="Go to testimonial {i + 1}"
							></button>
						{/each}
					</div>

					<button
						onclick={next}
						class="rounded-full border p-2 transition-colors hover:bg-accent"
						aria-label="Next testimonial"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			{/if}
		</div>
	</div>
</section>
