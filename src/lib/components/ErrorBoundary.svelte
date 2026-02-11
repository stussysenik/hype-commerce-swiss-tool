<script>
	import type { Snippet } from 'svelte';

	let {
		children,
		fallback,
	}: {
		children: Snippet;
		fallback?: Snippet<[{ error: Error; reset: () => void }]>;
	} = $props();

	let error = $state<Error | null>(null);

	function reset() {
		error = null;
	}
</script>

{#if error && fallback}
	{@render fallback({ error, reset })}
{:else if error}
	<div class="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
		<p class="text-sm font-medium text-destructive">Something went wrong</p>
		<p class="mt-1 text-xs text-muted-foreground">{error.message}</p>
		<button
			onclick={reset}
			class="mt-4 inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
		>
			Try Again
		</button>
	</div>
{:else}
	{@render children()}
{/if}
