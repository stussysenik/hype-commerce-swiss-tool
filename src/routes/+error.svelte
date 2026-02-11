<script>
	import { page } from '$app/state';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
	<h1 class="text-6xl font-bold tracking-tight">{page.status}</h1>
	<p class="mt-4 text-lg text-muted-foreground">
		{#if page.status === 404}
			The page you're looking for doesn't exist.
		{:else if page.status === 500}
			Something went wrong on our end. Please try again later.
		{:else}
			{page.error?.message ?? 'An unexpected error occurred.'}
		{/if}
	</p>
	<div class="mt-8 flex gap-4">
		<a
			href="/"
			class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
		>
			Go Home
		</a>
		<button
			onclick={() => history.back()}
			class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
		>
			Go Back
		</button>
	</div>
</div>
