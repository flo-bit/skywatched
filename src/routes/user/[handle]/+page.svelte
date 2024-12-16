<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import Profile from '$lib/Components/Profile.svelte';
	import ReviewCard from '$lib/Components/ReviewCard.svelte';

	let { data } = $props();
</script>

<Container>
	<Profile profile={data.profile} />

	{#if data.items.length > 0}
		<div class="flex w-full flex-col items-center gap-8 px-4 py-8">
			{#each data.items as item}
				<ReviewCard data={item} />
			{/each}
		</div>
	{:else}
		<p class="py-8 text-center text-base-500">No movies or tv shows rated yet.</p>
	{/if}
</Container>
