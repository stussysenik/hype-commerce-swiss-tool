<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>Drop Alert</Card.Title>
		<Card.Description>Supreme x Nike SB Dunk Low - Releasing Friday</Card.Description>
	</Card.Header>
	<Card.Content>
		<p class="text-sm text-muted-foreground">
			Limited to 500 pairs worldwide. Queue opens at 11:00 AM EST.
		</p>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Dismiss</Button>
		<Button>Join Queue</Button>
	</Card.Footer>
</Card.Root>
