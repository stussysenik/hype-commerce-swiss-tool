<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data } = $props();

	const tierColors = {
		standard: 'secondary' as const,
		vip: 'default' as const,
		platinum: 'destructive' as const,
	};
</script>

<svelte:head>
	<title>My Account | Hype Commerce</title>
</svelte:head>

<section class="px-6 py-12">
	<div class="mx-auto max-w-4xl">
		<h1 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">My Account</h1>

		<div class="mt-6 grid gap-4 sm:grid-cols-3">
			<Card.Root>
				<Card.Header>
					<Card.Description>Tier</Card.Description>
					<Card.Title>
						<Badge variant={tierColors[data.user?.tier ?? 'standard']}>
							{data.user?.tier ?? 'Standard'}
						</Badge>
					</Card.Title>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Description>Drops Entered</Card.Description>
					<Card.Title class="text-2xl">{data.user?.totalDropsEntered ?? 0}</Card.Title>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Description>Drops Won</Card.Description>
					<Card.Title class="text-2xl">{data.user?.totalDropsWon ?? 0}</Card.Title>
				</Card.Header>
			</Card.Root>
		</div>

		<Tabs.Root value="drops" class="mt-8">
			<Tabs.List>
				<Tabs.Trigger value="drops">My Drops</Tabs.Trigger>
				<Tabs.Trigger value="wishlist">Wishlist</Tabs.Trigger>
				<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="drops" class="mt-4">
				{#if data.dropEntries.length > 0}
					<div class="space-y-4">
						{#each data.dropEntries as entry}
							<Card.Root>
								<Card.Header>
									<div class="flex items-center justify-between">
										<Card.Title class="text-base">{entry.dropTitle}</Card.Title>
										<Badge variant={entry.status === 'purchased' ? 'default' : 'secondary'}>
											{entry.status}
										</Badge>
									</div>
									<Card.Description>
										Entered {new Date(entry.createdAt).toLocaleDateString()}
									</Card.Description>
								</Card.Header>
							</Card.Root>
						{/each}
					</div>
				{:else}
					<p class="py-8 text-center text-muted-foreground">No drop entries yet.</p>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="wishlist" class="mt-4">
				{#if data.wishlistItems.length > 0}
					<div class="grid gap-4 sm:grid-cols-2">
						{#each data.wishlistItems as item}
							<Card.Root>
								<Card.Header>
									<div class="flex items-center gap-4">
										{#if item.productImage}
											<img
												src={item.productImage}
												alt={item.productTitle ?? ''}
												class="h-16 w-16 rounded-md object-cover"
											/>
										{/if}
										<div>
											<Card.Title class="text-base">{item.productTitle}</Card.Title>
											<Button
												variant="link"
												href="/products/{item.productHandle}"
												class="h-auto p-0 text-sm"
											>
												View Product
											</Button>
										</div>
									</div>
								</Card.Header>
							</Card.Root>
						{/each}
					</div>
				{:else}
					<p class="py-8 text-center text-muted-foreground">Your wishlist is empty.</p>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="settings" class="mt-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>Account Settings</Card.Title>
						<Card.Description>Manage your profile and preferences</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-muted-foreground">
							Account settings will be available when authentication is configured.
						</p>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
