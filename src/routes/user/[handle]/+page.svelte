<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import Profile from '$lib/Components/Profile.svelte';
	import ReviewCard from '$lib/Components/ReviewCard.svelte';

	let { data } = $props();
</script>

<Container>
	<Profile profile={data.profile} />

	{#if data.items.length > 0}
		<div class="flex flex-col gap-8 w-full items-center py-8 px-4">
			{#each data.items as item}
				<ReviewCard data={item} />
			{/each}
		</div>
	{:else}
		<p class="text-center text-base-500 py-8">No movies or tv shows rated yet.</p>
	{/if}
</Container>
