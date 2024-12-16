<script lang="ts">
	import Container from '$lib/Components/Container.svelte';
	import Profile from '$lib/Components/Profile.svelte';
	import ReviewList from '$lib/Components/ReviewList.svelte';

	let { data } = $props();
</script>

<Container>
	<Profile profile={data.profile} />

	{#if data.items.length > 0}
		<ReviewList reviews={data.items} class="mt-8" />
	{:else}
		<p class="py-8 text-center text-base-500">No movies or tv shows rated yet.</p>
	{/if}
</Container>
