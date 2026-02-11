<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		if (!dev) {
			const { inject } = await import('@vercel/analytics');
			inject({ mode: 'production' });

			const { injectSpeedInsights } = await import('@vercel/speed-insights');
			injectSpeedInsights();
		}
	});
</script>

{@render children()}
