<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	interface Props {
		title?: string;
		subtitle?: string;
		placeholder?: string;
		buttonText?: string;
		onSubmit?: (email: string) => void;
	}

	let {
		title = 'Stay in the loop',
		subtitle = 'Get notified about upcoming drops and exclusive releases.',
		placeholder = 'Enter your email',
		buttonText = 'Subscribe',
		onSubmit,
	}: Props = $props();

	let email = $state('');
	let submitted = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!email) return;
		onSubmit?.(email);
		submitted = true;
	}
</script>

<section class="bg-muted/50 px-6 py-16 md:py-24">
	<div class="mx-auto max-w-xl text-center">
		<h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
		<p class="mt-4 text-muted-foreground">{subtitle}</p>

		{#if submitted}
			<div class="mt-8 rounded-lg border bg-background p-6">
				<p class="font-semibold">You're in.</p>
				<p class="mt-1 text-sm text-muted-foreground">
					We'll notify you when something drops.
				</p>
			</div>
		{:else}
			<form onsubmit={handleSubmit} class="mt-8 flex gap-3 sm:mx-auto sm:max-w-md">
				<Input
					type="email"
					{placeholder}
					required
					bind:value={email}
					class="flex-1"
				/>
				<Button type="submit">{buttonText}</Button>
			</form>
		{/if}
	</div>
</section>
